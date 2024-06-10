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
import DatePicker from "react-datepicker";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import states from 'states-us';
import { LOI } from "../pages/loiPage.tsx"

import "react-datepicker/dist/react-datepicker.css";

type Inputs = {
  exclusivityDays: number,
  terminationFeeType: string,
  terminationFeeAmount: number,
  governingLaw: string,
  expirationDate: Date | null,
  status: string
}

interface LoiStepFourProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  updateLoi: (data: Inputs) => Promise<{loi: LOI}>;
  loi: LOI | null;
  setConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoiStepFour({ setActiveStep, updateLoi, loi, setConfirmationModalOpen }: LoiStepFourProps) {

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const terminationFeeType = watch('terminationFeeType')
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.status = "completed"
    if (data.terminationFeeType == "none") {
      data.terminationFeeAmount = 0
    }
    const newLoi = await updateLoi(data)
    if ('id' in newLoi) {
      setConfirmationModalOpen(true)
    }
  }

  useEffect(() => {
    if (loi == null) return;
    for (const [key, value] of Object.entries(loi)) {
      if (['terminationFeeType', 'terminationFeeAmount', 'governingLaw'].includes(key)) {
        setValue(key as keyof Inputs, value);
      }
      else if (['terminationFeeType', 'expirationDate'].includes(key)) {
        setValue(key as keyof Inputs, value ? new Date(value) : null);
      }
      else if (key == 'exclusivityDays') {
        setValue(key as keyof Inputs, value as number);
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
        <div className="flex h-full w-full grow shrink-0 basis-0 flex-col items-start gap-6">
          <div className="flex flex-col items-start gap-1">
            <label className="text-body-bold font-body-bold text-default-font" htmlFor="terminationFeeType">How long should the exclusivity period be?</label>
            <div className="flex flex-row items-center gap-1">
              <TextField
                className="h-auto w-full flex-none"
                label=""
                helpText=""
                htmlFor="exclusivityDays"
              >
                
                  <TextField.Input {...register("exclusivityDays", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
              </TextField>
              <div className="text-body font-body text-default-font">Days</div>
            </div>
            {errors.exclusivityDays && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-body-bold font-body-bold text-default-font" htmlFor="terminationFeeType">
              What type of termination fee will be included?
            </label>
            <Controller
              control={control}
              name="terminationFeeType"
              rules={{ required: true }}
              render={({ field }) => (
              <ToggleGroup value={field.value} onValueChange={field.onChange}>
                <ToggleGroup.Item icon={null} value="none">
                  No Termination Fee
                </ToggleGroup.Item>
                <ToggleGroup.Item icon={null} value="buyside">
                  Regular (Buyside)
                </ToggleGroup.Item>
                <ToggleGroup.Item icon={null} value="sellside">
                  Reverse (Sellside)
                </ToggleGroup.Item>
                <ToggleGroup.Item icon={null} value="mutual">
                  Mutual
                </ToggleGroup.Item>
              </ToggleGroup>
            )}
            />
            {errors.terminationFeeType && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
          {["buyside", "sellside", "mutual"].includes(terminationFeeType) ? <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1 pl-4">
            <TextField
              className="h-auto w-full flex-none"
              label="How much should the termination fee be?"
              helpText=""
              htmlFor="terminationFeeAmount"
              icon="FeatherDollarSign"
            >
              <TextField.Input {...register("terminationFeeAmount", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
            </TextField>
            {errors.terminationFeeAmount && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>: null}
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <label className="text-body-bold font-body-bold text-default-font" htmlFor="governingLaw">Under which state's law will this agreement be governed?</label>
            <Controller
              control={control}
              name="governingLaw"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  className="h-auto w-full flex-none"
                  placeholder="Select"
                  helpText=""
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <div className="flex w-full flex-col items-start">
                    {states.map((state) => (
                      <Select.Item key={state.name} value={state.name}>
                        {state.name}
                      </Select.Item>
                    ))}
                  </div>
                </Select>
              )}
            />
            {errors.governingLaw && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <label className="text-body-bold font-body-bold text-default-font" htmlFor="expirationDate">
              When should this LOI expire?
            </label>
            <Controller
                control={control}
                name="expirationDate"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker selected={field.value} onChange={field.onChange} className="flex h-8 w-full flex-none items-center gap-1 rounded-md border border-solid border-neutral-border focus:ring-0 focus:border-brand-primary text-body font-body text-default-font"/>
              )}
              />
            {errors.expirationDate && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
        </div>
        <div className="flex w-full items-center gap-2">
          <Button size="medium" type="submit">Finish</Button>
          <Button variant="neutral-tertiary" size="medium" onClick={() => setActiveStep(2)}>
            Back
          </Button>
        </div>
      </div>
    </form>
  );
}

export default LoiStepFour;
