"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccordionContext = exports.AccordionPanelContext = void 0;
const react_1 = require("react");
exports.AccordionPanelContext = (0, react_1.createContext)(undefined);
function useAccordionContext() {
    const context = (0, react_1.useContext)(exports.AccordionPanelContext);
    if (!context) {
        throw new Error('useAccordionContext should be used within the AccordionPanelContext provider!');
    }
    return context;
}
exports.useAccordionContext = useAccordionContext;
