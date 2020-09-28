import * as http from "http";
import * as https from "https";
import * as WebSocket from "ws";
import { Handlers } from "../common/Handlers";
import { Listeners } from "../common/Listeners";
import {
  default as RealtimeServerClient,
  default as RpcServerClient
} from "./RealtimeServerClient";
import RealtimeServerEventType from "./RealtimeServerEventType";

export interface RealtimeServerListener {
  (client: RealtimeServerClient, params?: any);
}
export interface RealtimeServerHandler {
  (client: RealtimeServerClient, params?: any): any;
}

export class RealtimeServer {
  private server: http.Server | https.Server;
  private socket: WebSocket.Server;
  private clients: RpcServerClient[] = [];
  private handlers: Handlers = new Handlers();
  private listeners: Listeners = new Listeners();

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
    this.listeners.notify(
      RealtimeServerEventType.CLIENT_CONNECT,
      client,
      client.info
    );
  };

  private unregisterClient(client: RpcServerClient) {
    const idx = this.clients.indexOf(client);
    if (idx >= 0) this.clients.splice(idx, 1);
    this.listeners.notify(
      RealtimeServerEventType.CLIENT_DISCONNECT,
      client,
      client.info
    );
  }

  private onHttpRequest: http.RequestListener = (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    res.write("Hello World! " + req.url);
    res.end();
  };

  setHandler<T>(name: string, handler: RealtimeServerHandler) {
    this.handlers.setHandler(name, handler);
  }
  removeHandler(name: string) {
    this.handlers.removeHandler(name);
  }

  addListener<T>(name: string, listener: RealtimeServerListener) {
    this.listeners.addListener(name, listener);
  }
  removeListener<T>(name: string, listener: RealtimeServerListener) {
    this.listeners.removeListener(name, listener);
  }

  listen(port?: number) {
    const p = port || process.env.port;
    this.server.listen(p);
    console.log("Server listening on", p, "?", this.server.listening);
  }

  broadcast(message: WebSocket.Data, ignore?: RealtimeServerClient) {
    this.clients.forEach((client) => {
      if (client !== ignore) client.send(message);
    });
  }

  notifyClients(method: string, params: any, ignore?: RealtimeServerClient) {
    this.clients.forEach((client) => {
      if (client !== ignore) client.notify(method, params);
    });
  }
}
