import type { UseFloatingProps, UseFloatingReturn, ReferenceType } from './types';
export declare function useFloating<RT extends ReferenceType = ReferenceType>({ middleware, placement, strategy, whileElementsMounted, }?: UseFloatingProps): UseFloatingReturn<RT>;
