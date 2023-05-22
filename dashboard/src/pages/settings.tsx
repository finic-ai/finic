/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    Spinner,
    TextInput,
  } from "flowbite-react";
  import { FC, useEffect } from "react";
  import { useState } from "react";
  import {
    HiHome,
  } from "react-icons/hi";
  import supabase from "../lib/supabaseClient";
import { useUserStateContext } from "../context/UserStateContext";
  import NavbarSidebarLayout from "../layouts/navbar-sidebar";
  
  const SettingsPage: FC = function () {
    
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
                <Breadcrumb.Item>Settings</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Settings
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white">
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
    const {appId, userId} = useUserStateContext()

    const [name, setName] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(false)
    const [webhookUrl, setWebhookUrl] = useState('')
    const [webhookSaved, setWebhookSaved] = useState(false)
    const [webhookLoading, setWebhookLoading] = useState(true)


    useEffect(() => {
        async function getSettings() {
            const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('app_id', appId)
            if (error) console.log(error)
            if (data && data[0]) {
                setName(data[0].name)
                setLogoUrl(data[0].logo)
            }
            setLoading(false)
        }
        async function getSyncs() {
            const { data, error } = await supabase
            .from('syncs')
            .select('*')
            .eq('app_id', appId)
            if (error) console.log(error)
            if (data && data[0]) {
                setWebhookUrl(data[0].webhook_url)
            }
            setWebhookLoading(false)
        }
        if (appId) {
            getSettings()
            getSyncs()
        }
        
    }, [appId])

    async function updateSettings() {
        setLoading(true)
        setSaved(false)
        var downloadUrl = ''
        // Check if the url starts with https://drive.google.com/file/d/ and ends with /view?usp=sharing. 
        // If it does, then it is a google drive link and we need to convert it to a direct download link.
        console.log('hello')
        console.log(logoUrl)
        if (logoUrl.startsWith('https://drive.google.com/file/d/')) {
            console.log('hello')
            const fileId = logoUrl.split('/')[5]
            downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        } else {
            downloadUrl = logoUrl
        }
        const { data, error } = await supabase
        .from('settings')
        .upsert({ name, logo: downloadUrl, app_id: appId })
        .eq('app_id', appId)
        .select()
        setLoading(false)
        if (error) console.log(error)
        if (data) {
            console.log(data)
            setSaved(true)
        }
    }

    async function updateSync() {
      setWebhookLoading(true)
      setWebhookSaved(false)
      const { data, error } = await supabase
      .from('syncs')
      .upsert({ app_id: appId, user_id: userId, webhook_url: webhookUrl })
      .eq('app_id', appId)
      .select()
      setWebhookLoading(false)
      if (error) console.log(error)
      if (data) {
          console.log(data)
          setWebhookSaved(true)
      }
    }


    return (
        <div className="bg-white">
        <form className=" m-6 p-6 rounded">
  <div className="grid grid-cols-1 gap-6 w-1/2">
    <h3 className="font-semibold text-gray-900 dark:text-white sm:text-xl">
      Modal Options 
    </h3>
    <div>
      <Label htmlFor="apiKeys.label">Name</Label>
      <TextInput
        id="apiKeys.label"
        name="apiKeys.label"
        helperText='The name of your company. This will be displayed in the Psychic link modal.'
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
    <div className="flex justify-beginning">
        <Button color="primary" onClick={updateSettings}>
            {loading && <Spinner className="mr-3" />}
            Save
        </Button>
        

    </div>
    {/* Success message text */}
    {saved && <div className="text-green-500 text-sm ml-2 mt-1">Saved!</div>}

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
    <div className="flex justify-beginning">
        <Button color="primary" onClick={updateSync}>
            {webhookLoading && <Spinner className="mr-3" />}
            Save
        </Button>
    </div>
  </div>
  {webhookSaved && <div className="text-green-500 text-sm ml-2 mt-1">Saved!</div>}
</form>
</div>

    );
  };
  
  export default SettingsPage;
  