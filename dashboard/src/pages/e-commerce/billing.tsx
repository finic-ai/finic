/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Label,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const EcommerceBillingPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="mb-6 grid grid-cols-1 gap-y-6 px-4 pt-6 dark:border-gray-700 dark:bg-gray-900 xl:grid-cols-2 xl:gap-4">
        <div className="col-span-full">
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
            <Breadcrumb.Item>Billing</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Billing
          </h1>
        </div>
        <IntroCard />
        <OrderHistoryCard />
      </div>
      <div className="grid grid-cols-1 gap-y-6 px-4">
        <GeneralInfoCard />
        <CardDetailsCard />
      </div>
    </NavbarSidebarLayout>
  );
};

const IntroCard: FC = function () {
  return (
    <Card>
      <a
        href="#"
        className="flex items-center text-2xl font-bold dark:text-white"
      >
        <img alt="" src="../../images/logo.svg" className="mr-4 h-11" />
        <span>Flowbite</span>
      </a>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Switch your subscription to a different type, such as a monthly plan,
        annual plan, or student plan. And see a list of subscription plans that
        Flowbite offers.
      </p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        Next payment of $36 (yearly) occurs on August 13, 2020.
      </p>
      <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-3">
        <div>
          <a
            href="#"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 py-2.5 px-5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Change Plan
          </a>
        </div>
        <div>
          <a
            href="#"
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
          >
            Cancel Subscription
          </a>
        </div>
      </div>
    </Card>
  );
};

const OrderHistoryCard: FC = function () {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Order History
        </h3>
        <div className="shrink-0">
          <a
            className="rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
            href="#"
          >
            View all
          </a>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Transaction</Table.HeadCell>
                  <Table.HeadCell>Date &amp; Time</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from&nbsp;
                      <span className="font-semibold">Bonnie Green</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 23 ,2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $2300
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="bg-gray-50 dark:bg-gray-700">
                    <Table.Cell className="whitespace-nowrap rounded-l-lg p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment refund to&nbsp;
                      <span className="font-semibold">#00910</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 23 ,2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      -$670
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap rounded-r-lg p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 pb-0 text-sm font-normal text-gray-900 dark:text-white">
                      Payment failed from&nbsp;
                      <span className="font-semibold">#087651</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 pb-0 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 18, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 pb-0 text-sm font-semibold text-gray-900 dark:text-white">
                      $234
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4 pb-0">
                      <Badge color="failure">Cancelled</Badge>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const GeneralInfoCard: FC = function () {
  return (
    <Card>
      <h3 className="mb-4 text-xl font-bold dark:text-white">
        General Information
      </h3>
      <form>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-1 grid grid-cols-1 gap-y-3">
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <TextInput
                id="first-name"
                name="first-name"
                placeholder="Bonnie"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="organization">Organization</Label>
              <TextInput
                id="organization"
                name="organization"
                placeholder="Company name"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="department">Department</Label>
              <TextInput
                id="department"
                name="department"
                placeholder="Development"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="city">City</Label>
              <TextInput
                id="city"
                name="city"
                placeholder="eg., San Francisco"
                required
              />
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-y-3">
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <TextInput
                id="last-name"
                name="last-name"
                placeholder="Green"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="role">Role</Label>
              <TextInput
                id="role"
                name="role"
                placeholder="React Developer"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="country">Country</Label>
              <TextInput
                id="country"
                name="country"
                placeholder="United States"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                name="email"
                placeholder="example@company.com"
                required
              />
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-y-2">
            <Label htmlFor="info">Info</Label>
            <Textarea
              id="info"
              name="info"
              placeholder="Receipt Info (optional)"
              rows={12}
            />
          </div>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </Card>
  );
};

const CardDetailsCard: FC = function () {
  return (
    <Card>
      <h3 className="mb-4 text-xl font-bold dark:text-white">Card Details</h3>
      <form>
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="grid grid-cols-1 gap-y-2">
            <Label htmlFor="full-name">(Full name as displayed on card)*</Label>
            <TextInput
              id="full-name"
              name="full-name"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-y-2">
            <Label htmlFor="card-number">Card Number *</Label>
            <TextInput
              id="card-number"
              name="card-number"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-y-2">
            <Label htmlFor="cvc">CVC *</Label>
            <TextInput id="cvc" name="cvc" placeholder="•••" required />
          </div>
          <div className="grid grid-cols-1 gap-y-2">
            <Label htmlFor="zip">Postal / ZIP code (optional)</Label>
            <TextInput id="zip" name="zip" placeholder="e.g. 12345" required />
          </div>
        </div>
        <Button color="primary">Update</Button>
      </form>
    </Card>
  );
};

export default EcommerceBillingPage;
