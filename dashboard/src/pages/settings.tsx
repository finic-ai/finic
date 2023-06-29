/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Spinner,
  TextInput,
  Checkbox,
  ToggleSwitch,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { HiHome } from "react-icons/hi";
import supabase from "../lib/supabaseClient";
import { useUserStateContext } from "../context/UserStateContext";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import Text from "../components/text";

const SettingsPage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="/">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <Text>Home</Text>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Settings</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Settings
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <ProductsTable />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const ProductsTable: FC = function () {
  const { appId, userId } = useUserStateContext();

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [enabledConnectors, setEnabledConnectors] = useState<string[]>([]);
  const [whitelabel, setWhitelabel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [webhookLoading, setWebhookLoading] = useState(true);

  const allConnectors = [
    { id: "confluence", name: "Confluence" },
    { id: "slack", name: "Slack" },
    { id: "dropbox", name: "Dropbox" },
    { id: "zendesk", name: "Zendesk" },
    { id: "intercom", name: "Intercom" },
    { id: "hubspot", name: "Hubspot" },
    { id: "notion", name: "Notion" },
    { id: "readme", name: "Readme.com" },
    { id: "salesforce", name: "Salesforce" },
    { id: "gdrive", name: "Google Drive" },
    { id: "github", name: "Github" },
    { id: "web", name: "Website" },
  ];

  useEffect(() => {
    async function getSettings() {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("app_id", appId);
      if (error) console.log(error);
      if (data && data[0]) {
        setName(data[0].name);
        setLogoUrl(data[0].logo);
        if (data[0].enabled_connectors !== null) {
          setEnabledConnectors(data[0].enabled_connectors);
        } else {
          // All connector IDs are enabled by default
          setEnabledConnectors(allConnectors.map((connector) => connector.id));
        }
        if (data[0].whitelabel) {
          setWhitelabel(data[0].whitelabel);
        }
      }
      setLoading(false);
    }
    async function getSyncs() {
      const { data, error } = await supabase
        .from("syncs")
        .select("*")
        .eq("app_id", appId);
      if (error) console.log(error);
      if (data && data[0]) {
        setWebhookUrl(data[0].webhook_url);
      }
      setWebhookLoading(false);
    }
    if (appId) {
      getSettings();
      getSyncs();
    }
  }, [appId]);

  async function updateSettings() {
    setLoading(true);
    setSaved(false);
    let downloadUrl = "";
    // Check if the url starts with https://drive.google.com/file/d/ and ends with /view?usp=sharing.
    // If it does, then it is a google drive link and we need to convert it to a direct download link.
    console.log("hello");
    console.log(logoUrl);
    if (logoUrl.startsWith("https://drive.google.com/file/d/")) {
      console.log("hello");
      const fileId = logoUrl.split("/")[5];
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    } else {
      downloadUrl = logoUrl;
    }
    const { data, error } = await supabase
      .from("settings")
      .upsert({
        name,
        logo: downloadUrl,
        app_id: appId,
        enabled_connectors: enabledConnectors,
        whitelabel: whitelabel,
      })
      .eq("app_id", appId)
      .select();
    setLoading(false);
    if (error) console.log(error);
    if (data) {
      console.log(data);
      setSaved(true);
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

  const handleCheckChange = (e: any) => {
    if (e.target.checked) {
      // append value to enabledConnectors if it's not already included
      if (!enabledConnectors.includes(e.target.value)) {
        setEnabledConnectors([...enabledConnectors, String(e.target.value)]);
      }
    } else {
      // remove value from enabledConnectors when unchecked
      setEnabledConnectors(
        enabledConnectors.filter((item) => item !== e.target.value)
      );
    }
  };

  const ConnectorCheckbox = ({
    connectorId,
    connectorName,
  }: {
    connectorId: string;
    connectorName: string;
  }) => {
    return (
      <div className="mt-4 flex flex-row">
        <Checkbox
          disabled={loading}
          value={connectorId}
          checked={enabledConnectors.includes(connectorId)}
          onChange={handleCheckChange}
        />
        <Label htmlFor="apiKeys.newKey" className="ml-2">
          {connectorName}
        </Label>
      </div>
    );
  };

  return (
    <div>
      <form className=" m-6 rounded p-6">
        <div className="grid grid-cols-1 gap-6">
          <h3 className="font-semibold text-gray-900 dark:text-white sm:text-xl">
            Modal Options
          </h3>
          <div>
            <Label htmlFor="apiKeys.label">Name</Label>
            <TextInput
              id="apiKeys.label"
              name="apiKeys.label"
              helperText="The name of your company. This will be displayed in the Psychic link modal."
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="apiKeys.newKey">Logo</Label>
            <TextInput
              id="apiKeys.newKey"
              name="apiKeys.newKey"
              className="mt-1"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              helperText="URL to your company logo. This will be displayed in the Psychic link modal. Must be a google drive link."
            />
          </div>
          <div>
            <Label htmlFor="apiKeys.newKey">Enabled Connectors</Label>
            {allConnectors.map((connector) => (
              <ConnectorCheckbox
                connectorId={connector.id}
                connectorName={connector.name}
              />
            ))}
          </div>
          <div>
            <Label htmlFor="apiKeys.newKey">Whitelabeling</Label>
            <ToggleSwitch
              disabled={loading}
              label="Initial Consent Screen"
              checked={!whitelabel}
              onChange={() => setWhitelabel(!whitelabel)}
            />
          </div>
          <div className="justify-beginning flex">
            <Button color="primary" onClick={updateSettings}>
              {loading && <Spinner className="mr-3" />}
              Save
            </Button>
          </div>
          {/* Success message text */}
          {saved && (
            <div className="ml-2 mt-1 text-sm text-green-500">Saved!</div>
          )}

          <h3 className="font-semibold text-gray-900 dark:text-white sm:text-xl">
            24-hr Sync Options
          </h3>
          <div>
            <Label htmlFor="apiKeys.newKey">Webhook URL</Label>
            <TextInput
              id="apiKeys.newKey"
              name="apiKeys.newKey"
              className="mt-1"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              helperText="Webhook URL to send 24-hr sync data to. Psychic will send POST requests to this URL for each connector you have enabled."
            />
          </div>
          <div className="justify-beginning flex">
            <Button color="primary" onClick={updateSync}>
              {webhookLoading && <Spinner className="mr-3" />}
              Save
            </Button>
          </div>
        </div>
        {webhookSaved && (
          <div className="ml-2 mt-1 text-sm text-green-500">Saved!</div>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;
