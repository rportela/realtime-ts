import JsonRpc from "../common/JsonRpc";
import * as http from "http";
import * as WebSocket from "ws";
import { Handlers } from "../common/Handlers";
import { Listeners } from "../common/Listeners";

export default class RealtimeServerClient extends JsonRpc {
  socket: WebSocket;
  info: http.IncomingMessage;
  id: string;

  private onMessage = (event: WebSocket.MessageEvent) => {
    const data: WebSocket.Data = event.data;
    try {
      const json: any = JSON.parse(data as string);
      this.receive(json);
    } catch (e) {
      console.error(e);
    }
  };

  protected jsonSend(obj: any) {
    this.socket.send(JSON.stringify(obj));
  }

  constructor(
    handlers: Handlers,
    listeners: Listeners,
    socket: WebSocket,
    info: http.IncomingMessage
  ) {
    super(handlers, listeners);
    this.socket = socket;
    this.info = info;
    this.id = info.headers["sec-websocket-key"].toString();
    socket.onmessage = this.onMessage;
  }
}
