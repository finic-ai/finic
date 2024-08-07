"use client";

import { useState, useEffect, createContext, useContext, PropsWithChildren, ReactNode } from 'react';
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);

if (!supabaseUrl) {
  throw new Error("Missing env.SUPABASE_URL");
} else if (!supabaseKey) {
  throw new Error("Missing env.SUPABASE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface UserStateContextProps {
  isLoggedIn: boolean;
  bearer: any;
  email: any;
  avatarUrl: any;
  appId: any;
  userId: any;
  authStateLoading: boolean;
  authState: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function useAuth() {

  function logOut() {
    console.log("logging out");
    supabase.auth.signOut();
  }

  const UserStateContext = createContext<UserStateContextProps>(undefined!);

  interface UserStateProviderProps {
    children: ReactNode | undefined;
    session: any; // Use a more specific type if you know the structure of your session object
  }

  function UserStateProvider({
    children,
    session,
  }: UserStateProviderProps) {
    const [bearer, setBearer] = useState(null);
    const [email, setEmail] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [appId, setAppId] = useState(null);
    const [userId, setUserId] = useState("");
    const loggedIn = session !== null;
    const [authStateLoading, setAuthStateLoading] = useState(true);
  
    const fetchData = async () => {
      // TODO #1: Replace with your JWT template name
      console.log("fetching data");
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        let metadata = user!.user_metadata;
        const email = user!.email || metadata.email;
        const id = user!.id;
        // Select the row corresponding to this userId
        const { data } = await supabase.from("user").select().eq("id", id);
        console.log(data);
  
        if (data && data[0]) {
          setBearer(data[0].secret_key);
          setEmail(email);
          setAvatarUrl(data[0].avatar_url);
          setAppId(data[0].app_id);
          setUserId(id);
          setAuthStateLoading(false);
        } else {
          // Create the user row if it doesn't exist
  
          const response = await supabase
            .from("user")
            .insert({
              id: id,
              secret_key: uuidv4(),
              app_id: uuidv4(),
              email: email,
              avatar_url: metadata.avatar_url,
            })
            .select();
          console.log(response);
  
          if (response.data && response.data[0]) {
            const data = response.data[0];
            setBearer(data.secret_key);
            setEmail(email);
            setAvatarUrl(metadata.avatar_url);
            setAppId(data.app_id);
            setUserId(id);
            setAuthStateLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setAuthStateLoading(false);
      }
    };
  
    useEffect(() => {
      if (session) {
        fetchData();
      }
    }, [session]);
  
    return (
      <UserStateContext.Provider
        value={{
          isLoggedIn: loggedIn,
          authStateLoading: authStateLoading,
          bearer: bearer,
          email: email,
          avatarUrl: avatarUrl,
          userId: userId,
          appId: appId,
          authState: authStateLoading
            ? "loading"
            : loggedIn
            ? "authenticated"
            : "unauthenticated",
        }}
      >
        {children}
      </UserStateContext.Provider>
    );
  }

  function useUserStateContext(): UserStateContextProps {
    const context = useContext(UserStateContext);
  
    return context;
  }

  function useLocalStorage(key: string, initialValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return initialValue;
      }
    });
  
    const setValue = (value: any) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    };
  
    useEffect(() => {
      const handleStorageChange = (e: any) => {
        if (e.key === key) {
          setStoredValue(JSON.parse(e.newValue));
        }
      };
  
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, [key]);
  
    return [storedValue, setValue];
  }

  return {
    logOut,
    supabase,
    useLocalStorage,
    UserStateProvider,
    useUserStateContext
  };
}