declare type Callback = (...args: any[]) => any;
export declare const subscribeCallback: (key: string, callbacks: Record<string, Callback[]>, callback: Callback) => () => void;
export {};
