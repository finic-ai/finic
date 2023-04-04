import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from '../Flowbite/ThemeContext';
import BreadcrumbItem from './BreadcrumbItem';
const BreadcrumbComponent = ({ children, ...props }) => {
    const theme = useTheme().theme.breadcrumb;
    return (_jsx("nav", { "aria-label": "Breadcrumb", ...props, children: _jsx("ol", { className: theme.list, children: children }) }));
};
BreadcrumbComponent.displayName = 'Breadcrumb';
export const Breadcrumb = Object.assign(BreadcrumbComponent, { Item: BreadcrumbItem });
