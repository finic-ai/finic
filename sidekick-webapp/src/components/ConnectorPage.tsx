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

interface StartPageProps {
  customerName: string,
  setCurrentStep: Function,
  customerLogoUrl: string
}

interface ModalHeaderProps {
  customerLogoUrl: string
}
  
const ConnectorPage: React.FC<StartPageProps> = ({customerName, customerLogoUrl, setCurrentStep}) => {
  // Workaround needed because Flowbite doesn't support forwarding props
  const withModalHeaderProps = (Component: React.ComponentType<ModalHeaderProps>, additionalProps: ModalHeaderProps) => {
    return (props: any) => <Component {...additionalProps} {...props} />;
  };

  const renderModalHeader = () => {
    return (
      <Modal.Header as={withModalHeaderProps(ModalHeader, { customerLogoUrl })} />
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
          By selecting “Continue” you agree to the <a href="https://www.getsidekick.ai/privacy-policy" className="underline text-blue-500">Sidekick End User Privacy Policy</a>
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

const ModalHeader: React.FC<ModalHeaderProps> = ({customerLogoUrl}) => {
  return (
    <div className="flex w-full justify-between">
        <button className="items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
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

export default ConnectorPage;
  