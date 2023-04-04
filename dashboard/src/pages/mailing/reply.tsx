/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import type { FC } from "react";
import { FaSmile } from "react-icons/fa";
import {
  HiArrowLeft,
  HiChevronLeft,
  HiChevronRight,
  HiClock,
  HiExclamationCircle,
  HiFolder,
  HiOutlineTag,
  HiPaperAirplane,
  HiPaperClip,
  HiPhotograph,
  HiPrinter,
  HiReply,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const MailingReplyPage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <Menu />
      <div className="p-5">
        <div className="mb-4 flex items-center">
          <div className="shrink-0">
            <img
              alt=""
              src="../../images/users/bonnie-green.png"
              className="h-8 w-8 rounded-full"
            />
          </div>
          <div className="ml-4">
            <div className="truncate text-base font-semibold text-gray-900 dark:text-white">
              Bonnie Green
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              email@flowbite.com
            </div>
          </div>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Website Hosting Reviews Free The Best Resource For Hosting Comparison
        </h1>
        <div className="space-y-2">
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Do you know what could beat the exciting feeling of having a new
            computer? Make your own PC easy and compatible!
          </p>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            So insisted received is occasion advanced honoured. Among ready to
            which up. Attacks smiling and may out assured moments man nothing
            outward. Thrown any behind afford either the set depend one temper.
            Instrument melancholy in acceptance collecting frequently be if.
            Zealously now pronounce existence add you instantly say offending.
            Merry their far had widen was. Concerns no in expenses raillery
            formerly.
          </p>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Best Regards,
            <br />
            Bonnie Green, CEO Themesberg LLC
          </p>
        </div>
      </div>
      <SendForm />
    </NavbarSidebarLayout>
  );
};

const Menu: FC = function () {
  return (
    <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
      <div className="flex items-center divide-x divide-gray-100 dark:divide-gray-700">
        <div className="pr-3">
          <a
            href="/mailing/inbox"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Return</span>
            <HiArrowLeft className="text-2xl" />
          </a>
        </div>
        <div className="flex space-x-2 pl-0 sm:px-2">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Save</span>
            <HiClock className="text-2xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Purge</span>
            <HiExclamationCircle className="text-2xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Move</span>
            <HiFolder className="text-2xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Tag</span>
            <HiOutlineTag className="text-2xl" />
          </a>
        </div>
        <div className="pl-3 text-sm font-medium text-gray-500">
          Today, 08:34 AM
        </div>
      </div>
      <div className="hidden space-x-2 divide-x divide-gray-100 pl-0 dark:divide-gray-700 sm:flex sm:px-2">
        <div className="pr-2">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Reply</span>
            <HiReply className="text-2xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Delete</span>
            <HiTrash className="text-2xl" />
          </a>
        </div>
        <div className="pl-2">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <HiChevronLeft className="text-2xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Next</span>
            <HiChevronRight className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

const SendForm: FC = function () {
  return (
    <div className="right-0 bottom-0 w-full border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 lg:fixed lg:pl-64">
      <form className="pb-4 sm:px-4">
        <div className="mb-4">
          <Label htmlFor="reply-to" className="sr-only">
            Reply to
          </Label>
          <TextInput
            id="reply-to"
            name="reply-to"
            defaultValue="email@flowbite.com"
          />
        </div>
        <div>
          <Label htmlFor="reply-message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="reply-message"
            name="reply-message"
            rows={6}
            placeholder="Write text here ..."
          />
        </div>
      </form>
      <div className="items-center dark:divide-gray-700 sm:flex sm:divide-x sm:divide-gray-100 lg:pl-4">
        <div className="mb-3 space-y-3 sm:mb-0 sm:flex sm:space-y-0 sm:space-x-3">
          <Button color="primary" href="/mailing/reply">
            <div className="flex items-center gap-x-2">
              <HiPaperAirplane className="text-xl" />
              Send
            </div>
          </Button>
        </div>
        <div className="flex space-x-1 pl-0 sm:pl-6">
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Add emoji</span>
            <FaSmile className="text-xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Attach</span>
            <HiPaperClip className="text-xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Screenshot</span>
            <HiPhotograph className="text-xl" />
          </a>
          <a
            href="#"
            className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="sr-only">Print</span>
            <HiPrinter className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MailingReplyPage;
