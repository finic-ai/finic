import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { AccordionPanelContext } from './AccordionPanelContext';
export const AccordionPanel = ({ children, ...props }) => {
    const { alwaysOpen } = props;
    const [isOpen, setOpen] = useState(props.isOpen);
    const provider = alwaysOpen
        ? {
            ...props,
            isOpen,
            setOpen: () => setOpen(!isOpen),
        }
        : props;
    return _jsx(AccordionPanelContext.Provider, { value: provider, children: children });
};
