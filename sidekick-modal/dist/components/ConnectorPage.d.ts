import React from "react";
interface ConnectorPageProps {
    customerName: string;
    currentStep: number;
    setCurrentStep: Function;
    customerLogoUrl: string;
    setConnectorName: Function;
}
declare const ConnectorPage: React.FC<ConnectorPageProps>;
export default ConnectorPage;
