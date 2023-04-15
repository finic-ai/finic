/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    TextInput,
    Textarea,
    Spinner
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import {
    HiHome,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  import { useUserStateContext } from "../../context/UserStateContext";

  
  const WebsiteConnectorPage: FC = function () {
    const [urlsInput, setUrlsInput] = useState('');
    const [connectLoading, setConnectLoading] = useState(false)
    const [upsertedChunks, setUpsertedChunks] = useState(new Array<string>());
    const [cssSelector, setCssSelector] = useState('');
    const {bearer} = useUserStateContext()

    async function crawlPages() {
      setConnectLoading(true)
      try {
        // Define the URL to make the request to
        // split by comma and remove whitespace
        const urls = urlsInput.split(',').map(url => url.trim())
        var payload = {
          urls: urls, 
          css_selector: cssSelector
        }

        // Make the request using the fetch function and await the response
        const url = import.meta.env.VITE_SERVER_URL + '/upsert-web-data';
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify(payload),
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
                <Breadcrumb.Item>Website</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Scrape web content
              </h1>
            </div>
          </div>
        </div>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <form>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="lg:col-span-2">
                    <Label htmlFor="apiKeys.label">URLs</Label>
                    <Textarea 
                      id="apiKeys.label"
                      name="apiKeys.label"
                      placeholder='https://www.example.com, https://www.example2.com, ...'
                      className="mt-1 w-1/2"
                      onChange={(e) => setUrlsInput(e.target.value)}
                      value={urlsInput}
                      helperText="URLs of the pages you want to scrape. Must be a comma separated list."
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label htmlFor="apiKeys.label">CSS Selector</Label>
                    <TextInput
                      id="apiKeys.label"
                      name="apiKeys.label"
                      className="mt-1 w-1/2"
                      placeholder=".example-class"
                      onChange={(e) => setCssSelector(e.target.value.trim())}
                      value={cssSelector}
                      helperText={<p>Only elements matching the <a className="text-blue-400" href="https://www.w3schools.com/cssref/css_selectors.php">CSS selector</a> will be ingested. Applies to all URLs provided.</p>}
                    />
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" disabled={!urlsInput} className="mb-6" onClick={() => crawlPages() } >
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
  
  export default WebsiteConnectorPage;
  