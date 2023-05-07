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
  HiEyeSlash
} from "react-icons/hi2";
import React from "react";
import { useState } from "react";

interface StartPageProps {
  customerName: string,
  setCurrentStep: Function,
  customerLogoUrl?: string
}
  
const StartPage: React.FC<StartPageProps> = ({customerName, customerLogoUrl, setCurrentStep}) => {
  const renderModalHeader = () => {
    return (
      <Modal.Header>
        <div className="flex flex-col items-center">
          <Avatar.Group className="my-4">
            <Avatar
              img={customerLogoUrl}
              rounded={true}
              stacked={true}
              size="lg"
            />
            <Avatar
              img="https://uploads-ssl.webflow.com/6401c72af7f8fc5af247a5c7/644d9fa48bde357e0426aee7_dark_icon.png"
              rounded={true}
              stacked={true}
              size="lg"
            />
          </Avatar.Group>
          <p className="font-normal text-center"><span className="font-bold">{customerName}</span> uses <span className="font-bold">Sidekick</span> to connect to your knowledge base applications.</p>
        </div>
      </Modal.Header>
    )

  }

  const renderModalBody = () => {
    return (
      <Modal.Body className="space-y-6 px-8">
        <div className="space-y-1">
          <HiLockClosed className="text-3xl mr-1 text-gray-600" />
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mt-2">
            Your data is secure
          </h5>
          <p className="text-base leading-relaxed text-gray-500">
          Sidekick is SOC2 compliant and doesn’t sell your data, or share it with any third parties except those you explicitly authorize.
          </p>
        </div>
        <div className="space-y-1">
          <HiEyeSlash className="text-3xl mr-1 text-gray-600" />
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mt-2">
            Your organization’s controls are respected
          </h5>
          <p className="text-base leading-relaxed text-gray-500">
          Sidekick ensures that access control lists (ACLs) set by your organization are preserved. Only those resources you have permission to view will be shared with Support Hero.
          </p>
        </div>
      </Modal.Body>
    )
  }

  const renderModalFooter = () => {
    return (
      <Modal.Footer className="flex flex-col space-y-6">
        <p className="text-sm text-gray-500">
          By selecting “Continue” you agree to the <a href="https://www.getsidekick.ai/privacy-policy" target="_blank" className="underline text-blue-500">Sidekick End User Privacy Policy</a>
        </p>
        <Button size="xl" className="w-3/5 min-w-300" onClick={() => setCurrentStep(1)}>
          Continue
        </Button>
      </Modal.Footer>
    )
  }

  return (
    <div>
      {renderModalHeader()}
      {renderModalBody()}
      {renderModalFooter()}
    </div>
  );
}

export default StartPage;
  