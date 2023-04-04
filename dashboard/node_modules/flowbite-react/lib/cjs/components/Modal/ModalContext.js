"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalContext = exports.ModalContext = void 0;
const react_1 = require("react");
exports.ModalContext = (0, react_1.createContext)(undefined);
function useModalContext() {
    const context = (0, react_1.useContext)(exports.ModalContext);
    if (!context) {
        throw new Error('useModalContext should be used within the ModalContext provider!');
    }
    return context;
}
exports.useModalContext = useModalContext;
