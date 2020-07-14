import { Handlers, Handler } from "./Handlers";
import { Listeners, Listener } from "./Listeners";

/**
 * A rpc call is represented by sending a Request object to a Server. The Request object has the following members:
 */
export interface JsonRpcRequest {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  jsonrpc: string;
  /**
   * A String containing the name of the method to be invoked.
   * Method names that begin with the word rpc followed by a period character (U+002E or ASCII 46) are
   * reserved for rpc-internal methods and extensions and MUST NOT be used for anything else.
   */
  method: string;

  /**
   * A Structured value that holds the parameter values to be used during the invocation of the method. This member MAY be omitted.s
   */
  params?: any[];

  /**
   * An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
   * If it is not included it is assumed to be a notification.
   * The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts.
   */
  id?: string | number;
}

/**
 * When a rpc call encounters an error, the Response Object MUST contain the error member with a value that is a Object with the following members:
 */
export interface JsonRpcError {
  /**
   * A Number that indicates the error type that occurred.
   * This MUST be an integer.
   */
  code: number;
  /**
   * A String providing a short description of the error.
   * The message SHOULD be limited to a concise single sentence.
   */
  message: string;
  /**
   * A Primitive or Structured value that contains additional information about the error.
   * This may be omitted.
   * The value of this member is defined by the Server (e.g. detailed error information, nested errors etc.).
   */
  data?: any;
}
/**
 * When a rpc call is made, the Server MUST reply with a Response, except for in the case of Notifications.
 * The Response is expressed as a single JSON Object, with the following members:
 */
export interface JsonRpcResponse {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  jsonrpc: string;

  /**
   * This member is REQUIRED on success.
   * This member MUST NOT exist if there was an error invoking the method.
   * The value of this member is determined by the method invoked on the Server.
   */
  result?: any;

  /**
   * This member is REQUIRED on error.
   * This member MUST NOT exist if there was no error triggered during invocation.
   * The value for this member MUST be an Object as defined in section 5.1.
   */
  error?: JsonRpcError;

  /**
   * An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
   * The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts.
   */
  id: string | number;
}

export class JsonRpcPendingRequest implements JsonRpcRequest {
  jsonrpc: string = "2.0";
  method: string;
  params?: any[];
  id?: string | number;
  resolve: (result: any) => void;
  reject: (error: JsonRpcError) => void;
}

export abstract class JsonRpc {
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

  protected abstract jsonSend(obj: any);

  private processRequestArray(requests: JsonRpcRequest[]) {
    requests.forEach((req) => this.processRequest(req));
  }

  private processRequest(request: JsonRpcRequest) {
    if (request.id) {
      this.handlers
        .invoke(request.method, request.params)
        .then((result) => {
          const resMsg: JsonRpcResponse = {
            id: request.id,
            jsonrpc: request.jsonrpc,
            result: result,
          };
          this.jsonSend(resMsg);
        })
        .catch((error: Error) => {
          const resMsg: JsonRpcResponse = {
            id: request.id,
            jsonrpc: request.jsonrpc,
            error: {
              code: -1,
              message: error.message,
              data: error.stack,
            },
          };
          this.jsonSend(resMsg);
        });
    } else this.listeners.notify(request.method, request.params);
  }

  private processResponse(response: JsonRpcResponse) {
    const pending: JsonRpcPendingRequest = this.pending[response.id];
    if (pending) {
      delete this.pending[response.id];
      if (response.error) pending.reject(response.error);
      else pending.resolve(response.result);
    }
  }

  receive(message: any) {
    if (Array.isArray(message)) this.processRequestArray(message);
    else if (message.method) this.processRequest(message);
    else this.processResponse(message);
  }

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

  notify(method: string, ...params: any): void {
    const req: JsonRpcRequest = {
      method: method,
      params: params,
      jsonrpc: "2.0",
    };
    this.jsonSend(req);
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

  static createId(): string {
    return new Date().getTime().toString(36) + Math.random().toString(36);
  }
}
