import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter, Navigate } from "react-router-dom";
import ApiKeysPage from "./pages/api-keys";
import ConnectionsPage from "./pages/connections";
import { UserStateProvider } from "./context/UserStateContext";
import NotionConnectorPage from "./pages/connectors/notion";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import  supabase  from "./lib/supabaseClient";

const container = document.getElementById("root");

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

function App() {
  const [session, setSession] = useState(null)

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </div>
      </div>
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
    {/* <ClerkProvider publishableKey={clerkPubKey}>
      <Flowbite theme={{ theme }}>
        <SignedIn>
          <UserStateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ApiKeysPage />} index />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/connectors/notion" element={<NotionConnectorPage />} />
            </Routes>
          </BrowserRouter>
          </UserStateProvider>
        </SignedIn>
        <SignedOut>
        <div className="flex items-center justify-center h-screen"><SignIn routing="hash"/></div> 
          <BrowserRouter>
            <Routes>
              <Route path="/sign-up" element={<div className="flex items-center justify-center h-screen"><SignUp routing="hash" /></div>} />
              <Route path="/sign-in" element={<div className="flex items-center justify-center h-screen"><SignIn routing="hash" /></div>} />
              <Route path="*" element={<Navigate to="/sign-in"/>}/>
            </Routes>
          </BrowserRouter>
        </SignedOut>
      </Flowbite>
    </ClerkProvider> */}
  </StrictMode>
);
