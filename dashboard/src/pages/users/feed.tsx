/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card } from "flowbite-react";
import type { FC } from "react";
import { HiBriefcase, HiDotsVertical, HiHeart, HiMap } from "react-icons/hi";
import { MdComment } from "react-icons/md";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const UserFeedPage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="relative grid grid-cols-1 overflow-y-hidden xl:h-[calc(100vh-4rem)] xl:grid-cols-4 xl:gap-4">
        <UserProfile />
        <UserFeed />
      </div>
    </NavbarSidebarLayout>
  );
};

const UserProfile: FC = function () {
  return (
    <div className="py-6 px-4 xl:sticky xl:mb-0 xl:pb-0">
      <div className="sm:flex sm:space-x-4 xl:block xl:space-x-0">
        <img
          className="mb-2 h-20 w-20 rounded-lg"
          src="../../images/users/jese-leos-2x.png"
          alt="Jese portrait"
        />
        <div>
          <h2 className="text-xl font-bold dark:text-white">Jese Leos</h2>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <HiBriefcase className="mr-2 text-lg text-gray-900" />
              Front-end Developer
            </li>
            <li className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <HiMap className="mr-2 text-lg text-gray-900" />
              San Francisco, USA
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-6 sm:flex xl:block xl:space-y-4">
        <div className="sm:flex-1">
          <address className="text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
            <div className="mt-4">Email address</div>
            <a
              className="text-sm font-medium text-gray-900 dark:text-white"
              href="mailto:webmaster@flowbite.com"
            >
              yourname@flowbite.com
            </a>
            <div className="mt-4">Home address</div>
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              92 Miles Drive, Newark, NJ 07103, California, <br />
              United States of America
            </div>
            <div className="mt-4 dark:text-gray-400">Phone number</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              +00 123 456 789 / +12 345 678
            </div>
          </address>
        </div>
      </div>
      <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">
        Software Skill
      </h3>
      <div className="mt-0 flex space-x-3">
        <svg
          className="h-6 w-6"
          viewBox="0 0 17 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.1558 0.559692H1.51087C0.676432 0.559692 0 1.23742 0 2.07346V15.7446C0 16.5806 0.676432 17.2583 1.51087 17.2583H15.1558C15.9902 17.2583 16.6667 16.5806 16.6667 15.7446V2.07346C16.6667 1.23742 15.9902 0.559692 15.1558 0.559692Z"
            fill="#DC395F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.58437 4.80783C6.58437 5.37806 6.12024 5.81314 5.56621 5.81314C5.01217 5.81314 4.54817 5.378 4.54817 4.80783C4.54817 4.23799 5.01217 3.80298 5.56621 3.80298C6.12024 3.80298 6.58437 4.23799 6.58437 4.80783ZM3.36574 11.9506C3.36574 11.726 3.39575 11.4506 3.45558 11.1956H3.45565L4.21913 8.07017H3.03638L3.39575 6.74185H6.24055L5.1175 11.2051C5.04263 11.4903 5.01268 11.7269 5.01268 11.8916C5.01268 12.1771 5.15292 12.2605 5.37219 12.3101C5.50572 12.34 6.56971 12.3191 7.14895 11.029L7.88658 8.07017H6.68872L7.0481 6.74185H9.60826L9.27896 8.24995C9.72805 7.40973 10.6265 6.61139 11.5098 6.61139C12.4531 6.61139 13.2317 7.28469 13.2317 8.57479C13.2317 8.90471 13.1867 9.2638 13.067 9.66874L12.5878 11.3933C12.543 11.5737 12.5129 11.7235 12.5129 11.8585C12.5129 12.1584 12.6327 12.3083 12.8573 12.3083C13.0819 12.3083 13.3664 12.1429 13.6958 11.2284L14.3546 11.4832C13.9652 12.8483 13.2616 13.4181 12.3782 13.4181C11.345 13.4181 10.8511 12.8035 10.8511 11.9631C10.8511 11.7233 10.8809 11.4681 10.9558 11.213L11.4499 9.44292C11.5098 9.24782 11.5248 9.06798 11.5248 8.90289C11.5248 8.33305 11.1805 7.98786 10.6265 7.98786C9.92271 7.98786 9.45858 8.49397 9.219 9.46901L8.26067 13.3201H6.58391L6.88488 12.1099C6.39198 12.9211 5.70741 13.4235 4.86301 13.4235C3.84484 13.4235 3.36574 12.8359 3.36574 11.9506Z"
            fill="white"
          />
        </svg>
        <svg
          className="h-6 w-6"
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.297 0.762876L8.9845 0.259155L13.672 0.762876L17.301 5.71471L8.9845 15.5586L0.667969 5.71471L4.297 0.762876Z"
            fill="#FDB300"
          />
          <path
            d="M4.03524 5.71497L8.98317 15.5589L0.666626 5.71497H4.03524Z"
            fill="#EA6C00"
          />
          <path
            d="M13.929 5.71497L8.98107 15.5589L17.2976 5.71497H13.929Z"
            fill="#EA6C00"
          />
          <path
            d="M4.03467 5.71497H13.9305L8.9826 15.5589L4.03467 5.71497Z"
            fill="#FDAD00"
          />
          <path
            d="M8.98272 0.259277L4.2952 0.762992L4.03479 5.71483L8.98272 0.259277Z"
            fill="#FDD231"
          />
          <path
            d="M8.98164 0.259277L13.6692 0.762992L13.9296 5.71483L8.98164 0.259277Z"
            fill="#FDD231"
          />
          <path
            d="M17.2987 5.71453L13.6696 0.762695L13.9301 5.71453H17.2987Z"
            fill="#FDAD00"
          />
          <path
            d="M0.666626 5.71453L4.29565 0.762695L4.03524 5.71453H0.666626Z"
            fill="#FDAD00"
          />
          <path
            d="M8.98272 0.259277L4.03479 5.71483H13.9306L8.98272 0.259277Z"
            fill="#FEEEB7"
          />
        </svg>
        <svg
          className="h-6 w-6"
          viewBox="0 0 12 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.07892 17.2564C4.61226 17.2564 5.8567 16.0098 5.8567 14.4738V11.6913H3.07892C1.54559 11.6913 0.301147 12.9379 0.301147 14.4738C0.301147 16.0098 1.54559 17.2564 3.07892 17.2564Z"
            fill="#0ACF83"
          />
          <path
            d="M0.301147 8.90901C0.301147 7.37305 1.54559 6.12646 3.07892 6.12646H5.8567V11.6916H3.07892C1.54559 11.6916 0.301147 10.445 0.301147 8.90901Z"
            fill="#A259FF"
          />
          <path
            d="M0.301025 3.34407C0.301025 1.8081 1.54547 0.561523 3.0788 0.561523H5.85658V6.12662H3.0788C1.54547 6.12662 0.301025 4.88004 0.301025 3.34407Z"
            fill="#F24E1E"
          />
          <path
            d="M5.85718 0.561523H8.63495C10.1683 0.561523 11.4127 1.8081 11.4127 3.34407C11.4127 4.88003 10.1683 6.12661 8.63495 6.12661H5.85718V0.561523Z"
            fill="#FF7262"
          />
          <path
            d="M11.4127 8.90901C11.4127 10.445 10.1683 11.6916 8.63495 11.6916C7.10162 11.6916 5.85718 10.445 5.85718 8.90901C5.85718 7.37305 7.10162 6.12646 8.63495 6.12646C10.1683 6.12646 11.4127 7.37305 11.4127 8.90901Z"
            fill="#1ABCFE"
          />
        </svg>
        <svg
          className="h-6 w-6"
          viewBox="0 0 13 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.12203 1.09285H4.79923V2.63598H5.5665V1.09285H6.24703V0.321289H4.12203V1.09285ZM2.30926 0.321317H1.54199V2.63602H2.31593V1.86445H3.01648V2.63602H3.78375V0.321317H3.01648V1.08618H2.30926V0.321317ZM6.58222 0.321289H7.38618L7.8799 1.13646L8.37362 0.321289H9.17759V2.63598H8.41032V1.4887L7.87323 2.32065L7.33614 1.4887V2.63598H6.58222V0.321289ZM10.3271 0.321289H9.5598V2.63598H11.4146V1.87113H10.3271V0.321289Z"
            fill="black"
          />
          <path
            d="M1.51371 16.1212L0.412842 3.69568H12.5157L11.4148 16.1145L6.45425 17.4966"
            fill="#E44D26"
          />
          <path
            d="M6.46338 16.4406V4.71619H11.4106L10.4665 15.3168"
            fill="#F16529"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.4651 6.23572H2.66211L3.07577 10.8383H6.4651V9.31863H4.46353L4.32342 7.75872H6.4651V6.23572ZM4.66104 11.6036H3.13985L3.35335 13.9955L6.46245 14.8677V13.2776L4.76779 12.8214L4.66104 11.6036Z"
            fill="#EBEBEB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.45831 6.23572H10.2546L10.1145 7.75872H6.45831V6.23572ZM6.45654 9.31902H9.97597L9.55897 13.9954L6.45654 14.8609V13.2775L8.14787 12.8213L8.32467 10.842H6.45654V9.31902Z"
            fill="white"
          />
        </svg>
        <svg
          className="h-6 w-6"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.2726 15.2265H3.03646C1.64757 15.2265 0.515625 14.1118 0.515625 12.744V3.07392C0.515625 1.70616 1.64757 0.591431 3.03646 0.591431H13.2656C14.6615 0.591431 15.7865 1.70616 15.7865 3.07392V12.7372C15.7934 14.1118 14.6615 15.2265 13.2726 15.2265Z"
            fill="#2E001F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.4111 7.39617L8.35555 11.0755C8.39027 11.1302 8.36943 11.1849 8.31388 11.1849H7.10554C7.02916 11.1849 6.99443 11.1644 6.95971 11.096C6.84486 10.8627 6.72954 10.6294 6.61364 10.395L6.61349 10.3946C6.28094 9.72192 5.94359 9.03947 5.5986 8.31941H5.58471C5.16804 9.23582 4.70971 10.2001 4.26526 11.1028C4.23054 11.1575 4.19582 11.178 4.14026 11.178H2.99443C2.92499 11.178 2.91804 11.1233 2.95276 11.0823L4.85554 7.51243L3.01526 3.90153C2.9736 3.84682 3.01526 3.80579 3.05693 3.80579H4.25138C4.32082 3.80579 4.3486 3.81947 4.37638 3.88102C4.81388 4.78374 5.25832 5.71382 5.67499 6.62339H5.68888C6.09165 5.72066 6.5361 4.78374 6.96666 3.88785L6.96793 3.88585C7.0019 3.83231 7.02306 3.79895 7.09166 3.79895H8.20971C8.26527 3.79895 8.2861 3.83998 8.25138 3.89469L6.4111 7.39617ZM8.69629 8.51069C8.69629 6.91725 9.77268 5.67258 11.481 5.67258C11.6268 5.67258 11.7032 5.67258 11.8421 5.68626V3.87397C11.8421 3.83293 11.8768 3.80558 11.9116 3.80558H13.0088C13.0643 3.80558 13.0782 3.8261 13.0782 3.86029V10.1383C13.0782 10.323 13.0782 10.5555 13.113 10.8085C13.113 10.8496 13.0991 10.8632 13.0574 10.8838C12.4741 11.1573 11.863 11.2804 11.2796 11.2804C9.77268 11.2873 8.69629 10.3709 8.69629 8.51069ZM11.4393 6.69151C11.6059 6.69151 11.7448 6.71886 11.842 6.75989V10.1451C11.7101 10.1998 11.5295 10.2203 11.3629 10.2203C10.5781 10.2203 9.95315 9.71427 9.95315 8.45592C9.95315 7.35487 10.5643 6.69151 11.4393 6.69151Z"
            fill="#FFD9F2"
          />
        </svg>
      </div>
    </div>
  );
};

