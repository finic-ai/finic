/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  TextInput,
  Spinner,
  Modal,
  Tabs,
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
  const [redirectUri, setRedirectUri] = useState('');
  const [connections, setConnections] = useState([] as any[])

  const {bearer, appId} = useUserStateContext()

  async function authorize() {
    setAuthLoading(true)
    const url = import.meta.env.VITE_SERVER_URL + '/enable-connector';
    var payload = {
      connector_id: "notion",
      credential: {
        client_id: clientId,
        client_secret: clientSecret,
        authorization_url: authorizationUrl,
        redirect_uri: redirectUri
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
            <div className="flex items-center">
              <SiNotion className="mr-2 text-xl" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Notion
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Tabs.Group>
        <Tabs.Item active={true} title="Configuration">
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
                        redirectUri={redirectUri} 
                        setRedirectUri={setRedirectUri} 
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item active={true} title="Active Connections">
          <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
            <div className="mb-1 w-full">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg mb-2">
                  Active connections 
                </h2>
                {authorized && <ConnectionsTable connections={connections} />}
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Playground">
          <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
            <div className="mb-1 w-full">
              <div className="mb-4">
                {authorized && <ConnectorPlayground connectorId="notion" bearer={appId} />}
              </div>
            </div>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </NavbarSidebarLayout>
  );
};

interface AuthorizeModalProps {
  authorize: () => void;
  authorized: boolean;
  authLoading: boolean;
  clientId: string;
  setClientId: (clientId: string) => void;
  clientSecret: string;
  setClientSecret: (clientSecret: string) => void;
  authorizationUrl: string;
  setAuthorizationUrl: (authorizationUrl: string) => void;
  redirectUri: string;
  setRedirectUri: (redirect_uri: string) => void;
}

const AuthorizeModal: FC<AuthorizeModalProps> = function ({
  authorize, clientId, setClientId, clientSecret, setClientSecret, authorizationUrl, setAuthorizationUrl, redirectUri, setRedirectUri, authorized, authLoading
}: AuthorizeModalProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" className="mb-6"  onClick={() => setOpen(true) } >
        {authLoading ? <Spinner className="mr-3 text-sm" /> : <>
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
              <div>
                <Label htmlFor="apiKeys.label">Redirect URI</Label>
                <TextInput
                  value={redirectUri}
                  onChange={(e) => setRedirectUri(e.target.value)}
                  placeholder='Notion Redirect URI'
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

interface ConnectorPlaygroundProps {
  connectorId: string;
  bearer: string;
}

const ConnectorPlayground: FC<ConnectorPlaygroundProps> = function ({connectorId, bearer}: ConnectorPlaygroundProps) {
  const [connectionId, setConnectionId] = useState('');

  const createNewConnection = async (connectionId: string, connectorId: string) => {
    const url = import.meta.env.VITE_SERVER_URL + '/add-oauth-connection';
    var payload = {
      connector_id: connectorId,
      connection_id: connectionId,
    }

    // TODO: Replace this entire block with the Sidekick SDK
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
      const isAuthorized = jsonData.result.authorized
      const authUrl = jsonData.result.auth_url
      const width = 600
      const height = 800
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2
      window.open(authUrl, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`)
      window.addEventListener('message', (event) => {
        if (event.origin !== "http://localhost:5173") {
          console.log('wrong origin')
          return;
        }
        console.log(event.data)
      }, false);
      console.log(jsonData)
    } catch (error) {
      console.log('error creating new connection')
    }
  }

  return (
    <>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg mb-2">
        Playground
      </h2>
      <p className="mb-6">See how users will experience using Sidekick to connect their Notion workspace.</p>
      <Label htmlFor="apiKeys.label">Connection ID</Label>
      <TextInput
        value={connectionId}
        onChange={(e) => setConnectionId(e.target.value)}
        placeholder="The unique identifier for this connection."
        helperText="This ID will appear in your Active Connections list if the test is successful." 
        className="mt-1"
      />
      <Button color="primary" className="mt-6"  onClick={() => createNewConnection(connectionId, connectorId) } >
        <SiNotion className="mr-3 text-sm" />
        Connect to Notion
      </Button>
    </>
  );
};

export default NotionConnectorPage;
