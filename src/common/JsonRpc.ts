import { Handlers, Handler } from "./Handlers";
import { Listeners, Listener } from "./Listeners";
import JsonRpcRequest from "./JsonRpcRequest";
import JsonRpcResponse from "./JsonRpcResponse";
import JsonRpcPendingRequest from "./JsonRpcPendingRequest";

/**
 * Wraps all functionality of JSON RPC.
 * Handlers for standard method calls and listeners for remote notifications.
 * @author Rodrigo Portela
 */
export default abstract class JsonRpc {
  handlers: Handlers;
  listeners: Listeners;
  pending: any = {};

  constructor(
    handlers: Handlers = new Handlers(),
    listeners: Listeners = new Listeners()
  ) {
    this.handlers = handlers;
    this.listeners = listeners;
  }

  /**
   * Implement this method on the client or on the server to send JSON encoded messages.
   * @param obj
   */
  protected abstract jsonSend(obj: any);

  /**
   * Processes an array of requests by calling the processRequest for each member of the array.
   * @param requests
   */
  private processRequestArray(requests: JsonRpcRequest[]) {
    requests.forEach(this.processRequest);
  }

  /**
   * Processes a request. Either a standard method call or a notification.
   * If the request is a standard method call, an appropriate JsonRpcResponse is sent back to the caller.
   * If the request is a notification, the listeners are invoked but no response is sent back to the caller.
   * @param request
   */
  private processRequest = (request: JsonRpcRequest) => {
    if (request.id) {
      this.handlers
        .invoke(request.method, request.params)
        .then((result: any) => {
          const resMsg: JsonRpcResponse = {
            id: request.id,
            jsonrpc: request.jsonrpc,
            result: result,
          };
          this.jsonSend(resMsg);
        })
        .catch((error: any) => {
          const resMsg: JsonRpcResponse = {
            id: request.id,
            jsonrpc: request.jsonrpc,
            error: {
              code: -1,
              message: error.message || error,
              data: error.stack,
            },
          };
          this.jsonSend(resMsg);
        });
    } else this.listeners.notify(request.method, request.params);
  };

  /**
   * Processes the response of a standard method call.
   * It removes the pending request from the bag and either resolves or rejects the promise depending on the presence of an error.
   * @param response
   */
  private processResponse(response: JsonRpcResponse) {
    const pending: JsonRpcPendingRequest = this.pending[response.id];
    if (pending) {
      delete this.pending[response.id];
      if (response.error) pending.reject(response.error);
      else pending.resolve(response.result);
    }
  }

  /**
   * Receives an arbitrary json message from a remote and translates it to a standard method call, a notification or a response from a call.
   * @param message
   */
  receive(message: any) {
    if (Array.isArray(message)) this.processRequestArray(message);
    else if (message.method) this.processRequest(message);
    else this.processResponse(message);
  }

  /**
   * Performs a RPC call.
   * Creates a new pending JSON RPC request, stores it on the bag and sends the encoded json on the pipe.
   * @param method
   * @param params
   */
  call(method: string, ...params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = new JsonRpcPendingRequest();
      req.id = JsonRpc.createId();
      req.method = method;
      req.resolve = resolve;
      req.reject = reject;
      req.params = params;
      this.pending[req.id] = req;
      this.jsonSend(req);
    });
  }

  /**
   * Performs a RPC notification. That is a RPC request with no message id attached to it.
   * It simply creates the request and sends the encoded json on the pipe.
   * @param method
   * @param params
   */
  notify(method: string, ...params: any): void {
    const req: JsonRpcRequest = {
      method: method,
      params: params,
      jsonrpc: "2.0",
    };
    this.jsonSend(req);
  }

  /**
   * This method adds a listener that can be remotely invoked by name.
   * @param method
   * @param listener
   */
  addListener(method: string, listener: Listener) {
    this.listeners.addListener(method, listener);
  }

  /**
   * This method removes a listener from the listener collection.
   * @param method
   * @param listener
   */
  removeListener(method: string, listener: Listener) {
    this.listeners.removeListener(method, listener);
  }

  /**
   * This method sets the handler of a specific name, that can be invoked from a remote, by name.
   */
  setHandler(method: string, handler: Handler) {
    this.handlers.setHandler(method, handler);
  }

  /**
   * This method deletes the name, preventing any remotes from successfully calling the method.
   * @param method
   */
  removeHandler(method: string) {
    this.handlers.removeHandler(method);
  }

  /**
   * A static helper method to create time ascending, unique ids.
   */
  static createId(): string {
    return new Date().getTime().toString(36) + Math.random().toString(36);
  }
}
