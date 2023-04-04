"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSidebarItemContext = exports.SidebarItemContext = void 0;
const react_1 = require("react");
exports.SidebarItemContext = (0, react_1.createContext)(undefined);
function useSidebarItemContext() {
    const context = (0, react_1.useContext)(exports.SidebarItemContext);
    if (!context) {
        throw new Error('useSidebarItemContext should be used within the SidebarItemContext provider!');
    }
    return context;
}
exports.useSidebarItemContext = useSidebarItemContext;
