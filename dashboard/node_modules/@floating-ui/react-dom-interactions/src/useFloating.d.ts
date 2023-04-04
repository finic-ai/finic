import type { ReferenceType, UseFloatingReturn, UseFloatingProps } from './types';
export declare function useFloating<RT extends ReferenceType = ReferenceType>({ open, onOpenChange: unstable_onOpenChange, whileElementsMounted, placement, middleware, strategy, nodeId, }?: Partial<UseFloatingProps>): UseFloatingReturn<RT>;
