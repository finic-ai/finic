"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimelineContext = exports.TimelineContext = void 0;
const react_1 = require("react");
exports.TimelineContext = (0, react_1.createContext)(undefined);
function useTimelineContext() {
    const context = (0, react_1.useContext)(exports.TimelineContext);
    if (!context) {
        throw new Error('useTimelineContext should be used within the TimelineContext providor!');
    }
    return context;
}
exports.useTimelineContext = useTimelineContext;
