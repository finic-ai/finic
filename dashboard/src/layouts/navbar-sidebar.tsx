import { Footer } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import Navbar from "../navigation/navbar";
import Sidebar from "../navigation/sidebar";
import { MdFacebook } from "react-icons/md";
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { SidebarProvider } from "../context/SidebarContext";
import classNames from "classnames";
import Text from "../components/text";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> =
  function ({ children, isFooter = true }) {
    return (
      <SidebarProvider>
        <Navbar />
        <div className="flex items-start pt-1">
          <Sidebar />
          <MainContent isFooter={isFooter}>{children}</MainContent>
        </div>
      </SidebarProvider>
    );
  };

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  return (
    <main
      className={classNames(
        "overflow-y-auto relative w-full h-full bg-gray-50 dark:bg-gray-900",
        "lg:ml-1"
      )}
    >
      {children}
      {isFooter && (
        <div className="mx-4 mt-4">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

const MainContentFooter: FC = function () {
  return (
    <>
      <Footer container>
        <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
          <Footer.LinkGroup>
            <Footer.Link href="#" className="mb-3 mr-3 lg:mb-0">
              Terms and conditions
            </Footer.Link>
            <Footer.Link href="#" className="mb-3 mr-3 lg:mb-0">
              Privacy Policy
            </Footer.Link>
            <Footer.Link href="#" className="mr-3">
              Licensing
            </Footer.Link>
            <Footer.Link href="#" className="mr-3">
              Cookie Policy
            </Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
          <Footer.LinkGroup>
            <div className="flex gap-x-1">
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <MdFacebook className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaInstagram className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaTwitter className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaGithub className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaDribbble className="text-lg" />
              </Footer.Link>
            </div>
          </Footer.LinkGroup>
        </div>
      </Footer>
      <Text className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
        &copy; 2019-2022 Flowbite.com. All rights reserved.
      </Text>
    </>
  );
};

export default NavbarSidebarLayout;
