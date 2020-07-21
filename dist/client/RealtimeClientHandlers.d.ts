/**
 * A standard handler. A function that receives an arbitrary number of parameters.
 * @author Rodrigo Portela
 */
export interface Handler {
    (caller?: any, ...params: any): any;
}
/**
 * This class wraps standard handler functionality.
 * Your are expected to associate your functions to well known names that can be transmitted over the network.
 * Typically, names are all caps and exposed as enums in typescript but feel free to use any string you like.
 * @author Rodrigo Portela
 */
export declare class Handlers {
    private handlers;
    /**
     * Sets a handler for a specific name. This can later be called by the invoke method.
     * @param name
     * @param handler
     */
    setHandler(name: string, handler: Handler): void;
    /**
     * Gets the handler of a specific name or undefined if no handler has been set for that name.
     * @param name
     */
    getHandler(name: string): Handler | undefined;
    /**
     * Deletes the handler of a specific name.
     * @param name
     */
    removeHandler(name: string): void;
    /**
     * Invokes the handler with a specific name passing the parameters.
     * If no handler is set for that name, the promise rejects with and Unknown Handler error.
     * @param name
     * @param params
     */
    invoke(name: string, ...params: any): Promise<any>;
}
