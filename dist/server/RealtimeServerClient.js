"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonRpc_1 = require("../common/JsonRpc");
class RealtimeServerClient extends JsonRpc_1.default {
    constructor(handlers, listeners, socket, info) {
        super();
        this.onMessage = (event) => {
            const data = event.data;
            try {
                const json = JSON.parse(data);
                this.receiveJson(json);
            }
            catch (e) {
                console.error(e);
            }
        };
        this.handlers = handlers;
        this.listeners = listeners;
        this.socket = socket;
        this.info = info;
        this.id = info.headers["sec-websocket-key"].toString();
        socket.onmessage = this.onMessage;
    }
    sendJson(json) {
        this.socket.send(json);
    }
    handleCall(method, params) {
        return this.handlers.invoke(method, this, params);
    }
    handleNotification(method, params) {
        this.listeners.notify(method, this, params);
    }
    send(message) {
        this.socket.send(message);
    }
}
exports.default = RealtimeServerClient;
