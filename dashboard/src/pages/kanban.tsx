/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { Fragment } from "react";
import { useState } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import kanbanBoards from "../data/kanban.json";
import { ReactSortable } from "react-sortablejs";
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import {
  HiArrowsExpand,
  HiClipboard,
  HiClipboardCopy,
  HiEye,
  HiFolder,
  HiPaperClip,
  HiPencilAlt,
  HiPlus,
} from "react-icons/hi";

interface KanbanBoard {
  id: number;
  title: string;
  tasks: KanbanItem[];
}

interface KanbanItem {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  daysLeft: number;
  attachment?: string;
  members: KanbanItemMember[];
}

interface KanbanItemMember {
  id: number;
  name: string;
  avatar: string;
}

const KanbanPage: FC = function () {
  const [list, setList] = useState<KanbanBoard[]>(kanbanBoards);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="mb-6 flex items-start justify-start space-x-4 px-4">
            {list.map((board) => (
              <div key={board.id}>
                <div className="py-4 text-base font-semibold text-gray-900 dark:text-gray-300">
                  {board.title}
                </div>
                <div className="mb-6 space-y-4">
                  <ReactSortable
                    animation={100}
                    forceFallback
                    group="kanban"
                    list={board.tasks}
                    setList={(tasks) =>
                      setList((list) => {
                        const newList = [...list];
                        const index = newList.findIndex(
                          (item) => item.id === board.id
                        );
                        newList[index]!.tasks = tasks;
                        return newList;
                      })
                    }
                  >
                    {board.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="mb-4 w-[28rem] cursor-grab rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between pb-4">
                          <div className="text-base font-semibold text-gray-900 dark:text-white">
                            {task.name}
                          </div>
                          <div className="w-8">
                            <EditCardModal />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          {task.attachment && (
                            <img
                              alt=""
                              src={task.attachment}
                              className="mb-3 rounded-lg"
                            />
                          )}
                          <div className="pb-4 text-sm font-normal text-gray-700 dark:text-gray-400">
                            {task.description}
                          </div>
                          <div className="flex justify-between">
                            <div className="flex items-center justify-start">
                              {task.members.map((member) => (
                                <Fragment key={member.id}>
                                  <a href="#" className="-mr-3">
                                    <img
                                      alt={member.name}
                                      src={`/images/users/${member.avatar}`}
                                      className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
                                    />
                                  </a>
                                  <div className="invisible absolute z-50 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                    {member.name}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                            <div className="flex items-center justify-center rounded-lg bg-purple-100 px-3 text-sm font-medium text-purple-800 dark:bg-purple-200">
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              7 days left
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ReactSortable>
                </div>
                <AddAnotherCardModal />
              </div>
            ))}
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const EditCardModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center rounded-lg border-2 border-transparent py-2 font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <span className="sr-only">Edit card</span>
        <HiPencilAlt className="text-lg" />
      </button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit task</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 text-2xl font-semibold leading-none text-gray-900 dark:text-white">
            Redesign Themesberg Homepage
          </div>
          <div className="mb-5 flex flex-col items-start justify-center space-y-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Added by{" "}
              <a className="cursor-pointer text-primary-700 no-underline hover:underline dark:text-primary-500">
                Bonnie Green
              </a>
              , 22 hours ago
            </div>
            <div className="flex flex-row flex-wrap">
              <div className="flex items-center justify-start">
                <a
                  href="#"
                  data-tooltip-target="bonnie-tooltip"
                  className="-mr-3"
                >
                  <img
                    className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
                    src="../images/users/bonnie-green.png"
                    alt="Bonnie Green"
                  />
                </a>
                <div
                  id="bonnie-tooltip"
                  role="tooltip"
                  className="invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                >
                  Bonnie Green
                </div>
                <a
                  href="#"
                  data-tooltip-target="roberta-tooltip"
                  className="-mr-3"
                >
                  <img
                    className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
                    src="../images/users/roberta-casas.png"
                    alt="Roberta Casas"
                  />
                </a>
                <div
                  id="roberta-tooltip"
                  role="tooltip"
                  className="invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                >
                  Roberta Casas
                </div>
                <a
                  href="#"
                  data-tooltip-target="michael-tooltip"
                  className="-mr-3"
                >
                  <img
                    className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
                    src="../images/users/michael-gough.png"
                    alt="Michael Gough"
                  />
                </a>
                <div
                  id="michael-tooltip"
                  role="tooltip"
                  className="invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                >
                  Michael Gough
                </div>
              </div>
              <Button
                color="gray"
                className="ml-5 font-bold dark:bg-gray-600 [&>*]:py-1"
              >
                <div className="flex items-center gap-x-2 text-xs">
                  <HiPlus />
                  Join
                </div>
              </Button>
              <Button
                color="gray"
                className="ml-3 font-bold dark:bg-gray-600 [&>*]:py-1"
              >
                <div className="flex items-center gap-x-2 text-xs">
                  <HiPaperClip />
                  Attachment
                </div>
              </Button>
            </div>
          </div>
          <div className="mb-2 inline-flex items-center text-center text-lg font-semibold text-gray-900 dark:text-white">
            <svg
              className="mr-1 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              ></path>
            </svg>
            Description
          </div>
          <div className="mb-4 space-y-2 text-base text-gray-500 dark:text-gray-400">
            <p>
              I made some wireframes that we would like you to follow since we
              are building it in Google’s Material Design (Please learn more
              about this and see how to improve standard material design into
              something beautiful). But besides that, you can just do it how you
              like.
            </p>
            <p>
              Next Friday should be done. Next Monday we should deliver the
              first iteration. Make sure, we have a good result to be delivered
              by the day.
            </p>
            <div className="w-max cursor-pointer text-sm font-semibold text-primary-700 hover:underline dark:text-primary-500">
              Show Full Description
            </div>
          </div>
          <div className="mb-4 w-full rounded-lg border border-gray-100 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
            <div className="p-4">
              <label htmlFor="compose-mail" className="sr-only">
                Your comment
              </label>
              <textarea
                id="compose-mail"
                rows={4}
                className="block w-full border-0 bg-gray-100 px-0 text-base text-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                placeholder="Write a comment..."
              ></textarea>
            </div>
            <div className="flex items-center justify-between border-t p-4 dark:border-gray-600">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-primary-700 py-1.5 px-3 text-center text-xs font-semibold text-white hover:bg-primary-800"
              >
                <svg
                  className="mr-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Post comment
              </button>

              <div className="flex space-x-1 pl-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <a href="#" className="shrink-0">
                <img
                  className="h-7 w-7 rounded-full"
                  src="../images/users/michael-gough.png"
                  alt="Micheal Gough"
                />
              </a>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  Micheal Gough
                </p>
                <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                  Product Manager
                </p>
              </div>
              <a
                href="#"
                className="rounded-lg p-1 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </a>
            </div>
            <ul className="list-outside list-disc pl-6 text-xs text-gray-500 dark:text-gray-400">
              <li>
                Latest clicks/conversions. Where you currently have the logo for
                merchant, we should instead have a logo that represent the
                referring traffic sources (ex. Google or Facebook). So we’re
                actually missing a column that should say “Source”. And there
                should be no icon for the merchants.
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="grid w-full grid-cols-5 items-center gap-x-3">
            <Button color="primary" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2">
                <HiClipboard className="text-xl" />
                Save
              </div>
            </Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2">
                <HiArrowsExpand className="text-xl" />
                Move
              </div>
            </Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2">
                <HiClipboardCopy className="text-xl" />
                Copy
              </div>
            </Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2">
                <HiFolder className="text-xl" />
                Archive
              </div>
            </Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2">
                <HiEye className="text-xl" />
                Watch
              </div>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AddAnotherCardModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed border-gray-200 px-5 py-2 font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add another card
      </button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new task</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-4 grid grid-cols-1 gap-y-2">
              <Label htmlFor="taskName">Task name</Label>
              <TextInput
                id="taskName"
                name="taskName"
                placeholder="Redesign homepage"
              />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-y-2">
              <Label htmlFor="description">Enter a description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="On line 672 you ..."
                rows={6}
              />
            </div>
            <div className="flex w-full items-center justify-center">
              <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="text-base">Drop files to upload</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center gap-x-3">
            <Button color="primary" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2">
                <HiPlus className="text-lg" />
                Add card
              </div>
            </Button>
            <Button color="gray" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default KanbanPage;
