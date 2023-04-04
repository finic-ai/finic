import { Cache, ScopedMutator, RevalidateCallback, StateUpdateCallback } from '../types';
export declare type GlobalState = [
    Record<string, RevalidateCallback[]>,
    Record<string, StateUpdateCallback[]>,
    Record<string, [number, number]>,
    Record<string, [any, number]>,
    ScopedMutator
];
export declare const SWRGlobalState: WeakMap<Cache<any>, GlobalState>;
