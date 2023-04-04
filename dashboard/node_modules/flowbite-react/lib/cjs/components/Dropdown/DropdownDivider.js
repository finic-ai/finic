"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownDivider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ThemeContext_1 = require("../Flowbite/ThemeContext");
const DropdownDivider = () => {
    const theme = (0, ThemeContext_1.useTheme)().theme.dropdown.floating.divider;
    return (0, jsx_runtime_1.jsx)("div", { className: theme });
};
exports.DropdownDivider = DropdownDivider;
