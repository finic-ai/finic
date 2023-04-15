/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    Modal,
    Table,
    TextInput,
    Spinner,
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState } from "react";
  import {
    HiHome,
    HiCheckCircle,
    // HiOutlineExclamationCircle,
    // HiTrash,
  } from "react-icons/hi";
import { useUserStateContext } from "../context/UserStateContext";
  import NavbarSidebarLayout from "../layouts/navbar-sidebar";
  
  const VectorstorePage: FC = function () {
    
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
                <Breadcrumb.Item>Vector Stores</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Vector Stores
              </h1>
            </div>
            <div className="block items-center sm:flex">
              <div className="flex w-full items-center sm:justify-end">
              </div>
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
  
  interface AuthorizeModalProps {
    vectorstoreId: number;
    vectorstoreName: string;
    updateVectorstore: (id: number) => void;
    vectorstoreIsUpdating: boolean;
    updateVectorstoreToPinecone: (id: number, apiKey: string, index: string, environment: string) => void;
  }

  const AuthorizeModal: FC<AuthorizeModalProps> = function ({vectorstoreId, vectorstoreName, updateVectorstore, vectorstoreIsUpdating, updateVectorstoreToPinecone }: AuthorizeModalProps) {
    const [isOpen, setOpen] = useState(false);

    const [apiKey, setApiKey] = useState("");
    const [index , setIndex] = useState("");
    const [environment, setEnvironment] = useState("");

    const buttonClicked = () => {
        if (vectorstoreId == 1) {
            updateVectorstore(vectorstoreId);
        } else {
            setOpen(true);
        }
    }

  
    return (
      <>
        <Button color="primary" className="mb-6" onClick={() => buttonClicked() } >
          {vectorstoreIsUpdating ? <Spinner className="mr-3 text-sm" /> : <>
          Use
          </>}
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>{`Set vector store to ${vectorstoreName}`}</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="lg:col-span-2">
                <div>
                  <Label htmlFor="apiKeys.label">API Key</Label>
                  <TextInput
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder='API Key'
                    className="mt-1"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="apiKeys.newKey">Index</Label>
                  <TextInput
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    placeholder='Index'
                    className="mt-1"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label>Environment</Label>
                  <TextInput
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    placeholder='Environment'
                    className="mt-1"
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={() => {
              updateVectorstoreToPinecone(vectorstoreId, apiKey, index, environment)
              setOpen(false)
            }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };


  
  const ProductsTable: FC = function () {
    const {bearer, vectorstore, setVectorstore} = useUserStateContext()
    console.log(vectorstore)
    const testAPIKeys = [
      {
          id: 1,
          label: "Default (Weaviate)",
      },
      {
        id: 3,
        label: "Pinecone",
      },
    ]
    const [vectorstoreIsUpdating, setVectorstoreIsUpdating] = useState(false)

    const updateVectorstore = async (id: number) => {
      console.log(id)
      const url = import.meta.env.VITE_SERVER_URL + '/select-vectorstore';
      setVectorstoreIsUpdating(true)
      var payload = {
        vectorstore: id,
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const isAuthorized = jsonData.authorized
        console.log(jsonData)
        if (!isAuthorized) {
          console.log('failed to authenticate')
        }
        setVectorstore(id)
        setVectorstoreIsUpdating(false)
      } catch (error) {
        setVectorstoreIsUpdating(false)
    }
  }

    const updateVectorstoreToPinecone = async (id: number, apiKey: string, index: string, environment: string) => {
      console.log(id)
      const url = import.meta.env.VITE_SERVER_URL + '/select-vectorstore';
      setVectorstoreIsUpdating(true)
      var payload = {
        vectorstore: id,
        credentials: JSON.stringify({
          api_key: apiKey,
          index: index,
          environment: environment
        })
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearer}` },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const isAuthorized = jsonData.authorized
        console.log(jsonData)
        if (!isAuthorized) {
          console.log('failed to authenticate')
        }
        setVectorstore(id)
        setVectorstoreIsUpdating(false)
      } catch (error) {
        setVectorstoreIsUpdating(false)
    }
    }

    return (
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>Label</Table.HeadCell>
          <Table.HeadCell>Currently in use</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          {/* <Table.HeadCell>Created</Table.HeadCell>
          <Table.HeadCell>Last Used</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell> */}
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {testAPIKeys.map((key, i) => (
            <Table.Row key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {key.label}
                    </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {vectorstore == key.id ?
                            <HiCheckCircle color="green" /> : <> </>
                        }  
                    </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        <AuthorizeModal 
                          vectorstoreId={key.id} 
                          vectorstoreName={key.label}
                          updateVectorstore={updateVectorstore}
                          vectorstoreIsUpdating={vectorstoreIsUpdating}
                          updateVectorstoreToPinecone={updateVectorstoreToPinecone}
                            />
                        
                    </div>
                </Table.Cell>
                {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {key.created}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {key.last_used}
                </Table.Cell>
                <Table.Cell className="space-x-2 whitespace-nowrap p-4">
                    <div className="flex items-center gap-x-3">
                        <DeleteProductModal />
                    </div>
                </Table.Cell> */}
            </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  };
  
  export default VectorstorePage;
  