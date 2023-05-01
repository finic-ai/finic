/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    TextInput,
    Spinner,
    Modal,
    Table
  } from "flowbite-react";
  import { FC, useEffect } from "react";
  import { useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { SiNotion } from "react-icons/si";

  import {
    HiHome,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  import { useUserStateContext } from "../../context/UserStateContext";
  
  const NotionConnectorPage: FC = function () {
    const [authorized, setAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [authorizationUrl, setAuthorizationUrl] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [email, setEmail] = useState('');
    const [connections, setConnections] = useState([] as any[])
    const {bearer} = useUserStateContext()

    async function authorize() {
      setAuthLoading(true)
      const url = import.meta.env.VITE_SERVER_URL + '/enable-connector';
      var payload = {
        connector_id: "notion",
        credential: {
          client_id: clientId,
          client_secret: clientSecret,
          authorization_url: authorizationUrl,
        }
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
        const isAuthorized = jsonData.status.is_enabled
        console.log(jsonData)
        if (!isAuthorized) {
          console.log('failed to authenticate')
        }
        setAuthLoading(false)
        setAuthorized(isAuthorized)
      } catch (error) {
        setAuthLoading(false)
      }
    }

    useEffect(() => {
      async function getConnectorStatus() {
        const url = import.meta.env.VITE_SERVER_URL + '/get-connector-status';
        var payload = {
          connector_id: "notion",
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
          const isAuthorized = jsonData.status.is_enabled
          const connections = jsonData.status.connections
          console.log(connections)
          setAuthorized(isAuthorized)
          setConnections(connections)
          setAuthLoading(false)
        } catch (error) {
          setAuthLoading(false)
        }
      }
      if (bearer) {
        getConnectorStatus()
      }
    }, [bearer])
        

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
                    <AuthorizeModal 
                      authorize={authorize} 
                      authLoading={authLoading} 
                      authorized={authorized} 
                      clientId={clientId} 
                      setClientId={setClientId}
                      clientSecret={clientSecret}
                      setClientSecret={setClientSecret}
                      authorizationUrl={authorizationUrl}
                      setAuthorizationUrl={setAuthorizationUrl}
                      subdomain={subdomain} 
                      setSubdomain={setSubdomain} 
                      email={email} 
                      setEmail={setEmail} 
                    />
                  </div>
                </div>
              </form>
              {authorized && <ConnectionsTable connections={connections} />}
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
    clientId: string;
    setClientId: (apiKey: string) => void;
    clientSecret: string;
    setClientSecret: (apiKey: string) => void;
    authorizationUrl: string;
    setAuthorizationUrl: (apiKey: string) => void;
    subdomain: string;
    setSubdomain: (subdomain: string) => void;
    email: string;
    setEmail: (email: string) => void;
  }

  const AuthorizeModal: FC<AuthorizeModalProps> = function ({
    authorize, clientId, setClientId, clientSecret, setClientSecret, authorizationUrl, setAuthorizationUrl, authorized, authLoading
  }: AuthorizeModalProps) {
    const [isOpen, setOpen] = useState(false);

    console.log(authorized)
  
    return (
      <>
        <Button color="primary" className="mb-6"  onClick={() => setOpen(true) } >
          {authLoading ? <Spinner className="mr-3 text-sm" /> : <>
          <SiNotion className="mr-3 text-sm" />
          {authorized ?  'Update Credentials'  : 'Enable Connector'}
          </>}
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Enable Notion Connector</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="lg:col-span-2">
                <div>
                  <Label htmlFor="apiKeys.label">OAuth client ID</Label>
                  <TextInput
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder='Notion OAuth client ID'
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKeys.label">OAuth client secret</Label>
                  <TextInput
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder='Notion OAuth client secret'
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKeys.label">Authorization URL</Label>
                  <TextInput
                    value={authorizationUrl}
                    onChange={(e) => setAuthorizationUrl(e.target.value)}
                    placeholder='Notion authorization URL'
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

  interface ConnectionsTableProps {
    connections: any[]
  }

  const ConnectionsTable: FC<ConnectionsTableProps> = function ({connections}: ConnectionsTableProps) {
    return (
      <>
      <div></div>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg mb-2">
      Active connections 
</h2>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>Connection ID</Table.HeadCell>
          <Table.HeadCell>Workspace Name</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {connections.map((item, i) => (
            <Table.Row key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {item.connection_id}
                    </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {item.metadata.workspace_name}
                    </div>
                </Table.Cell>
            </Table.Row>
            ))}
        </Table.Body>
      </Table>
      </>
    );
  };
  
  export default NotionConnectorPage;
  