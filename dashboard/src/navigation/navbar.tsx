/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { DarkThemeToggle, Navbar } from "flowbite-react";
import { HiMenuAlt1, HiSearch, HiX } from "react-icons/hi";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import supabase from "../lib/supabaseClient";

const ExampleNavbar: FC = function () {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/images/Horizontal_Logo_light.svg"
                className="dark:hidden mr-3 h-8"
              />
              <img
                alt=""
                src="/images/Horizontal_Logo_dark.svg"
                className="hidden dark:block mr-3 h-8"
              />
            </Navbar.Brand>
            {/* <form className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                size={32}
                type="search"
              />
            </form> */}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <DarkThemeToggle />

              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-white border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold py-2 px-4 rounded"
              >
                <div className="flex items-center gap-x-3">Log out</div>
              </button>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
