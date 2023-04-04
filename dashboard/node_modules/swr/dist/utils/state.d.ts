import { MutableRefObject } from 'react';
import { State } from '../types';
declare type StateKeys = keyof State<any, any>;
/**
 * An implementation of state with dependency-tracking.
 */
export declare const useStateWithDeps: <Data, Error_1, S = State<Data, Error_1>>(state: S, unmountedRef: MutableRefObject<boolean>) => [MutableRefObject<S>, Record<keyof State<any, any>, boolean>, (payload: S) => void];
export {};
