import { Button } from "flowbite-react";
import type { FC } from "react";
import { HiChevronLeft } from "react-icons/hi";

const NotFoundPage: FC = function () {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <img alt="" src="/images/illustrations/404.svg" className="lg:max-w-md" />
      <h1 className="mb-6 text-2xl font-bold dark:text-white md:text-5xl">
        Page not found
      </h1>
      <p className="mb-6 w-4/5 text-center text-lg text-gray-500 dark:text-gray-300">
        Oops! Looks like you followed a bad link. If you think this is a problem
        with us, please tell us.
      </p>
      <Button href="/">
        <div className="mr-1 flex items-center gap-x-2">
          <HiChevronLeft className="text-xl" /> Go back home
        </div>
      </Button>
    </div>
  );
};

export default NotFoundPage;
