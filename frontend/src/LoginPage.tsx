import React, { useState, useEffect } from "react";
import "./App.css";
import useLocalStorage from "./useLocalStorage";
import { redirect, useLocation } from "react-router-dom";
import supabase from "./lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserStateProvider } from "./context/UserStateContext";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Root } from "@subframe/core/dist/cjs/components/progress";
import posthog from "posthog-js";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});

function LoginPage() {
  let query = new URLSearchParams(useLocation().search);
  var email = query.get("email");
  var token = query.get("token");

  const [isWebView, setIsWebView] = useState(false);

  var currentUrl = window.location.href;

  // get rid of any # params at the end of the url

  if (currentUrl.includes("#")) {
    currentUrl = currentUrl.split("#")[0];
  }

  // redirect url is current url without the email and token params. Keep all other params.
  var redirectUrl: any = new URL(currentUrl);
  redirectUrl.searchParams.delete("email");
  redirectUrl.searchParams.delete("token");
  redirectUrl = redirectUrl.href;

  if (email && token) {
    history.pushState({}, "", redirectUrl);
  }

  // Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.29.1314

  function redirectToBrowser() {
    const currentUrl = window.location.href;
    // open the current url in the default browser
    window?.open(currentUrl, "_blank");
  }

  const userAgent = window.navigator.userAgent || window.navigator.vendor;

  useEffect(() => {
    const isIPhone = userAgent.includes("iPhone");
    const isAndroid = userAgent.includes("Android");
    const isLinkedinWebView = userAgent.includes("LinkedInApp");

    setIsWebView(isLinkedinWebView);

    if (email && token) {
      // email decode from url param
      email = decodeURIComponent(email);
      console.log(redirectUrl);
      posthog.capture("otp_login_attempt", {
        email: email,
        redirect_url: redirectUrl,
      });
      supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
        options: { redirectTo: redirectUrl },
      });
    }
  }, []);

  return (
    <Routes>
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
              {isWebView ? (
                <div>
                  <div className="text-center text-lg font-bold mb-4">
                    Please open this page in your browser for the best
                    experience.
                  </div>
                  <div className="text-center">
                    You can copy the following link and open it in your browser:
                  </div>
                  {/* blue text */}
                  <div className="text-center text-blue-500 mb-4">
                    {currentUrl}
                  </div>
                </div>
              ) : (
                <div>
                  <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google"]}
                    redirectTo={redirectUrl}
                    magicLink={true}
                    view={"magic_link"}
                  />
                  {/* <Button
                    onClick={() => {
                      redirectToBrowser();
                    }}
                  >
                    Log In
                  </Button> */}
                </div>
              )}
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default LoginPage;
