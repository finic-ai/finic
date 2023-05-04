export declare function useSidekickAuth(connector_id: string, connection_id: string, public_key: string, sidekick_url: string): {
    authorize: () => Promise<void>;
    authorized: boolean;
    loading: boolean;
    newConnection: string | null;
    error: string | null;
};
