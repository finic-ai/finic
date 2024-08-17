import React, { useRef, useState } from "react";
import { Select } from "@/subframe/components/Select";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { DestinationConfigurationDrawerType } from "@/types";
import { IconWithBackground, IconName } from "@/subframe/components/IconWithBackground";
import { Button } from "@/subframe/components/Button";
import { PropertiesAccordion } from "@/subframe/components/PropertiesAccordion";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";

interface DestinationNodeConfigurationDrawerProps {
  className?: string;
  nodeId: string;
  nodeData?: any;
  iconName: IconName;
  updateNodeConfiguration: (nodeId: string, configuration: any) => void;
  closeDrawer: () => void;
}

export default function DestinationNodeConfigurationDrawer({ nodeData, nodeId, iconName, updateNodeConfiguration, closeDrawer }: DestinationNodeConfigurationDrawerProps) {
  const configuration = nodeData.configuration || {};
  const childRef = useRef<{ saveData: () => void }>(null);
  const [destinationType, setDestinationType] = useState(nodeData.configuration ? nodeData.configuration.destinationType : null);

  function handleSaveClick() {
    if (childRef.current) {
      childRef.current.saveData();
    }
  }

  function onValueChange (value: string) {
    setDestinationType(value);
  };

  return (
    <div className="flex w-80 h-full flex-none flex-col items-start border-l border-solid border-neutral-border">
      <div className="flex flex-grow w-full overflow-auto flex-col items-start">
        <div className="flex w-full items-center justify-center gap-6 pt-4 pr-4 pb-4 pl-4">
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            {nodeData.name}
          </span>
          <div className="flex items-center justify-end gap-2">
            <span className="text-body-bold font-body-bold text-default-font">
              Destination
            </span>
            <IconWithBackground
              variant="brand"
              size="medium"
              icon={iconName}
              square={false}
            />
          </div>
        </div>
        <div className="flex w-80 h-full flex-none flex-col items-start border-l border-solid border-neutral-border">
          <PropertiesRow text="Destination">
            <Select
              className={destinationType ? "" : "w-40"}
              placeholder="Choose Destination"
              helpText=""
              value={destinationType}
              onValueChange={onValueChange}
            >
              <Select.Item value="snowflake">Snowflake</Select.Item>
            </Select>
          </PropertiesRow>
          {destinationType && React.createElement(
            DestinationConfigurationDrawerType[destinationType as keyof typeof DestinationConfigurationDrawerType] as React.ElementType,
            {configuration, updateNodeConfiguration: (configuration: any) => updateNodeConfiguration(nodeId, configuration), ref: childRef}
          )}
        </div>
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
        <Button onClick={handleSaveClick}>
          Save
        </Button>
      </div>
    </div>
  );
}