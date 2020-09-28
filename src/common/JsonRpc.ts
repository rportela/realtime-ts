import { Handler, Handlers } from "./Handlers";
import { Listener, Listeners } from "./Listeners";

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
 * This class is supposed to wrap a promise with it's resolve and reject methods and be stored.
 * Once a remote RPC is completed, the corresponding methods should be called and the pending request removed from the store.
 * @author Rodrigo Portela
 */
export class JsonRpcPendingRequest implements JsonRpcRequest {
  jsonrpc: string = "2.0";
  method: string;
  params?: any[];
  id?: string | number;
  created_at: Date = new Date();
  resolve: (result: any) => void;
  reject: (error: JsonRpcError) => void;
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

/**
 * Wraps all functionality of JSON RPC.
 * Handlers for standard method calls and listeners for remote notifications.
 * @author Rodrigo Portela
 */
export abstract class JsonRpc {
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
      const res = this.handleCall(request.method, request.params);
      const p: Promise<any> = res.then ? res : Promise.resolve(res);
      p.then((result) => this.respondSuccess(request, result)).catch((err) =>
        this.respondError(request, err)
      );
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

export abstract class JsonRpcBus extends JsonRpc {
  private handlers: Handlers;
  private listeners: Listeners;
  constructor(handlers?: Handlers, listeners?: Listeners) {
    super();
    this.handlers = handlers || new Handlers();
    this.listeners = listeners || new Listeners();
  }

  protected handleCall(method: string, params: any): Promise<any> {
    return this.handlers.invoke(method, params);
  }
  protected handleNotification(method: string, params: any): void {
    return this.listeners.notify(method, params);
  }

  setHandler(method: string, handler: Handler) {
    this.handlers.setHandler(method, handler);
  }
  removeHandler(method: string) {
    this.handlers.removeHandler(method);
  }
  invokeLocalHandler(method: string, ...params: any[]) {
    this.handlers.invoke(method, params);
  }
  addListener(event: string, listener: Listener) {
    this.listeners.addListener(event, listener);
  }
  removeListener(event: string, listener: Listener) {
    this.listeners.removeListener(event, listener);
  }
  notifyLocalListener(event: string, ...params: any[]) {
    this.listeners.notify(event, params);
  }
}
