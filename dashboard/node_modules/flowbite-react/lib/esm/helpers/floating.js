import { arrow, autoPlacement, shift } from '@floating-ui/core';
import { flip, offset } from '@floating-ui/react-dom-interactions';
/**
 * @see https://floating-ui.com/docs/middleware
 */
export const getMiddleware = ({ arrowRef, placement, }) => {
    const middleware = [];
    middleware.push(offset(8));
    middleware.push(placement === 'auto' ? autoPlacement() : flip());
    middleware.push(shift({ padding: 8 }));
    if (arrowRef.current) {
        middleware.push(arrow({ element: arrowRef.current }));
    }
    return middleware;
};
export const getPlacement = ({ placement }) => {
    return placement === 'auto' ? undefined : placement;
};
export const getArrowPlacement = ({ placement }) => {
    return {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    }[placement.split('-')[0]];
};
