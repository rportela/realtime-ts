import { JsonRpcBus } from "../common/JsonRpc";
import { RealtimeClient } from "./RealtimeClient";
export default class JsonRpcClient extends JsonRpcBus {
    client: RealtimeClient;
    buffer: string[];
    constructor(url: string, protocols?: string | string[]);
    protected onConnect: () => void;
    protected onMessage: (data: any) => void;
    protected sendJson(json: string): void;
}
