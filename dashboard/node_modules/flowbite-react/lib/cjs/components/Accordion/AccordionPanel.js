"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccordionPanel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AccordionPanelContext_1 = require("./AccordionPanelContext");
const AccordionPanel = ({ children, ...props }) => {
    const { alwaysOpen } = props;
    const [isOpen, setOpen] = (0, react_1.useState)(props.isOpen);
    const provider = alwaysOpen
        ? {
            ...props,
            isOpen,
            setOpen: () => setOpen(!isOpen),
        }
        : props;
    return (0, jsx_runtime_1.jsx)(AccordionPanelContext_1.AccordionPanelContext.Provider, { value: provider, children: children });
};
exports.AccordionPanel = AccordionPanel;
