"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRatingContext = exports.RatingContext = void 0;
const react_1 = require("react");
exports.RatingContext = (0, react_1.createContext)(undefined);
function useRatingContext() {
    const context = (0, react_1.useContext)(exports.RatingContext);
    if (!context) {
        throw new Error('useRatingContext should be used within the RatingContext provider!');
    }
    return context;
}
exports.useRatingContext = useRatingContext;
