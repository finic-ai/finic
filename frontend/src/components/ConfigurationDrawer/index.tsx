import { Button } from "../../../../frontend/src/subframe/components/Button";
import {
  IconWithBackground,
  type IconName,
} from "../../../../frontend/src/subframe/components/IconWithBackground";
import { Select } from "../../../../frontend/src/subframe/components/Select";
import { PropertiesAccordion } from "../../../../frontend/src/subframe/components/PropertiesAccordion";
import { TextArea } from "../../../../frontend/src/subframe/components/TextArea";
import { Alert } from "../../../../frontend/src/subframe/components/Alert";
import { PropertiesRow } from "../../../../frontend/src/subframe/components/PropertiesRow";
import { TextField } from "../../../../frontend/src/subframe/components/TextField";
import { ToggleGroup } from "../../../../frontend/src/subframe/components/ToggleGroup";
import { NodeTypeNames } from "@/types";

interface ConfigurationDrawerProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  nodeType: string;
  iconName: IconName;
  closeDrawer: () => void;
}

export function ConfigurationDrawer({
  children,
  className,
  title,
  description,
  nodeType,
  iconName,
  closeDrawer,
}: ConfigurationDrawerProps) {
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
            {title}
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
        <PropertiesAccordion title="Description">
          <TextArea
            className="h-auto w-full flex-none"
            variant="filled"
            label=""
            helpText=""
          >
            <TextArea.Input
              className="h-auto min-h-[96px] w-full flex-none"
              placeholder="Receive data from FiveTran's Salesforce connector"
              value={description ? description : ""}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {}}
            />
          </TextArea>
        </PropertiesAccordion>
        {children}
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
