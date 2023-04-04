import { createContext, useContext } from 'react';
export const TableContext = createContext(undefined);
export function useTableContext() {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext should be used within the TableContext provider!');
    }
    return context;
}
