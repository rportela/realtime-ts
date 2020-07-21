import JsonRpcRequest from "./JsonRpcRequest";
import JsonRpcError from "./JsonRpcError";
/**
 * This class is supposed to wrap a promise with it's resolve and reject methods and be stored.
 * Once a remote RPC is completed, the corresponding methods should be called and the pending request removed from the store.
 * @author Rodrigo Portela
 */
export default class JsonRpcPendingRequest implements JsonRpcRequest {
    jsonrpc: string;
    method: string;
    params?: any[];
    id?: string | number;
    resolve: (result: any) => void;
    reject: (error: JsonRpcError) => void;
}
