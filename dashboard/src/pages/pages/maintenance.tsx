/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from "flowbite-react";
import type { FC } from "react";
import { HiChevronLeft } from "react-icons/hi";

const MaintenancePage: FC = function () {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <img
        alt=""
        src="/images/illustrations/maintenance.svg"
        className="lg:max-w-md"
      />
      <h1 className="mt-6 mb-3 w-4/5 text-center text-4xl font-bold dark:text-white">
        Under Maintenance
      </h1>
      <p className="mb-6 w-4/5 text-center text-lg text-gray-500 dark:text-gray-300">
        Sorry for the inconvenience but we're performing some maintenance at the
        moment. If you need to you can always&nbsp;
        <a href="#" className="text-primary-700 dark:text-primary-300">
          contact us
        </a>
        , otherwise we'll be back online shortly!
      </p>
      <Button href="/">
        <div className="mr-1 flex items-center gap-x-2">
          <HiChevronLeft className="text-xl" /> Go back home
        </div>
      </Button>
    </div>
  );
};

export default MaintenancePage;
