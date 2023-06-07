/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Tabs
  } from "flowbite-react";
import { FC } from "react";
import { useState } from "react";
import {usePsychicLink} from "@psychic-api/link";
import { usePostHog } from 'posthog-js/react'

import {
  HiHome,
} from "react-icons/hi";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { useUserStateContext } from "../context/UserStateContext";
import { ConnectorPlayground } from "./playground";

const OnboardingPage: FC = function () {

  const {appId} = useUserStateContext()
      

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
              <Breadcrumb.Item>First Steps</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex-col items-center space-y-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                First Steps
              </h1>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Step 1: Connect a data source
                </h2>
                <ConnectorPlayground bearer={appId} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Step 2: Load documents from your data source
                </h2>
                <p>Ask questions the data source you just connected using a LLM</p>
                <p>Your Psychic secret key (keep this private): </p>
                <Tabs.Group style="underline">
                    <Tabs.Item active title="Using LangChain">

                    </Tabs.Item>
                    <Tabs.Item active title="Using LlamaIndex">

                    </Tabs.Item>
                    <Tabs.Item active title="Using the API">

                    </Tabs.Item>
                </Tabs.Group>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Step 3: Connect more data sources with Psychic Link
                </h2>
                <p>Psychic Link can be added to any React application to let your users connect their own data sources.</p>
                <p>You can then load these documents just like you did with your own documents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default OnboardingPage;
  