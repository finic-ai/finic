"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSidebarContext = exports.SidebarContext = void 0;
const react_1 = require("react");
exports.SidebarContext = (0, react_1.createContext)(undefined);
function useSidebarContext() {
    const context = (0, react_1.useContext)(exports.SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext should be used within the SidebarContext provider!');
    }
    return context;
}
exports.useSidebarContext = useSidebarContext;
