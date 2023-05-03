export declare function useNotionOAuth(connector_id: string, connection_id: string, public_key: string): {
    authorize: () => Promise<void>;
    authCode: string | null;
};
