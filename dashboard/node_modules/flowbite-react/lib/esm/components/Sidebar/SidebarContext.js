import { createContext, useContext } from 'react';
export const SidebarContext = createContext(undefined);
export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext should be used within the SidebarContext provider!');
    }
    return context;
}
