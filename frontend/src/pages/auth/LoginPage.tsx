import "@/App.css";
import { supabase } from "@/hooks/useAuth";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const redirectUrl = import.meta.env.VITE_APP_REDIRECT_URL;

function LoginPage() {

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          appearance={{ theme: ThemeSupa }}
          redirectTo={redirectUrl}
        />
      </div>
    </div>
  );
}

export default LoginPage;
