/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Label, Table, TextInput } from "flowbite-react";
import type { FC } from "react";
import {
  HiCog,
  HiDotsVertical,
  HiDownload,
  HiHome,
  HiPrinter,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const EcommerceInvoicePage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <Menu />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-full m-4 md:mx-6 md:mt-6 xl:mb-2">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="#">
              <div className="flex items-center gap-x-3">
                <HiHome className="text-xl" />
                <span className="dark:text-white">Home</span>
              </div>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/e-commerce/products">
              E-commerce
            </Breadcrumb.Item>
            <Breadcrumb.Item>Invoice</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Invoice
          </h1>
        </div>
        <div className="col-span-12 mx-4 mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 md:mx-6 lg:my-6 xl:col-span-10 xl:col-start-2 xl:p-8 2xl:col-span-8 2xl:col-start-3">
          <Invoice />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const Menu: FC = function () {
  return (
    <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
      <div className="mb-3 flex items-center dark:divide-gray-700 sm:mb-0 sm:divide-x sm:divide-gray-100">
        <form className="flex-auto lg:pr-3" action="#" method="GET">
          <Label htmlFor="invoice-search" className="sr-only">
            Search
          </Label>
          <div className="relative sm:w-64 md:w-96">
            <TextInput
              id="invoice-search"
              name="invoice-search"
              placeholder="Search for invoice number"
              type="search"
            />
          </div>
        </form>
        <div className="ml-auto flex space-x-1 pl-2">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Configure</span>
            <HiCog className="text-2xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Settings</span>
            <HiDotsVertical className="text-2xl" />
          </a>
        </div>
      </div>
      <div className="items-center space-y-4 sm:inline-flex sm:space-y-0 sm:space-x-4">
        <div>
          <a
            href="#"
            className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
          >
            <HiDownload className="text-2xl" />
            Download Invoice
          </a>
        </div>
        <div>
          <a
            href="#"
            className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white py-2 px-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:w-auto"
          >
            <HiPrinter className="text-2xl" />
            Print
          </a>
        </div>
      </div>
    </div>
  );
};

const Invoice: FC = function () {
  return (
    <div className="space-y-6 overflow-hidden p-4 md:p-8">
      <div className="sm:flex">
        <div className="mb-5 text-2xl font-bold dark:text-white sm:mb-0 sm:text-3xl">
          Invoice #0472
        </div>
        <div className="space-y-3 text-left sm:ml-auto sm:text-right">
          <svg
            className="h-10 w-10 sm:ml-auto"
            viewBox="0 0 39 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.1622 1.47093L22.6807 5.26078C22.5339 5.29495 22.3817 5.2995 22.2331 5.27414C22.0844 5.24879 21.9424 5.19404 21.8152 5.11312L14.4967 0.331871C14.3629 0.244902 14.2118 0.187926 14.0539 0.164864C13.896 0.141802 13.7349 0.153201 13.5819 0.198277L0.915185 3.92484C0.799036 3.95271 0.695356 4.01814 0.620271 4.11096C0.545186 4.20379 0.502904 4.3188 0.5 4.43812V12.0178L13.5819 8.17171C13.7349 8.12664 13.896 8.11524 14.0539 8.1383C14.2118 8.16136 14.3629 8.21834 14.4967 8.30531L21.8152 13.0795C21.941 13.1635 22.0831 13.2201 22.2322 13.2455C22.3814 13.271 22.5342 13.2647 22.6807 13.2272L38.5 9.36V1.72406C38.4982 1.65256 38.4684 1.5846 38.4172 1.53469C38.3659 1.48477 38.2971 1.45685 38.2256 1.45687L38.1622 1.47093Z"
              fill="#FF7F66"
            />
            <path
              d="M28.8241 19.7311L22.6808 21.2077C22.5341 21.2435 22.3816 21.2488 22.2327 21.2234C22.0838 21.198 21.9417 21.1424 21.8152 21.06L14.4967 16.2788C14.4675 16.2581 14.4344 16.2437 14.3995 16.2364C14.3645 16.2291 14.3284 16.2291 14.2934 16.2364C14.2584 16.2436 14.2253 16.258 14.1961 16.2786C14.1669 16.2992 14.1423 16.3256 14.1237 16.3561C14.0913 16.3957 14.0739 16.4455 14.0745 16.4967V23.6897C14.0742 23.7776 14.096 23.8642 14.1378 23.9415C14.1796 24.0189 14.2401 24.0846 14.3137 24.1327L21.8152 29.0545C21.9422 29.1358 22.0846 29.1901 22.2334 29.2143C22.3823 29.2385 22.5345 29.232 22.6808 29.1952L29.176 27.6413C30.2256 27.388 31.1601 26.7905 31.8298 25.9441C32.4995 25.0977 32.8659 24.0515 32.8704 22.9725V22.8248C32.8574 21.9645 32.5034 21.1445 31.8859 20.5447C31.2685 19.9449 30.4381 19.6144 29.5771 19.6256C29.323 19.6331 29.0705 19.6685 28.8241 19.7311Z"
              fill="#FF7F66"
            />
            <path
              d="M28.8241 35.678L22.6808 37.1545C22.5339 37.1887 22.3817 37.1933 22.2331 37.1679C22.0845 37.1426 21.9424 37.0878 21.8152 37.0069L14.4967 32.2256C14.4676 32.2057 14.4349 32.1916 14.4004 32.1844C14.3658 32.1771 14.3302 32.1767 14.2956 32.1832C14.2609 32.1898 14.2279 32.2031 14.1984 32.2224C14.1689 32.2418 14.1435 32.2668 14.1237 32.296C14.0917 32.3386 14.0745 32.3904 14.0745 32.4436V39.6366C14.0742 39.7245 14.096 39.8111 14.1378 39.8884C14.1796 39.9658 14.24 40.0315 14.3137 40.0795L21.8152 45.0014C21.941 45.0854 22.0831 45.142 22.2322 45.1674C22.3814 45.1929 22.5342 45.1866 22.6808 45.1491L29.1759 43.5881C30.2268 43.3372 31.1626 42.7402 31.8328 41.8934C32.5029 41.0465 32.8684 39.999 32.8704 38.9194V38.7717C32.8574 37.9114 32.5034 37.0914 31.8859 36.4916C31.2685 35.8918 30.4381 35.5612 29.5771 35.5725C29.3227 35.5766 29.0698 35.612 28.8241 35.678Z"
              fill="#FF7F66"
            />
            <path
              opacity="0.32"
              d="M22.2163 29.1881V21.2498C22.3695 21.2815 22.5276 21.2815 22.6808 21.2498L25.3267 20.5467L26.8748 28.1405L22.6526 29.167C22.5103 29.205 22.3616 29.2122 22.2163 29.1881ZM28.423 35.7483L22.6808 37.1545C22.5276 37.1862 22.3695 37.1862 22.2163 37.1545V45.1561C22.3695 45.1877 22.5276 45.1877 22.6808 45.1561L29.9711 43.3702L28.423 35.7483ZM22.2163 13.2483C22.3695 13.2799 22.5276 13.2799 22.6808 13.2483L23.7856 12.9811L22.2163 5.27484V13.2483Z"
              fill="#111928"
            />
            <g opacity="0.16">
              <path
                opacity="0.16"
                d="M14.0745 8.1436C14.2237 8.17206 14.3667 8.22682 14.4967 8.30532L21.8152 13.0866C21.936 13.1668 22.0729 13.2196 22.2163 13.2413V5.26782C22.0729 5.24617 21.936 5.19337 21.8152 5.11314L14.4967 0.331885C14.3667 0.253384 14.2237 0.198624 14.0745 0.170166V8.1436Z"
                fill="#111928"
              />
              <path
                opacity="0.16"
                d="M22.2163 37.1686C22.0738 37.14 21.9377 37.0851 21.8152 37.0069L14.4967 32.2256C14.436 32.1856 14.3619 32.1713 14.2907 32.1858C14.2194 32.2003 14.1569 32.2424 14.1167 32.303C14.089 32.3447 14.0743 32.3936 14.0745 32.4436V39.6366C14.0742 39.7245 14.096 39.8111 14.1378 39.8884C14.1796 39.9658 14.24 40.0315 14.3137 40.0795L21.8152 45.0014C21.9387 45.0763 22.0745 45.1287 22.2163 45.1561V37.1686Z"
                fill="#111928"
              />
              <path
                opacity="0.16"
                d="M14.4967 16.2788C14.436 16.2388 14.3619 16.2244 14.2907 16.2389C14.2194 16.2534 14.1569 16.2956 14.1167 16.3561C14.089 16.3978 14.0743 16.4467 14.0745 16.4968V23.6897C14.0742 23.7776 14.096 23.8642 14.1378 23.9416C14.1796 24.0189 14.24 24.0846 14.3137 24.1327L21.8152 29.0546C21.9376 29.1317 22.0738 29.1843 22.2163 29.2093V21.2499C22.0725 21.2257 21.9356 21.1705 21.8152 21.0882L14.4967 16.2788Z"
                fill="#111928"
              />
            </g>
          </svg>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Themesberg Inc.
            </div>
            <div className="text-sm font-normal text-gray-900 dark:text-white">
              291 N 4th St, San Jose, CA 95112, USA
            </div>
          </div>
          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
            August 1, 2021
          </div>
        </div>
      </div>
      <div className="sm:w-72">
        <div className="mb-4 text-base font-bold uppercase text-gray-900 dark:text-white">
          Bill to
        </div>
        <address className="text-base font-normal text-gray-500 dark:text-gray-400">
          Themesberg Inc., LOUISVILLE, Selby 3864 Johnson Street, United States
          of America VAT Code: AA-1234567890
        </address>
      </div>
      <div className="my-8 flex flex-col">
        <div className="overflow-x-auto border-b border-gray-200 dark:border-gray-600">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <Table className="min-w-full text-gray-900">
                <Table.Head>
                  <Table.HeadCell>Item</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Qty</Table.HeadCell>
                  <Table.HeadCell>Off</Table.HeadCell>
                  <Table.HeadCell>Total</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal">
                      <div className="text-base font-semibold">
                        Pixel Design System
                      </div>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Html components
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                      $128.00
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold text-gray-900 dark:text-white">
                      1
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal">
                      50%
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold">
                      $64.00
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal">
                      <div className="text-base font-semibold">
                        Volt Dashboard Template
                      </div>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Tailwind template
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                      $69.00
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold text-gray-900 dark:text-white">
                      1
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal">
                      0%
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold">
                      $69.00
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal">
                      <div className="text-base font-semibold">
                        Neumorphism UI
                      </div>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Html template
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                      $69.00
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold text-gray-900 dark:text-white">
                      1
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal">
                      0%
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold">
                      $69.00
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal">
                      <div className="text-base font-semibold">
                        Glassmorphism UI
                      </div>
                      <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Figma template
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                      $149.00
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold text-gray-900 dark:text-white">
                      1
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-normal">
                      0%
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-base font-semibold">
                      $149.00
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 sm:ml-auto sm:w-72 sm:text-right">
        <div className="flex justify-between">
          <div className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            Subtotal
          </div>
          <div className="text-base font-medium text-gray-900 dark:text-white">
            $415.00
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            Tax rate
          </div>
          <div className="text-base font-medium text-gray-900 dark:text-white">
            5%
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            Discount
          </div>
          <div className="text-base font-medium text-gray-900 dark:text-white">
            $64.00
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-base font-semibold uppercase text-gray-900 dark:text-white">
            Total
          </div>
          <div className="text-base font-bold text-gray-900 dark:text-white">
            $351.00
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceInvoicePage;
