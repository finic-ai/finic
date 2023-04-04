import { Cache, ScopedMutator, ProviderConfiguration } from '../types';
export declare const initCache: <Data = any>(provider: Cache<Data>, options?: Partial<ProviderConfiguration> | undefined) => [Cache<Data>, ScopedMutator<Data>, () => void] | [Cache<Data>, ScopedMutator<Data>] | undefined;
