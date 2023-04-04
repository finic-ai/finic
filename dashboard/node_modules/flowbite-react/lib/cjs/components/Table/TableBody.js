"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBody = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TableBody = ({ children, ...props }) => {
    return (0, jsx_runtime_1.jsx)("tbody", { ...props, children: children });
};
exports.TableBody = TableBody;
