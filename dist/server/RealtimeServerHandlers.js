"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeServerHandlers = void 0;
class RealtimeServerHandlers {
    constructor() {
        this.handlers = {};
    }
    setHandler(name, handler) {
        this.handlers[name] = handler;
    }
    removeHandler(name) {
        delete this.handlers[name];
    }
    invoke(method, client, params) {
        return new Promise((resolve, reject) => {
            const handler = this.handlers[method];
            if (handler) {
                try {
                    const res = handler(client, params);
                    if (res && res.then)
                        res.then(resolve).catch(reject);
                    else
                        resolve(res);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject(new Error("Handler not found for " + method));
            }
        });
    }
}
exports.RealtimeServerHandlers = RealtimeServerHandlers;
