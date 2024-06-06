import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import posthog from "posthog-js";
import { useUserStateContext } from "../context/UserStateContext";
import { DefaultPageLayout } from "../subframe";
import { Button } from "@/subframe/components/Button";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { Steps } from "@/subframe/components/Steps";
import { TextField } from "@/subframe/components/TextField";
import { Select } from "@/subframe/components/Select";
import { TextArea } from "@/subframe/components/TextArea";
import { RadioGroup } from "@/subframe/components/RadioGroup";
import { Checkbox } from "@/subframe/components/Checkbox";
import { CheckboxGroup } from "@/subframe/components/CheckboxGroup";
import { RadioCardGroup } from "@/subframe/components/RadioCardGroup";
import { Accordion } from "@/subframe/components/Accordion";
import { useForm, SubmitHandler } from "react-hook-form"
import LoiStepOne from "../createLoiSteps/loiStepOne";
import LoiStepTwo from "../createLoiSteps/loiStepTwo";
import LoiStepThree from "../createLoiSteps/loiStepThree";
import LoiStepFour from "../createLoiSteps/loiStepFour";

type Inputs = {
  businessName: string
}

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});

function CreateLoiPage() {
  const [ activeStep, setActiveStep ] = useState(2);
  
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-8 bg-default-background pt-12 pb-12">
        <div className="flex w-full flex-col items-start gap-2">
          <Breadcrumbs>
            <Breadcrumbs.Item onClick={() => {
              window.location.href = "/lois";
            }}>LOIs</Breadcrumbs.Item>
            <Breadcrumbs.Divider />
            <Breadcrumbs.Item active={true}>Create LOI</Breadcrumbs.Item>
          </Breadcrumbs>
          <span className="text-section-header font-section-header text-default-font">
            Create new LOI
          </span>
        </div>
        <Steps>
          <Steps.Step
            name="Basic Information"
            firstStep={true}
            variant={activeStep > 0 ? "success": "active"}
            stepNumber="1"
            onClick={() => setActiveStep(0)}
          />
          <Steps.Step 
            name="Deal Structure" 
            variant={activeStep > 1 ? "success": (activeStep == 1 ? "active": "default")} 
            stepNumber="2" 
            onClick={() => activeStep > 1 && setActiveStep(1)}/>
          <Steps.Step 
            name="Post Close" 
            variant={activeStep > 2 ? "success": (activeStep == 2 ? "active": "default")} 
            stepNumber="3" 
            onClick={() => activeStep > 1 && setActiveStep(1)}/>
          <Steps.Step 
            name="Misc" 
            variant={activeStep == 3 ? "active": "default"} 
            lastStep={true} 
            stepNumber="4" 
            onClick={() => activeStep > 1 && setActiveStep(1)}/>
        </Steps>
        <div className="flex w-full items-start gap-6">
          {(() => {
            switch (activeStep) {
              case 0:
                return <LoiStepOne setActiveStep={setActiveStep} />;
              case 1:
                return <LoiStepTwo setActiveStep={setActiveStep} />;
              case 2:
                return <LoiStepThree setActiveStep={setActiveStep} />;
              case 3:
                return <LoiStepFour setActiveStep={setActiveStep} />;
              default:
                return <LoiStepOne setActiveStep={setActiveStep} />;
            }
          })()}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex w-80 flex-col items-center justify-center gap-2 rounded-md bg-neutral-50 pt-6 pr-6 pb-6 pl-6">
              <span className="text-body font-body text-subtext-color">
                LOI Preview
              </span>
            </div>
            <Button
              variant="brand-tertiary"
              size="medium"
              icon="FeatherEye"
              iconRight={null}
              loading={false}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default CreateLoiPage;
