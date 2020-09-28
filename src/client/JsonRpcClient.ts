import { JsonRpcBus } from "../common/JsonRpc";
import { RealtimeClient, RealtimeClientEvent } from "./RealtimeClient";

export default class JsonRpcClient extends JsonRpcBus {
  client: RealtimeClient;
  buffer: string[] = [];
  constructor(url: string, protocols?: string | string[]) {
    super();
    this.client = new RealtimeClient(url, protocols);
    this.client.addListener(RealtimeClientEvent.CONNECT, this.onConnect);
    this.client.addListener(RealtimeClientEvent.MESSAGE, this.onMessage);
  }
  protected onConnect = () => {
    const msgs = this.buffer;
    this.buffer = [];
    for (const msg of msgs) this.client.send(msg);
  };
  protected onMessage = (data: any) => {
    this.receiveJson(data);
  };
  protected sendJson(json: string) {
    if (this.client.isConnected()) this.client.send(json);
    else this.buffer.push(json);
  }
}
