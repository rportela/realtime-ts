import RealtimeServerClient from "./RealtimeServerClient";
export interface RealtimeServerHandler<T> {
    (client: RealtimeServerClient, params?: T): any | Promise<any>;
}
export declare class RealtimeServerHandlers {
    private handlers;
    setHandler<T>(name: string, handler: RealtimeServerHandler<T>): void;
    removeHandler(name: string): void;
    invoke<T>(method: string, client: RealtimeServerClient, params?: T): Promise<any>;
}
