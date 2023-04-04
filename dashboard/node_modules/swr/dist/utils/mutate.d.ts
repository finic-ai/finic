import { Key, Cache, MutatorCallback, MutatorOptions } from '../types';
export declare const internalMutate: <Data>(args_0: Cache<any>, args_1: Key, args_2: Data | Promise<Data | undefined> | MutatorCallback<Data> | undefined, args_3: boolean | MutatorOptions<Data> | undefined) => Promise<any>;
