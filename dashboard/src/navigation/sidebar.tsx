/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiKey,
  HiLink,
  HiBeaker,
  HiQuestionMarkCircle,
  HiCog,
  HiPlay,
  HiCloudDownload,
  HiSparkles
} from "react-icons/hi";
import { FaGithub, FaReadme } from "react-icons/fa";

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";

const DashboardSidebar: FC = function () {
  const {
    isOpenOnSmallScreens: isSidebarOpenOnSmallScreens,
    isPageWithSidebar
  } = useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");
  const [isConnectorsOpen, setEcommerceOpen] = useState(true);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
    setEcommerceOpen(newPage.includes("/connectors/"));
  }, [setCurrentPage, setEcommerceOpen]);

  if (!isPageWithSidebar) {
    return null;
  }

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            {/* <form className="pb-3 md:hidden">
              <TextInput
                icon={HiSearch}
                type="search"
                placeholder="Search"
                required
                size={32}
              />
            </form> */}
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/onboarding" icon={HiSparkles}>
                  First Steps
                </Sidebar.Item>
                <Sidebar.Item href="/create-connection" icon={HiPlay}>
                  Create Connection
                </Sidebar.Item>
                <Sidebar.Collapse
                  icon={HiLink}
                  label="Connector Status"
                  open={isConnectorsOpen}
                >
                  <Sidebar.Item
                    href="/connectors/notion"
                    className={
                      "/connectors/notion" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Notion
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/github"
                    className={
                      "/connectors/google-drive" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Github
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/google-drive"
                    className={
                      "/connectors/google-drive" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Google Drive
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/gmail"
                    className={
                      "/connectors/gmail" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Gmail
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/zendesk"
                    className={
                      "/connectors/zendesk" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Zendesk
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/confluence"
                    className={
                      "/connectors/confluence" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Confluence
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/slack"
                    className={
                      "/connectors/slack" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Slack
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/dropbox"
                    className={
                      "/connectors/dropbox" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Dropbox
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/intercom"
                    className={
                      "/connectors/intercom" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Intercom
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/hubspot"
                    className={
                      "/connectors/hubspot" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Hubspot
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/salesforce"
                    className={
                      "/connectors/salesforce" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Salesforce
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/readme"
                    className={
                      "/connectors/readme" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Readme
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/website"
                    className={
                      "/connectors/website" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Website
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="/connectors/sharepoint"
                    className={
                      "/connectors/sharepoint" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Sharepoint
                  </Sidebar.Item>
                </Sidebar.Collapse>
                {/* <Sidebar.Item
                  href="/vectorstore"
                  icon={HiDatabase}
                >
                  Vector Store
                </Sidebar.Item> */}
                <Sidebar.Item href="/syncs" icon={HiCloudDownload}>
                  Syncs
                </Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                {/* <Sidebar.Item
                  href="/query"
                  icon={FaRobot}
                >
                  Query
                </Sidebar.Item> */}
                <Sidebar.Item href="/api-keys" icon={HiKey}>
                  API Key
                </Sidebar.Item>
                <Sidebar.Item href="/settings" icon={HiCog}>
                  Settings
                </Sidebar.Item>
                <Sidebar.Item
                  href="https://github.com/psychicapi/psychic"
                  target="_blank"
                  icon={FaGithub}
                >
                  GitHub
                </Sidebar.Item>
                <Sidebar.Item
                  href="https://docs.psychic.dev"
                  target="_blank"
                  icon={FaReadme}
                >
                  Docs
                </Sidebar.Item>

                <Sidebar.Item
                  href="https://docs.psychic.dev/api-reference/endpoint/get-documents"
                  icon={HiBeaker}
                  target="_blank"
                >
                  API Playground
                </Sidebar.Item>
                <Sidebar.Item
                  href="https://join.slack.com/t/psychicapi/shared_invite/zt-1yptnhwcz-SiOCnrbqnBDsuzps9sEMSw"
                  icon={HiQuestionMarkCircle}
                  target="_blank"
                >
                  Support
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
          <BottomMenu />
        </div>
      </Sidebar>
    </div>
  );
};

const BottomMenu: FC = function () {
  return (
    <div className="flex items-center justify-center gap-x-5">
      {/* <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
        <span className="sr-only">Tweaks</span>
        <HiAdjustments className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
      </button>
      <div>
        <Tooltip content="Settings page">
          <a
            href="/users/settings"
            className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Settings page</span>
            <HiCog className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
          </a>
        </Tooltip>
      </div>
      <div>
        <LanguageDropdown />
      </div> */}
    </div>
  );
};

export default DashboardSidebar;
