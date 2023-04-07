/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    TextInput,
    Spinner
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState, useEffect } from "react";
  import { FaPlus, FaGoogle } from "react-icons/fa";
  import {
    HiHome,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../layouts/navbar-sidebar";
  import { useLocation } from 'react-router-dom';
  
  const FinishSetupPage: FC = function () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('code');
    const [upsertedChunks, setUpsertedChunks] = useState(new Array<string>());
    const [folderName, setFolderName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [connectLoading, setConnectLoading] = useState(false)

    async function authorize() {
      setAuthLoading(true)
      const currentUrl = new URL(window.location.href);
      const urlWithoutQueryParams = currentUrl.origin + currentUrl.pathname;
      const url = 'https://sidekick-server-ezml2kwdva-uc.a.run.app/authorize-google-drive';
      var payload = {
        auth_code: authCode,
        redirect_uri: urlWithoutQueryParams
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      if (jsonData.auth_url) {
        console.log(jsonData.auth_url)
        window.location.href = jsonData.auth_url
      } else {
        console.log('successfuly authenticated')
        // remove the code from the url
        window.history.replaceState({}, document.title, "/connectors/google-drive");
        setAuthLoading(false)
      }
    }

    async function connectGoogleDrive() {
      setConnectLoading(true)
      try {
        // Define the URL to make the request to
        const url = 'https://sidekick-server-ezml2kwdva-uc.a.run.app/upsert-google-docs';
        var payload = {
          folder_name: folderName
        }

        // Make the request using the fetch function and await the response
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
          body: JSON.stringify(payload),
        });
    
        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the response body as JSON and await the result
        const jsonData = await response.json();

        const numChunks = jsonData.ids.length
        setUpsertedChunks(jsonData.ids)
        console.log(`Successfully upserted ${numChunks} chunks`)
        setConnectLoading(false)
        
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error connecting to google drive:', error);
        setConnectLoading(false)
      }
    }
    useEffect(() => {
      if (authCode) {
        authorize()
      }
    }, []);

    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item href="/">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Home</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Connectors</Breadcrumb.Item>
                <Breadcrumb.Item>Google Drive</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Connect Google Drive
              </h1>
            </div>
          </div>
        </div>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <form>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <Button color="primary" className="mb-6" onClick={() => authorize() } >
                      {authLoading ? <Spinner className="mr-3 text-sm" /> : <>
                      <FaGoogle className="mr-3 text-sm" />
                      Authorize Google
                      </>}
                    </Button>
                    <Label htmlFor="apiKeys.label">Folder name</Label>
                    <TextInput
                      id="apiKeys.label"
                      name="apiKeys.label"
                      placeholder='Path to the folder you want to sync with Sidekick'
                      className="mt-1"
                      onChange={(e) => setFolderName(e.target.value.trim())}
                      value={folderName}
                      helperText="Only Google Docs files in this folder will by synced"
                    />
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" className="mb-6" onClick={() => connectGoogleDrive() } >
                        {connectLoading ? <Spinner className="mr-3 text-sm" /> : <>
                        <FaPlus className="mr-3 text-sm" />
                        Connect
                        </>}
                       
                      </Button>
                      {upsertedChunks.length > 0 ? <p>{`Successfully upserted ${upsertedChunks.length} chunks`}</p> : null}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  };
  
  export default FinishSetupPage;
  