const UserFeed: FC = function () {
  return (
    <>
      <div className="col-span-2 m-auto mb-5 h-full max-w-3xl space-y-6 overflow-hidden overflow-y-auto p-4 lg:pt-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                alt="Portrait Neil Sims"
                src="../../images/users/neil-sims.png"
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/neil-sims.png"
                alt="Neil Sims"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Neil Sims
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                12 April at 09.28 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Hi @everyone, the new designs are attached. Go check them out and
              let me know if I missed anything. Thanks!
            </p>
            <div className="flex flex-wrap">
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-1.jpg"
                alt="task screenshot"
              />
              <img
                className="mr-4 mb-4 h-40 w-40 rounded-lg"
                src="../../images/feed/image-2.jpg"
                alt="task screenshot"
              />
            </div>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />7 Comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              457 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="../../images/users/roberta-casas.png"
                alt="Roberta Casas"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Roberta Casas
              </p>
              <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                13 April at 10.55 PM
              </p>
            </div>
            <a
              href="#"
              className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiDotsVertical className="text-2xl" />
            </a>
          </div>
          <div className="space-y-4">
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              I've been working on my app and grew it to $22k MMR in just a few
              years. Hard work pays off!
            </p>
          </div>
          <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <MdComment className="mr-2 text-lg" />
              No comments
            </a>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
            >
              <HiHeart className="mr-2 text-lg" />
              43 Likes
            </a>
          </div>
          <div>
            <form action="#">
              <label htmlFor="write-message" className="sr-only">
                Comment
              </label>
              <input
                type="text"
                id="write-message"
                placeholder="Write comment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </form>
          </div>
        </Card>
      </div>
      <div className="hidden w-full space-y-10 py-6 px-4 xl:sticky xl:flex xl:flex-col">
        <div>
          <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
            Experience
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="flex items-center space-x-4 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.99686 17.2745H13.9083L19.125 12.1409V0.15625H1.30428L0 3.5802V17.2745H4.77995V19.8438H7.3895L9.99686 17.2745ZM17.3867 1.86719V11.283L14.3433 14.2794H9.5625L6.95605 16.845V14.2794H3.04181V1.86719H17.3867ZM7.82358 10.4284H9.56252V5.293H7.82358V10.4284ZM14.3433 10.4284H12.6048V5.293H14.3433V10.4284Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  Twitch
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Web Developer, New York USA
                </span>
              </div>
            </li>
            <li className="flex items-center space-x-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 17 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.6548 0.5C12.6548 0.5 10.7499 0.508901 9.37979 2.32747C8.16141 3.94464 8.47161 5.3278 8.47161 5.3278C8.47161 5.3278 10.1236 5.61559 11.5769 3.85687C12.9381 2.20979 12.6548 0.5 12.6548 0.5ZM9.73865 6.19398C9.29026 6.376 8.92182 6.52555 8.64585 6.52555C8.30184 6.52555 7.88681 6.36455 7.40452 6.17745C6.73565 5.91797 5.93739 5.6083 5.01974 5.60828C2.59022 5.60828 0 7.79898 0 11.9751C0 16.2196 3.06015 21.5 5.48241 21.5C5.85921 21.5 6.32593 21.3297 6.84337 21.1408C7.48701 20.9059 8.20912 20.6423 8.93429 20.6423C9.58452 20.6423 10.1484 20.8545 10.7049 21.0638C11.2471 21.2678 11.7823 21.4692 12.3835 21.4692C15.0361 21.4692 17 15.9026 17 15.9026C17 15.9026 14.1906 14.8073 14.1906 11.6288C14.1906 8.81133 16.4459 7.65016 16.4459 7.65016C16.4459 7.65016 15.2928 5.54981 12.3617 5.54981C11.3256 5.54981 10.4355 5.91109 9.73865 6.19398Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  Apple
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  React Developer, Palo Alto USA
                </span>
              </div>
            </li>
            <li className="flex items-center space-x-4 pt-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.989 11.2057C20.989 10.3044 20.9175 9.64668 20.7629 8.9646H10.7092V13.0328H16.6105C16.4916 14.0437 15.8491 15.5663 14.4213 16.5894L14.4013 16.7256L17.5801 19.2466L17.8003 19.2691C19.8229 17.3568 20.989 14.5431 20.989 11.2057Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.7092 21.9245C13.6004 21.9245 16.0275 20.95 17.8003 19.2692L14.4213 16.5895C13.5171 17.2351 12.3035 17.6857 10.7092 17.6857C7.87755 17.6857 5.4742 15.7735 4.61747 13.1304L4.49189 13.1413L1.18654 15.76L1.14331 15.8831C2.90418 19.464 6.52114 21.9245 10.7092 21.9245Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.61755 13.1303C4.39149 12.4482 4.26066 11.7174 4.26066 10.9622C4.26066 10.207 4.39149 9.47622 4.60565 8.79413L4.59966 8.64887L1.25289 5.98804L1.14339 6.04136C0.41765 7.52737 0.0012207 9.19609 0.0012207 10.9622C0.0012207 12.7284 0.41765 14.397 1.14339 15.883L4.61755 13.1303Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.7092 4.23869C12.7199 4.23869 14.0763 5.12785 14.8496 5.87089L17.8717 2.85018C16.0157 1.08405 13.6004 0 10.7092 0C6.52113 0 2.90418 2.46039 1.14331 6.04135L4.60557 8.79412C5.4742 6.15102 7.87754 4.23869 10.7092 4.23869Z"
                    fill="#EB4335"
                  />
                </svg>
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  Google
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Frontend Dev, Calfornia USA
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className="xl:sticky">
          <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
            Education
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="flex items-center space-x-4 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold uppercase text-white dark:bg-gray-600">
                Su
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  Stanford University
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Computer Science and Engineering
                </span>
              </div>
            </li>
            <li className="flex items-center space-x-4 pt-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold uppercase text-white">
                Th
              </div>
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  Thomas Jeff High School
                </div>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Secondary School Certificate
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserFeedPage;
