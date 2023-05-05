import React from "react";
interface StartPageProps {
    customerName: string;
    setCurrentStep: Function;
    customerLogoUrl?: string;
}
declare const StartPage: React.FC<StartPageProps>;
export default StartPage;
