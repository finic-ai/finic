import React from "react";
interface ModalHeaderProps {
    customerLogoUrl: string;
    currentStep: number;
    setCurrentStep: Function;
}
declare const ModalHeader: React.FC<ModalHeaderProps>;
export declare const withModalHeaderProps: (Component: React.ComponentType<ModalHeaderProps>, additionalProps: ModalHeaderProps) => (props: any) => JSX.Element;
export default ModalHeader;
