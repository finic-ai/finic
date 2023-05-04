/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Footer, Label, Navbar, ToggleSwitch } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { HiOutlineLogin } from "react-icons/hi";

const PricingPage: FC = function () {
  const [isYearly, setYearly] = useState(false);

  return (
    <>
      <ExampleNavbar />
      <div className="dark:bg-gray-900">
        <div className="container mx-auto px-4 pt-32 dark:bg-gray-900 lg:px-0">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl sm:leading-none sm:tracking-tight">
            Our pricing plan made simple
          </h1>
          <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
            All types of businesses need access to development resources, so we
            give you the option to decide how much you need to use.
          </p>
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900 dark:text-white">
              Monthly
            </span>
            <div className="mx-3">
              <Label htmlFor="yearly" className="sr-only">
                Toggle yearly prices
              </Label>
              <ToggleSwitch
                checked={isYearly}
                id="yearly"
                label=""
                name="yearly"
                onChange={() => setYearly(!isYearly)}
              />
            </div>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              Yearly
            </span>
          </div>
          <section className="grid grid-cols-1 space-y-12 pt-9 lg:grid-cols-3 lg:gap-x-6 lg:space-y-0 xl:gap-8">
            <div className="flex flex-col rounded-lg bg-white p-6 shadow dark:bg-gray-800 xl:p-8">
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-semibold text-gray-500 dark:text-gray-400">
                  Freelancer
                </h3>
                <div className="mb-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-3xl font-semibold dark:text-white">
                    $
                  </span>
                  <span className="text-5xl font-extrabold tracking-tight dark:text-white">
                    49
                  </span>
                  <span className="ml-1 text-2xl font-normal text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  Great for personal use and for your side projects.
                </p>
                <ul className="my-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Everything you need to manage payments
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      No setup fees, monthly fees, or hidden fees
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Comprehensive & rigorous compliance
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Get hundreds of feature updates each year
                    </span>
                  </li>

                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Predictable payouts to your bank accounts
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Financial reconciliation and reporting
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      24×7 phone, chat, and email support
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Robust developer platform and third-party integrations
                    </span>
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="rounded-lg bg-primary-700 py-2.5 px-5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Choose plan
              </a>
            </div>
            <div className="flex flex-col rounded-lg bg-white p-6 shadow dark:bg-gray-800 xl:p-8">
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-semibold text-gray-500 dark:text-gray-400">
                  Company
                </h3>
                <div className="mb-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-3xl font-semibold dark:text-white">
                    $
                  </span>
                  <span className="text-5xl font-extrabold tracking-tight dark:text-white">
                    299
                  </span>
                  <span className="ml-1 text-2xl font-normal text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  Great for personal use and for your side projects.
                </p>
                <ul className="my-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Everything you need to manage payments
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      No setup fees, monthly fees, or hidden fees
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Comprehensive & rigorous compliance
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Get hundreds of feature updates each year
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Predictable payouts to your bank accounts
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Financial reconciliation and reporting
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      24×7 phone, chat, and email support
                    </span>
                  </li>
                  <li className="flex space-x-3 line-through">
                    <svg
                      className="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-500">
                      Robust developer platform and third-party integrations
                    </span>
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="rounded-lg bg-primary-700 py-2.5 px-5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Choose plan
              </a>
            </div>
            <div className="flex flex-col rounded-lg bg-white p-6 shadow dark:bg-gray-800 xl:p-8">
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-semibold text-gray-500 dark:text-gray-400">
                  Enterprise
                </h3>
                <div className="mb-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-3xl font-semibold dark:text-white">
                    $
                  </span>
                  <span className="text-5xl font-extrabold tracking-tight dark:text-white">
                    2999
                  </span>
                  <span className="ml-1 text-2xl font-normal text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  Great for personal use and for your side projects.
                </p>
                <ul className="my-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Everything you need to manage payments
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      No setup fees, monthly fees, or hidden fees
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Comprehensive & rigorous compliance
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Get hundreds of feature updates each year
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Predictable payouts to your bank accounts
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Financial reconciliation and reporting
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      24×7 phone, chat, and email support
                    </span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                    </svg>
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Robust developer platform and third-party integrations
                    </span>
                  </li>
                </ul>
              </div>
              <a
                href="#"
                className="rounded-lg bg-primary-700 py-2.5 px-5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Choose plan
              </a>
            </div>
          </section>
          <section className="flex flex-col pt-20">
            <div className="overflow-x-auto rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow sm:rounded-lg">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th scope="col" className="p-4 text-left">
                          <span className="sr-only">Feature</span>
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-right text-base font-semibold tracking-wider text-gray-900 dark:text-white"
                        >
                          Freelancer
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-right text-base font-semibold tracking-wider text-gray-900 dark:text-white"
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-right text-base font-semibold tracking-wider text-gray-900 dark:text-white"
                        >
                          Enterprise
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      <tr>
                        <td className="whitespace-nowrap rounded-l-lg p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Seperate business/personal
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Estimate tax payments
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap rounded-l-lg p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Stock control
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Create invoices & estimates
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap rounded-l-lg p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Manage bills & payments
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Run payroll
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap rounded-l-lg p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Handle multiple currencies
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
                        <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Number of Users
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-1">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="text-xs font-medium sm:text-sm md:text-base">
                              1 User
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-1">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                            </svg>
                            <span className="text-xs font-medium sm:text-sm md:text-base">
                              5-10 Users
                            </span>
                          </div>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <div className="flex items-center justify-end space-x-1">
                            <svg
                              className="h-5 w-5 "
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                            </svg>
                            <span className="text-xs font-medium sm:text-sm md:text-base">
                              20+ Users
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap rounded-l-lg p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Track deductible mileage
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Track employee time
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap rounded-l-lg p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                          Multi-device
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                        <td className="rounded-r-lg p-4">
                          <svg
                            className="ml-auto h-5 w-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          <section className="pt-20">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-5xl sm:leading-none sm:tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400 sm:text-xl">
              All types of businesses need access to development resources, so
              we give you the option to decide how much you need to use.
            </p>
            <hr className="my-6 border-gray-200 dark:border-gray-800 md:my-12" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    What do you mean by "Figma assets"?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You will have access to download the full Figma project
                    including all of the pages, the components, responsive
                    pages, and also the icons, illustrations, and images
                    included in the screens.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    What does "lifetime access" exactly mean?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Once you have purchased either the design, code, or both
                    packages, you will have access to all of the future updates
                    based on the roadmap, free of charge.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    How does support work?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    We're aware of the importance of well qualified support,
                    that is why we decided that support will only be provided by
                    the authors that actually worked on this project.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Feel free to&nbsp;
                    <a
                      href="#"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                      target="_blank"
                      rel="noreferrer"
                    >
                      contact us
                    </a>
                    &nbsp;and we'll help you out as soon as we can.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    I want to build more than one project with FlowBite. Is that
                    allowed?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    You can use FlowBite for an unlimited amount of projects,
                    whether it's a personal website, a SaaS app, or a website
                    for a client. As long as you don't build a product that will
                    directly compete with FlowBite either as a UI kit, theme, or
                    template, it's fine.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Find out more information by&nbsp;
                    <a
                      href="/license"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      reading the license
                    </a>
                    .
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    What does "free updates" include?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    The free updates that will be provided is based on the{" "}
                    <a
                      href="#"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      roadmap
                    </a>
                    &nbsp;that we have laid out for this project. It is also
                    possible that we will provide extra updates outside of the
                    roadmap as well.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    What does the free version include?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    The&nbsp;
                    <a
                      href="#"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      free version
                    </a>
                    &nbsp;of FlowBite includes a minimal style guidelines,
                    component variants, and a dashboard page with the mobile
                    version alongside it.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    You can use this version for any purposes, because it is
                    open-source under the MIT license.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    What is the difference between FlowBite and Tailwind UI?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Although both FlowBite and Tailwind UI are built for
                    integration with Tailwind CSS, the main difference is in the
                    design, the pages, the extra components and UI elements that
                    FlowBite includes.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Additionally, FlowBite is a project that is still in
                    development, and later it will include both the application,
                    marketing, and e-commerce UI interfaces.
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    How do I purchase a license for my entire team?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    You can purchase a license that you can share with your
                    entire team here:
                  </p>
                  <ul className="mb-4 list-disc pl-4">
                    <li className="mb-2 text-gray-600">
                      <span className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500">
                        Figma Files - Buy a team license for $299 USD
                      </span>
                    </li>
                    <li className="mb-2 text-gray-600">
                      <span className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500">
                        Figma Files + Tailwind CSS code pre-order - Buy a team
                        license for <del>$699</del> $559 USD
                      </span>
                    </li>
                    <li className="mb-4 text-gray-600 dark:text-gray-400">
                      <span className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500">
                        Tailwind CSS code pre-order - Buy a team license for{" "}
                        <del>$399</del> $319 USD
                      </span>
                    </li>
                  </ul>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Please use a single account to share with your team to
                    access the download files.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Can I build/sell templates or themes using FlowBite?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    It is not allowed to use FlowBite or parts of the project to
                    build themes, templates, UI kits, or page builders.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Find out more information by{" "}
                    <a
                      href="/license"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      reading the license
                    </a>
                    .
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Can I use FlowBite in open-source projects?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Generally, it is accepted to use FlowBite in open-source
                    projects, as long as it is not a UI library, a theme, a
                    template, a page-builder that would be considered as an
                    alternative to FlowBite itself.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    With that being said, feel free to use this design kit for
                    your open-source projects.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Find out more information by{" "}
                    <a
                      href="/license"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      reading the license
                    </a>
                    .
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Can I use FlowBite for commercial purposes?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Absolutely! You can use this design kit to build any type of
                    commercial business, whether it's a SaaS, an e-commerce app,
                    an application UI.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    As long as it is not a design resource that you will
                    re-sell, it is alright to use it for commercial purposes.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Find out more information by{" "}
                    <a
                      href="/license"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      reading the license
                    </a>
                    .
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Can I get an invoice?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    After opening the checkout process, you will be able to add
                    all of your personal or company information that you want to
                    be available on the invoice. After the purchase, you will
                    get an email with the invoice.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    If you forgot to complete the information, or you didn't get
                    the invoice by email, feel free to{" "}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href="#"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      contact us
                    </a>
                    &nbsp;and help you out with the invoice.
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    When will I get access to the Tailwind CSS code if I
                    pre-ordered it?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    The official date that we have set out to release the code
                    version of FlowBite is the{" "}
                    <span className="font-medium text-gray-900">
                      25th of September, 2021
                    </span>
                    . We are already working on the integration and if you have
                    a pre-order, you will also get frequent updates about the
                    progress.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    You'll be one of the first to know when it will be
                    available.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    What is your refund policy?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    If you are unhappy with your purchase, just{" "}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href="#"
                      className="font-medium text-primary-600 underline hover:no-underline dark:text-primary-500"
                    >
                      contact us
                    </a>
                    &nbsp;within 30 days and we'll issue a full refund.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Is it allowed to use the design assets, such as the fonts,
                    icons, and illustrations?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    What you see is what you get. Which means that all icons,
                    fonts, and illustrations can be used based on the licensing
                    that we researched or purchased. For example, we purchased
                    rights to use the illustrations in Flowbite.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Where can I access my download files?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    After you purchased one of the plans, you will get two
                    emails: one for the invoice, and another one with the
                    download files.
                  </p>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Soon we will create a way that you will be able to access
                    the download files from the FlowBite dashboard from this
                    website.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    I have a company registered for VAT. Where can I add the VAT
                    for the invoice?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    After initializing the checkout process from Paddle, you
                    will be able to see a text "Add VAT code". Click on that,
                    and add the VAT code for your company. This will also remove
                    the extra VAT tax from the purchase.
                  </p>
                </div>
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                    Why would I pre-order the Tailwind CSS code?
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    If you decide to pre-order the Tailwind CSS code, which will
                    arrive on the 25th of September 2021, you can get a base 20%
                    price reduction and purchase it only for $119, instead of
                    $149.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ExampleFooter />
    </>
  );
};

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid className="p-6">
      <div className="flex items-center gap-x-9">
        <Navbar.Brand href="/">
          <img alt="" src="/images/logo.svg" className="mr-3 h-6 sm:h-9" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Flowbite
          </span>
        </Navbar.Brand>
        <Navbar.Collapse>
          <Navbar.Link href="/" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">Team</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>
      </div>
      <div className="flex">
        <Button>
          <HiOutlineLogin className="mr-3 text-lg" /> Login/Register
        </Button>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

