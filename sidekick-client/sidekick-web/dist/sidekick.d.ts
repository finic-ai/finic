export declare function useSidekickAuth(public_key: string, sidekick_url: string): {
    authorize: (connector_id: string, connection_id: string) => Promise<void>;
    authorized: boolean;
    loading: boolean;
    newConnection: string | null;
    error: string | null;
};
