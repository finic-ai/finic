import type { AccordionPanelProps } from './AccordionPanel';
type AccordionPanelContext = Omit<AccordionPanelProps, 'children'>;
export declare const AccordionPanelContext: import("react").Context<AccordionPanelContext | undefined>;
export declare function useAccordionContext(): AccordionPanelContext;
export {};
