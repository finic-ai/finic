import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { authState } from "@feathery/react/dist/auth/LoginForm";

interface UserStateContextProps {
  isLoggedIn: boolean;
  bearer: any;
  email: any;
  avatarUrl: any;
  firstName: any;
  lastName: any;
  userId: any;
  completedOnboarding: any;
  setCompletedOnboarding: any;
  authStateLoading: boolean;
  authState: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

interface UserStateProviderProps {
  children: ReactNode | undefined;
  session: any; // Use a more specific type if you know the structure of your session object
}

export function UserStateProvider({
  children,
  session,
}: UserStateProviderProps) {
  const [bearer, setBearer] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [userId, setUserId] = useState("");
  const [completedOnboarding, setCompletedOnboarding] = useState(false);
  const loggedIn = session !== null;
  const [authStateLoading, setAuthStateLoading] = useState(true);

  let query = new URLSearchParams(useLocation().search);
  let referralId = query.get("referral_id");

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    console.log("fetching data");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let metadata = user!.user_metadata;
      console.log(metadata);
      const email = user!.email || metadata.email;
      const id = user!.id;
      // Select the row corresponding to this userId
      const { data } = await supabase
        .from("lending_users")
        .select()
        .eq("id", id);
      console.log(data);

      if (data && data[0]) {
        setBearer(data[0]["secret_key"]);
        setCompletedOnboarding(data[0]["completed_onboarding"]);
        setEmail(email);
        setAvatarUrl(data[0].avatar_url);
        setFirstName(data[0].first_name);
        setLastName(data[0].last_name);
        setUserId(id);
        setAuthStateLoading(false);
      } else {
        // Create the user row if it doesn't exist

        const response = await supabase
          .from("lending_users")
          .insert({
            id: id,
            secret_key: uuidv4(),
            completed_onboarding: false,
            email: email,
            avatar_url: metadata.avatar_url,
            referral_id: referralId,
          })
          .select();
        console.log(response);

        if (response.data && response.data[0]) {
          const data = response.data[0];
          setBearer(data["secret_key"]);
          setCompletedOnboarding(data["completed_onboarding"]);
          setEmail(email);
          setAvatarUrl(metadata.avatar_url);
          setFirstName(metadata.first_name);
          setLastName(metadata.last_name);
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
        firstName: firstName,
        lastName: lastName,
        userId: userId,
        completedOnboarding: completedOnboarding,
        setCompletedOnboarding,
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

export function useUserStateContext(): UserStateContextProps {
  const context = useContext(UserStateContext);

  return context;
}
