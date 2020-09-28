export interface Listener {
    (...params: any[]): void;
}
export declare class Listeners {
    private listeners;
    addListener(event: string, listener: Listener): void;
    removeListener(event: string, listener: Listener): void;
    notify(event: string, ...params: any[]): void;
}
