"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listeners = void 0;
class Listeners {
    constructor() {
        this.listeners = {};
    }
    addListener(method, listener) {
        const arr = this.listeners[method];
        if (!arr) {
            this.listeners[method] = [listener];
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
    notify(method, ...params) {
        const arr = this.listeners[method];
        if (arr) {
            arr.forEach((listener) => {
                try {
                    listener(params);
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
}
exports.Listeners = Listeners;
