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
import { applyForLoan, getApplications } from "../utils";
import { useUserStateContext } from "../context/UserStateContext";
import { DefaultPageLayout } from "../subframe";
import { Avatar } from "@/subframe/components/Avatar";
import { Table } from "@/subframe/components/Table";
import { Badge } from "@/subframe/components/Badge";
import { Button } from "@/subframe/components/Button";
import { Dialog } from "@/subframe/components/Dialog";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import { LinkButton } from "@/subframe/components/LinkButton";

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

const NewComponent = () => {
  return <h1>Hello, I'm the new React component!</h1>;
};

function Dashboard() {
  const [loadingLender, setLoadingLender] = useState<string | null>(null);
  const contextRef = useRef<FormContext>(null);
  const navigate = useNavigate();

  const [applications, setApplications] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // formCompletion is a state but of function type
  const [formCompletion, setFormCompletion] = useState(() => () => {});

  const { bearer, email, userId } = useUserStateContext();

  async function apply(
    lenderId: string,
    businessId: string,
    underLoi?: boolean,
    linkedinUrl?: string,
    files?: Array<File>
  ) {
    setLoadingLender(lenderId);
    const responseApplication = await applyForLoan(
      bearer,
      userId,
      lenderId,
      businessId,
      underLoi,
      linkedinUrl,
      files
    );

    if (
      responseApplication.error &&
      responseApplication.error == "Incomplete onboarding"
    ) {
      setShowPopup(true);
      setFormCompletion(() => async () => {
        var underLoi = contextRef.current?.fields["under-loi"].value;
        if (underLoi === null) {
          underLoi = undefined;
        } else if (underLoi === "Yes") {
          underLoi = true;
        } else {
          underLoi = false;
        }
        var linkedinUrl =
          contextRef.current?.fields["linkedin"].value?.toString();
        var files: Array<File> = [];

        const resumeValue = contextRef.current?.fields["resume"]
          .value as Promise<File>[];
        if (resumeValue.length > 0) {
          const resumeFile = await resumeValue[0];
          files.push(resumeFile);
        }

        const creditScoreValue = contextRef.current?.fields["credit-score-file"]
          .value as Promise<File>[];
        if (creditScoreValue.length > 0) {
          const creditScoreFile = await creditScoreValue[0];
          files.push(creditScoreFile);
        }

        const buyer2021TaxReturnValue = contextRef.current?.fields[
          "buyer-2021-tax-return_1"
        ].value as Promise<File>[];
        if (buyer2021TaxReturnValue.length > 0) {
          const buyer2021TaxReturnFile = await buyer2021TaxReturnValue[0];
          files.push(buyer2021TaxReturnFile);
        }

        const buyer2022TaxReturnValue = contextRef.current?.fields[
          "buyer-2022-tax-return_1"
        ].value as Promise<File>[];
        if (buyer2022TaxReturnValue.length > 0) {
          const buyer2022TaxReturnFile = await buyer2022TaxReturnValue[0];
          files.push(buyer2022TaxReturnFile);
        }

        const buyer2023TaxReturnValue = contextRef.current?.fields[
          "buyer-2023-tax-return_1"
        ].value as Promise<File>[];
        if (buyer2023TaxReturnValue.length > 0) {
          const buyer2023TaxReturnFile = await buyer2023TaxReturnValue[0];
          files.push(buyer2023TaxReturnFile);
        }

        const buyerForm413Value = contextRef.current?.fields["buyer-form-413_1"]
          .value as Promise<File>[];
        if (buyerForm413Value.length > 0) {
          const buyerForm413File = await buyerForm413Value[0];
          files.push(buyerForm413File);
        }

        const cimValue = contextRef.current?.fields["cim_1"]
          .value as Promise<File>[];
        if (cimValue.length > 0) {
          const cimFile = await cimValue[0];
          files.push(cimFile);
        }

        const business2021TaxReturnValue = contextRef.current?.fields[
          "business-2021-tax-return_1"
        ].value as Promise<File>[];
        if (business2021TaxReturnValue.length > 0) {
          const business2021TaxReturnFile = await business2021TaxReturnValue[0];
          files.push(business2021TaxReturnFile);
        }

        const business2022TaxReturnValue = contextRef.current?.fields[
          "business-2022-tax-return_1"
        ].value as Promise<File>[];
        if (business2022TaxReturnValue.length > 0) {
          const business2022TaxReturnFile = await business2022TaxReturnValue[0];
          files.push(business2022TaxReturnFile);
        }

        const business2023TaxReturnValue = contextRef.current?.fields[
          "business-2023-tax-return_1"
        ].value as Promise<File>[];
        if (business2023TaxReturnValue.length > 0) {
          const business2023TaxReturnFile = await business2023TaxReturnValue[0];
          files.push(business2023TaxReturnFile);
        }

        const business2024PnlValue = contextRef.current?.fields[
          "business-2024-pnl_1"
        ].value as Promise<File>[];
        if (business2024PnlValue.length > 0) {
          const business2024PnlFile = await business2024PnlValue[0];
          files.push(business2024PnlFile);
        }

        const business2024BalanceSheetValue = contextRef.current?.fields[
          "business-2024-balance-sheet_1"
        ].value as Promise<File>[];
        if (business2024BalanceSheetValue.length > 0) {
          const business2024BalanceSheetFile =
            await business2024BalanceSheetValue[0];
          files.push(business2024BalanceSheetFile);
        }

        const loiValue = contextRef.current?.fields["loi_1"]
          .value as Promise<File>[];
        if (loiValue.length > 0) {
          const loiFile = await loiValue[0];
          files.push(loiFile);
        }

        apply(lenderId, businessId, underLoi, linkedinUrl, files);
      });
      setLoadingLender(null);
      return;
    } else {
      const applicationLenderId = responseApplication.lender_id;
      // set .application = true for lender
      const updatedApplications = applications.map((application) => {
        if (application.lender_id == applicationLenderId) {
          application.status = responseApplication.status;
        }
        return application;
      });
      setDialogOpen(true);
      setApplications(updatedApplications);
      setLoadingLender(null);
    }
  }

  useEffect(() => {
    const fetchApplications = async () => {
      const retrievedApplications = await getApplications(bearer);
      console.log("applications", retrievedApplications);
      setApplications(retrievedApplications);
    };
    if (bearer) fetchApplications();
  }, [bearer]);

  return (
    <DefaultPageLayout>
      <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background pt-12 pr-40 pb-12 pl-40">
        <span className="text-subheader font-subheader text-default-font">
          Recommended Lenders
        </span>
        <span className="text-body font-body text-default-font">
          These are the top 10 recommended lenders based on your requested loan
          amount, company location, and company sector. Loan amounts and average
          interest rates are calculated using public data released by the SBA on
          SBA 7a loans over the past year.
        </span>
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Lender</Table.HeaderCell>
              <Table.HeaderCell>Website</Table.HeaderCell>
              <Table.HeaderCell>Number of 7a loans</Table.HeaderCell>
              <Table.HeaderCell>Avg. interest rate</Table.HeaderCell>
            </Table.HeaderRow>
          }
        >
          {applications.map((application) => (
            <LenderRow
              key={application.lender_id}
              application={application}
              loadingLender={loadingLender}
              apply={apply}
            />
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
            }
          }}
          onFormComplete={(context) => {
            const fields = context.fields;
            formCompletion();
          }}
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Content className="h-auto w-auto flex-none">
            <div className="flex max-w-[384px] flex-col items-start gap-6 pt-6 pr-6 pb-6 pl-6">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                  <IconWithBackground
                    variant="success"
                    size="large"
                    icon="FeatherSend"
                  />
                  <span className="text-subheader font-subheader text-default-font">
                    Application Submitted
                  </span>
                  <span className="text-body font-body text-default-font">
                    {`Your application has been sent. Please check your inbox at ${email} for
                    a confirmation email.`}
                  </span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <Button
                    className="h-8 w-full grow shrink-0 basis-0"
                    variant="brand-primary"
                    size="medium"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog>
      </div>
    </DefaultPageLayout>
  );
}

