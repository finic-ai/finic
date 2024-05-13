import React, { useState, useEffect } from "react";
import "./App.css";
import useLocalStorage from "./useLocalStorage";
import supabase from "./lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserStateProvider } from "./context/UserStateContext";
import RootComponent from "./RootComponent";
import LoginPage from "./LoginPage";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Root } from "@subframe/core/dist/cjs/components/progress";
import TagManager from "react-gtm-module";

function App() {
  const [session, setSession] = useLocalStorage("session", null);

  const tagManagerArgs = {
    gtmId: "GTM-P8J3LCM2",
  };

  TagManager.initialize(tagManagerArgs);

  (window as any).dataLayer.push({
    event: "buyer_signup",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <UserStateProvider session={session}>
        {session ? (
          <RootComponent />
        ) : (
          <Routes>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        )}
      </UserStateProvider>
    </Router>
  );
}

export default App;
