import React, { useRef, useState, useEffect } from "react";
import "../App.css";
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

type Inputs = {
  businessName: string,
  buyerName: string,
  legalEntity: string,
  bizRevenue: number,
  bizEbitda: number,
  financialsPeriod: string,
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
    unregister,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newLoi = await createLoi(data)
    if ('id' in newLoi) {
      setActiveStep(1);
    }
  }

  useEffect(() => {
    if (loi == null) return;
    for (const [key, value] of Object.entries(loi)) {
      if (['buyerName', 'businessName', 'legalEntity', 'bizRevenue', 'bizEbitda', 'financialsPeriod'].includes(key)) {
        setValue(key as keyof Inputs, value as string | number);
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
          Acquiring Entity
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
            Do you have a legal entity?
          </label>
          <ToggleGroup value={hasLegalEntity || undefined}>
            <ToggleGroup.Item icon={null} value="yes" onClick={() => setHasLegalEntity("yes")}>
              Yes
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="no" onClick={() => {setHasLegalEntity("no"); unregister('legalEntity')}}>
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
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
        <span className="text-subheader font-subheader text-default-font">
          Business Info
        </span>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextField
            className="h-auto w-full flex-none"
            label="Legal name of the business"
            helpText=""
            htmlFor="businessName"
          >
            <TextField.Input {...register("businessName", {required: true})}/>
          </TextField>
          {errors.businessName && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex w-full items-start gap-4">
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <TextField
              className="h-auto w-full flex-none"
              label="Revenue"
              helpText=""
              htmlFor="bizRevenue"
              icon="FeatherDollarSign"
            >
              <TextField.Input {...register("bizRevenue", {required: true})} type="number" className="focus:ring-0"/>
            </TextField>
            {errors.bizRevenue && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <TextField
              className="h-auto w-full flex-none"
              label="EBITDA"
              helpText=""
              htmlFor="bizEbitda"
              icon="FeatherDollarSign"
            >
              <TextField.Input {...register("bizEbitda", {required: true})} type="number" className="focus:ring-0"/>
            </TextField>
            {errors.bizEbitda && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="financialsPeriod">
            Period for the provided revenue and EBITDA:
          </label>
          <Controller
            control={control}
            name="financialsPeriod"
            rules={{ required: true }}
            render={({ field }) => (
            <ToggleGroup value={field.value} onValueChange={field.onChange}>
              <ToggleGroup.Item icon={null} value="ttm">
                Trailing 12 months
              </ToggleGroup.Item>
              <ToggleGroup.Item icon={null} value="fy">
                FY 2023
              </ToggleGroup.Item>
            </ToggleGroup>
          )}
          />
          {errors.financialsPeriod && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <Button size="medium" type="submit">Next</Button>
      </div>
    </form>
  );
}

export default LoiStepOne;
