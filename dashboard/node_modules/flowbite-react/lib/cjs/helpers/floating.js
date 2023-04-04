"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrowPlacement = exports.getPlacement = exports.getMiddleware = void 0;
const core_1 = require("@floating-ui/core");
const react_dom_interactions_1 = require("@floating-ui/react-dom-interactions");
/**
 * @see https://floating-ui.com/docs/middleware
 */
const getMiddleware = ({ arrowRef, placement, }) => {
    const middleware = [];
    middleware.push((0, react_dom_interactions_1.offset)(8));
    middleware.push(placement === 'auto' ? (0, core_1.autoPlacement)() : (0, react_dom_interactions_1.flip)());
    middleware.push((0, core_1.shift)({ padding: 8 }));
    if (arrowRef.current) {
        middleware.push((0, core_1.arrow)({ element: arrowRef.current }));
    }
    return middleware;
};
exports.getMiddleware = getMiddleware;
const getPlacement = ({ placement }) => {
    return placement === 'auto' ? undefined : placement;
};
exports.getPlacement = getPlacement;
const getArrowPlacement = ({ placement }) => {
    return {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    }[placement.split('-')[0]];
};
exports.getArrowPlacement = getArrowPlacement;
