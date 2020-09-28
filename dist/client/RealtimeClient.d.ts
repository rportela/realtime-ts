import { Listener } from "../common/Listeners";
/**
 * The most basic realtime client events.
 */
export declare enum RealtimeClientEvent {
    CONNECT = "CONNECT",
    ERROR = "ERROR",
    DISCONNECT = "DISCONNECT",
    MESSAGE = "MESSAGE"
}
/**
 * This class is responsible for handling messages of a websocket on the client side.
 * It exposes handlers for method calls and listeners for notifications.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export declare class RealtimeClient {
    private socket;
    private reconnectHandler;
    private connected;
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
     * Transmits data using the WebSocket connection. data can be a string, a Blob, an ArrayBuffer, or an ArrayBufferView.
     * @param data
     */
    send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void;
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
}
