/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    TextInput,
    Spinner,
    Modal
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { SiConfluence } from "react-icons/si";

  import {
    HiHome,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  import { useUserStateContext } from "../../context/UserStateContext";
  
  const ConfluenceConnectorPage: FC = function () {
    const {bearer} = useUserStateContext()


    const [upsertedChunks, setUpsertedChunks] = useState(new Array<string>());
    const [authorized, setAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [connectLoading, setConnectLoading] = useState(false)
    const [space, setSpace] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null)

    async function authorize() {
      setAuthLoading(true)
      setError(null)
      const url = import.meta.env.VITE_SERVER_URL + '/authorize-with-api-key';
      var payload = {
        api_key: apiKey,
        subdomain: subdomain,
        email: email,
        connector_id: 6
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const isAuthorized = jsonData.authorized
        console.log(jsonData)
        setAuthLoading(false)
        if (!isAuthorized) {
          setError("Failed to authorize. Please check your credentials and try again.")
          return
        }
        setAuthorized(isAuthorized)
      } catch (error) {
        setError(`${error}`)
        setAuthLoading(false)
      }
    }

    async function connect() {
      setConnectLoading(true)
      setError(null)
      try {
        // Define the URL to make the request to
        const url = import.meta.env.VITE_SERVER_URL + '/upsert-from-connector';

        // Make the request using the fetch function and await the response
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify({
            connector_id: 6,
            path: space
          }),
        });
        // Parse the response body as JSON and await the result
        const jsonData = await response.json();

        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error(`${jsonData.detail}`);
        }

        setUpsertedChunks(jsonData.ids)
        setConnectLoading(false)
        
      } catch (error) {
        // Handle any errors that occurred during the fetch
        setError(`${error}. Check to make sure you have the correct space ID.`);
        setConnectLoading(false)
      }
    }

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
                <Breadcrumb.Item>Confluence</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Connect Confluence
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
                    
                    <AuthorizeModal authorize={authorize} authLoading={authLoading} authorized={authorized} apiKey={apiKey} setApiKey={setApiKey} subdomain={subdomain} setSubdomain={setSubdomain} email={email} setEmail={setEmail} />
                    <Label htmlFor="apiKeys.label">Confluence space</Label>
                    <TextInput
                      id="apiKeys.label"
                      name="apiKeys.label"
                      placeholder='Confluence space ID you want to sync with Sidekick'
                      className="mt-1"
                      onChange={(e) => setSpace(e.target.value.trim())}
                      value={space}
                      helperText="Only Confluence pages in this space will be synced. You can find the space id in the URL of your wiki."
                    />
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" className="mb-6" disabled={!space} onClick={() => connect() } >
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

  interface AuthorizeModalProps {
    authorize: () => void;
    authorized: boolean;
    authLoading: boolean;
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    subdomain: string;
    setSubdomain: (subdomain: string) => void;
    email: string;
    setEmail: (email: string) => void;
  }

  const AuthorizeModal: FC<AuthorizeModalProps> = function ({authorize, apiKey, setApiKey, subdomain, setSubdomain, email, setEmail, authorized, authLoading}: AuthorizeModalProps) {
    const [isOpen, setOpen] = useState(false);

    console.log(authorized)
  
    return (
      <>
        <Button color="primary" className="mb-6" disabled={authorized} onClick={() => setOpen(true) } >
          {authLoading ? <Spinner className="mr-3 text-sm" /> : <>
          <SiConfluence className="mr-3 text-sm" />
          Authorize Confluence
          </>}
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <div className="flex flex-col">
              <strong>Authorize Confluence</strong>
              <a className="text-sm font-normal text-blue-500 dark:text-blue-400" href="https://docs.getsidekick.ai/data-connectors#auth-4" target="_blank">Documentation</a>
            </div>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="lg:col-span-2">
                <div>
                  <Label htmlFor="apiKeys.label">API Key</Label>
                  <TextInput
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder='Confluence API Key'
                    className="mt-1"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="apiKeys.newKey">Email</Label>
                  <TextInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Confluence Email'
                    className="mt-1"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label>Subdomain</Label>
                  <TextInput
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    placeholder='Confluence Subdomain'
                    className="mt-1"
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={() => {
              authorize()
              setOpen(false)
            }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  export default ConfluenceConnectorPage;
  