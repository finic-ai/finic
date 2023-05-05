import { AxiosResponse } from 'axios';
declare function authorizeConnector(endpoint: string, connectorName: string, bearerToken: string, connectionId: string): Promise<AxiosResponse>;
export default authorizeConnector;
