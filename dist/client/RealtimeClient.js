"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeClient = exports.RealtimeClientEvent = void 0;
const Listeners_1 = require("../common/Listeners");
/**
 * The most basic realtime client events.
 */
var RealtimeClientEvent;
(function (RealtimeClientEvent) {
    RealtimeClientEvent["CONNECT"] = "CONNECT";
    RealtimeClientEvent["ERROR"] = "ERROR";
    RealtimeClientEvent["DISCONNECT"] = "DISCONNECT";
    RealtimeClientEvent["MESSAGE"] = "MESSAGE";
})(RealtimeClientEvent = exports.RealtimeClientEvent || (exports.RealtimeClientEvent = {}));
/**
 * This class is responsible for handling messages of a websocket on the client side.
 * It exposes handlers for method calls and listeners for notifications.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
class RealtimeClient {
    /**
     * Creates a new realtime client.
     * @param url
     * @param protocols
     */
    constructor(url, protocols) {
        this.reconnectHandler = 0;
        this.connected = false;
        this.reconnectTimeout = 10000;
        /**
         * Connects to a remote URL using protocols and binds events to the socket.
         */
        this.connect = () => {
            if (this.connected === true)
                return;
            this.resetSocket();
            this.socket = new WebSocket(this.url, this.protocols);
            this.socket.onmessage = this.onMessage;
            this.socket.onopen = this.onOpen;
            this.socket.onerror = this.onError;
            this.socket.onclose = this.onClose;
        };
        /**
         * Handles the opening of a socket connection.
         * @param ev
         */
        this.onOpen = (ev) => {
            this.connected = true;
            // clear any reconnect timeout;
            if (this.reconnectHandler) {
                window.clearTimeout(this.reconnectHandler);
                this.reconnectHandler = 0;
            }
            this.listeners.notify(RealtimeClientEvent.CONNECT, ev);
        };
        /**
         * Handles the error of a socket connection.
         * @param ev
         */
        this.onError = (ev) => {
            console.error(ev);
            this.resetSocket();
            if (!this.reconnectHandler) {
                this.reconnectHandler = window.setTimeout(this.connect, this.reconnectTimeout);
            }
            this.listeners.notify(RealtimeClientEvent.ERROR, ev);
        };
        /**
         * Handles the closing of a socket connection.
         * @param ev
         */
        this.onClose = (ev) => {
            console.info("Socket disconnected, will reconnect in ", this.reconnectTimeout / 1000, "s.");
            this.connected = false;
            this.resetSocket();
            this.reconnectHandler = window.setTimeout(this.connect, this.reconnectTimeout);
            this.listeners.notify(RealtimeClientEvent.DISCONNECT, ev);
        };
        /**
         * Receives a message from the remote source.
         * Currently only JSON messages are parsed and processed.
         * @param msg
         */
        this.onMessage = (msg) => {
            this.listeners.notify(RealtimeClientEvent.MESSAGE, msg.data);
        };
        this.url = url;
        this.protocols = protocols;
        this.listeners = new Listeners_1.Listeners();
        if (navigator.onLine)
            this.connect();
        window.addEventListener("online", this.connect);
    }
    /**
     * Removes all listeners from a socket and sets current attribute to null.
     */
    resetSocket() {
        if (this.socket) {
            this.socket.removeEventListener("close", this.onClose);
            this.socket.removeEventListener("open", this.onOpen);
            this.socket.removeEventListener("error", this.onError);
            this.socket.removeEventListener("message", this.onMessage);
            this.socket = null;
        }
    }
    /**
     * Transmits data using the WebSocket connection. data can be a string, a Blob, an ArrayBuffer, or an ArrayBufferView.
     * @param data
     */
    send(data) {
        this.socket.send(data);
    }
    /**
     * Tells if the socket is connected or not.
     */
    isConnected() {
        return this.connected;
    }
    /**
     * Adds a listener to a specific notification.
     * @param method
     * @param listener
     */
    addListener(method, listener) {
        this.listeners.addListener(method, listener);
    }
    /**
     * Removes a listener from a specific notification.
     * @param method
     * @param listener
     */
    removeListener(method, listener) {
        this.listeners.removeListener(method, listener);
    }
}
exports.RealtimeClient = RealtimeClient;
