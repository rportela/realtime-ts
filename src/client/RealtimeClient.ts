import JsonRpc from "../common/JsonRpc";
import { Handlers, Handler } from "../common/Handlers";
import { Listener, Listeners } from "../common/Listeners";

/**
 * The most basic realtime client events.
 */
export enum RealtimeClientEvent {
  CONNECT = "CONNECT",
  ERROR = "ERROR",
  DISCONNECT = "DISCONNECT",
}

/**
 * This class is responsible for handling messages of a websocket on the client side.
 * It exposes handlers for method calls and listeners for notifications.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export class RealtimeClient extends JsonRpc {
  private socket: WebSocket;
  private reconnectHandler: number = 0;
  private connected: boolean = false;
  private buffer: string[] = [];
  private handlers: Handlers = new Handlers();
  private listeners: Listeners = new Listeners();
  reconnectTimeout: number = 10000;
  url: string;
  protocols?: string | string[];

  /**
   * Creates a new realtime client.
   * @param url
   * @param protocols
   */
  constructor(url: string, protocols?: string | string[]) {
    super();
    this.url = url;
    this.protocols = protocols;
    if (navigator.onLine) this.connect();
    window.addEventListener("online", this.connect);
  }

  /**
   * Connects to a remote URL using protocols and binds events to the socket.
   */
  private connect = () => {
    if (this.connected === true) return;
    this.resetSocket();
    this.socket = new WebSocket(this.url, this.protocols);
    this.socket.onmessage = this.onMessage;
    this.socket.onopen = this.onOpen;
    this.socket.onerror = this.onError;
    this.socket.onclose = this.onClose;
  };

  /**
   * Removes all listeners from a socket and sets current attribute to null.
   */
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

  /**
   * Receives a message from the remote source.
   * Currently only JSON messages are parsed and processed.
   * @param msg
   */
  private onMessage = (msg: MessageEvent) => {
    this.receiveJson(msg.data);
  };

  /**
   * Either sends the message if connected.
   * Or stores it in a buffer for sending when connected.
   * @param json
   */
  protected sendJson(json: string) {
    if (this.connected) this.socket.send(json);
    else this.buffer.push(json);
  }

  /**
   * Handles a remote procedure call by invoking a handler out of the Handlers.
   * @param method
   * @param params
   */
  protected handleCall(method: string, params: any): any | Promise<any> {
    return this.handlers.invoke(method, params);
  }

  /**
   * Handles a notification by notifying all listeners.
   * @param method
   * @param params
   */
  protected handleNotification(method: string, params: any): void {
    this.listeners.notify(method, params);
  }

  /**
   * Tells if the socket is connected or not.
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Adds a listener to a specific notification.
   * @param method
   * @param listener
   */
  addListener(method: string, listener: Listener) {
    this.listeners.addListener(method, listener);
  }

  /**
   * Removes a listener from a specific notification.
   * @param method
   * @param listener
   */
  removeListener(method: string, listener: Listener) {
    this.listeners.removeListener(method, listener);
  }

  /**
   * Sets a handler for a remote method call.
   * @param method
   * @param handler
   */
  setHandler(method: string, handler: Handler) {
    this.handlers.setHandler(method, handler);
  }

  /**
   * Deletes the handler of a remote method call.
   * @param method
   */
  removeHandler(method: string) {
    this.handlers.removeHandler(method);
  }
}
