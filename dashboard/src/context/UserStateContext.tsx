import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { v4 as uuidv4 } from 'uuid';


interface UserStateContextProps {
  bearer: any;
  appId: any;
  email: any;
  avatarUrl: any;
  fullName: any;

}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function UserStateProvider({ children }: PropsWithChildren) {

  const [bearer, setBearer] = useState(null)
  const [email, setEmail] = useState(null)
  const [appId, setAppId] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [fullName, setFullName] = useState(null)

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    console.log("fetching data")
    try {

      const {
        data: { user },
      } = await supabase.auth.getUser()
      let metadata = user!.user_metadata
      console.log(metadata)
      const email = metadata.email
      const userId = user!.id
      console.log(userId)
      // Select the row corresponding to this userId
      const { data, error } = await supabase.from('users').select().eq('id', userId)
      console.log(data)

      if (data && data[0]) {
        setBearer(data[0]['secret_key'])
        setAppId(data[0]['app_id'])
        setEmail(email)
        setAvatarUrl(metadata.avatar_url)
        setFullName(metadata.full_name)

      } else {
        // Create the user row if it doesn't exist

        const response = await supabase.from('users').insert({
          id: userId,
          secret_key: uuidv4(),
          app_id: uuidv4(),
          email: email
        }).select()
        console.log(response)

        if (response.data && response.data[0]) {
          const data = response.data[0]
          setBearer(data['secret_key'])
          setAppId(data['app_id'])
          setEmail(email)
          setAvatarUrl(metadata.avatar_url)
          setFullName(metadata.full_name)
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
        appId: appId,
        email: email,
        avatarUrl: avatarUrl,
        fullName: fullName
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
