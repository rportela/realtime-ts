"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = void 0;
/**
 * This class wraps standard handler functionality.
 * Your are expected to associate your functions to well known names that can be transmitted over the network.
 * Typically, names are all caps and exposed as enums in typescript but feel free to use any string you like.
 * @author Rodrigo Portela
 */
class Handlers {
    constructor() {
        this.handlers = {};
    }
    /**
     * Sets a handler for a specific name. This can later be called by the invoke method.
     * @param name
     * @param handler
     */
    setHandler(name, handler) {
        this.handlers[name] = handler;
    }
    /**
     * Gets the handler of a specific name or undefined if no handler has been set for that name.
     * @param name
     */
    getHandler(name) {
        return this.handlers[name];
    }
    /**
     * Deletes the handler of a specific name.
     * @param name
     */
    removeHandler(name) {
        delete this.handlers[name];
    }
    /**
     * Invokes the handler with a specific name passing the parameters.
     * If no handler is set for that name, the promise rejects with and Unknown Handler error.
     * @param name
     * @param params
     */
    invoke(name, ...params) {
        return new Promise((resolve, reject) => {
            const handler = this.handlers[name];
            if (handler) {
                try {
                    const result = handler(params);
                    if (result && result.then)
                        result.then(resolve).catch(reject);
                    else
                        resolve(result);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                reject(new Error("Unknown handler " + name));
            }
        });
    }
}
exports.Handlers = Handlers;
