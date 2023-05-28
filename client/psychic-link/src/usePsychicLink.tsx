import React, { useRef, useState, useEffect, useCallback } from 'react';

const PSYCHIC_URL = 'https://link.psychic.dev';

export function usePsychicLink(public_key: string, onSuccessCallback: Function) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  let windowObjectReference: Window | null = null;

  async function open(accountId: string) {
    setIsLoading(true)
    // Open the Psychic Link modal
    const url = `${PSYCHIC_URL}?public_key=${public_key}&account_id=${accountId}`

    if (windowObjectReference === null || windowObjectReference.closed) {
      const width = 600;
      const height = 800;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      windowObjectReference = window.open(url, '_blank', `addressbar=no, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`)
    } else {
      windowObjectReference.focus();
    }
  }

  const handleMessage = useCallback((event: MessageEvent) => {
    // check if oigin is not http://localhost:3000 or link.psychic.dev
    if (event.origin !== "http://localhost:3000" && event.origin !== "https://link.psychic.dev") {
      return;
    }
    const data = event.data;
    if (data && data.account_id) {
      setIsLoading(false)
      onSuccessCallback(data.account_id)
    } else {
      setError("Connection failed. Please try again later.")
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

  return { open, isReady, isLoading, error};
}