/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Tabs, TextInput } from "flowbite-react";
import { FC } from "react";
import replitShowFiles from "../assets/replit-show-files.png";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { useUserStateContext } from "../context/UserStateContext";
import { ConnectorPlayground } from "./create-connection";
import Text from "../components/text";

const OnboardingPage: FC = function () {
  const { appId, bearer } = useUserStateContext();

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
              <Breadcrumb.Item>First Steps</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex-col items-center space-y-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                First Steps
              </h1>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Step 1: Connect a test data source
                </h2>
                <ConnectorPlayground publicKey={appId} />
              </div>
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Step 2: Load documents from your test data source and ask it
                  questions
                </h2>
                <Text className="mb-4">
                  You'll need the <span className="font-bold">Account ID</span>{" "}
                  you used and your Psychic{" "}
                  <span className="font-bold">Secret Key</span> for this step.
                </Text>
                <div className="flex flex-row items-center space-x-4">
                  <Text>Your Secret Key:</Text>
                  <TextInput className="w-[310px]" readOnly value={bearer} />
                </div>
                <Tabs.Group style="underline">
                  <Tabs.Item active title="Using LangChain">
                    <div className="flex-col space-y-4">
                      <Text>
                        This Repl shows how to use Psychic's{" "}
                        <a
                          className="text-blue-400"
                          href="https://docs.psychic.dev/python-sdk"
                        >
                          Python SDK
                        </a>{" "}
                        with LangChain to ask questions over data you just
                        connected.
                      </Text>
                      <Text>
                        It may take up to 60 seconds to load when running it for
                        the first time.
                      </Text>
                      <span className="flex flex-row items-center space-x-2">
                        <Text>To view the source code, click</Text>
                        <img className="h-8" src={replitShowFiles} />
                        <Text>below.</Text>
                      </span>
                      <iframe
                        height="400px"
                        className="w-full"
                        src="https://replit.com/@JasonFan6/Connect-SaaS-data-to-ChatGPT-using-Psychic-and-LangChain?embed=true"
                      />
                    </div>
                  </Tabs.Item>
                  <Tabs.Item active title="Using the API">
                    <div className="flex-col space-y-4">
                      <Text>
                        This Repl shows how to use Psychic's{" "}
                        <a
                          className="text-blue-400"
                          href="https://docs.psychic.dev/api-reference/endpoint/ask-question"
                        >
                          API
                        </a>{" "}
                        to ask questions over data you just connected.
                      </Text>
                      <Text>
                        The "/ask-question" endpoint is meant for POCs and
                        should not be used in production applications. To use
                        Psychic in production, use the{" "}
                        <a
                          className="text-blue-400"
                          href="https://docs.psychic.dev/python-sdk"
                        >
                          Python SDK
                        </a>{" "}
                        or the{" "}
                        <a
                          className="text-blue-400"
                          href="https://docs.psychic.dev/api-reference/endpoint/get-documents"
                        >
                          Get Documents{" "}
                        </a>
                        endpoint to retrieve documents and load them into a
                        vector database.
                      </Text>
                      <span className="flex flex-row items-center space-x-2">
                        <Text>To view the source code, click</Text>
                        <img className="h-8" src={replitShowFiles} />
                        <Text>below.</Text>
                      </span>
                      <iframe
                        height="400px"
                        className="w-full"
                        src="https://replit.com/@JasonFan6/Connect-SaaS-data-to-ChatGPT-using-Psychic-APIs?embed=true"
                      />
                    </div>
                  </Tabs.Item>
                </Tabs.Group>
              </div>
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Step 3: Connect more data sources with Psychic Link
                </h2>
                <Text>
                  <a
                    className="text-blue-400"
                    href="https://docs.psychic.dev/psychic-link"
                  >
                    Psychic Link
                  </a>{" "}
                  can be added to any React application to let your users
                  connect their own data sources.
                </Text>
                <Text className="mb-4">
                  You can load these documents and use them with LangChain just
                  like you did with your own documents.
                </Text>
                <Text className="mb-4">Here's an example:</Text>
                <SyntaxHighlighter language="javascript" style={dracula}>
                  {`import React, { useState } from 'react';
import { usePsychicLink } from '@psychic-api/link';

const PsychicDemo: React.FC = () => {
  const [connection, setConnection] = useState(null)
  
  const psychicCallback = (newConnection) => {
    setConnection(newConnection)
    fetchDocumentsFromServer(newConnection.accountId, newConnection.connectorId) // Send a request to your backend to fetch documents using the Psychic API endpoints or Python library.
  }

  const { open, isReady, isLoading, error } = usePsychicLink(publicKey, psychicCallback) // publicKey is your Psychic public key
  const accountId = getUserId() // Psychic Account IDs should map to the unique ID of the user creating this connection
  
  return (
    <button onClick={() => {
      open(accountId)
    }} >
      Connect
    </button>
  )
}`}
                </SyntaxHighlighter>
              </div>
              <div>
                <Button className="w-full md:w-1/5" href="/create-connection">
                  ✨ Finish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default OnboardingPage;
