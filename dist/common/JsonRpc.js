"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonRpcPendingRequest_1 = require("./JsonRpcPendingRequest");
/**
 * Wraps all functionality of JSON RPC.
 * Handlers for standard method calls and listeners for remote notifications.
 * @author Rodrigo Portela
 */
class JsonRpc {
    constructor() {
        this.pending = {};
        /**
         * Processes a request. Either a standard method call or a notification.
         * If the request is a standard method call, an appropriate JsonRpcResponse is sent back to the caller.
         * If the request is a notification, the listeners are invoked but no response is sent back to the caller.
         * @param request
         */
        this.receiveRequest = (request) => {
            if (request.id) {
                try {
                    const res = this.handleCall(request.method, request.params);
                    const p = res.then ? res : Promise.resolve(res);
                    p.then((result) => this.respondSuccess(request, result)).catch((err) => this.respondError(request, err));
                }
                catch (err) {
                    this.respondError(request, err);
                }
            }
            else {
                try {
                    this.handleNotification(request.method, request.params);
                }
                catch (err) {
                    console.error(err);
                }
            }
        };
    }
    /**
   a  * Performs a RPC call.
     * Creates a new pending JSON RPC request, stores it on the bag and sends the encoded json on the pipe.
     * @param method
     * @param params
     */
    call(method, ...params) {
        return new Promise((resolve, reject) => {
            const req = new JsonRpcPendingRequest_1.default();
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
    notify(method, params) {
        const req = {
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
    receiveJson(json) {
        const message = JSON.parse(json);
        if (Array.isArray(message)) {
            message.forEach(this.receiveRequest);
        }
        else if (message.method) {
            this.receiveRequest(message);
        }
        else {
            this.receiveResponse(message);
        }
    }
    /**
     * Processes the response of a standard method call.
     * It removes the pending request from the bag and either resolves or rejects the promise depending on the presence of an error.
     * @param response
     */
    receiveResponse(response) {
        const pending = this.pending[response.id];
        if (pending) {
            delete this.pending[response.id];
            if (response.error)
                pending.reject(response.error);
            else
                pending.resolve(response.result);
        }
    }
    /**
     * Encodes a JSON response to send through the pipe with a specific result.
     * @param req
     * @param result
     */
    respondSuccess(req, result) {
        const msg = {
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
    respondError(req, err) {
        const msg = {
            id: req.id,
            jsonrpc: req.jsonrpc,
            error: {
                code: -1,
                message: err.message,
                data: err.stack,
            },
        };
        const json = JSON.stringify(msg);
        this.sendJson(json);
    }
    /**
     * A static helper method to create time ascending, unique ids.
     */
    static createId() {
        return new Date().getTime().toString(36) + Math.random().toString(36);
    }
}
exports.default = JsonRpc;
