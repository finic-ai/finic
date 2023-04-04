import type { ElementProps, FloatingContext } from '../types';
export interface Props {
    enabled?: boolean;
    pointerDown?: boolean;
    toggle?: boolean;
    ignoreMouse?: boolean;
    keyboardHandlers?: boolean;
}
/**
 * Adds click event listeners that change the open state.
 * @see https://floating-ui.com/docs/useClick
 */
export declare const useClick: <RT extends import("@floating-ui/dom/src/types").ReferenceElement = import("@floating-ui/dom/src/types").ReferenceElement>({ open, onOpenChange, dataRef, refs }: FloatingContext<RT>, { enabled, pointerDown, toggle, ignoreMouse, keyboardHandlers, }?: Props) => ElementProps;
