import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Button } from "@/subframe/components/Button";
import { SettingsPageLayout } from "..";

interface AccountSettingsPageProps {
  className?: string;
}

export default function AccountSettingsPage({
  className,
}: AccountSettingsPageProps) {
  return <SettingsPageLayout></SettingsPageLayout>;
}

// export { default as GenerativeAINode, GenerativeAINodeConfigurationDrawer } from "./GenerativeAINode";
// export { default as JoinNode, JoinNodeConfigurationDrawer } from "./JoinNode";
// export { default as MappingNode, MappingNodeConfigurationDrawer } from "./MappingNode";
// export { default as PythonNode, PythonNodeConfigurationDrawer } from "./PythonNode";
// export { default as ConditionalNode, ConditionalNodeConfigurationDrawer } from "./ConditionalNode";
// export { default as FilterNode, FilterNodeConfigurationDrawer } from "./FilterNode";
// export { default as SourceNode, SourceNodeConfigurationDrawer } from "./SourceNode";
// export { default as DestinationNode, DestinationNodeConfigurationDrawer } from "./DestinationNode";
// export { default as SplitNode, SplitNodeConfigurationDrawer } from "./SplitNode";
// export { default as SQLNode, SQLNodeConfigurationDrawer } from "./SQLNode";
