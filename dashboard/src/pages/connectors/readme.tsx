/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  TextInput,
  Tooltip,
  Spinner,
  Modal,
  Tabs,
  Table,
} from "flowbite-react";
import { FC, useEffect } from "react";
import { useState } from "react";
import { SiBookstack } from "react-icons/si";
import { HiOutlineTrash } from "react-icons/hi";

import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useUserStateContext } from "../../context/UserStateContext";
import Text from "../../components/text";

const ReadmeConnectorPage: FC = function () {
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authorizationUrl, setAuthorizationUrl] = useState("");
  const [connections, setConnections] = useState([] as any[]);

  const { bearer } = useUserStateContext();

  async function authorize() {
    setAuthLoading(true);
    const url =
      import.meta.env.VITE_SERVER_URL + "/set-custom-connector-credentials";
    var payload = {
      connector_id: "readme",
      credential: {
        client_id: clientId,
        client_secret: clientSecret,
        authorization_url: authorizationUrl,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();
      const isAuthorized = jsonData.status.is_enabled;
      console.log(jsonData);
      if (!isAuthorized) {
        console.log("failed to authenticate");
      }
      setAuthLoading(false);
      setAuthorized(isAuthorized);
    } catch (error) {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    async function getConnectorStatus() {
      const url = import.meta.env.VITE_SERVER_URL + "/get-connector-status";
      console.log(url);
      var payload = {
        connector_id: "readme",
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const isAuthorized = jsonData.status.is_enabled;
        const connections = jsonData.status.connections;
        setAuthorized(isAuthorized);
        setConnections(connections);
        setAuthLoading(false);
      } catch (error) {
        setAuthLoading(false);
      }
    }
    if (bearer) {
      getConnectorStatus();
    }
  }, [bearer]);

  const deleteConnection = async (accountId: string, i: number) => {
    setDeleteLoading(true);
    const url = import.meta.env.VITE_SERVER_URL + "/delete-connection";
    var payload = {
      connector_id: "notion",
      account_id: accountId,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setDeleteLoading(false);
      let newConnections = [...connections];
      newConnections.splice(i, 1);
      setConnections(newConnections);
    } catch (error) {
      setDeleteLoading(false);
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="/">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <Text>Home</Text>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Connectors</Breadcrumb.Item>
              <Breadcrumb.Item>Readme</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex items-center">
              <SiBookstack className="mr-2 text-xl" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Readme
              </h1>
            </div>
            <Text>
              View your active connections and configure the Readme connector
              here. You can create a new connection from the{" "}
              <a href="/playground" className="text-blue-400">
                Playground
              </a>
              .
            </Text>
          </div>
        </div>
      </div>
      <Tabs.Group>
        <Tabs.Item active={true} title="Active Connections">
          <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
            <div className="mb-1 w-full">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg mb-2">
                  Active connections
                </h2>
                <ConnectionsTable
                  connections={connections}
                  isLoading={deleteLoading}
                  deleteConnection={deleteConnection}
                />
              </div>
            </div>
          </div>
        </Tabs.Item>
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
                      />
                    </div>
                  </div>
                </form>
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
}

const AuthorizeModal: FC<AuthorizeModalProps> = function ({
  authorize,
  clientId,
  setClientId,
  clientSecret,
  setClientSecret,
  authorizationUrl,
  setAuthorizationUrl,
  authorized,
  authLoading,
}: AuthorizeModalProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" className="mb-6" onClick={() => setOpen(true)}>
        {authLoading ? (
          <Spinner className="mr-3 text-sm" />
        ) : (
          <>{authorized ? "Update Credentials" : "Enable Connector"}</>
        )}
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Custom Readme Credentials</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="lg:col-span-2">
              <div>
                <Label htmlFor="apiKeys.label">OAuth client ID</Label>
                <TextInput
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="OAuth client ID"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="apiKeys.label">OAuth client secret</Label>
                <TextInput
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="OAuth client secret"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="apiKeys.label">Authorization URL</Label>
                <TextInput
                  value={authorizationUrl}
                  onChange={(e) => setAuthorizationUrl(e.target.value)}
                  placeholder="Authorization URL"
                  className="mt-1"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={() => {
              authorize();
              setOpen(false);
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

interface ConnectionsTableProps {
  connections: any[];
  isLoading: boolean;
  deleteConnection: (accountId: string, i: number) => void;
}

const ConnectionsTable: FC<ConnectionsTableProps> = function ({
  connections,
  isLoading,
  deleteConnection,
}: ConnectionsTableProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleDelete = (accountId: string, i: number) => {
    setSelectedIndex(i);
    deleteConnection(accountId, i);
  };

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>Account ID</Table.HeadCell>
          <Table.HeadCell>Workspace Name</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {connections.map((item, i) => (
            <Table.Row
              key={i}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {item.account_id}
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {item.metadata.workspace_name}
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                <Tooltip content="Delete">
                  <Button
                    color="failure"
                    onClick={() => handleDelete(item.account_id, i)}
                    disabled={isLoading}
                  >
                    {isLoading && selectedIndex == i ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <HiOutlineTrash className="h-4 w-4" />
                    )}
                  </Button>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default ReadmeConnectorPage;
