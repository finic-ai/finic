import React, { useState, useCallback } from "react";
import { Select } from "@/subframe/components/Select";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { Button } from "@/subframe/components/Button";
import { TextField } from "@/subframe/components/TextField";
import { PropertiesRow } from "../../../subframe/components/PropertiesRow";
import { Switch } from "../../../subframe/components/Switch";
import { SourceConfigurationDrawerType } from "@/types";

// interface GCSConfigurationDrawer {

// }

export function GCSConfigurationDrawer() {
  return (
    <div>
      <PropertiesAccordion title="Authentication">
        <div className="flex flex-col items-start gap-4">
          <span className="text-caption font-caption text-default-font">
            In order to access your Google Cloud Storage, you&#39;ll need to set up
            a service account and upload the credentials as a JSON file. Learn more
            here.
          </span>
          <div className="flex flex-col items-start gap-2">
            <Button
              variant="neutral-secondary"
              icon="FeatherUpload"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Upload
            </Button>
            <span className="text-caption font-caption text-subtext-color">
              Upload your service account credentials as a JSON file.
            </span>
          </div>
        </div>
      </PropertiesAccordion>
      <PropertiesAccordion title="File Location">
        <div className="flex flex-col items-start gap-4">
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="Bucket Name"
            helpText={
              'The unique name of the GCS bucket to connect to, e.g. "project-data-storage".'
            }
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </TextField>
          <TextField
            disabled={false}
            error={false}
            variant="outline"
            label="File Name"
            helpText="The filename or path of the document to retrieve."
            icon={null}
            iconRight={null}
          >
            <TextField.Input
              placeholder=""
              value=""
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
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
}
