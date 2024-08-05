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
  businessName: string,
  businessAddress: string,
  businessState: string,
  businessEntityType: string,
  sellerName: string,
  businessRevenue: number,
  businessEbitda: number,
  financialsPeriod: string,
}

interface LoiStepTwoProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  updateLoi: (data: Inputs) => Promise<{loi: LOI}>;
  loi: LOI | null;
}

function LoiStepOne({ setActiveStep, updateLoi, loi}: LoiStepTwoProps) {
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
    const newLoi = await updateLoi(data)
    if ('id' in newLoi) {
      setActiveStep(2);
    }
  }

  useEffect(() => {
    if (loi == null) return;
    console.log(loi)
    for (const [key, value] of Object.entries(loi)) {
      if (['sellerName', 'businessName', 'businessAddress', 'businessState', 'businessEntityType', 'businessRevenue', 'businessEbitda', 'financialsPeriod'].includes(key)) {
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
          Company Information
        </span>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextField
            className="h-auto w-full flex-none"
            label="Company's legal name"
            helpText=""
            htmlFor="businessName"
          >
            <TextField.Input {...register("businessName", {required: true})}/>
          </TextField>
          {errors.businessName && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextField
            className="h-auto w-full flex-none"
            label="Seller's full name"
            helpText=""
            htmlFor="sellerName"
          >
            <TextField.Input {...register("sellerName", {required: true})}/>
          </TextField>
          {errors.sellerName && <span className="text-body font-body text-error-700">This field is required</span>}
        </div>
        <div className="flex w-full items-start gap-4">
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <label className="text-body-bold font-body-bold text-default-font" htmlFor="businessState">State of incorporation</label>
            <Controller
              control={control}
              name="businessState"
              rules={{ required: false }}
              render={({ field }) => (
                <Select
                  className="h-auto w-full flex-none"
                  placeholder="Select"
                  helpText="Optional"
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
          </div>
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <label className="text-body-bold font-body-bold text-default-font" htmlFor="businessEntityType">Entity type</label>
            <Controller
              control={control}
              name="businessEntityType"
              rules={{ required: false }}
              render={({ field }) => (
                <Select
                  className="h-auto w-full flex-none"
                  placeholder="Select"
                  helpText="Optional"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <div className="flex w-full flex-col items-start">
                    {businessEntityTypes.map((entityType) => (
                      <Select.Item key={entityType} value={entityType}>
                        {entityType}
                      </Select.Item>
                    ))}
                  </div>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
          <TextArea
            className="h-auto min-h-[96px] w-full flex-none"
            label="Address"
            helpText=""
            htmlFor="businessAddress"
          >
            <TextArea.Input {...register("businessAddress", {required: false})} className="focus:ring-0"/>
          </TextArea>
        </div>
        <div className="flex w-full items-start gap-4">
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <TextField
              className="h-auto w-full flex-none"
              label="Revenue"
              helpText="The 12-month run rate revenue used as the basis for the valuation."
              htmlFor="businessRevenue"
              icon="FeatherDollarSign"
            >
              <TextField.Input {...register("businessRevenue", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
            </TextField>
            {errors.businessRevenue && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
          <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-1">
            <TextField
              className="h-auto w-full flex-none"
              label="EBITDA"
              helpText="The 12-month run rate EBIDTA used as the basis for the valuation."
              htmlFor="businessEbitda"
              icon="FeatherDollarSign"
            >
              <TextField.Input {...register("businessEbitda", {required: true})} type="number" className="focus:ring-0 pl-0 pr-0"/>
            </TextField>
            {errors.businessEbitda && <span className="text-body font-body text-error-700">This field is required</span>}
          </div>
        </div>
        <div className="flex w-full items-center gap-2">
          <Button size="medium" type="submit">Next</Button>
          <Button variant="neutral-tertiary" size="medium" onClick={() => setActiveStep(0)}>
            Back
          </Button>
        </div>
      </div>
    </form>
  );
}

export default LoiStepOne;
