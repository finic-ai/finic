import { createContext, useContext } from 'react';
export const AccordionPanelContext = createContext(undefined);
export function useAccordionContext() {
    const context = useContext(AccordionPanelContext);
    if (!context) {
        throw new Error('useAccordionContext should be used within the AccordionPanelContext provider!');
    }
    return context;
}
