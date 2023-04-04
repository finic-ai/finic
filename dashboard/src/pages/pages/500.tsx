import { Button } from "flowbite-react";
import type { FC } from "react";
import { HiChevronLeft } from "react-icons/hi";

const ServerErrorPage: FC = function () {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <img alt="" src="/images/illustrations/500.svg" className="lg:max-w-md" />
      <h1 className="mb-3 w-4/5 text-center text-2xl font-bold dark:text-white md:text-5xl">
        Something has gone seriously wrong
      </h1>
      <p className="mb-6 w-4/5 text-center text-lg text-gray-500 dark:text-gray-300">
        It's always time for a coffee break. We should be back by the time you
        finish your coffee.
      </p>
      <Button href="/">
        <div className="mr-1 flex items-center gap-x-2">
          <HiChevronLeft className="text-xl" /> Go back home
        </div>
      </Button>
    </div>
  );
};

export default ServerErrorPage;
