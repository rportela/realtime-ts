"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listeners = void 0;
class Listeners {
    constructor() {
        this.listeners = {};
    }
    addListener(event, listener) {
        let l = this.listeners[event];
        if (l === undefined) {
            l = [listener];
            this.listeners[event] = l;
        }
        else {
            const idx = l.indexOf(listener);
            if (idx < 0)
                l.push(listener);
        }
    }
    removeListener(event, listener) {
        const l = this.listeners[event];
        if (l) {
            const idx = l.indexOf(listener);
            if (idx >= 0)
                l.splice(idx, 1);
        }
    }
    notify(event, ...params) {
        const l = this.listeners[event];
        if (l) {
            l.forEach((listener) => {
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
