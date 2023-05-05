/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Avatar,
    Button,
    Label,
    Modal,
    Table,
    TextInput,
  } from "flowbite-react";
  import {
    HiLockClosed,
    HiEyeSlash,
    HiOutlineArrowLeft
  } from "react-icons/hi2";
  import React from "react";
  import { useState } from "react";

interface ModalHeaderProps {
    customerLogoUrl: string,
    currentStep: number,
    setCurrentStep: Function
}

const ModalHeader: React.FC<ModalHeaderProps> = ({customerLogoUrl, currentStep, setCurrentStep}) => {
    return (
      <div className="flex w-full justify-between">
          <button onClick={() => setCurrentStep(currentStep - 1)} className="items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
            <HiOutlineArrowLeft className="h-5 w-5 text-gray-400"/>
          </button>
          <Avatar.Group>
              <Avatar
                img={customerLogoUrl}
                rounded={true}
                stacked={true}
                size="sm"
              />
              <Avatar
                img="https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9fa48bde357e0426aee7_dark_icon.png"
                rounded={true}
                stacked={true}
                size="sm"
              />
            </Avatar.Group>
            <div className="w-px:32"></div>
        </div>
    )
  }

  // Workaround needed because Flowbite doesn't support forwarding props
export const withModalHeaderProps = (Component: React.ComponentType<ModalHeaderProps>, additionalProps: ModalHeaderProps) => {
    return (props: any) => <Component {...additionalProps} {...props} />;
};

export default ModalHeader