import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { usePostHog } from "posthog-js/react";
import { v4 as uuidv4 } from "uuid";

interface UserStateContextProps {
  bearer: any;
  appId: any;
  completedOnboarding: any;
  email: any;
  avatarUrl: any;
  fullName: any;
  userId: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function UserStateProvider({ children }: PropsWithChildren) {
  const [bearer, setBearer] = useState(null);
  const [email, setEmail] = useState(null);
  const [appId, setAppId] = useState(null);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [userId, setUserId] = useState("");

  const posthog = usePostHog();

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    console.log("fetching data");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let metadata = user!.user_metadata;
      console.log(metadata);
      const email = metadata.email;
      const id = user!.id;
      // Select the row corresponding to this userId
      const { data } = await supabase.from("users").select().eq("id", id);
      console.log(data);

      if (data && data[0]) {
        setBearer(data[0]["secret_key"]);
        setAppId(data[0]["app_id"]);
        setCompletedOnboarding(data[0]["completed_onboarding"]);
        setEmail(email);
        setAvatarUrl(metadata.avatar_url);
        setFullName(metadata.full_name);
        setUserId(id);
        posthog!.identify(id, {
          email: email,
          app_id: data[0]["app_id"],
        });
      } else {
        // Create the user row if it doesn't exist

        const response = await supabase
          .from("users")
          .insert({
            id: id,
            secret_key: uuidv4(),
            app_id: uuidv4(),
            email: email,
          })
          .select();

        if (response.data && response.data[0]) {
          const data = response.data[0];
          setBearer(data["secret_key"]);
          setAppId(data["app_id"]);
          setCompletedOnboarding(data["completed_onboarding"]);
          setEmail(email);
          setAvatarUrl(metadata.avatar_url);
          setFullName(metadata.full_name);
          setUserId(id);
          posthog!.identify(id, {
            email: email,
            app_id: data["app_id"],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        bearer: bearer,
        appId: appId,
        completedOnboarding: completedOnboarding,
        email: email,
        avatarUrl: avatarUrl,
        fullName: fullName,
        userId: userId,
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
