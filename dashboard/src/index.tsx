import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter, Navigate } from "react-router-dom";
import DashboardPage from "./pages";
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
import GoogleDrivePage from "./pages/google-drive";

const container = document.getElementById("root");

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}


// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkPubKey = "pk_test_ZXZvbHZlZC1zYWxtb24tNTkuY2xlcmsuYWNjb3VudHMuZGV2JA"

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <Flowbite theme={{ theme }}>
        <SignedIn>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardPage />} index />
              <Route path="/mailing/compose" element={<MailingComposePage />} />
              <Route path="/mailing/inbox" element={<MailingInboxPage />} />
              <Route path="/mailing/read" element={<MailingReadPage />} />
              <Route path="/mailing/reply" element={<MailingReplyPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/pages/pricing" element={<PricingPage />} />
              <Route path="/pages/maintenance" element={<MaintenancePage />} />
              <Route path="/pages/404" element={<NotFoundPage />} />
              <Route path="/pages/500" element={<ServerErrorPage />} />
              <Route path="/authentication/sign-in" element={<SignInPage />} />
              <Route path="/authentication/sign-up" element={<SignUpPage />} />
              <Route
                path="/authentication/forgot-password"
                element={<ForgotPasswordPage />}
              />
              <Route
                path="/authentication/reset-password"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/authentication/profile-lock"
                element={<ProfileLockPage />}
              />
              <Route
                path="/e-commerce/billing"
                element={<EcommerceBillingPage />}
              />
              <Route
                path="/e-commerce/invoice"
                element={<EcommerceInvoicePage />}
              />
              <Route
                path="/e-commerce/products"
                element={<EcommerceProductsPage />}
              />
              <Route path="/users/feed" element={<UserFeedPage />} />
              <Route path="/users/list" element={<UserListPage />} />
              <Route path="/users/profile" element={<UserProfilePage />} />
              <Route path="/users/settings" element={<UserSettingsPage />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
              <Route path="/google-drive" element={<GoogleDrivePage />} />
            </Routes>
          </BrowserRouter>
        </SignedIn>
        <SignedOut>
          <BrowserRouter>
            <Routes>
              <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
              <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="*" element={<Navigate to="/sign-in"/>}/>
            </Routes>
          </BrowserRouter>
        </SignedOut>
      </Flowbite>
    </ClerkProvider>
  </StrictMode>
);
