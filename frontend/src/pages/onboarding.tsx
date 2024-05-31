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

  async function finishOnboarding(fields: Record<string, any>) {
    const loanAmount = fields["loan-amt"].value!.valueOf();
    const firstName = fields["firstname"].value!.toString();
    const lastName = fields["lastname"].value!.toString();
    // const applicantTypeRaw = fields["applicants"].value!.toString();
    // var applicantType = "acquirer";
    // if (applicantTypeRaw == "Acquirer") {
    //   applicantType = "acquirer";
    // } else if (applicantTypeRaw == "Business Owner") {
    //   applicantType = "business_owner";
    // } else if (applicantTypeRaw == "Business Broker") {
    //   applicantType = "business_broker";
    // }
    // const buyerResume = fields["buyer-resume"].value!.valueOf();
    // const buyer2021TaxReturn = fields["buyer-2021-tax-return"].value!.valueOf();
    // const buyer2022TaxReturn = fields["buyer-2022-tax-return"].value!.valueOf();
    // const buyer2023TaxReturn = fields["buyer-2023-tax-return"].value!.valueOf();
    // const buyerForm413 = fields["buyer-form-413"].value!.valueOf();
    const companyName = fields["biz-name"].value!.valueOf();
    const companyWebsite = fields["biz-website"].value!.valueOf();
    const state = fields["biz-state"].value!.valueOf();

    // const cim = fields["cim"].value!.valueOf();
    // const business2021TaxReturn =
    //   fields["business-2021-tax-return"].value!.valueOf();
    // const business2022TaxReturn =
    //   fields["business-2022-tax-return"].value!.valueOf();
    // const business2023TaxReturn =
    //   fields["business-2023-tax-return"].value!.valueOf();
    // const business2024PnL = fields["business-2024-pnl"].value!.valueOf();
    // const business2024BalanceSheet =
    //   fields["business-2024-balance-sheet"].value!.valueOf();
    // const loi = fields["loi"].value!.valueOf();
    // const buyerCreditScore = fields["buyer-credit-score"].value!.valueOf();
    // const buyerFirstName = fields["buyer-first-name"].value?.valueOf();
    // const buyerLastName = fields["buyer-last-name"].value?.valueOf();
    // const buyerEmail = fields["buyer-email"].value?.valueOf();
    // const buyerLinkedin = fields["buyer-linkedin"].value?.valueOf();
    // const ownerFirstName = fields["owner-first-name"].value?.valueOf();
    // const ownerLastName = fields["owner-last-name"].value?.valueOf();
    // const ownerEmail = fields["owner-email"].value?.valueOf();

    const response = await completeOnboarding(
      bearer,
      loanAmount as number,
      firstName,
      lastName,
      companyName as string,
      companyWebsite as string,
      state as string
    );
    console.log(response);
    if (response.success) {
      window.location.reload();
    }
  }

  return (
    <div>
      <Form
        formId="cQalFV"
        contextRef={contextRef}
        onAction={(context) => {
          const stepProperties = context.getStepProperties();

          console.log(context.getStepProperties());
          console.log(context.trigger.id);

          if (context.trigger.id == "55060c5b-62fe-4875-8df2-3eba4c22702a") {
            console.log("finished form");
          }
        }}
        onFormComplete={(context) => {
          const fields = context.fields;
          setLoading(true);
          finishOnboarding(fields);
        }}
      />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center space-x-4">
            <span className="text-2xl font-semibold">
              Finding the best lenders for you
            </span>
            <Spinner size="xl" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Onboarding;
