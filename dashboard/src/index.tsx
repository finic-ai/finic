import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import ApiKeysPage from "./pages/api-keys";
import ConnectionsPage from "./pages/connections";
import { UserStateProvider } from "./context/UserStateContext";
import NotionConnectorPage from "./pages/connectors/notion";
import GoogleDriveConnectorPage from "./pages/connectors/google-drive"
import ZendeskConnectorPage from "./pages/connectors/zendesk"
import { RedirectPage } from "./pages/oauth/redirect";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import  supabase  from "./lib/supabaseClient";
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import ConfluenceConnectorPage from "./pages/connectors/confluence";
import Settings from "./pages/settings";

const container = document.getElementById("root");

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}


if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

function App() {
  const [session, setSession] = useLocalStorage('session', null);
  console.log(session)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/oauth/redirect" element={<RedirectPage />} />
          <Route path="*" element={
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>

      
    )
  }
  else {
    return (
      <Flowbite theme={{ theme }}>
        <UserStateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ApiKeysPage />} index />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/connectors/notion" element={<NotionConnectorPage />} />
              <Route path="/connectors/google-drive" element={<GoogleDriveConnectorPage />} />
              <Route path="/connectors/zendesk" element={<ZendeskConnectorPage />} />
              <Route path="/connectors/confluence" element={<ConfluenceConnectorPage />} />
              <Route path="/oauth/redirect" element={<RedirectPage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </UserStateProvider>
      </Flowbite>
    )
  }
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
