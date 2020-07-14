import { JsonRpc } from "../common/JsonRpc";

export class RealtimeClient extends JsonRpc {
  private socket: WebSocket;

  constructor(url: string, protocols?: string | string[]) {
    super();
    this.socket = new WebSocket(url, protocols);
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = this.onConnect;
    this.socket.onerror = this.onError;
    this.socket.onclose = this.onDisconnect;
  }

  private onConnect = (ev: Event) => this.listeners.notify("CONNECT", ev);
  private onError = (ev: Event) => this.listeners.notify("ERROR", ev);
  private onDisconnect = (ev: Event) => this.listeners.notify("DISCONNECT", ev);
  private onMessage = (ev: MessageEvent) => {
    const json = ev.data;
    const obj = JSON.parse(json);
    this.receive(obj);
  };

  protected jsonSend(obj: any) {
    const json = JSON.stringify(obj);
    this.socket.send(json);
    
  }
}
