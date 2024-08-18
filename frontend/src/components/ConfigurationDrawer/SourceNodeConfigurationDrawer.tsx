import React, { useEffect, useRef, useState } from "react";
import { Select } from "@/subframe/components/Select";
import { PropertiesRow } from "@/subframe/components/PropertiesRow";
import { SourceConfigurationDrawerType } from "@/types";
import { IconWithBackground, IconName } from "@/subframe/components/IconWithBackground";
import { Button } from "@/subframe/components/Button";
import { TextField } from "@/subframe/components/TextField";

interface SourceNodeConfigurationDrawerProps {
  className?: string;
  nodeId: string;
  nodeData?: any;
  iconName: IconName;
  updateNodeConfiguration: (nodeId: string, configuration: any) => void;
  closeDrawer: () => void;
}

export default function SourceNodeConfigurationDrawer({ nodeData, nodeId, iconName, updateNodeConfiguration, closeDrawer }: SourceNodeConfigurationDrawerProps) {
  const configuration = nodeData.configuration || {};
  const childRef = useRef<{ saveData: () => void }>(null);
  const [sourceType, setSourceType] = useState(nodeData.configuration ? nodeData.configuration.sourceType : null);
  const [editingName, setEditingName] = useState(false);
  const [nodeName, setNodeName] = useState(nodeData.name);
  const nodeNameRef = useRef<HTMLSpanElement>(null);

  const handleClickOutsideNodeName = (event: MouseEvent) => {
    if (nodeNameRef.current && !nodeNameRef.current.contains(event.target as Node)) {
      // Logic to trigger when clicking outside the span
      setEditingName(false);
      // console.log(nodeData)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideNodeName);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNodeName);
    };
  }, []);

  function handleSaveClick() {
    if (childRef.current) {
      childRef.current.saveData();
    }
  }

  function onValueChange (value: string) {
    setSourceType(value);
  };
  
  
  return (
    <div className="flex w-80 h-full flex-none flex-col items-start border-l border-solid border-neutral-border">
      <div className="flex flex-grow w-full overflow-auto flex-col items-start">
        <div className="flex w-full items-center justify-center gap-6 pt-4 pr-4 pb-4 pl-4">
          <span 
            className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font" 
            ref={nodeNameRef}
            onClick={() => setEditingName(true)}
          >
            {editingName ? <TextField
              variant="outline"
            >
              <TextField.Input
                placeholder=""
                value={nodeName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setNodeName(event.target.value)}}
              />
            </TextField> : nodeName}
          </span>
          <div className="flex items-center justify-end gap-2">
            <span className="text-body-bold font-body-bold text-default-font">
              Source
            </span>
            <IconWithBackground
              variant="brand"
              size="medium"
              icon={iconName}
              square={false}
            />
          </div>
        </div>
        <div className="w-full">
          <PropertiesRow text="Source">
            <Select
              className={sourceType ? "" : "w-40"}
              placeholder="Choose Source"
              helpText=""
              value={sourceType}
              onValueChange={onValueChange}
            >
              <Select.Item value="google_cloud_storage">Google Cloud Storage</Select.Item>
            </Select>
          </PropertiesRow>
          {sourceType && React.createElement(
            SourceConfigurationDrawerType[sourceType as keyof typeof SourceConfigurationDrawerType] as React.ElementType,
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