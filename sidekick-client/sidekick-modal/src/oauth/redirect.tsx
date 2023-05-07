/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useEffect } from "react";

const RedirectPage: React.FC = () => {

  useEffect(() => {
    console.log(window.opener)
      if (window.opener) {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          if (code) {
              window.opener.postMessage({ code: code }, '*')
          }
          window.close()
      }
  }, [])
  
  return (
    <div></div>
  )
}

export default RedirectPage
