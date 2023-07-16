import { FC, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Helmet } from "react-helmet";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import OnboardingPage from "./pages/onboarding";
import ApiKeysPage from "./pages/api-keys";
import ConnectionsPage from "./pages/connections";
import { UserStateProvider } from "./context/UserStateContext";
import NotionConnectorPage from "./pages/connectors/notion";
import GoogleDriveConnectorPage from "./pages/connectors/google-drive";
import ZendeskConnectorPage from "./pages/connectors/zendesk";
import SlackConnectorPage from "./pages/connectors/slack";
import DropboxConnectorPage from "./pages/connectors/dropbox";
import IntercomConnectorPage from "./pages/connectors/intercom";
import HubspotConnectorPage from "./pages/connectors/hubspot";
import SalesforceConnectorPage from "./pages/connectors/salesforce";
import { RedirectPage } from "./pages/oauth/redirect";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./lib/supabaseClient";
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import ConfluenceConnectorPage from "./pages/connectors/confluence";
import SettingsPage from "./pages/settings";
import SyncsPage from "./pages/syncs";
import CreateConnectionPage from "./pages/create-connection";
import { useUserStateContext } from "./context/UserStateContext";
import ReadmeConnectorPage from "./pages/connectors/readme";
import WebsiteConnectorPage from "./pages/connectors/website";
import GmailConnectorPage from "./pages/connectors/gmail";
import SharepointConnectorPage from "./pages/connectors/sharepoint";
import GithubConnectorPage from "./pages/connectors/github";

const container = document.getElementById("root");

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}

if (
  !window.location.host.includes("127.0.0.1") &&
  !window.location.host.includes("localhost")
) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  });
}

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

function App() {
  const [session, setSession] = useLocalStorage("session", null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      if (scriptLoaded && (window as any).Intercom) {
        const name =
          session.user.identities.length > 0
            ? session.user.identities[0].identity_data.name
            : null;

        (window as any).Intercom("boot", {
          api_base: "https://api-iam.intercom.io",
          app_id: "tdxqbjpq",
          name: name, // Full name
          email: session.user.email, // Email address
          created_at: session.user.created_at // Signup date as a Unix timestamp
        });
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [scriptLoaded]);

  const handleScriptInject = (tags: any) => {
    if (tags.scriptTags.length > 0) {
      setScriptLoaded(true);
    }
  };

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/oauth/redirect" element={<RedirectPage />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google"]}
                  />
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <PostHogProvider client={posthog}>
        <Flowbite theme={{ theme }}>
          <Helmet
            onChangeClientState={(newState) => handleScriptInject(newState)}
          >
            <script>
              {`(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/tdxqbjpq';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`}
            </script>
          </Helmet>
          <UserStateProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/api-keys" element={<ApiKeysPage />} />
                <Route path="/connections" element={<ConnectionsPage />} />
                <Route
                  path="/connectors/confluence"
                  element={<ConfluenceConnectorPage />}
                />
                <Route
                  path="/connectors/dropbox"
                  element={<DropboxConnectorPage />}
                />
                <Route
                  path="/connectors/github"
                  element={<GithubConnectorPage />}
                />
                <Route
                  path="/connectors/google-drive"
                  element={<GoogleDriveConnectorPage />}
                />
                <Route
                  path="/connectors/gmail"
                  element={<GmailConnectorPage />}
                />
                <Route
                  path="/connectors/hubspot"
                  element={<HubspotConnectorPage />}
                />
                <Route
                  path="/connectors/intercom"
                  element={<IntercomConnectorPage />}
                />
                <Route
                  path="/connectors/notion"
                  element={<NotionConnectorPage />}
                />
                <Route
                  path="/connectors/readme"
                  element={<ReadmeConnectorPage />}
                />
                <Route
                  path="/connectors/salesforce"
                  element={<SalesforceConnectorPage />}
                />
                <Route
                  path="/connectors/slack"
                  element={<SlackConnectorPage />}
                />
                <Route
                  path="/connectors/website"
                  element={<WebsiteConnectorPage />}
                />
                <Route
                  path="/connectors/zendesk"
                  element={<ZendeskConnectorPage />}
                />
                <Route
                  path="/connectors/sharepoint"
                  element={<SharepointConnectorPage />}
                />
                <Route path="/oauth/redirect" element={<RedirectPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/syncs" element={<SyncsPage />} />
                <Route path="/playground" element={<CreateConnectionPage />} />
                <Route
                  path="/create-connection"
                  element={<CreateConnectionPage />}
                />
              </Routes>
            </BrowserRouter>
          </UserStateProvider>
        </Flowbite>
      </PostHogProvider>
    );
  }
}

const RootPage: FC = () => {
  const [showOnboardingPage, setShowOnboardingPage] = useLocalStorage(
    "showOnboardingPage",
    false
  );
  const { completedOnboarding } = useUserStateContext();

  useEffect(() => {
    if (completedOnboarding != showOnboardingPage) {
      setShowOnboardingPage(completedOnboarding);
    }
  }, []);

  if (showOnboardingPage) {
    return <OnboardingPage />;
  }
  return <OnboardingPage />;
};

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
