"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is supposed to wrap a promise with it's resolve and reject methods and be stored.
 * Once a remote RPC is completed, the corresponding methods should be called and the pending request removed from the store.
 * @author Rodrigo Portela
 */
class JsonRpcPendingRequest {
    constructor() {
        this.jsonrpc = "2.0";
    }
}
exports.default = JsonRpcPendingRequest;
