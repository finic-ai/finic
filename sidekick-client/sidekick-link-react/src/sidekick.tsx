import React, { useRef, useState, useEffect, useCallback } from 'react';

const NOTION_OAUTH_URL = 'https://www.notion.com/oauth/authorize';
const SIDEKICK_URL = 'https://link.psychic.dev';

export function useSidekickLink(public_key: string, onSuccessCallback: Function) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let windowObjectReference: Window | null = null;

  async function open(connectionId: string) {
    // Open the Sidekick Link modal
    const url = `${SIDEKICK_URL}?public_key=${public_key}&connection_id=${connectionId}`

    if (windowObjectReference === null || windowObjectReference.closed) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const left = window.screenX
      const top = window.screenY
      windowObjectReference = window.open(url, '_blank', `addressbar=no, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`)
    } else {
      windowObjectReference.focus();
    }
  }

  const handleMessage = useCallback((event: MessageEvent) => {
    // check if oigin is not http://localhost:5173 or app.getsidekick.ai
    if (event.origin !== "http://localhost:3000" && event.origin !== "https://link.psychic.dev") {
      return;
    }
    const data = event.data;
    if (data && data.connection_id) {
      onSuccessCallback(data.connection_id)
    }
  }, [])

  useEffect(() => {
    // Add event listeners to get auth codes
    window.addEventListener('message', handleMessage, false);
    setIsReady(true)
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return { open, isReady };
}