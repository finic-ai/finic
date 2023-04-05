/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Modal,
    Table,
    Textarea,
    TextInput,
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState, useEffect } from "react";
  import { FaPlus, FaGoogle } from "react-icons/fa";
  import {
    HiCog,
    HiDotsVertical,
    HiExclamationCircle,
    HiHome,
    HiOutlineExclamationCircle,
    HiPencilAlt,
    HiTrash,
    HiUpload,
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../layouts/navbar-sidebar";
  import { Pagination } from "./users/list";
  import { useLocation } from 'react-router-dom';

  
  const GoogleDrivePage: FC = function () {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('code');
    const [folderName, setFolderName] = useState('');

    async function connectGoogleDrive(code: string | null) {
      console.log(folderName);
      try {
        // Define the URL to make the request to
        // const url = 'https://sidekick-server-ezml2kwdva-uc.a.run.app/upsert-google-docs';
        const url = 'http://localhost:8080/upsert-google-docs';
        var payload = {
          folder_name: folderName,
          auth_code: code
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

        if (jsonData.auth_url) {
          console.log(jsonData.auth_url)
          window.location.href = jsonData.auth_url
        } else {
          const numChunks = jsonData.ids.length
          console.log(`Successfully upserted ${numChunks} chunks`)
        }
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error connecting to google drive:', error);
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
                <Breadcrumb.Item>Google Drive</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Connect Google Drive
              </h1>
            </div>
          </div>
        </div>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <form>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <Button color="primary" onClick={() => connectGoogleDrive(null) }>
                      <FaGoogle className="mr-3 text-sm" />
                      Authorize Google
                    </Button>
                    <Label htmlFor="apiKeys.label">Folder name</Label>
                    <TextInput
                      id="apiKeys.label"
                      name="apiKeys.label"
                      placeholder='Name of the folder you want to sync with Sidekick'
                      className="mt-1"
                      onChange={(e) => setFolderName(e.target.value.trim())}
                      value={folderName}
                    />
                  </div>
                  <div className="lg:col-span-2">
                      <Button color="primary" disabled={authCode == null} onClick={() => connectGoogleDrive(authCode) }>
                        <FaPlus className="mr-3 text-sm" />
                        Connect
                      </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  };
  
  export default GoogleDrivePage;
  