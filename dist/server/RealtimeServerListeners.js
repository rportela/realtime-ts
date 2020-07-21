"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeServerListeners = void 0;
class RealtimeServerListeners {
    constructor() {
        this.listeners = {};
    }
    addListener(method, listener) {
        let arr = this.listeners[method];
        if (!arr) {
            arr = [listener];
            this.listeners[method] = arr;
        }
        else {
            const idx = arr.indexOf(listener);
            if (idx < 0)
                arr.push(listener);
        }
    }
    removeListener(method, listener) {
        const arr = this.listeners[method];
        if (arr) {
            const idx = arr.indexOf(listener);
            if (idx >= 0)
                arr.splice(idx, 1);
        }
    }
    notify(method, client, params) {
        const arr = this.listeners[method];
        if (arr) {
            try {
                arr.forEach((listener) => listener(client, params));
            }
            catch (err) {
                console.error(err);
            }
        }
    }
}
exports.RealtimeServerListeners = RealtimeServerListeners;
