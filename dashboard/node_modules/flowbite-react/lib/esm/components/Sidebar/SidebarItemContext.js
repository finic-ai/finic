import { createContext, useContext } from 'react';
export const SidebarItemContext = createContext(undefined);
export function useSidebarItemContext() {
    const context = useContext(SidebarItemContext);
    if (!context) {
        throw new Error('useSidebarItemContext should be used within the SidebarItemContext provider!');
    }
    return context;
}
