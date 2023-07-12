/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, Button } from "flowbite-react";
import { HiLockClosed, HiEyeSlash } from "react-icons/hi2";
import React from "react";
import { useState } from "react";
import { useModalContext } from "../context/ModalContext";

const StartPage: React.FC = () => {
  const {
    customerName,
    customerLogoUrl,
    setCurrentStep,
    logoLoading,
    skipConnectorSelection,
    selectedConnectorId,
    startConnectorAuthFlow,
    connectorsThatStartOAuthFirst,
  } = useModalContext();

  const goToNextStep = () => {
    if (skipConnectorSelection) {
      setCurrentStep(2);
      if (connectorsThatStartOAuthFirst.includes(selectedConnectorId)) {
        startConnectorAuthFlow(window, selectedConnectorId);
      }
    } else {
      setCurrentStep(1);
    }
  };
  const renderModalHeader = () => {
    return (
      <div>
        <div className="flex flex-col items-center px-8">
          <>
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
            <p className="font-normal text-center">
              <span className="font-bold">{customerName}</span> uses{" "}
              <span className="font-bold">Psychic</span> to connect to your
              knowledge base applications.
            </p>
          </>
        </div>
        <hr className="h-px my-8 mx-6 bg-gray-200 border-0" />
      </div>
    );
  };

  const renderModalBody = () => {
    return (
      <div className="space-y-6 px-8 text-left">
        <div className="space-y-1">
          <HiLockClosed className="text-3xl mr-1 text-gray-600" />
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mt-2">
            Your data is secure
          </h5>
          <p className="text-base leading-relaxed text-gray-500">
            Psychic implements controls aligned with SOC2 requirements and
            doesn’t sell your data, or share it with any third parties except
            those you explicitly authorize.
          </p>
        </div>
        <div className="space-y-1">
          <HiEyeSlash className="text-3xl mr-1 text-gray-600" />
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mt-2">
            Your organization’s controls are respected
          </h5>
          <p className="text-base leading-relaxed text-gray-500">
            Psychic ensures that access control lists (ACLs) set by your
            organization are preserved. Only those resources you have permission
            to view will be shared.
          </p>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0" />
      </div>
    );
  };

  const renderModalFooter = () => {
    return (
      <div className="flex flex-col space-y-6 mt-6 px-8 items-center">
        <p className="text-sm text-gray-500">
          By selecting “Continue” you agree to the{" "}
          <a
            href="https://www.psychic.dev/privacy-policy"
            target="_blank"
            className="underline text-blue-500"
          >
            Psychic End User Privacy Policy
          </a>
        </p>
        <Button
          size="xl"
          className="w-3/5 min-w-300"
          onClick={() => goToNextStep()}
        >
          Continue
        </Button>
      </div>
    );
  };

  return (
    <div>
      {logoLoading ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
          {/* Rounded full width rectangles with margins */}
          <div className="w-3/4 h-8 bg-gray-200 rounded-full mb-2"></div>
          <div className="w-3/4 h-8 bg-gray-200 rounded-full mb-2"></div>
          <div className="w-3/4 h-8 bg-gray-200 rounded-full mb-2"></div>
          <div className="w-3/4 h-8 bg-gray-200 rounded-full mb-2"></div>
        </div>
      ) : (
        <>
          {renderModalHeader()}
          {renderModalBody()}
          {renderModalFooter()}
        </>
      )}
    </div>
  );
};

export default StartPage;
