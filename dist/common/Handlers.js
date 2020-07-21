"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = void 0;
class Handlers {
    constructor() {
        this.handlers = {};
    }
    setHandler(method, handler) {
        this.handlers[method] = handler;
    }
    removeHandler(method) {
        delete this.handlers[method];
    }
    invoke(method, ...params) {
        return new Promise((resolve, reject) => {
            const handler = this.handlers[method];
            if (handler) {
                try {
                    const result = handler(params);
                    if (result && result.then)
                        result.then(resolve).catch(reject);
                    else
                        resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject(new Error("No handler found for " + method));
            }
        });
    }
}
exports.Handlers = Handlers;
