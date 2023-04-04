"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTableContext = exports.TableContext = void 0;
const react_1 = require("react");
exports.TableContext = (0, react_1.createContext)(undefined);
function useTableContext() {
    const context = (0, react_1.useContext)(exports.TableContext);
    if (!context) {
        throw new Error('useTableContext should be used within the TableContext provider!');
    }
    return context;
}
exports.useTableContext = useTableContext;
