/// <reference types="react" />
import { defaultConfig } from './utils/config';
import { Fetcher, Key, SWRResponse, FullConfiguration, SWRConfiguration, SWRHook } from './types';
export declare const useSWRHandler: <Data = any, Error_1 = any>(_key: Key, fetcher: ((args_0: string) => import("./types").FetcherResponse<Data>) | ((args_0: any, ...args_1: unknown[]) => import("./types").FetcherResponse<Data>) | ((args_0: Record<any, any>) => import("./types").FetcherResponse<Data>) | ((args_0: string | [any, ...unknown[]] | readonly [any, ...unknown[]] | Record<any, any>) => import("./types").FetcherResponse<Data>) | null, config: import("./types").InternalConfiguration & import("./types").PublicConfiguration<any, any, import("./types").BareFetcher<unknown>> & Partial<import("./types").PublicConfiguration<Data, Error_1, import("./types").BareFetcher<any>>>) => SWRResponse<Data, Error_1>;
export declare const SWRConfig: import("react").FC<import("react").PropsWithChildren<{
    value?: (Partial<import("./types").PublicConfiguration<any, any, import("./types").BareFetcher<any>>> & Partial<import("./types").ProviderConfiguration> & {
        provider?: ((cache: Readonly<import("./types").Cache<any>>) => import("./types").Cache<any>) | undefined;
    }) | undefined;
}>> & {
    default: FullConfiguration;
};
export declare const unstable_serialize: (key: Key) => string;
declare const _default: SWRHook;
export default _default;
