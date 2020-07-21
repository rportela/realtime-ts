export interface Listener {
    (...params: any[]): void;
}
export declare class Listeners {
    private listeners;
    addListener(method: string, listener: Listener): void;
    removeListener(method: string, listener: Listener): void;
    notify(method: string, ...params: any[]): void;
}
