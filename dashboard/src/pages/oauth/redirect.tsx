/* eslint-disable jsx-a11y/anchor-is-valid */
  import type { FC } from "react";
  import { useEffect } from "react";

  export const RedirectPage: FC = function () {

    useEffect(() => {
        if (window.opener) {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                window.opener.postMessage({ code: code }, '*')
            }
        }
    }, [])
    
    return (
      <div> </div>
    )
  }