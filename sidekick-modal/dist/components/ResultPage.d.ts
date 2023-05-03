import React from "react";
interface ResultPageProps {
    customerName: string;
    currentStep: number;
    setCurrentStep: Function;
    customerLogoUrl: string;
    connectorName: string;
    setShowModal: Function;
}
declare const ConnectorPage: React.FC<ResultPageProps>;
export default ConnectorPage;
