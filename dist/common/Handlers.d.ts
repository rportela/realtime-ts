/**
 *
 */
export interface Handler {
    (...params: any[]): any;
}
/**
 *
 */
export declare class Handlers {
    private handlers;
    setHandler(method: string, handler: Handler): void;
    removeHandler(method: string): void;
    invoke(method: string, ...params: any[]): Promise<any>;
}
