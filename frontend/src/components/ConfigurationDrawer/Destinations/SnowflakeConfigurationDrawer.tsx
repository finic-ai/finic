import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Select } from "@/subframe/components/Select";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { Button } from "@/subframe/components/Button";
import { TextField } from "@/subframe/components/TextField";
import { PropertiesRow } from "../../../subframe/components/PropertiesRow";
import { Switch } from "../../../subframe/components/Switch";
import { validate } from "uuid";
import { DestinationNodeType } from "@/types/index";

type SnowflakeConfiguration = {
  destinationType: string;
  hasCredentials?: boolean;
  account?: string;
  warehouse?: string;
  database?: string;
  tableSchema?: string;
  table?: string;
};

interface SnowflakeConfigurationDrawerProps {
  configuration: SnowflakeConfiguration;
  updateNodeConfiguration: (configuration: SnowflakeConfiguration) => void;
}

export const SnowflakeConfigurationDrawer = forwardRef((props: SnowflakeConfigurationDrawerProps, ref) => {
  const { configuration = { 
    destinationType: DestinationNodeType.SNOWFLAKE, 
    hasCredentials: false, 
    account: "",
    warehouse: "", 
    database: "",
    tableSchema: "",
    table: ""
  }} = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authFile, setAuthFile] = useState<any | null>(null);
  const [account, setAccount] = useState<string>(configuration.account || "");
  const [warehouse, setWarehouse] = useState<string>(configuration.warehouse || "");
  const [database, setDatabase] = useState<string>(configuration.database || "");
  const [tableSchema, setTableSchema] = useState<string>(configuration.tableSchema || "");
  const [table, setTable] = useState<string>(configuration.table || "");

  useImperativeHandle(ref, () => ({
    saveData: () => {
      if (!authFile && configuration.hasCredentials || account.length == 0 || warehouse.length == 0 || database.length == 0 || tableSchema.length == 0 || table.length == 0) {
        console.log("Invalid data");
        return;
      }
      console.log(authFile);
      console.log(configuration.hasCredentials);
      if (!authFile && configuration.hasCredentials) {
        const newConfig = {
          destinationType: DestinationNodeType.SNOWFLAKE,
          account: account,
          warehouse: warehouse,
          database: database,
          tableSchema: tableSchema,
          table: table
        };
        props.updateNodeConfiguration(newConfig);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newConfig = {
            destinationType: DestinationNodeType.SNOWFLAKE,
            account: account,
            warehouse: warehouse,
            database: database,
            tableSchema: tableSchema,
            table: table,
            credentials: JSON.parse(event.target?.result as string)
          };
          props.updateNodeConfiguration(newConfig);
        };
        reader.readAsText(authFile);
      }
    }
  }))

  const handleClickUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAuthFile(file);
    }
  };

  return (
    <div>
      <PropertiesAccordion title="Authentication">
        <div className="flex flex-col items-start gap-4">
          <span className="text-caption font-caption text-default-font">
            In order to connect to Snowflake, you&#39;ll need to set up
            a service account and upload the credentials as a JSON file. Learn more
            here.
          </span>
          <div className="flex flex-col items-start gap-2">
            <div>
              <Button
                variant="neutral-secondary"
                icon="FeatherUpload"
                onClick={handleClickUploadFile}
              >
                Upload
              </Button>
              <span className="text-caption font-caption text-subtext-color">
                {authFile ? `File: ${authFile.name}` : (configuration.hasCredentials ? "Credentials already provided": "No credentials provided")}
              </span>
            </div>
            <input className="hidden" type="file" accept=".json,application/json" ref={fileInputRef} onChange={handleUploadFile}>
            </input>
          </div>
        </div>
      </PropertiesAccordion>
      <PropertiesAccordion title="Destination Settings">
        <div className="flex flex-col items-start gap-4">
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="Account Name"
            helpText={
              'The name of the Snowflake account to connect to.'
            }
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value={account}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setAccount(event.target.value)}}
            />
          </TextField>
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="Warehouse Name"
            helpText="The name of the warehouse to connect to."
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value={warehouse}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setWarehouse(event.target.value)}}
            />
          </TextField>
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="Database Name"
            helpText="The name of the database to connect to."
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value={database}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setDatabase(event.target.value)}}
            />
          </TextField>
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="Table Schema Name"
            helpText="The name of the table schema to use."
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value={tableSchema}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTableSchema(event.target.value)}}
            />
          </TextField>
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="Table Name"
            helpText="The name of the table to connect to."
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value={table}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTable(event.target.value)}}
            />
          </TextField>
        </div>
        <div className="flex w-full items-center gap-2 pt-4">
          <Button
            variant="neutral-primary"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Test Connection
          </Button>
        </div>
      </PropertiesAccordion>
      <PropertiesAccordion title="Sample Data">
        <div className="flex flex-col items-start gap-2">
          <Button
            variant="neutral-secondary"
            icon="FeatherUpload"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Upload
          </Button>
          <span className="text-caption font-caption text-subtext-color">
            Upload a CSV file to test this node with sample  input data.
          </span>
        </div>
      </PropertiesAccordion>
      <PropertiesAccordion title="Run Schedule">
        <div className="flex flex-col items-start gap-4">
          <span className="text-caption font-caption text-default-font">
            By default, a node will immediately run after all its input nodes have
            completed running. Setting a schedule delays running until the specified
            time.
          </span>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Enable Schedule
            </span>
            <Switch checked={false} onCheckedChange={(checked: boolean) => {}} />
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              className="h-8 grow shrink-0 basis-0"
              variant="neutral-secondary"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Crontab
            </Button>
            <Button
              className="h-8 grow shrink-0 basis-0"
              icon="FeatherCheck"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Basic
            </Button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Run Frequency
            </span>
            <Select
              variant="filled"
              label=""
              placeholder="Weekly"
              helpText=""
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="5 mins">5 mins</Select.Item>
              <Select.Item value="30 mins">30 mins</Select.Item>
              <Select.Item value="1 hour">1 hour</Select.Item>
            </Select>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Day of Week
            </span>
            <Select
              variant="filled"
              label=""
              placeholder="Thursday"
              helpText=""
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="5 mins">5 mins</Select.Item>
              <Select.Item value="30 mins">30 mins</Select.Item>
              <Select.Item value="1 hour">1 hour</Select.Item>
            </Select>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="grow shrink-0 basis-0 text-caption-bold font-caption-bold text-default-font">
              Hour of Day
            </span>
            <Select
              variant="filled"
              label=""
              placeholder="12:00:00 UTC"
              helpText=""
              value=""
              onValueChange={(value: string) => {}}
            >
              <Select.Item value="5 mins">5 mins</Select.Item>
              <Select.Item value="30 mins">30 mins</Select.Item>
              <Select.Item value="1 hour">1 hour</Select.Item>
            </Select>
          </div>
        </div>
      </PropertiesAccordion>
      <PropertiesRow text="On Failure">
        <Select
          variant="filled"
          label=""
          placeholder="Retry"
          helpText=""
          value=""
          onValueChange={(value: string) => {}}
        >
          <Select.Item value="5 mins">5 mins</Select.Item>
          <Select.Item value="Notify">Notify</Select.Item>
          <Select.Item value="Ignore">Ignore</Select.Item>
        </Select>
      </PropertiesRow>
    </div>
  );
});
