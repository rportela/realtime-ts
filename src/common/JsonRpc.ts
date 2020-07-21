import JsonRpcPendingRequest from "./JsonRpcPendingRequest";
import JsonRpcRequest from "./JsonRpcRequest";
import JsonRpcResponse from "./JsonRpcResponse";
import JsonRpcError from "./JsonRpcError";

/**
 * Wraps all functionality of JSON RPC.
 * Handlers for standard method calls and listeners for remote notifications.
 * @author Rodrigo Portela
 */
export default abstract class JsonRpc {
  private pending: any = {};

  protected abstract sendJson(json: string);
  protected abstract handleCall(method: string, params: any): Promise<any>;
  protected abstract handleNotification(method: string, params: any): void;

  /**
 a  * Performs a RPC call.
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
      const json = JSON.stringify(req);
      this.sendJson(json);
    });
  }

  notify(method: string, params?: any): void {
    const req: JsonRpcRequest = {
      method: method,
      jsonrpc: "2.0",
      params: params,
    };
    const json = JSON.stringify(req);
    this.sendJson(json);
  }

  /**
   * Receives an arbitrary json message from a remote and translates it to a standard method call, a notification or a response from a call.
   * @param message
   */
  protected receiveJson(json: string) {
    const message: any = JSON.parse(json);
    if (Array.isArray(message)) {
      (message as Array<JsonRpcRequest>).forEach(this.receiveRequest);
    } else if (message.method) {
      this.receiveRequest(message);
    } else {
      this.receiveResponse(message);
    }
  }

  /**
   * Processes the response of a standard method call.
   * It removes the pending request from the bag and either resolves or rejects the promise depending on the presence of an error.
   * @param response
   */
  private receiveResponse(response: JsonRpcResponse) {
    const pending: JsonRpcPendingRequest = this.pending[response.id];
    if (pending) {
      delete this.pending[response.id];
      if (response.error) pending.reject(response.error);
      else pending.resolve(response.result);
    }
  }

  /**
   * Processes a request. Either a standard method call or a notification.
   * If the request is a standard method call, an appropriate JsonRpcResponse is sent back to the caller.
   * If the request is a notification, the listeners are invoked but no response is sent back to the caller.
   * @param request
   */
  private receiveRequest = (request: JsonRpcRequest) => {
    if (request.id) {
      try {
        const res = this.handleCall(request.method, request.params);
        const p: Promise<any> = res.then ? res : Promise.resolve(res);
        p.then((result) => this.respondSuccess(request, result)).catch((err) =>
          this.respondError(request, err)
        );
      } catch (err) {
        this.respondError(request, err);
      }
    } else {
      try {
        this.handleNotification(request.method, request.params);
      } catch (err) {
        console.error(err);
      }
    }
  };

  /**
   * Encodes a JSON response to send through the pipe with a specific result.
   * @param req
   * @param result
   */
  protected respondSuccess(req: JsonRpcRequest, result: any) {
    const msg: JsonRpcResponse = {
      id: req.id,
      jsonrpc: req.jsonrpc,
      result: result,
    };
    const json = JSON.stringify(msg);
    this.sendJson(json);
  }

  /**
   * Encodes a JSON response to sen through the pipe with a specific error.
   * @param req
   * @param err
   */
  protected respondError(req: JsonRpcRequest, err: Error) {
    const msg: JsonRpcResponse = {
      id: req.id,
      jsonrpc: req.jsonrpc,
      error: {
        code: -1,
        message: err.message,
        data: err.stack,
      } as JsonRpcError,
    };
    const json = JSON.stringify(msg);
    this.sendJson(json);
  }

  /**
   * A static helper method to create time ascending, unique ids.
   */
  static createId(): string {
    return new Date().getTime().toString(36) + Math.random().toString(36);
  }
}
