"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import {ReactFlowProvider} from "@xyflow/react"
import React, { useEffect, useState } from "react";
import { useAuth, UserStateProvider, supabase } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { session, setSession } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, []);

  const renderAuth = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <Auth
            supabaseClient={supabase}
            providers={["google"]}
            appearance={{ theme: ThemeSupa }}
            redirectTo={"http://localhost:3000/workflow/123"}
          />
        </div>
      </div>
    );
  };

  const renderApp = () => {
    return (
      <UserStateProvider session={session}>
        <ReactFlowProvider>
          {children}
        </ReactFlowProvider>
      </UserStateProvider>
    );
  }

  const renderLoading = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {mounted ? (session ? renderApp() : renderAuth()) : renderLoading()}
      </body>
    </html>
  );
}
