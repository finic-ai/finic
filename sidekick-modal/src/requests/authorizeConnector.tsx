import axios, { AxiosResponse } from 'axios';

interface PostRequestBody {
  connection_id: string;
  connector_id: string;
  auth_code: string|undefined;
}

const ENDPOINT = "https://sidekick-server-ezml2kwdva-uc.a.run.app/docs/authorize-oauth"

async function authorizeConnector(
  connectorName: string,
  bearerToken: string,
  connectionId: string,
  authCode?: string
): Promise<AxiosResponse> {
  // Set up the axios configuration
  const config = {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  }

  // Prepare the request body
  const requestBody: PostRequestBody = {
    connection_id: connectionId,
    connector_id: connectorName,
    auth_code: authCode
  }

  try {
    // Make the POST request
    const response = await axios.post(ENDPOINT, requestBody, config);

    // Check if the response status is in the 2xx range
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error('Error making POST request:', error);
    throw error;
  }
}

export default authorizeConnector