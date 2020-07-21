/**
 * A listener is a generic method that receives an arbitrary number of parameters.
 * @author Rodrigo Portela
 */
export interface Listener {
    (...params: any): void;
}
/**
 * This class is a dictionary of names and a an array of listeners.
 * You can easily notify the listeners of a specific key.
 * @author Rodrigo Portela
 */
export declare class Listeners {
    private listeners;
    /**
     * This method pushes a new listener to a specific named event.
     * It ignores methods that are already bound to the event represented by name.
     * @param name
     * @param listener
     */
    addListener(name: string, listener: Listener): void;
    /**
     * Removes a listener if found from the specific named event.
     * @param name
     * @param listener
     */
    removeListener(name: string, listener: Listener): void;
    /**
     * Notifies all listeners of a specific named event.
     * @param name
     * @param params
     */
    notify(name: string, ...params: any): void;
}
