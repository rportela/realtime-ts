import { Listener, Listeners } from "../common/Listeners";

/**
 * The most basic realtime client events.
 */
export enum RealtimeClientEvent {
  CONNECT = "CONNECT",
  ERROR = "ERROR",
  DISCONNECT = "DISCONNECT",
  MESSAGE = "MESSAGE",
}

/**
 * This class is responsible for handling messages of a websocket on the client side.
 * It exposes handlers for method calls and listeners for notifications.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export class RealtimeClient {
  private socket: WebSocket;
  private reconnectHandler: number = 0;
  private connected: boolean = false;
  private listeners: Listeners;
  reconnectTimeout: number = 10000;
  url: string;
  protocols?: string | string[];

  /**
   * Creates a new realtime client.
   * @param url
   * @param protocols
   */
  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
    this.listeners = new Listeners();
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
    this.listeners.notify(RealtimeClientEvent.MESSAGE, msg.data);
  };

  /**
   * Transmits data using the WebSocket connection. data can be a string, a Blob, an ArrayBuffer, or an ArrayBufferView.
   * @param data
   */
  send(
    data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ) {
    this.socket.send(data);
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
}
