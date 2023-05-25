/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    TextInput,
    Spinner,
  } from "flowbite-react";
import { FC } from "react";
import { useState } from "react";
import {usePsychicLink} from "@psychicdev/link";
import { usePostHog } from 'posthog-js/react'

import {
  HiHome,
} from "react-icons/hi";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { useUserStateContext } from "../context/UserStateContext";

const PlaygroundPage: FC = function () {

  const {appId} = useUserStateContext()
      

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
              <Breadcrumb.Item>Playground</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Playground
              </h1>
            </div>
          </div>
        </div>
      </div>
          <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
            <div className="mb-1 w-full">
              <div className="mb-4">
                <ConnectorPlayground bearer={appId} />
              </div>
            </div>
          </div>
    </NavbarSidebarLayout>
  );
};

interface ConnectorPlaygroundProps {
  bearer: string;
}

const ConnectorPlayground: FC<ConnectorPlaygroundProps> = function ({bearer}: ConnectorPlaygroundProps) {
  const [connectionId, setConnectionId] = useState<string>('');
  const [newConnection, setNewConnection] = useState<string | null>(null);

  const publicKey = bearer
  const posthog = usePostHog()

  const { open, isReady, isLoading, error } = usePsychicLink(publicKey, (newConnection: string) => {
    setNewConnection(newConnection)
    posthog?.capture('connector_playground_connection_created', {connectionId: newConnection})
  })

  return (
    <>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-lg mb-2">
        Playground
      </h2>
      <p className="mb-6">See how users will experience using Psychic Link to connect their SaaS apps.</p>
      <Label htmlFor="apiKeys.label">Connection ID</Label>
      <TextInput
        value={connectionId}
        onChange={(e) => setConnectionId(e.target.value)}
        placeholder="The unique identifier for this connection."
        helperText="This ID will appear in your Active Connections list if the test is successful." 
        className="mt-1"
      />
      <Button disabled={!isReady} color="primary" className="mt-6"  onClick={() => {
          open(connectionId)
      }} >
        {isLoading ? <Spinner className="mr-3 text-sm" /> : <>
        Connect
        </>}
      </Button>
      {newConnection && <div className="text-green-500 ml-3 mt-6">New connection successfully established: {newConnection}</div>}
      {error && <div className="text-red-500 ml-3 mt-6">{error}</div>}
    </>
  );
};

export default PlaygroundPage;
  