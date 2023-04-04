import { createContext, useContext } from 'react';
export const RatingContext = createContext(undefined);
export function useRatingContext() {
    const context = useContext(RatingContext);
    if (!context) {
        throw new Error('useRatingContext should be used within the RatingContext provider!');
    }
    return context;
}
