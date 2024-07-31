export enum NodeType {
  SOURCE = "source",
  DESTINATION = "destination",
  MAPPING = "mapping",
  JOIN = "join",
  SPLIT = "split",
  FILTER = "filter",
  CONDITIONAL = "conditional",
  GENERATIVE_AI = "generative_ai",
  PYTHON = "python",
  SQL = "sql",
};
  
export interface Node {
  id: string;
  name: string;
  type: NodeType;
  description: string;
};
  