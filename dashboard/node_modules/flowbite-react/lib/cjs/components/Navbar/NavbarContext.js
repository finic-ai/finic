"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavbarContext = exports.NavbarContext = void 0;
const react_1 = require("react");
exports.NavbarContext = (0, react_1.createContext)(undefined);
function useNavbarContext() {
    const context = (0, react_1.useContext)(exports.NavbarContext);
    if (!context) {
        throw new Error('useNavBarContext should be used within the NavbarContext provider!');
    }
    return context;
}
exports.useNavbarContext = useNavbarContext;
