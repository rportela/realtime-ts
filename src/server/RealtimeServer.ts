import * as http from "http";
import * as https from "https";
import * as WebSocket from "ws";
import RpcServerClient from "./RealtimeServerClient";
import { Handlers, Handler } from "../common/Handlers";
import { Listeners, Listener } from "../common/Listeners";
import RealtimeServerEventType from "./RealtimeServerEventType";

export default class RealtimeServer {
  private server: http.Server | https.Server;
  private socket: WebSocket.Server;
  private clients: RpcServerClient[] = [];
  private listeners: Listeners = new Listeners();
  private handlers: Handlers = new Handlers();

  constructor(useHttps?: boolean) {
    this.server =
      useHttps === true
        ? https.createServer(this.onHttpRequest)
        : http.createServer(this.onHttpRequest);
    this.socket = new WebSocket.Server({ server: this.server });
    this.socket.on("connection", this.registerClient);
  }

  private registerClient = (ws: WebSocket, message: http.IncomingMessage) => {
    const client: RpcServerClient = new RpcServerClient(
      this.handlers,
      this.listeners,
      ws,
      message
    );
    ws.onclose = () => this.unregisterClient(client);
    this.clients.push(client);
    console.log("got a new client", client.info);
    this.listeners.notify(RealtimeServerEventType.CLIENT_CONNECT, client);
  };

  private unregisterClient(client: RpcServerClient) {
    const idx = this.clients.indexOf(client);
    if (idx >= 0) this.clients.splice(idx, 1);
    this.listeners.notify(RealtimeServerEventType.CLIENT_DISCONNECT, client);
  }

  private onHttpRequest: http.RequestListener = (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    res.write("Hello World! " + req.url);
    res.end();
  };

  setHandler(name: string, handler: Handler) {
    this.handlers.setHandler(name, handler);
  }
  removeHandler(name: string) {
    this.handlers.removeHandler(name);
  }
  addListener(name: string, listener: Listener) {
    this.listeners.addListener(name, listener);
  }
  removeListener(name: string, listener: Listener) {
    this.listeners.removeListener(name, listener);
  }

  listen(port?: number) {
    this.server.listen(port || process.env.port);
  }
}
