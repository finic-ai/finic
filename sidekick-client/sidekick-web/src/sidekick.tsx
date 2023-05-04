import React, { useRef, useState, useEffect } from 'react';


const NOTION_OAUTH_URL = 'https://www.notion.com/oauth/authorize';

export function useSidekickAuth(connector_id: string, connection_id: string, public_key: string, sidekick_url: string) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [newConnection, setNewConnection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  let windowObjectReference: Window | null = null;
  const authCodeHandled = useRef(false)

  async function authorize() {
    setLoading(true);
    setAuthorized(false);
    setError(null);
    setNewConnection(null);
    const authorizeResult = await authorizeConnection(null, connector_id, connection_id, public_key, sidekick_url, setError)
    if (!authorizeResult) {
        setLoading(false)
        return
    }
    const url = authorizeResult.auth_url


    if (windowObjectReference === null || windowObjectReference.closed) {
      const strWindowFeatures = 'toolbar=no,menubar=no,width=600,height=700,top=100,left=100';
      windowObjectReference = window.open(url, 'NotionOAuth', strWindowFeatures);
    } else {
      windowObjectReference.focus();
    }
  }

  useEffect(() => {

    function handleMessage(event: MessageEvent) {
        console.log(event)
        // check if oigin is not http://localhost:5173 or app.getsidekick.ai
        if (event.origin !== "http://localhost:5173" && event.origin !== "https://app.getsidekick.ai") {
            return;
          }
        const data = event.data;
        if (data && data.code && !authCodeHandled.current) {
            authCodeHandled.current = true
            completeAuthWithCode(data.code)
        }
    }

    async function completeAuthWithCode(code: string) {
        const result = await authorizeConnection(code, connector_id, connection_id, public_key, sidekick_url, setError)
        if (!result) {
            setLoading(false)
            return
        }
        console.log(result)
        setAuthorized(result.authorized)
        setNewConnection(result.connection.connection_id)
        setLoading(false)
        // window.close()
    }


    window.addEventListener('message', handleMessage, false);

    return () => {
        window.removeEventListener('message', handleMessage);
        // window.removeEventListener('popstate', handlePopState);
    //   window.removeEventListener('hashchange', handleOAuthMessage);
    };
  }, []);

  return { authorize, authorized, loading, newConnection, error };
}

// export default useNotionOAuth;

type AuthPayload = {
    connector_id: string;
    connection_id: string;
    auth_code?: string;
}


async function authorizeConnection(auth_code: string | null, 
                                    connector_id: string, 
                                    connection_id: string,
                                    public_key: string,
                                    sidekick_url: string,
                                    setError: (error: string | null) => void) {
    const baseUrl = sidekick_url
    const url = baseUrl + '/add-oauth-connection';

    var payload: AuthPayload = {
        connection_id: connection_id,
        connector_id: connector_id
    }
    if (auth_code) {
        payload.auth_code = auth_code
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${public_key}`},
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            setError(`Authorization failed with status: ${response.status}`);
        }
    
        const data = await response.json();
    
        return data.result;
    } catch (error) {
        setError(`Authorization failed with error: ${error}`);
    }
}