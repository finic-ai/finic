import * as React from 'react';
import type { ElementProps } from './types';
export declare const useInteractions: (propsList?: Array<ElementProps | void>) => {
    getReferenceProps: (userProps?: React.HTMLProps<Element> | undefined) => Record<string, unknown>;
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
    getItemProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};
