import JsonRpc from "../common/JsonRpc";
import { Handler } from "../common/Handlers";
import { Listener } from "../common/Listeners";
/**
 * The most basic realtime client events.
 */
export declare enum RealtimeClientEvent {
    CONNECT = "CONNECT",
    ERROR = "ERROR",
    DISCONNECT = "DISCONNECT"
}
/**
 * This class is responsible for handling messages of a websocket on the client side.
 * It exposes handlers for method calls and listeners for notifications.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
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
    /**
     * Creates a new realtime client.
     * @param url
     * @param protocols
     */
    constructor(url: string, protocols?: string | string[]);
    /**
     * Connects to a remote URL using protocols and binds events to the socket.
     */
    private connect;
    /**
     * Removes all listeners from a socket and sets current attribute to null.
     */
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
    /**
     * Receives a message from the remote source.
     * Currently only JSON messages are parsed and processed.
     * @param msg
     */
    private onMessage;
    /**
     * Either sends the message if connected.
     * Or stores it in a buffer for sending when connected.
     * @param json
     */
    protected sendJson(json: string): void;
    /**
     * Handles a remote procedure call by invoking a handler out of the Handlers.
     * @param method
     * @param params
     */
    protected handleCall(method: string, params: any): any | Promise<any>;
    /**
     * Handles a notification by notifying all listeners.
     * @param method
     * @param params
     */
    protected handleNotification(method: string, params: any): void;
    /**
     * Tells if the socket is connected or not.
     */
    isConnected(): boolean;
    /**
     * Adds a listener to a specific notification.
     * @param method
     * @param listener
     */
    addListener(method: string, listener: Listener): void;
    /**
     * Removes a listener from a specific notification.
     * @param method
     * @param listener
     */
    removeListener(method: string, listener: Listener): void;
    /**
     * Sets a handler for a remote method call.
     * @param method
     * @param handler
     */
    setHandler(method: string, handler: Handler): void;
    /**
     * Deletes the handler of a remote method call.
     * @param method
     */
    removeHandler(method: string): void;
}
