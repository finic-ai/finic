/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Label, TextInput, Spinner } from "flowbite-react";
import { FC } from "react";
import { useState } from "react";
import { usePsychicLink } from "@psychic-api/link";
import { usePostHog } from "posthog-js/react";

import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { useUserStateContext } from "../context/UserStateContext";
import Text from "../components/text";

const CreateConnectionPage: FC = function () {
  const { appId } = useUserStateContext();

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
              <Breadcrumb.Item>Create Connection</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Create Connection
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <ConnectorPlayground publicKey={appId} />
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

interface ConnectorPlaygroundProps {
  publicKey: string;
}

export const ConnectorPlayground: FC<ConnectorPlaygroundProps> = function ({
  publicKey,
}: ConnectorPlaygroundProps) {
  const [accountId, setAccountId] = useState<string>("");
  const [newConnection, setNewConnection] = useState<any>(null);

  const posthog = usePostHog();

  const { open, isReady, isLoading, error } = usePsychicLink(
    publicKey,
    (newConnection: { accountId: string; connectorId: string }) => {
      setNewConnection(newConnection);
      console.log(newConnection);
      posthog?.capture("connector_playground_connection_created", {
        connection: newConnection,
      });
    }
  );

  return (
    <>
      <Text className="mb-6">
        {
          'Click "Connect" to choose a data source to connect to using Psychic\'s OAuth app. You can then view connections under Connector Status > Active Connections.'
        }
      </Text>
      <Label htmlFor="apiKeys.label">Account ID</Label>
      <TextInput
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        required
        placeholder="The unique identifier for this connection."
        className="mt-1"
      />
      <Button
        type="submit"
        disabled={!isReady || accountId.length < 1}
        color="primary"
        className="mt-6"
        onClick={() => {
          open(accountId);
        }}
      >
        {isLoading ? <Spinner className="mr-3 text-sm" /> : <>Connect</>}
      </Button>
      {newConnection && (
        <div className="text-green-500 ml-3 mt-6">
          New connection successfully established for account{" "}
          {newConnection.accountId} with {newConnection.connectorId}
        </div>
      )}
      {error && <div className="text-red-500 ml-3 mt-6">{error}</div>}
    </>
  );
};

export default CreateConnectionPage;
