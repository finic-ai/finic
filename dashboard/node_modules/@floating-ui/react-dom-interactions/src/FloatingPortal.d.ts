import * as React from 'react';
export declare const useFloatingPortalNode: ({ id, enabled, }?: {
    id?: string | undefined;
    enabled?: boolean | undefined;
}) => HTMLElement | null;
/**
 * Portals your floating element outside of the main app node.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export declare const FloatingPortal: ({ children, id, root, }: {
    children?: React.ReactNode;
    id?: string | undefined;
    root?: HTMLElement | null | undefined;
}) => React.ReactPortal | null;
