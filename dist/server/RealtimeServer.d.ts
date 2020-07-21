import * as WebSocket from "ws";
import { default as RealtimeServerClient } from "./RealtimeServerClient";
export interface RealtimeServerListener {
    (client: RealtimeServerClient, params?: any): any;
}
export interface RealtimeServerHandler {
    (client: RealtimeServerClient, params?: any): any;
}
export declare class RealtimeServer {
    private server;
    private socket;
    private clients;
    private listeners;
    private handlers;
    constructor(useHttps?: boolean);
    private registerClient;
    private unregisterClient;
    private onHttpRequest;
    setHandler<T>(name: string, handler: RealtimeServerHandler): void;
    removeHandler(name: string): void;
    addListener<T>(name: string, listener: RealtimeServerListener): void;
    removeListener<T>(name: string, listener: RealtimeServerListener): void;
    listen(port?: number): void;
    broadcast(message: WebSocket.Data, ignore?: RealtimeServerClient): void;
    notifyClients(method: string, params: any, ignore?: RealtimeServerClient): void;
}
