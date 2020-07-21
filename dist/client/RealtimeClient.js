"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeClient = exports.RealtimeClientEvent = void 0;
const JsonRpc_1 = require("../common/JsonRpc");
const Handlers_1 = require("../common/Handlers");
const Listeners_1 = require("../common/Listeners");
var RealtimeClientEvent;
(function (RealtimeClientEvent) {
    RealtimeClientEvent["CONNECT"] = "CONNECT";
    RealtimeClientEvent["ERROR"] = "ERROR";
    RealtimeClientEvent["DISCONNECT"] = "DISCONNECT";
})(RealtimeClientEvent = exports.RealtimeClientEvent || (exports.RealtimeClientEvent = {}));
class RealtimeClient extends JsonRpc_1.default {
    constructor(url, protocols) {
        super();
        this.reconnectHandler = 0;
        this.connected = false;
        this.handlers = new Handlers_1.Handlers();
        this.listeners = new Listeners_1.Listeners();
        this.reconnectTimeout = 10000;
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
            // flush the buffer
            if (this.buffer.length > 0) {
                for (const msg of this.buffer)
                    this.socket.send(msg);
                this.buffer = [];
            }
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
        this.onMessage = (msg) => {
            this.receiveJson(msg.data);
        };
        this.url = url;
        this.protocols = protocols;
        if (navigator.onLine)
            this.connect();
        window.addEventListener("online", this.connect);
    }
    resetSocket() {
        if (this.socket) {
            this.socket.removeEventListener("close", this.onClose);
            this.socket.removeEventListener("open", this.onOpen);
            this.socket.removeEventListener("error", this.onError);
            this.socket.removeEventListener("message", this.onMessage);
            this.socket = null;
        }
    }
    sendJson(json) {
        if (this.connected)
            this.socket.send(json);
        else
            this.buffer.push(json);
    }
    handleCall(method, params) {
        return this.handlers.invoke(method, params);
    }
    handleNotification(method, params) {
        this.listeners.notify(method, params);
    }
    /**
     * Tells if the socket is connected or not.
     */
    isConnected() {
        return this.connected;
    }
    addListener(method, listener) {
        this.listeners.addListener(method, listener);
    }
    removeListener(method, listener) {
        this.listeners.removeListener(method, listener);
    }
    setHandler(method, handler) {
        this.handlers.setHandler(method, handler);
    }
    removeHandler(method) {
        this.handlers.removeHandler(method);
    }
}
exports.RealtimeClient = RealtimeClient;
