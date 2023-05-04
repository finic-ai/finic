import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import EcommerceBillingPage from "./pages/e-commerce/billing";
import EcommerceInvoicePage from "./pages/e-commerce/invoice";
import EcommerceProductsPage from "./pages/e-commerce/products";
import KanbanPage from "./pages/kanban";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import MaintenancePage from "./pages/pages/maintenance";
import PricingPage from "./pages/pages/pricing";
import UserFeedPage from "./pages/users/feed";
import UserListPage from "./pages/users/list";
import UserProfilePage from "./pages/users/profile";
import UserSettingsPage from "./pages/users/settings";
import MailingInboxPage from "./pages/mailing/inbox";
import MailingReadPage from "./pages/mailing/read";
import MailingReplyPage from "./pages/mailing/reply";
import MailingComposePage from "./pages/mailing/compose";
import ApiKeysPage from "./pages/api-keys";
import ConnectionsPage from "./pages/connections";
import GoogleDriveConnectorPage from "./pages/connectors/google-drive";
import WebsiteConnectorPage from "./pages/connectors/website";
import { UserStateProvider } from "./context/UserStateContext";
import ZendeskConnectorPage from "./pages/connectors/zendesk";
import ConfluenceConnectorPage from "./pages/connectors/confluence";
import NotionConnectorPage from "./pages/connectors/notion";
import { RedirectPage } from "./pages/oauth/redirect";
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
              <Route path="/oauth/redirect" element={<RedirectPage />} />
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
