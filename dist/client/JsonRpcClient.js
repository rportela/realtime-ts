"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonRpc_1 = require("../common/JsonRpc");
const RealtimeClient_1 = require("./RealtimeClient");
class JsonRpcClient extends JsonRpc_1.JsonRpcBus {
    constructor(url, protocols) {
        super();
        this.buffer = [];
        this.onConnect = () => {
            const msgs = this.buffer;
            this.buffer = [];
            for (const msg of msgs)
                this.client.send(msg);
        };
        this.onMessage = (data) => {
            this.receiveJson(data);
        };
        this.client = new RealtimeClient_1.RealtimeClient(url, protocols);
        this.client.addListener(RealtimeClient_1.RealtimeClientEvent.CONNECT, this.onConnect);
        this.client.addListener(RealtimeClient_1.RealtimeClientEvent.MESSAGE, this.onMessage);
    }
    sendJson(json) {
        if (this.client.isConnected())
            this.client.send(json);
        else
            this.buffer.push(json);
    }
}
exports.default = JsonRpcClient;
