import React from "react";
import { Button } from "@/subframe/components/Button";
import {
  IconWithBackground,
  type IconName,
} from "@/subframe/components/IconWithBackground";
import { Select } from "@/subframe/components/Select";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { TextArea } from "@/subframe/components/TextArea";
import { Alert } from "@/subframe/components/Alert";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { TextField } from "@/subframe/components/TextField";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { NodeTypeNames, configurationDrawerTypes } from "@/types";

interface ConfigurationDrawerProps {
  className?: string;
  nodeName: string;
  nodeType: string;
  nodeData?: any;
  iconName: IconName;
  closeDrawer: () => void;
}

export function ConfigurationDrawer({ className, nodeName, nodeType, nodeData, iconName, closeDrawer }: ConfigurationDrawerProps) {
  return (
    <div
      className={
        "flex w-80 h-full flex-none flex-col items-start border-l border-solid border-neutral-border " +
        (className ? className : "")
      }
    >
      <div className="flex flex-grow w-full overflow-auto flex-col items-start">
        <div className="flex w-full items-center justify-center gap-6 pt-4 pr-4 pb-4 pl-4">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            {nodeName}
          </span>
          <div className="flex items-center justify-end gap-2">
            <span className="text-body-bold font-body-bold text-default-font">
              {NodeTypeNames[nodeType as keyof typeof NodeTypeNames]}
            </span>
            <IconWithBackground
              variant="brand"
              size="medium"
              icon={iconName}
              square={false}
            />
          </div>
        </div>
        {React.createElement(
          configurationDrawerTypes[nodeType as keyof typeof configurationDrawerTypes] as React.ElementType<{ nodeData: any }>,
          { nodeData }
        )}
      </div>
      <div className="flex w-full items-center justify-end gap-2 pt-4 pr-2 pb-2 pl-2">
        <Button
          variant="brand-secondary"
          icon="FeatherSettings2"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            closeDrawer();
          }}
        >
          Close
        </Button>
        <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}>
          Run Node
        </Button>
      </div>
    </div>
  );
}
