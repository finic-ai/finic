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
} from '../components/nodes';

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