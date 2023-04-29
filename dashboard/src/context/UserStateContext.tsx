import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import supabase from "../lib/supabaseClient";
import { v4 as uuidv4 } from 'uuid';


interface UserStateContextProps {
  bearer: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function UserStateProvider({ children }: PropsWithChildren) {
  const { userId } = useAuth();
  const {user} = useUser();

  const [bearer, setBearer] = useState(null)

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    console.log("fetching data")
    try {

      // Select the row corresponding to this userId
      const { data, error } = await supabase.from('users').select().eq('uuid', userId).single()
      console.log(error)

      if (data && data[0]) {
        setBearer(data[0]['secret_key'])
      } else {
        const email = user?.emailAddresses?.[0]?.emailAddress || ''
        const response = await supabase.from('users').insert({
          id: userId,
          secret_key: uuidv4(),
          app_id: uuidv4(),
          email: email
        }).select()

        if (response.data && response.data[0]) {
          console.log(response.data)
          setBearer(response.data[0]['bearer'])
        } else {
          setBearer(null)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        bearer: bearer,
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserStateContext(): UserStateContextProps {
  const context = useContext(UserStateContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useSidebarContext should be used within the SidebarContext provider!"
    );
  }

  return context;
}
