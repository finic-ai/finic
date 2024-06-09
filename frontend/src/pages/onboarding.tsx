import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import useLocalStorage from "../useLocalStorage";
import { redirect, useLocation } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserStateProvider } from "../context/UserStateContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { Root } from "@subframe/core/dist/cjs/components/progress";
import posthog from "posthog-js";
import { Widget } from "@typeform/embed-react";
import { Loader } from "@/subframe/components/Loader";
import { Spinner } from "flowbite-react";
import {
  init,
  Form,
  setFieldValues,
  FormContext,
  updateUserId,
} from "@feathery/react";
import Field from "@feathery/react/dist/types/Form";
import { SubframeSides } from "@subframe/core/dist/cjs/assets/icons/final";
import { completeOnboarding } from "../utils";
import { useUserStateContext } from "../context/UserStateContext";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const NewComponent = () => {
  return <h1>Hello, I'm the new React component!</h1>;
};

function Onboarding() {
  const [loading, setLoading] = useState(false);
  const contextRef = useRef<FormContext>(null);
  const navigate = useNavigate();

  const { bearer, setCompletedOnboarding, userId } = useUserStateContext();

  useEffect(() => {
    const fetchApplications = async () => {
      if (userId) {
        updateUserId(userId, true);
      }
    };
    if (userId) fetchApplications();
  }, [userId]);

  async function finishOnboarding(fields: Record<string, any>) {
    const firstName = fields["firstname"].value!.toString();
    const lastName = fields["lastname"].value!.toString();

    const response = await completeOnboarding(bearer, firstName, lastName);
    console.log(response);
    if (response.success) {
      setCompletedOnboarding(true);
    }
  }

  return (
    <div>
      <Form
        formId="cQalFV"
        contextRef={contextRef}
        onAction={(context) => {
          const stepProperties = context.getStepProperties();

          console.log(context);
          console.log(context.trigger.id);

          if (
            context.trigger.id !== "ee670472-f4e8-43fc-b78e-0de67d9c8d34" ||
            (context as any).beforeClickActions
          ) {
            return;
          }

          finishOnboarding(context.fields);
        }}
      />
    </div>
  );
}

export default Onboarding;
