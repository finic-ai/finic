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
import Field from "@feathery/react/dist/utils/api/Field";
import { SubframeSides } from "@subframe/core/dist/cjs/assets/icons/final";
import { getRecommendedLenders } from "../utils";
import { useUserStateContext } from "../context/UserStateContext";
import { DefaultPageLayout } from "../subframe";
import { Avatar } from "@/subframe/components/Avatar";
import { Table } from "@/subframe/components/Table";
import { Badge } from "@/subframe/components/Badge";
import { Button } from "@/subframe/components/Button";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const NewComponent = () => {
  return <h1>Hello, I'm the new React component!</h1>;
};

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const contextRef = useRef<FormContext>(null);
  const navigate = useNavigate();

  const [lenders, setLenders] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const { bearer, setCompletedOnboarding, userId } = useUserStateContext();

  useEffect(() => {
    const fetchLenders = async () => {
      const retrievedLenders = await getRecommendedLenders(bearer);
      console.log("lenders", retrievedLenders);
      setLenders(retrievedLenders);
    };
    fetchLenders();
  }, []);

  async function apply(lenderId: string) {
    console.log("applying to lender", lenderId);
    setShowPopup(true);
  }

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background pt-12 pr-24 pb-12 pl-24">
        <span className="text-subheader font-subheader text-default-font">
          Recommended Lenders
        </span>
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Lender</Table.HeaderCell>
              <Table.HeaderCell>Website</Table.HeaderCell>
              <Table.HeaderCell>Loans in your sector</Table.HeaderCell>
              <Table.HeaderCell>
                Avg. interest rate in your sector
              </Table.HeaderCell>
            </Table.HeaderRow>
          }
        >
          {lenders.map((lender) => (
            <Table.Row>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  {/* <Avatar image={lender.logo}>{lender.name}</Avatar> */}
                  <div className="flex flex-col items-start justify-center">
                    <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                      {lender.name}
                    </span>
                    <span className="whitespace-nowrap text-label font-label text-subtext-color">
                      {lender.contact_name}
                    </span>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  {lender.website}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  {lender.num_loans_in_sector || lender.num_loans}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="whitespace-nowrap text-body font-body text-neutral-500">
                  {/* format with toFixed(2) */}
                  {lender.avg_interest_rate_in_sector &&
                    lender.avg_interest_rate_in_sector.toFixed(2)}
                  {lender.avg_interest_rate &&
                    lender.avg_interest_rate.toFixed(2)}
                  %
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex w-full grow shrink-0 basis-0 items-center justify-end gap-2">
                  <Button
                    onClick={() => {
                      apply(lender.id);
                    }}
                    variant="brand-primary"
                  >
                    Apply
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
        <Form
          formName="Complete Lending Application"
          contextRef={contextRef}
          popupOptions={{
            show: showPopup,
            onHide: () => setShowPopup(false),
          }}
          onAction={(context) => {
            const stepProperties = context.getStepProperties();

            console.log(context.getStepProperties());
            console.log(context.trigger.id);

            if (context.trigger.id == "55060c5b-62fe-4875-8df2-3eba4c22702a") {
              console.log("finished form");
              setLoading(true);
            }
          }}
          onFormComplete={(context) => {
            const fields = context.fields;
          }}
        />
      </div>
    </DefaultPageLayout>
  );
}

export default Dashboard;
