import { createContext, useContext } from 'react';
export const NavbarContext = createContext(undefined);
export function useNavbarContext() {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavBarContext should be used within the NavbarContext provider!');
    }
    return context;
}
