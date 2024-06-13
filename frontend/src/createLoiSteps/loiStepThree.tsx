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
  purchasePrice: number,
  notePercent: number,
  noteInterestRate: number,
  noteTerm: number,
  noteStandby: number,
  notePaymentType: string,
  transactionType: string,
  equityRolloverPercent: number,
}

interface LoiStepThreeProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  updateLoi: (data: Inputs) => Promise<{loi: LOI}>;
  loi: LOI | null;
}

function LoiStepThree({ setActiveStep, updateLoi, loi }: LoiStepThreeProps) {
  const [ noteOnStandby, setNoteOnStandby ] = useState<string | null>('no');
  const [ equityRollover, setEquityRollover ] = useState<string | null>('no');

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
    if (noteOnStandby == 'no') {
      data.noteStandby = 0
    }
    if (equityRollover == 'no') {
      data.equityRolloverPercent = 0
    }
    const newLoi = await updateLoi(data)
    if ('id' in newLoi) {
      setActiveStep(3);
    }
  }

  useEffect(() => {
    if (loi == null) return;
    for (const [key, value] of Object.entries(loi)) {
      if (['purchasePrice', 'notePercent', 'noteInterestRate', 'noteTerm', 'noteStandby', 'notePaymentType', 'transactionType', 'equityRolloverPercent'].includes(key)) {
        setValue(key as keyof Inputs, value as string | number);
      }
      if (key == 'noteStandby' && value as number > 0) {
        setNoteOnStandby('yes')
      }
      if (key == 'equityRolloverPercent' && value as number > 0) {
        setEquityRollover('yes')
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
        <div className="flex flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="transactionType">
            Will this be an asset or stock sale?
          </label>
          <Controller
            control={control}
            name="transactionType"
            rules={{ required: true }}
            render={({ field }) => (
            <ToggleGroup value={field.value} onValueChange={field.onChange}>
              <ToggleGroup.Item icon={null} value="asset">
                Asset
              </ToggleGroup.Item>
              <ToggleGroup.Item icon={null} value="stock">
                Stock
              </ToggleGroup.Item>
            </ToggleGroup>
          )}
          />
          {errors.transactionType && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextField
            className="h-auto w-full flex-none"
            label="What is the purchase price?"
            helpText=""
            htmlFor="purchasePrice"
            iconRight="FeatherDollarSign"
          >
            <TextField.Input {...register("purchasePrice", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
          </TextField>
          {errors.purchasePrice && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
        <span className="text-subheader font-subheader text-default-font">
          Sellers Note
        </span>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextField
            className="h-auto w-full flex-none"
            label="What percent of the purchase price will be in the form of a seller note?"
            helpText=""
            htmlFor="notePercent"
            iconRight="FeatherPercent"
          >
            <TextField.Input {...register("notePercent", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
          </TextField>
          {errors.notePercent && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex w-full items-start gap-4">
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <TextField
              className="h-auto w-full flex-none"
              label="Interest rate on the note"
              helpText=""
              htmlFor="noteInterestRate"
              iconRight="FeatherPercent"
            >
              <TextField.Input {...register("noteInterestRate", {required: true})} type="number" className="focus:ring-0"/>
            </TextField>
            {errors.noteInterestRate && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <TextField
              className="h-auto w-full flex-none"
              label="Term of the note (years)"
              helpText=""
              htmlFor="noteTerm"
            >
              <TextField.Input {...register("noteTerm", {required: true})} type="number" className="focus:ring-0"/>
            </TextField>
            {errors.noteTerm && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
        <Controller
          control={control}
          name="notePaymentType"
          rules={{ required: false }}
          render={({ field }) => (
            <RadioGroup
              label="How will the note be paid?"
              helpText=""
              value={field.value}
              onValueChange={field.onChange}
            >
              <div className="flex flex-col items-start gap-2">
                <RadioGroup.Option
                  label="Interest only for the term with a balloon payment at the end"
                  value="interest_only"
                />
                <RadioGroup.Option
                  label="Interest and principal payments amortized over the term"
                  value="amortizing"
                />
              </div>
            </RadioGroup>
          )
        }/>
          {errors.notePaymentType && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="noteOnStandby">
            Will the note be standby?
          </label>
          <p className="text-label pb-3">A 2 year standby is required by SBA 7(a) lenders for a sellers note to count towards minimum equity requirements.</p>
          <ToggleGroup value={noteOnStandby || undefined}>
            <ToggleGroup.Item icon={null} value="yes" onClick={() => setNoteOnStandby("yes")}>
              Yes
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="no" onClick={() => {setNoteOnStandby("no"); resetField('noteStandby')}}>
              No
            </ToggleGroup.Item>
          </ToggleGroup>
          {!noteOnStandby && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        {noteOnStandby == 'yes' ? <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1 pl-4">
          <TextField
            className="h-auto w-full flex-none"
            label="Years on standby"
            helpText=""
            htmlFor="noteStandby"
          >
            <TextField.Input {...register("noteStandby", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
          </TextField>
          {errors.noteStandby && noteOnStandby && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>: null}
        <span className="text-subheader font-subheader text-default-font">
          Equity Rollover
        </span>
        <div className="flex flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="equityRollover">
            Will the seller retain equity in the post-acquisition entity? (i.e. rollover equity)
          </label>
          <ToggleGroup value={equityRollover || undefined}>
            <ToggleGroup.Item icon={null} value="yes" onClick={() => setEquityRollover("yes")}>
              Yes
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="no" onClick={() => {setEquityRollover("no"); resetField('equityRolloverPercent')}}>
              No
            </ToggleGroup.Item>
          </ToggleGroup>
          {!equityRollover && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        {equityRollover == 'yes' ? <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1 pl-4">
          <TextField
            className="h-auto w-full flex-none"
            label="Percent of purchase price"
            helpText=""
            htmlFor="equityRolloverPercent"
            iconRight="FeatherPercent"
          >
            <TextField.Input {...register("equityRolloverPercent", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
          </TextField>
          {errors.equityRolloverPercent && equityRollover && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>: null}
        <div className="flex w-full items-center gap-2">
          <Button size="medium" type="submit">Next</Button>
          <Button variant="neutral-tertiary" size="medium" onClick={() => setActiveStep(1)}>
            Back
          </Button>
        </div>
      </div>
    </form>
  );
}

export default LoiStepThree;
