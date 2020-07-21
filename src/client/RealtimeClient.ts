import JsonRpc from "../common/JsonRpc";
import { Handlers, Handler } from "../common/Handlers";
import { Listener, Listeners } from "../common/Listeners";

export enum RealtimeClientEvent {
  CONNECT = "CONNECT",
  ERROR = "ERROR",
  DISCONNECT = "DISCONNECT",
}

export class RealtimeClient extends JsonRpc {
  private socket: WebSocket;
  private reconnectHandler: number = 0;
  private connected: boolean = false;
  private buffer: string[];
  private handlers: Handlers = new Handlers();
  private listeners: Listeners = new Listeners();
  reconnectTimeout: number = 10000;
  url: string;
  protocols?: string | string[];

  constructor(url: string, protocols?: string | string[]) {
    super();
    this.url = url;
    this.protocols = protocols;
    if (navigator.onLine) this.connect();
    window.addEventListener("online", this.connect);
  }

  private connect = () => {
    if (this.connected === true) return;
    this.resetSocket();
    this.socket = new WebSocket(this.url, this.protocols);
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = this.onOpen;
    this.socket.onerror = this.onError;
    this.socket.onclose = this.onClose;
  };

  private resetSocket() {
    if (this.socket) {
      this.socket.removeEventListener("close", this.onClose);
      this.socket.removeEventListener("open", this.onOpen);
      this.socket.removeEventListener("error", this.onError);
      this.socket.removeEventListener("message", this.onMessage);
      this.socket = null;
    }
  }

  /**
   * Handles the opening of a socket connection.
   * @param ev
   */
  private onOpen = (ev: Event) => {
    this.connected = true;
    // flush the buffer
    if (this.buffer.length > 0) {
      for (const msg of this.buffer) this.socket.send(msg);
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
  private onError = (ev: Event) => {
    console.error(ev);
    this.resetSocket();
    if (!this.reconnectHandler) {
      this.reconnectHandler = window.setTimeout(
        this.connect,
        this.reconnectTimeout
      );
    }
    this.listeners.notify(RealtimeClientEvent.ERROR, ev);
  };

  /**
   * Handles the closing of a socket connection.
   * @param ev
   */
  private onClose = (ev: Event) => {
    console.info(
      "Socket disconnected, will reconnect in ",
      this.reconnectTimeout / 1000,
      "s."
    );
    this.connected = false;
    this.resetSocket();
    this.reconnectHandler = window.setTimeout(
      this.connect,
      this.reconnectTimeout
    );
    this.listeners.notify(RealtimeClientEvent.DISCONNECT, ev);
  };

  private onMessage = (msg: MessageEvent) => {
    this.receiveJson(msg.data);
  };

  protected sendJson(json: string) {
    if (this.connected) this.socket.send(json);
    else this.buffer.push(json);
  }

  protected handleCall(method: string, params: any): any | Promise<any> {
    return this.handlers.invoke(method, params);
  }

  protected handleNotification(method: string, params: any): void {
    this.listeners.notify(method, params);
  }

  /**
   * Tells if the socket is connected or not.
   */
  isConnected(): boolean {
    return this.connected;
  }

  addListener(method: string, listener: Listener) {
    this.listeners.addListener(method, listener);
  }

  removeListener(method: string, listener: Listener) {
    this.listeners.removeListener(method, listener);
  }

  setHandler(method: string, handler: Handler) {
    this.handlers.setHandler(method, handler);
  }

  removeHandler(method: string) {
    this.handlers.removeHandler(method);
  }
}
