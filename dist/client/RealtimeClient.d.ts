import JsonRpc from "../common/JsonRpc";
import { Handler } from "../common/Handlers";
import { Listener } from "../common/Listeners";
export declare enum RealtimeClientEvent {
    CONNECT = "CONNECT",
    ERROR = "ERROR",
    DISCONNECT = "DISCONNECT"
}
export declare class RealtimeClient extends JsonRpc {
    private socket;
    private reconnectHandler;
    private connected;
    private buffer;
    private handlers;
    private listeners;
    reconnectTimeout: number;
    url: string;
    protocols?: string | string[];
    constructor(url: string, protocols?: string | string[]);
    private connect;
    private resetSocket;
    /**
     * Handles the opening of a socket connection.
     * @param ev
     */
    private onOpen;
    /**
     * Handles the error of a socket connection.
     * @param ev
     */
    private onError;
    /**
     * Handles the closing of a socket connection.
     * @param ev
     */
    private onClose;
    private onMessage;
    protected sendJson(json: string): void;
    protected handleCall(method: string, params: any): any | Promise<any>;
    protected handleNotification(method: string, params: any): void;
    /**
     * Tells if the socket is connected or not.
     */
    isConnected(): boolean;
    addListener(method: string, listener: Listener): void;
    removeListener(method: string, listener: Listener): void;
    setHandler(method: string, handler: Handler): void;
    removeHandler(method: string): void;
}
