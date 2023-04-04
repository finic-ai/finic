import { Middleware, SWRHook } from '../types';
export declare const withMiddleware: (useSWR: SWRHook, middleware: Middleware) => SWRHook;
