/**
 * Inlined into the react-router repo since use-sync-external-store does not
 * provide a UMD-compatible package, so we need this to be able to distribute
 * UMD react-router bundles
 */
import { useSyncExternalStore as server } from "./useSyncExternalStoreShimServer";
export declare const useSyncExternalStore: typeof server;
