/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Sidebar, Tooltip } from "flowbite-react";
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
} from "react-icons/hi";
import {FaGithub, FaReadme} from "react-icons/fa"

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";

const ExampleSidebar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");
  const [isConnectorsOpen, setEcommerceOpen] = useState(true);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
    setEcommerceOpen(newPage.includes("/connectors/"));
  }, [setCurrentPage, setEcommerceOpen]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
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
                <Sidebar.Collapse
                  icon={HiLink}
                  label="Connectors"
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
                  <Tooltip content="Coming Soon" trigger="hover">
                    <Sidebar.Item
                      href="/connectors/website"
                      className="pointer-events-none text-gray-400"
                    >
                      Website
                    </Sidebar.Item>
                  </Tooltip>
                  {/* <Sidebar.Item
                    href="/connectors/website"
                    className={
                      "/connectors/website" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Website
                  </Sidebar.Item> */}
                </Sidebar.Collapse>
                <Sidebar.Item
                  href="/playground"
                  icon={HiPlay}
                >
                  Playground
                </Sidebar.Item>
                {/* <Sidebar.Item
                  href="/vectorstore"
                  icon={HiDatabase}
                >
                  Vector Store
                </Sidebar.Item> */}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                {/* <Sidebar.Item
                  href="/query"
                  icon={FaRobot}
                >
                  Query
                </Sidebar.Item> */}
                <Sidebar.Item
                  href="/api-keys"
                  icon={HiKey}
                >
                  API Key
                </Sidebar.Item>
                <Sidebar.Item
                  href="/syncs"
                  icon={HiCloudDownload}
                >
                  Syncs
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
                  href="https://sidekick-ezml2kwdva-uc.a.run.app/docs"
                  icon={HiBeaker}
                  target="_blank"
                >
                  API Testing
                </Sidebar.Item>
                <Sidebar.Item
                  href="/settings"
                  icon={HiCog}
                >
                  Settings
                </Sidebar.Item>
                <Sidebar.Item
                  href="https://join.slack.com/t/psychicapi/shared_invite/zt-1ty1wz6w0-8jkmdvBpM5kj_Fh30EiCcg"
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

export default ExampleSidebar;
