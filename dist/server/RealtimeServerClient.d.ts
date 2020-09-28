/// <reference types="node" />
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
    constructor(handlers: Handlers, listeners: Listeners, socket: WebSocket, info: http.IncomingMessage);
    private onMessage;
    protected sendJson(json: string): void;
    protected handleCall(method: string, params: any): Promise<any>;
    protected handleNotification(method: string, params: any): void;
    send(message: WebSocket.Data): void;
}
