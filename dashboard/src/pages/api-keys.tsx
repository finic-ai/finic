/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { HiHome } from "react-icons/hi";
import { useUserStateContext } from "../context/UserStateContext";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import Text from "../components/text";

const ApiKeysPage: FC = function () {
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
              <Breadcrumb.Item>API Keys</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All API Keys
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="flex w-full items-center sm:justify-end">
              <AddAPIKeyModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <APIKeyTable />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AddAPIKeyModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      {/* <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Create new key
      </Button> */}
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Create new API key</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="apiKeys.label">Label</Label>
                <TextInput
                  id="apiKeys.label"
                  name="apiKeys.label"
                  placeholder='Name of the API key, e.g. "Production"'
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="apiKeys.newKey">API Key</Label>
                <TextInput
                  id="apiKeys.newKey"
                  name="apiKeys.newKey"
                  disabled={false}
                  readOnly={true}
                  className="mt-1"
                  value="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
                  helperText="Make sure you store this API key somewhere safe. It will never be shown again."
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => setOpen(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const APIKeyTable: FC = function () {
  const { bearer, appId } = useUserStateContext();
  const testAPIKeys = [
    {
      id: bearer,
      label: "Secret Key",
    },
    {
      id: appId,
      label: "Public Key",
    },
  ];
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Label</Table.HeadCell>
        <Table.HeadCell>API Key</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {testAPIKeys.map((key, i) => (
          <Table.Row
            key={i}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {key.label}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {key.id}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default ApiKeysPage;
