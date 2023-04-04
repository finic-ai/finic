import type { Placement } from '@floating-ui/react-dom';
import type { Middleware } from '@floating-ui/react-dom-interactions';
import type { RefObject } from 'react';
/**
 * @see https://floating-ui.com/docs/middleware
 */
export declare const getMiddleware: ({ arrowRef, placement, }: {
    arrowRef: RefObject<HTMLDivElement>;
    placement: 'auto' | Placement;
}) => Middleware[];
export declare const getPlacement: ({ placement }: {
    placement: 'auto' | Placement;
}) => Placement | undefined;
export declare const getArrowPlacement: ({ placement }: {
    placement: Placement;
}) => Placement;
