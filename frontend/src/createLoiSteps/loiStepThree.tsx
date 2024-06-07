import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import { Button } from "@/subframe/components/Button";
import { TextField } from "@/subframe/components/TextField";
import { TextArea } from "@/subframe/components/TextArea";
import DatePicker from "react-datepicker";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { LOI } from "../pages/loiPage.tsx"

type Inputs = {
  hasEarnout: string | undefined,
  hasEscrow: string | undefined,
  earnoutDescription: string,
  escrowPercent: number,
  closingDate: Date,
}

interface LoiStepThreeProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  updateLoi: (data: Inputs) => Promise<{loi: LOI}>;
  loi: LOI | null;
}

function LoiStepThree({ setActiveStep, updateLoi, loi }: LoiStepThreeProps) {

  const {
    register,
    handleSubmit,
    watch,
    control,
    unregister,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const hasEarnout = watch('hasEarnout')
  const hasEscrow = watch('hasEscrow')
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    delete data.hasEarnout
    delete data.hasEscrow
    const newLoi = await updateLoi(data)
    if ('id' in newLoi) {
      setActiveStep(3);
    }
  }

  useEffect(() => {
    if (loi == null) return;
    console.log(loi)
    for (const [key, value] of Object.entries(loi)) {
      if (['earnoutDescription', 'escrowPercent'].includes(key)) {
        setValue(key as keyof Inputs, value);
      }
      else if (key == 'closingDate') {
        setValue('closingDate', value ? new Date(value) : null);
      }
    }
    loi.earnoutDescription ? setValue('hasEarnout', 'yes') : setValue('hasEarnout', 'no');
    loi.escrowPercent ? setValue('hasEscrow', 'yes') : setValue('hasEscrow', 'no');
  }, [loi]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-6">
      <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background pt-4 pr-6 pb-6 pl-6 shadow-default">
        <div className="flex w-full flex-col items-start">
          <span className="w-full text-subheader font-subheader text-default-font" />
          <span className="w-full text-body font-body text-subtext-color" />
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="closingDate">
            Target closing date
          </label>
          <Controller
              control={control}
              name="closingDate"
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker selected={field.value} onChange={field.onChange} className="flex h-8 w-full flex-none items-center gap-1 rounded-md border border-solid border-neutral-border focus:ring-0 focus:border-brand-primary text-body font-body text-default-font"/>
            )}
            />
          {errors.closingDate && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex flex-col items-start gap-1">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="hasEarnout">Will there be an earnout?</label>
          <Controller
            control={control}
            name="hasEarnout"
            rules={{ required: true }}
            render={({ field }) => (
            <ToggleGroup value={field.value} onValueChange={field.onChange}>
              <ToggleGroup.Item icon={null} value="yes">
                Yes
              </ToggleGroup.Item>
              <ToggleGroup.Item icon={null} value="no">
                No
              </ToggleGroup.Item>
            </ToggleGroup>
          )}
          />
          {errors.hasEarnout && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        {hasEarnout == 'yes' ? <div className="flex w-full flex-col items-start gap-1 pl-4">
          <TextArea
            className="h-auto min-h-[96px] w-full flex-none"
            label="Describe the structure of the earnout."
            helpText=""
            htmlFor="earnoutDescription"
          >
            <TextArea.Input {...register("earnoutDescription", {required: true})} className="focus:ring-0"/>
          </TextArea>
          {errors.earnoutDescription && hasEarnout == 'yes' && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>: null}
        <div className="flex flex-col items-start gap-1">
        <label className="text-body-bold font-body-bold text-default-font" htmlFor="hasEscrow">
          Will funds be held in escrow?
        </label>
        <Controller
          control={control}
          name="hasEscrow"
          rules={{ required: true }}
          render={({ field }) => (
          <ToggleGroup value={field.value} onValueChange={field.onChange}>
            <ToggleGroup.Item icon={null} value="yes">
              Yes
            </ToggleGroup.Item>
            <ToggleGroup.Item icon={null} value="no">
              No
            </ToggleGroup.Item>
          </ToggleGroup>
          )}
        />
        {errors.hasEscrow && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        {hasEscrow == 'yes' ? <div className="flex flex-col items-start gap-1 pl-4">
          <label className="text-body-bold font-body-bold text-default-font" htmlFor="escrowPercent">What percent of the purchase price will be kept in escrow?</label>
          <TextField
            className="h-auto w-full flex-none"
            helpText=""
            htmlFor="escrowPercent"
            iconRight="FeatherPercent"
          >
            <TextField.Input {...register("escrowPercent", {required: true})}/>
          </TextField>
          <span className={`text-body font-body ${errors.escrowPercent ? 'text-error-700' : 'text-transparent'}`}>
            {errors.escrowPercent ? 'This field is required' : 'a'}
          </span>
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
