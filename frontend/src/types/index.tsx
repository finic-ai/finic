import React from "react";
import { type NodeTypes, type Node, type Edge } from "@xyflow/react";
import {
  SourceNode,
  DestinationNode,
  TransformationNode,
} from "@/components/Nodes";
import {
  SourceNodeConfigurationDrawer,
  DestinationNodeConfigurationDrawer,
  TransformationNodeConfigurationDrawer,
} from "@/components/ConfigurationDrawer";
import { GCSConfigurationDrawer } from "@/components/ConfigurationDrawer/Sources/GCSConfigurationDrawer";
import { SnowflakeConfigurationDrawer } from "@/components/ConfigurationDrawer/Destinations/SnowflakeConfigurationDrawer";

export enum SecretType {
  PASSWORD = "password",
  API_KEY = "api_key",
  AUTH_TOKEN = "auth_token"
}

export type FinicSecret = {
  id: string;
  type: SecretType;
  service_name: string;
  value: string;
};

export enum FinicNodeType {
  SOURCE = "source",
  DESTINATION = "destination",
  TRANSFORMATION = "transformation",
}

export const nodeTypes: NodeTypes = {
  source: SourceNode,
  destination: DestinationNode,
  transformation: TransformationNode,
};

export const configurationDrawerTypes = {
  source: SourceNodeConfigurationDrawer,
  destination: DestinationNodeConfigurationDrawer,
  transformation: TransformationNodeConfigurationDrawer,
};

export const NodeTypeNames = {
  source: "Source",
  destination: "Destination",
  transformation: "Transformation",
};

export const NodeIcons = {
  source: "FeatherFileInput",
  destination: "FeatherFileOutput",
  transformation: "FeatherCode2",
};

export type NodeResults = {
  columns: string[];
  data: Array<Array<string | number | boolean>>;
};

export type Agent = {
  id: string;
  userDefinedId: string;
  name: string;
  status: string;
  created_at: string;
  url: string;
};

export enum SourceNodeType {
  GOOGLE_CLOUD_STORAGE = "google_cloud_storage",
}

export enum SourceTypeNames {
  google_cloud_storage = "Google Cloud Storage",
}

export enum DestinationNodeType {
  SNOWFLAKE = "snowflake",
}

export enum DestinationTypeNames {
  snowflake = "Snowflake",
}


export const SourceConfigurationDrawerType = {
  google_cloud_storage: GCSConfigurationDrawer,
};

export type FinicNode = {
  id: string;
  position: { x: number; y: number };
  data: {
    name: string;
    configuration?: any;
    results?: any
  };
  type: string;
};

export const DestinationConfigurationDrawerType = {
  snowflake: SnowflakeConfigurationDrawer,
};

export const SourceConfigFields: Record<string, { [key: string]: string }> = { 
  google_cloud_storage: {
    bucket: "Bucket",
    filename: "Filename",
  }
};

export const DestinationConfigFields: Record<string, { [key: string]: string }> = { 
  snowflake: {
    account: "Account",
    warehouse: "Warehouse",
    database: "Database",
    tableSchema: "Table Schema",
    table: "Table",
  }
};