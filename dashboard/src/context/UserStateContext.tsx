import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import supabaseClient from "../lib/supabaseClient";
import { v4 as uuidv4 } from 'uuid';


interface UserStateContextProps {
  bearer: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function UserStateProvider({ children }: PropsWithChildren) {
  const { getToken, userId, orgId, orgSlug} = useAuth();
  const {user} = useUser();

  const [bearer, setBearer] = useState(null)

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    console.log("fetching data")
    try {
      const token = await getToken({ template: 'supabase' }) || ""

      const supabase = await supabaseClient(token)

      // TODO #2: Replace with your database table name
      const { data, error } = await supabase.from('users').select()
      console.log(error)
      const email = user?.emailAddresses?.[0]?.emailAddress || ''

      if (data && data[0]) {
        setBearer(data[0]['bearer'])
      } else {

        const response = await supabase.from('users').insert({
          uuid: userId,
          bearer: uuidv4(),
          app_id: uuidv4(),
          email: email
        }).select()

        if (response.data && response.data[0]) {
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
        bearer: bearer
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
