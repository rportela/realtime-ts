import * as http from "http";
import * as WebSocket from "ws";
import { Handlers } from "../common/Handlers";
import { JsonRpc } from "../common/JsonRpc";
import { Listeners } from "../common/Listeners";

export default class RealtimeServerClient extends JsonRpc {
  socket: WebSocket;
  info: http.IncomingMessage;
  id: string;
  handlers: Handlers;
  listeners: Listeners;

  constructor(
    handlers: Handlers,
    listeners: Listeners,
    socket: WebSocket,
    info: http.IncomingMessage
  ) {
    super();
    this.handlers = handlers;
    this.listeners = listeners;
    this.socket = socket;
    this.info = info;
    this.id = info.headers["sec-websocket-key"].toString();
    socket.onmessage = this.onMessage;
  }

  private onMessage = (event: WebSocket.MessageEvent) => {
    const data: WebSocket.Data = event.data;
    try {
      const json: any = JSON.parse(data as string);
      this.receiveJson(json);
    } catch (e) {
      console.error(e);
    }
  };

  protected sendJson(json: string) {
    this.socket.send(json);
  }
  protected handleCall(method: string, params: any): Promise<any> {
    return this.handlers.invoke(method, this, params);
  }
  protected handleNotification(method: string, params: any): void {
    this.listeners.notify(method, this, params);
  }

  send(message: WebSocket.Data) {
    this.socket.send(message);
  }
}
