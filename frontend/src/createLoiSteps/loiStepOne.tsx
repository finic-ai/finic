import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import states from 'states-us';
import { Button } from "@/subframe/components/Button";
import { TextField } from "@/subframe/components/TextField";
import { Select } from "@/subframe/components/Select";
import { TextArea } from "@/subframe/components/TextArea";
import { RadioGroup } from "@/subframe/components/RadioGroup";
import { Checkbox } from "@/subframe/components/Checkbox";
import { CheckboxGroup } from "@/subframe/components/CheckboxGroup";
import { RadioCardGroup } from "@/subframe/components/RadioCardGroup";
import { Accordion } from "@/subframe/components/Accordion";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { LOI } from "../pages/loiPage.tsx"

const businessEntityTypes = ["C Corporation", "S Corporation", "Limited Liability Company", "Sole Proprietorship", "Limited Liability Partnership", "Limited Partnership", "Other"]

type Inputs = {
  buyerName: string,
  legalEntity: string,
}

interface LoiStepOneProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  createLoi: (data: Inputs) => Promise<{loi: LOI}>;
  loi: LOI | null;
}

function LoiStepOne({ setActiveStep, createLoi, loi}: LoiStepOneProps) {
  const [ hasLegalEntity, setHasLegalEntity ] = useState<string | null>('no');

  const {
    register,
    handleSubmit,
    watch,
    control,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (hasLegalEntity == 'no') {
      data.legalEntity = ''
    }
    const newLoi = await createLoi(data)
    if ('id' in newLoi) {
      setActiveStep(1);
    }
  }

  useEffect(() => {
    if (loi == null) return;
    for (const [key, value] of Object.entries(loi)) {
      if (['buyerName', 'legalEntity'].includes(key)) {
        setValue(key as keyof Inputs, value as string);
      }
      if (key == 'legalEntity' && value != '') {
        setHasLegalEntity('yes');
      }
    }
  }, [loi]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-6">
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background pt-4 pr-6 pb-6 pl-6 shadow-default">
        <div className="flex w-full flex-col items-start">
          <span className="w-full text-subheader font-subheader text-default-font" />
          <span className="w-full text-body font-body text-subtext-color" />
        </div>
        <span className="text-subheader font-subheader text-default-font">
          Buyer Information
        </span>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextField
            className="h-auto w-full flex-none"
            label="Your full name"
            helpText=""
            htmlFor="buyerName"
          >
            <TextField.Input {...register("buyerName", {required: true})}/>
          </TextField>
          {errors.buyerName && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="hasLegalEntity">
            Do you have a legal entity set up for the acquisition?
          </label>
          <ToggleGroup value={hasLegalEntity || undefined}>
            <ToggleGroup.Item icon={null} value="yes" onClick={() => setHasLegalEntity("yes")}>
              Yes
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="no" onClick={() => {setHasLegalEntity("no"); resetField('legalEntity')}}>
              No
            </ToggleGroup.Item>
          </ToggleGroup>
          {!hasLegalEntity && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        {hasLegalEntity == 'yes' ? <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1 pl-4">
          <TextField
            className="h-auto w-full flex-none"
            label="Name of the legal entity"
            helpText=""
            htmlFor="legalEntity"
          >
            <TextField.Input {...register("legalEntity", {required: true})}/>
          </TextField>
          {errors.legalEntity && hasLegalEntity && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>: null}
        <Button size="medium" type="submit">Next</Button>
      </div>
    </form>
  );
}

export default LoiStepOne;
