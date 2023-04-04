"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breadcrumb = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ThemeContext_1 = require("../Flowbite/ThemeContext");
const BreadcrumbItem_1 = __importDefault(require("./BreadcrumbItem"));
const BreadcrumbComponent = ({ children, ...props }) => {
    const theme = (0, ThemeContext_1.useTheme)().theme.breadcrumb;
    return ((0, jsx_runtime_1.jsx)("nav", { "aria-label": "Breadcrumb", ...props, children: (0, jsx_runtime_1.jsx)("ol", { className: theme.list, children: children }) }));
};
BreadcrumbComponent.displayName = 'Breadcrumb';
exports.Breadcrumb = Object.assign(BreadcrumbComponent, { Item: BreadcrumbItem_1.default });
