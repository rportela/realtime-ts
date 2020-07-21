import JsonRpcRequest from "./JsonRpcRequest";
/**
 * Wraps all functionality of JSON RPC.
 * Handlers for standard method calls and listeners for remote notifications.
 * @author Rodrigo Portela
 */
export default abstract class JsonRpc {
    private pending;
    protected abstract sendJson(json: string): any;
    protected abstract handleCall(method: string, params: any): Promise<any>;
    protected abstract handleNotification(method: string, params: any): void;
    /**
   a  * Performs a RPC call.
     * Creates a new pending JSON RPC request, stores it on the bag and sends the encoded json on the pipe.
     * @param method
     * @param params
     */
    call(method: string, ...params: any): Promise<any>;
    notify(method: string, params?: any): void;
    /**
     * Receives an arbitrary json message from a remote and translates it to a standard method call, a notification or a response from a call.
     * @param message
     */
    protected receiveJson(json: string): void;
    /**
     * Processes the response of a standard method call.
     * It removes the pending request from the bag and either resolves or rejects the promise depending on the presence of an error.
     * @param response
     */
    private receiveResponse;
    /**
     * Processes a request. Either a standard method call or a notification.
     * If the request is a standard method call, an appropriate JsonRpcResponse is sent back to the caller.
     * If the request is a notification, the listeners are invoked but no response is sent back to the caller.
     * @param request
     */
    private receiveRequest;
    /**
     * Encodes a JSON response to send through the pipe with a specific result.
     * @param req
     * @param result
     */
    protected respondSuccess(req: JsonRpcRequest, result: any): void;
    /**
     * Encodes a JSON response to sen through the pipe with a specific error.
     * @param req
     * @param err
     */
    protected respondError(req: JsonRpcRequest, err: Error): void;
    /**
     * A static helper method to create time ascending, unique ids.
     */
    static createId(): string;
}
