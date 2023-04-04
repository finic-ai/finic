"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToastContext = exports.ToastContext = void 0;
const react_1 = require("react");
exports.ToastContext = (0, react_1.createContext)(undefined);
function useToastContext() {
    const context = (0, react_1.useContext)(exports.ToastContext);
    if (!context) {
        throw new Error('useToastContext should be used within the ToastContext provider!');
    }
    return context;
}
exports.useToastContext = useToastContext;
