"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listeners = void 0;
/**
 * This class is a dictionary of names and a an array of listeners.
 * You can easily notify the listeners of a specific key.
 * @author Rodrigo Portela
 */
class Listeners {
    constructor() {
        this.listeners = {};
    }
    /**
     * This method pushes a new listener to a specific named event.
     * It ignores methods that are already bound to the event represented by name.
     * @param name
     * @param listener
     */
    addListener(name, listener) {
        let lst = this.listeners[name];
        if (lst === undefined) {
            lst = [listener];
            this.listeners[name] = lst;
        }
        else {
            const i = lst.indexOf(listener);
            if (i < 0)
                lst.push(listener);
        }
    }
    /**
     * Removes a listener if found from the specific named event.
     * @param name
     * @param listener
     */
    removeListener(name, listener) {
        let lst = this.listeners[name];
        if (lst) {
            const i = lst.indexOf(listener);
            if (i >= 0)
                lst.splice(i, 0);
        }
    }
    /**
     * Notifies all listeners of a specific named event.
     * @param name
     * @param params
     */
    notify(name, ...params) {
        let lst = this.listeners[name];
        if (lst) {
            lst.forEach((l) => {
                try {
                    l(params);
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
}
exports.Listeners = Listeners;
