import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from '../Flowbite/ThemeContext';
export const DropdownDivider = () => {
    const theme = useTheme().theme.dropdown.floating.divider;
    return _jsx("div", { className: theme });
};
