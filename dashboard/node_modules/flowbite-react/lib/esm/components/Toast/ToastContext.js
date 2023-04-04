import { createContext, useContext } from 'react';
export const ToastContext = createContext(undefined);
export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext should be used within the ToastContext provider!');
    }
    return context;
}
