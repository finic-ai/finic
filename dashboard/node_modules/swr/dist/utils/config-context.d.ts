import { FC, PropsWithChildren } from 'react';
import { SWRConfiguration, FullConfiguration, ProviderConfiguration, Cache } from '../types';
export declare const SWRConfigContext: import("react").Context<Partial<FullConfiguration>>;
declare const SWRConfig: FC<PropsWithChildren<{
    value?: SWRConfiguration & Partial<ProviderConfiguration> & {
        provider?: (cache: Readonly<Cache>) => Cache;
    };
}>>;
export default SWRConfig;
