import { Middleware } from 'swr';
import type { SWRInfiniteConfiguration, SWRInfiniteResponse, SWRInfiniteHook, SWRInfiniteKeyLoader, SWRInfiniteFetcher } from './types';
export declare const unstable_serialize: (getKey: SWRInfiniteKeyLoader) => string;
export declare const infinite: Middleware;
declare const _default: SWRInfiniteHook;
export default _default;
export { SWRInfiniteConfiguration, SWRInfiniteResponse, SWRInfiniteHook, SWRInfiniteKeyLoader, SWRInfiniteFetcher };
/**
 * @deprecated `InfiniteFetcher` will be renamed to `SWRInfiniteFetcher`.
 */
export declare type InfiniteFetcher = SWRInfiniteFetcher;
