import axios, { AxiosResponse } from 'axios';

interface PostRequestBody {
  connection_id: string;
  connector_name: string;
}

async function authorizeConnector(
  endpoint: string,
  connectorName: string,
  bearerToken: string,
  connectionId: string
): Promise<AxiosResponse> {
  // Set up the axios configuration
  const config = {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  };

  // Prepare the request body
  const requestBody: PostRequestBody = {
    connection_id: connectionId,
    connector_name: connectorName
  };

  try {
    // Make the POST request
    const response = await axios.post(endpoint, requestBody, config);

    // Check if the response status is in the 2xx range
    if (response.status >= 200 && response.status < 300) {
      return response.data;
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