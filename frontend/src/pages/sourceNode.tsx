import { useCallback } from "react";
import { Select } from "@/subframe/components/Select";
import { Button } from "@/subframe/components/Button";
import * as SubframeCore from "@subframe/core";
import { Handle, Position } from "@xyflow/react";

// const handleStyle = { left: 10 };

function SourceNode({ data, isConnectable, selected }: any) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  const outline = `flex h-60 w-60 flex-none flex-col items-center rounded-md border border-solid ${
    selected ? "border-black" : "border-neutral-border"
  } bg-default-background`;

  return (
    <div className={outline}>
      <Handle type="source" position={Position.Right} id="a" />
      <div className="flex h-9 w-full flex-none items-center justify-between pt-1 pr-1 pb-1 pl-1">
        <div className="flex items-center justify-center gap-2">
          <img
            className="h-5 w-5 flex-none"
            src="https://res.cloudinary.com/subframe/image/upload/v1721095026/uploads/132/dtyslssyugxyanjx9x6x.svg"
          />
          <span className="text-body-bold font-body-bold text-default-font">
            BigQuery
          </span>
        </div>
        <Button
          variant="brand-tertiary"
          icon="FeatherPlay"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        />
      </div>
      <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
      <div className="flex h-10 w-full flex-none flex-col items-center justify-center gap-2 pt-2 pr-2 pb-2 pl-2">
        <Select
          className="h-auto w-full flex-none"
          label=""
          placeholder="BigQuery"
          helpText=""
          value="BigQuery"
          onValueChange={(value: string) => {}}
        >
          <Select.Item value="BigQuery">BigQuery</Select.Item>
          <Select.Item value="Snowflake">Snowflake</Select.Item>
          <Select.Item value="Redshift">Redshift</Select.Item>
        </Select>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-center gap-2">
        <Button
          className="h-8 w-28 flex-none"
          variant="neutral-secondary"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          Configure
        </Button>
        <Button
          className="h-8 w-28 flex-none"
          variant="neutral-secondary"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          View Tables
        </Button>
      </div>
      <div className="flex h-7 w-full flex-none items-start justify-between pt-1 pr-2 pb-2 pl-2">
        <span className="text-label-bold font-label-bold text-default-font">
          Status
        </span>
        <div className="flex items-center justify-center gap-1">
          <span className="text-label-bold font-label-bold text-error-700">
            Not configured
          </span>
          <SubframeCore.Icon
            className="text-body font-body text-error-700"
            name="FeatherX"
          />
        </div>
      </div>
    </div>
  );
}

export default SourceNode;
