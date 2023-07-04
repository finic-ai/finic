/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Spinner,
  TextInput,
  Table,
} from "flowbite-react";
import { FC, useEffect } from "react";
import { useState } from "react";
import { HiHome } from "react-icons/hi";
import supabase from "../lib/supabaseClient";
import { useUserStateContext } from "../context/UserStateContext";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import Text from "../components/text";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const SyncsPage: FC = function () {
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
              <Breadcrumb.Item>Syncs</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Syncs
            </h1>
          </div>
        </div>
      </div>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <ProductsTable />
      </div>
    </NavbarSidebarLayout>
  );
};

interface SyncResult {
  account_id: string;
  connector_id: string;
  success: boolean;
  docs_synced: number;
  error: string;
}
interface SyncResults {
  last_updated: number;
  results: SyncResult[];
}

const ProductsTable: FC = function () {
  const { appId, userId, bearer } = useUserStateContext();

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [webhookLoading, setWebhookLoading] = useState(true);
  // syncStatus is a dict or null. need to declare the type
  const [manualSyncLoading, setManualSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResults | null>(null);

  async function getSyncs() {
    setWebhookLoading(true);
    const { data, error } = await supabase
      .from("syncs")
      .select("*")
      .eq("app_id", appId);
    if (error) console.log(error);
    if (data && data[0]) {
      setWebhookUrl(data[0].webhook_url);
      console.log(data[0].results);
      setSyncResult(data[0].results);
    }
    setWebhookLoading(false);
    setManualSyncLoading(false);
  }

  useEffect(() => {
    if (appId) {
      getSyncs();
    }
  }, [appId]);

  async function testSync() {
    setManualSyncLoading(true);
    const url = import.meta.env.VITE_SERVER_URL + "/run-sync";
    var payload = {
      sync_all: false,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await response.json();
      getSyncs();
    } catch (error) {
      setManualSyncLoading(false);
    }
  }

  async function updateSync() {
    setWebhookLoading(true);
    setWebhookSaved(false);
    const { data, error } = await supabase
      .from("syncs")
      .upsert({ app_id: appId, user_id: userId, webhook_url: webhookUrl })
      .eq("app_id", appId)
      .select();
    setWebhookLoading(false);
    if (error) console.log(error);
    if (data) {
      console.log(data);
      setWebhookSaved(true);
    }
  }

  return (
    <div>
      <form>
        <div className="grid grid-cols-1 gap-6 w-1/2">
          <h3 className="font-semibold text-gray-900 dark:text-white sm:text-xl">
            Sync Webhook
          </h3>
          <div>
            <Label htmlFor="apiKeys.newKey">Webhook URL</Label>
            <TextInput
              id="apiKeys.newKey"
              name="apiKeys.newKey"
              className="mt-1"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              helperText="Psychic will send POST requests to this URL for each connector you have enabled every 24 hours."
            />
          </div>
          <div className="flex justify-beginning">
            <Button color="primary" onClick={updateSync}>
              {webhookLoading && <Spinner className="mr-3" />}
              Save
            </Button>
          </div>
          {webhookSaved && (
            <div className="text-green-500 text-sm ml-2 mt-1">Saved!</div>
          )}
          <Text>Requests will have a JSON body with the following format:</Text>
          <SyntaxHighlighter language="javascript" style={dracula}>{`{
  'account_id': string,
  'connector_id': string,
  'documents': [{
    'title': string
    'content': string
    'connector_id': string
    'account_id': string
    'uri' string (optional)
  }]
}`}</SyntaxHighlighter>
          <h3 className="font-semibold text-gray-900 dark:text-white sm:text-xl">
            Run manually
          </h3>
          <Text className="text-gray-500 dark:text-gray-400">
            Run a sync manually to test your webhook.
          </Text>
          <div className="flex justify-beginning">
            <Button
              color="primary"
              disabled={webhookLoading}
              onClick={testSync}
            >
              {manualSyncLoading && <Spinner className="mr-3" />}
              Run
            </Button>
          </div>
        </div>
        {syncResult !== null ? (
          <div className="my-6">
            <h3 className="font-semibold text-gray-900 dark:text-white sm:text-xl">
              Sync Status
            </h3>
            <Text className="text-gray-500 dark:text-gray-400 my-6">
              {/* convert unix timestamp to date display */}
              Latest sync:{" "}
              {new Date(syncResult?.last_updated * 1000).toLocaleString()}
              {/* Latest sync: {syncResult?.last_updated} */}
            </Text>
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>Account ID</Table.HeadCell>
                <Table.HeadCell>Connector ID</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Docs Synced</Table.HeadCell>
                <Table.HeadCell>Error</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                {syncResult?.results.map((item, i) => (
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
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {item.connector_id}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {item.success ? "Success" : "Error"}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {item.docs_synced}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {item.error}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default SyncsPage;
