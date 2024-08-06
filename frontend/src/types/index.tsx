import React from 'react';
import {
  type NodeTypes
} from '@xyflow/react';
import {
  SourceNode,
  DestinationNode,
  MappingNode,
  JoinNode,
  SplitNode,
  FilterNode,
  ConditionalNode,
  GenerativeAINode,
  PythonNode,
  SQLNode,
  SourceNodeConfigurationDrawer,
  DestinationNodeConfigurationDrawer,
  MappingNodeConfigurationDrawer,
  JoinNodeConfigurationDrawer,
  SplitNodeConfigurationDrawer,
  FilterNodeConfigurationDrawer,
  ConditionalNodeConfigurationDrawer,
  GenerativeAINodeConfigurationDrawer,
  PythonNodeConfigurationDrawer,
  SQLNodeConfigurationDrawer,
} from '../components/Nodes';

export enum FinicNodeType {
  SOURCE = 'source',
  DESTINATION = 'destination',
  MAPPING = 'mapping',
  JOIN = 'join',
  SPLIT = 'split',
  FILTER = 'filter',
  CONDITIONAL = 'conditional',
  GENERATIVE_AI = 'generative_ai',
  PYTHON = 'python',
  SQL = 'sql',
};

export const nodeTypes: NodeTypes = {
  source: SourceNode,
  destination: DestinationNode,
  mapping: MappingNode,
  join: JoinNode,
  split: SplitNode,
  filter: FilterNode,
  conditional: ConditionalNode,
  generative_ai: GenerativeAINode,
  python: PythonNode,
  sql: SQLNode,
};

export const configurationDrawerTypes: Record<string, React.ComponentType> = {
  source: SourceNodeConfigurationDrawer,
  destination: DestinationNodeConfigurationDrawer,
  mapping: MappingNodeConfigurationDrawer,
  join: JoinNodeConfigurationDrawer,
  split: SplitNodeConfigurationDrawer,
  filter: FilterNodeConfigurationDrawer,
  conditional: ConditionalNodeConfigurationDrawer,
  generative_ai: GenerativeAINodeConfigurationDrawer,
  python: PythonNodeConfigurationDrawer,
  sql: SQLNodeConfigurationDrawer,
};

export const NodeTypeNames = {
  source: 'Source',
  destination: 'Destination',
  mapping: 'Mapping',
  join: 'Join',
  split: 'Split',
  filter: 'Filter',
  conditional: 'Conditional',
  generative_ai: 'Generative AI',
  python: 'Python',
  sql: 'SQL',
};

export const NodeIcons = {
  source: 'FeatherFileInput',
  destination: 'FeatherFileOutput',
  mapping: 'FeatherFileJson',
  join: 'FeatherMerge',
  split: 'FeatherSplit',
  filter: 'FeatherFilter',
  conditional: 'FeatherHelpCircle',
  generative_ai: 'FeatherSparkles',
  python: 'FeatherCode2',
  sql: 'FeatherDatabaseZap',
};

export type NodeResults = {
  columns: string[];
  data: Array<Array<string | number | boolean>>;
};