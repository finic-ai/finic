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
  import { SiNotion } from "react-icons/si";

  import {
    HiHome,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  import { useUserStateContext } from "../../context/UserStateContext";
  
  const NotionConnectorPage: FC = function () {
    const [upsertedChunks, setUpsertedChunks] = useState(new Array<string>());
    const [authorized, setAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [connectLoading, setConnectLoading] = useState(false)
    const [apiKey, setApiKey] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [email, setEmail] = useState('');
    const {bearer} = useUserStateContext()

    async function authorize() {
      setAuthLoading(true)
      const url = import.meta.env.VITE_SERVER_URL + '/authorize-with-api-key';
      var payload = {
        api_key: apiKey,
        connector_id: 4
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
        if (!isAuthorized) {
          console.log('failed to authenticate')
        }
        setAuthLoading(false)
        setAuthorized(isAuthorized)
      } catch (error) {
        setAuthLoading(false)
        setAuthLoading(false)
      }
    }

    async function connect() {
      setConnectLoading(true)
      try {
        // Define the URL to make the request to
        const url = import.meta.env.VITE_SERVER_URL + '/upsert-from-connector';

        // Make the request using the fetch function and await the response
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify({
            connector_id: 4,
          }),
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
                <Breadcrumb.Item>Notion</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Connect Notion
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
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" className="mb-6" onClick={() => connect() } >
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

  const AuthorizeModal: FC<AuthorizeModalProps> = function ({authorize, apiKey, setApiKey, authorized, authLoading}: AuthorizeModalProps) {
    const [isOpen, setOpen] = useState(false);

    console.log(authorized)
  
    return (
      <>
        <Button color="primary" className="mb-6" disabled={authorized} onClick={() => setOpen(true) } >
          {authLoading ? <Spinner className="mr-3 text-sm" /> : <>
          <SiNotion className="mr-3 text-sm" />
          Authorize Notion
          </>}
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Authorize Notion</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="lg:col-span-2">
                <div>
                  <Label htmlFor="apiKeys.label">API Key</Label>
                  <TextInput
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder='Notion API Key'
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
  
  export default NotionConnectorPage;
  