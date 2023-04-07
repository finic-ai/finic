import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import isBrowser from "../helpers/is-browser";
import isSmallScreen from "../helpers/is-small-screen";
import { useAuth } from "@clerk/clerk-react";
import supabaseClient from "../lib/supabaseClient";

interface UserStateContextProps {
  bearer: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function UserStateProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();

  const [bearer, setBearer] = useState(null)

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    const token = await getToken({ template: 'supabase' }) || ""

    const supabase = await supabaseClient(token)

    // TODO #2: Replace with your database table name
    const { data, error } = await supabase.from('users').select()
    console.log(data, error)

    if (data && data[0]) {
      setBearer(data[0]['bearer'])
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
