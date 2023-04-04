/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import type { FC } from "react";
import { FaSmile } from "react-icons/fa";
import {
  HiArrowLeft,
  HiArrowRight,
  HiChevronLeft,
  HiChevronRight,
  HiPaperClip,
  HiPhotograph,
  HiPrinter,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const MailingComposePage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="flex items-center divide-x divide-gray-100 dark:divide-gray-700">
          <div className="pr-3">
            <a
              href="/mailing/inbox"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Go back</span>
              <HiArrowLeft className="text-2xl" />
            </a>
          </div>
          <div className="flex space-x-2 pl-4 text-gray-500">New Message</div>
        </div>
        <div className="hidden space-x-2 divide-x divide-gray-100 pl-0 dark:divide-gray-700 sm:flex sm:px-2">
          <div className="pr-2">
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
              <HiChevronLeft className="text-3xl" />
            </a>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <HiChevronRight className="text-3xl" />
            </a>
          </div>
        </div>
      </div>
      <form className="right-0 bottom-0 bg-white p-4 pt-8 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 space-y-4 lg:mb-5 lg:pl-4">
          <div>
            <Label htmlFor="message-to" className="sr-only">
              To
            </Label>
            <TextInput id="message-to" name="message-to" placeholder="To" />
          </div>
          <div>
            <Label htmlFor="message-subject" className="sr-only">
              Subject
            </Label>
            <TextInput
              id="message-subject"
              name="message-subject"
              placeholder="Subject"
            />
          </div>
          <div>
            <Label htmlFor="reply-mail" className="sr-only">
              Your message
            </Label>
            <Textarea
              id="reply-mail"
              name="reply-mail"
              placeholder="Write text here ..."
              rows={24}
            />
          </div>
        </div>
        <div className="items-center dark:divide-gray-700 sm:flex sm:divide-x sm:divide-gray-100 lg:pl-4">
          <div className="mb-3 space-y-3 sm:mb-0 sm:flex sm:space-y-0">
            <Button color="primary" type="submit">
              <div className="flex items-center gap-x-2">
                Send <HiArrowRight className="text-lg" />
              </div>
            </Button>
          </div>
          <div className="flex space-x-1 pl-0 sm:pl-6">
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Add emoji</span>
              <FaSmile className="text-2xl" />
            </a>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Attach</span>
              <HiPaperClip className="text-2xl" />
            </a>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Screenshot</span>
              <HiPhotograph className="text-2xl" />
            </a>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Print</span>
              <HiPrinter className="text-2xl" />
            </a>
          </div>
        </div>
      </form>
    </NavbarSidebarLayout>
  );
};

export default MailingComposePage;
