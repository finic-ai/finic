/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    TextInput,
    Spinner
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import {
    HiHome,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  
  const WebsiteConnectorPage: FC = function () {
    const [rootUrl, setRootUrl] = useState('');
    const [connectLoading, setConnectLoading] = useState(false)
    const [upsertedChunks, setUpsertedChunks] = useState(new Array<string>());
    const [shouldCrawl, setShouldCrawl] = useState(false);

    async function crawlPages() {
      setConnectLoading(true)
      try {
        // Define the URL to make the request to
        const url = 'https://sidekick-server-ezml2kwdva-uc.a.run.app/upsert-web';
        var payload = {
          url: url,
          crawl: shouldCrawl
        }

        // Make the request using the fetch function and await the response
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
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

    function toggleCrawl() {
      setShouldCrawl(!shouldCrawl)
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
                <div className="flex items-center gap-2">
                  <Checkbox id="crawl" checked={shouldCrawl} onChange={toggleCrawl}/>
                  <div className="ml-2 text-sm">
                    <Label htmlFor="crawl">
                      Crawl all pages at this path
                    </Label>
                    <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">Warning: This will recursively scrape every page starting with this URL path. It may take a long time.</p>
                  </div>
                </div>
                  <div>
                    <Label htmlFor="apiKeys.label">URL</Label>
                    <TextInput
                      id="apiKeys.label"
                      name="apiKeys.label"
                      placeholder='URL of the page you want to scrape'
                      className="mt-1"
                      onChange={(e) => setRootUrl(e.target.value.trim())}
                      value={rootUrl}
                      helperText="Only Google Docs files in this folder will by synced"
                    />
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" className="mb-6" onClick={() => crawlPages() } >
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
  