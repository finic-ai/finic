import React, { useCallback, useState, useEffect } from 'react';


const NOTION_OAUTH_URL = 'https://www.notion.com/oauth/authorize';

export function useNotionOAuth(connector_id: string, connection_id: string, public_key: string) {
  const [authCode, setAuthCode] = useState<string | null>(null);
  let windowObjectReference: Window | null = null;

  async function authorize() {
    const authorizeResult = await authorizeConnection(null, connector_id, connection_id, public_key)
    const url = authorizeResult.auth_url


    if (windowObjectReference === null || windowObjectReference.closed) {
      const strWindowFeatures = 'toolbar=no,menubar=no,width=600,height=700,top=100,left=100';
      windowObjectReference = window.open(url, 'NotionOAuth', strWindowFeatures);
      windowObjectReference!.addEventListener('hashchange', handleHashChange);
      windowObjectReference!.addEventListener('popstate', handlePopState);
    } else {
      windowObjectReference.focus();
    }
  }

  function handleHashChange(event: HashChangeEvent) {
    console.log('hash change')
    console.log(event)
    // if (event.data?.notion_oauth_code && event.origin === window.origin) {
    //     console.log(event.data)
    //     setAuthCode(event.data.notion_oauth_code);
    // }
}

function handlePopState(event: PopStateEvent) {
    console.log('pop state')
    console.log(event)
    // if (event.data?.notion_oauth_code && event.origin === window.origin) {
    //     console.log(event.data)
    //     setAuthCode(event.data.notion_oauth_code);
    // }
}

  useEffect(() => {
    

    // handlePopState({} as PopStateEvent)
    console.log("hello")

    // window.addEventListener('hashchange', handleHashChange);
    // window.addEventListener('popstate', handlePopState);

    return () => {
        // window.removeEventListener('hashchange', handleHashChange);
        // window.removeEventListener('popstate', handlePopState);
    //   window.removeEventListener('hashchange', handleOAuthMessage);
    };
  }, []);

  return { authorize, authCode };
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
                                    public_key: string) {
    const baseUrl = "http://localhost:8080"
    const url = baseUrl + '/add-oauth-connection';

    var payload: AuthPayload = {
        connection_id: connection_id,
        connector_id: connector_id
    }
    if (auth_code) {
        payload.auth_code = auth_code
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${public_key}`},
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(`Authorization failed with status: ${response.status}`);
    }

    const data = await response.json();

    return data.result;

}