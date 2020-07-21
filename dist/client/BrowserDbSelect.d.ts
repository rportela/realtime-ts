import DbSelect from "../common/DbSelect";
export declare class BrowserDbSelect extends DbSelect {
    private dbPromise;
    constructor(dbPromise: Promise<IDBDatabase>);
    first(): Promise<any>;
    toArray(): Promise<any[]>;
}
