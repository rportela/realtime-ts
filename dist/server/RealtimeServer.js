"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeServer = void 0;
const http = require("http");
const https = require("https");
const WebSocket = require("ws");
const Handlers_1 = require("../common/Handlers");
const Listeners_1 = require("../common/Listeners");
const RealtimeServerClient_1 = require("./RealtimeServerClient");
class RealtimeServer {
    constructor(useHttps) {
        this.clients = [];
        this.handlers = new Handlers_1.Handlers();
        this.listeners = new Listeners_1.Listeners();
        this.registerClient = (ws, message) => {
            const client = new RealtimeServerClient_1.default(this.handlers, this.listeners, ws, message);
            ws.onclose = () => this.unregisterClient(client);
            this.clients.push(client);
            console.log("got a new client", client.info);
            this.listeners.notify("CLIENT_CONNECT" /* CLIENT_CONNECT */, client, client.info);
        };
        this.onHttpRequest = (req, res) => {
            res.write("Hello World! " + req.url);
            res.end();
        };
        this.server =
            useHttps === true
                ? https.createServer(this.onHttpRequest)
                : http.createServer(this.onHttpRequest);
        this.socket = new WebSocket.Server({ server: this.server });
        this.socket.on("connection", this.registerClient);
    }
    unregisterClient(client) {
        const idx = this.clients.indexOf(client);
        if (idx >= 0)
            this.clients.splice(idx, 1);
        this.listeners.notify("CLIENT_DISCONNECT" /* CLIENT_DISCONNECT */, client, client.info);
    }
    setHandler(name, handler) {
        this.handlers.setHandler(name, handler);
    }
    removeHandler(name) {
        this.handlers.removeHandler(name);
    }
    addListener(name, listener) {
        this.listeners.addListener(name, listener);
    }
    removeListener(name, listener) {
        this.listeners.removeListener(name, listener);
    }
    listen(port) {
        const p = port || process.env.port;
        this.server.listen(p);
        console.log("Server listening on", p, "?", this.server.listening);
    }
    broadcast(message, ignore) {
        this.clients.forEach((client) => {
            if (client !== ignore)
                client.send(message);
        });
    }
    notifyClients(method, params, ignore) {
        this.clients.forEach((client) => {
            if (client !== ignore)
                client.notify(method, params);
        });
    }
}
exports.RealtimeServer = RealtimeServer;
