import RealtimeServerClient from "./RealtimeServerClient";
export interface RealtimeServerListener<T> {
    (client: RealtimeServerClient, params?: T): any;
}
export declare class RealtimeServerListeners {
    private listeners;
    addListener<T>(method: string, listener: RealtimeServerListener<T>): void;
    removeListener<T>(method: string, listener: RealtimeServerListener<T>): void;
    notify<T>(method: string, client: RealtimeServerClient, params?: T): void;
}
