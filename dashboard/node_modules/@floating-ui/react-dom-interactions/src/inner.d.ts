import * as React from 'react';
import { offset } from '@floating-ui/react-dom';
import type { SideObject, DetectOverflowOptions, Middleware, FloatingContext, ElementProps } from './types';
export declare const inner: (options: {
    listRef: React.MutableRefObject<Array<HTMLElement | null>>;
    index: number;
    onFallbackChange?: ((fallback: boolean) => void) | null | undefined;
    offset?: number | undefined;
    overflowRef?: React.MutableRefObject<SideObject | null> | undefined;
    minItemsVisible?: number | undefined;
    referenceOverflowThreshold?: number | undefined;
} & Partial<DetectOverflowOptions>) => Middleware;
export declare const useInnerOffset: ({ open, refs }: FloatingContext, { enabled, overflowRef, onChange, }: {
    enabled?: boolean | undefined;
    overflowRef: React.MutableRefObject<SideObject | null>;
    onChange: (offset: number | ((offset: number) => number)) => void;
}) => ElementProps;