function LenderRow({
  application,
  loadingLender,
  apply,
}: {
  application: any;
  loadingLender: any;
  apply: any;
}) {
  const [loading, setLoading] = useState(false);
  const { bearer, setCompletedOnboarding, userId } = useUserStateContext();
  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Avatar image={application.lender.logo_url} />

          <div className="flex flex-col items-start justify-center">
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              {application.lender.name}
            </span>
            <span className="whitespace-nowrap text-label font-label text-subtext-color">
              {application.lender.contact_name}
            </span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <LinkButton
          onClick={() => {
            const url = application.lender.website.startsWith("http")
              ? application.lender.website
              : `https://${application.lender.website}`;
            window.open(url, "_blank");
          }}
        >
          {application.lender.website}
        </LinkButton>
      </Table.Cell>
      <Table.Cell>
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          {application.lender.num_loans_in_sector ||
            application.lender.num_loans}
        </span>
      </Table.Cell>
      <Table.Cell>
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          {/* format with toFixed(2) */}
          {application.lender.avg_interest_rate &&
            application.lender.avg_interest_rate.toFixed(2)}
          %
        </span>
      </Table.Cell>

      <Table.Cell>
        <div className="flex w-full grow shrink-0 basis-0 items-center justify-end gap-2">
          <Button
            onClick={() => {
              apply(application.lender.id, application.business_id);
            }}
            loading={loadingLender == application.lender.id}
            disabled={loadingLender || application.status != "not_yet_applied"}
            variant="brand-primary"
          >
            {application.status == "not_yet_applied"
              ? `Apply`
              : `Already applied`}
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

export default Dashboard;
