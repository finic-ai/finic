export enum SecretType {
  PASSWORD = "password",
  API_KEY = "api_key",
  AUTH_TOKEN = "auth_token"
}

export type FinicSecret = {
  id: string;
  type: SecretType;
  serviceName: string;
  value: string;
};

export type Agent = {
  id: string;
  finicId: string;
  description: string;
  status: string;
  createdAt: string;
  url: string;
};

export type Execution = {
  id: string;
  finicAgentId: string;
  cloudProviderId: string
  status: string;
  startTime: string | null;
  endTime: string | null;
  results: Record<string, any>;
};