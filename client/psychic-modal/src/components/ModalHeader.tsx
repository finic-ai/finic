/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { HiLockClosed, HiEyeSlash, HiOutlineArrowLeft } from "react-icons/hi2";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../context/ModalContext";

const ModalHeader: React.FC = () => {
  const { currentStep, setCurrentStep, customerLogoUrl, whitelabel } =
    useModalContext();
  if (currentStep === 0) {
    return <></>;
  }

  const shouldHide = whitelabel && currentStep == 1 ? true : false;

  return (
    <div>
      <div className="flex w-full justify-between p-4">
        <button
          onClick={() => {
            if (!shouldHide) {
              setCurrentStep(currentStep - 1);
            }
          }}
          className="items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
        >
          {shouldHide ? (
            <></>
          ) : (
            <HiOutlineArrowLeft className="h-5 w-5 text-gray-400" />
          )}
        </button>
        <Avatar.Group>
          <Avatar
            img={customerLogoUrl}
            rounded={true}
            stacked={true}
            size="sm"
          />
          {/* <Avatar
              img="https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9fa48bde357e0426aee7_dark_icon.png"
              rounded={true}
              stacked={true}
              size="sm"
            /> */}
        </Avatar.Group>
        <div />
      </div>
      <hr className="h-px my-4 mx-6 bg-gray-200 border-0" />
    </div>
  );
};

export default ModalHeader;