const ExampleFooter: FC = function () {
  return (
    <Footer className="!justify-center rounded-none lg:pt-16">
      <div className="flex w-[95%] flex-col justify-center">
        <div className="grid w-full grid-cols-2 gap-8 py-8 px-6 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <img
                alt="Flowbite logo"
                src="/images/logo.svg"
                className="h-6 sm:h-9"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Flowbite
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-300">
              Flowbite is a UI library of elements & components based on
              Tailwind CSS that can get you started building websites faster and
              more efficiently.
            </p>
          </div>
          <div>
            <Footer.Title title="Resources" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Themesberg</Footer.Link>
              <Footer.Link href="#">Figma</Footer.Link>
              <Footer.Link href="#">Tailwind CSS</Footer.Link>
              <Footer.Link href="#">Blog</Footer.Link>
              <Footer.Link href="#">Affiliate program</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Help and Support" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Contact us</Footer.Link>
              <Footer.Link href="#">Knowledge Center</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Follow Us" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Github</Footer.Link>
              <Footer.Link href="#">Twitter</Footer.Link>
              <Footer.Link href="#">Facebook</Footer.Link>
              <Footer.Link href="#">LinkedIn</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Legal" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Privacy policy</Footer.Link>
              <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              <Footer.Link href="#">EULA</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
        <div className="flex items-center">
          <Footer.Divider />
        </div>
        <div className="w-full px-4 pb-24 sm:flex sm:items-center sm:justify-center">
          <Footer.Copyright
            by="Themesberg. All Rights Reserved."
            href="#"
            year={2022}
          />
        </div>
      </div>
    </Footer>
  );
};

export default PricingPage;
