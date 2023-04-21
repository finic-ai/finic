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
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  import { useLocation } from 'react-router-dom';
  import { useUserStateContext } from "../../context/UserStateContext";
  import { SupabaseService } from "../../services/supabase-service";
  import { useAuth } from "@clerk/clerk-react";
  
  const GoogleDriveConnectorPage: FC = function () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('code');

    const { getToken, userId } = useAuth();
    const {bearer} = useUserStateContext()


    const [upsertedChunks, setUpsertedChunks] = useState(new Array<string>());
    const [folderName, setFolderName] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    const [connectLoading, setConnectLoading] = useState(false)
    const [credential, setCredential] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    

    async function updateAuthorizationStatus() {
      if (authCode) {
        authorize()
      } else {
        const credential = await SupabaseService.getCredentialsByUserIdAndConnectorId(userId || "", 1, getToken)
        setCredential(credential)
        setAuthLoading(false)
      }
    }

    async function authorize() {
      setAuthLoading(true)
      const currentUrl = new URL(window.location.href);
      const urlWithoutQueryParams = currentUrl.origin + currentUrl.pathname;
      const url = import.meta.env.VITE_SERVER_URL + '/authorize-google-drive';
      var payload = {
        auth_code: authCode,
        redirect_uri: urlWithoutQueryParams
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      if (jsonData.auth_url) {
        window.location.href = jsonData.auth_url
      } else {
        console.log('successfuly authenticated')
        // remove the code from the url
        window.history.replaceState({}, document.title, "/connectors/google-drive");
        const credential = await SupabaseService.getCredentialsByUserIdAndConnectorId(userId || "", 1, getToken)
        setCredential(credential)
        setAuthLoading(false)
      }
    }

    async function connectGoogleDrive() {
      setConnectLoading(true)
      setError("")
      setUpsertedChunks([])
      try {
        // Define the URL to make the request to
        const url = import.meta.env.VITE_SERVER_URL + '/upsert-google-docs';
        var payload = {
          folder_name: folderName
        }

        // Make the request using the fetch function and await the response
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify(payload),
        });
  
    
        // Parse the response body as JSON and await the result
        const jsonData = await response.json();

        if (!response.ok) {
          setError(`Error upserting chunks: ${jsonData.detail}`)
          setConnectLoading(false)
          return
        }

        const numChunks = jsonData.ids.length
        setUpsertedChunks(jsonData.ids)
        console.log(`Successfully upserted ${numChunks} chunks`)
        setConnectLoading(false)
        
      } catch (error) {
        // Handle any errors that occurred during the fetch
        setError(`Error connecting to google drive: ${error}`);
        setConnectLoading(false)
      }
    }
    useEffect(() => {
      if (bearer && userId) {
        updateAuthorizationStatus()
      }
    }, [bearer]);

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
                    <div className="flex items-center">
                      <Button color="primary" className="mb-6" onClick={() => authorize() } >
                        {authLoading ? <Spinner className="mr-3 text-sm" /> : <>
                          {credential ? <><FaGoogle className="mr-3 text-sm" /> Reauthenticate Google</> : <>
                            <FaGoogle className="mr-3 text-sm" />
                            Authenticate Google
                            </>
                          }
                        </>}
                      </Button>
                      {(credential && !authLoading) && <div className="text-green-500 ml-3 mb-6">Authorized</div>}
                    </div>
                    <Label htmlFor="apiKeys.label">Folder link</Label>
                    <TextInput
                      id="apiKeys.label"
                      name="apiKeys.label"
                      placeholder='Link to the folder you want to sync with Sidekick'
                      className="mt-1"
                      onChange={(e) => setFolderName(e.target.value.trim())}
                      value={folderName}
                      helperText="Only files in this folder will by synced. You can find the link to the folder in your Google Drive account."
                    />
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" disabled={!folderName || !credential} className="mb-6" onClick={() => connectGoogleDrive() } >
                        {connectLoading ? <Spinner className="mr-3 text-sm" /> : <>
                        <FaPlus className="mr-3 text-sm" />
                        Connect
                        </>}
                       
                      </Button>
                      {error ? <p className="text-red-500">{error}</p> : null}
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
  
  export default GoogleDriveConnectorPage;
  