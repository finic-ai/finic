import { createContext, useContext } from 'react';
export const TimelineContext = createContext(undefined);
export function useTimelineContext() {
    const context = useContext(TimelineContext);
    if (!context) {
        throw new Error('useTimelineContext should be used within the TimelineContext providor!');
    }
    return context;
}
