/**
 *
 */
export declare enum ObservableDbEvent {
    OPEN_ERROR = "OPEN_ERROR",
    OPEN_BLOCKED = "OPEN_BLOCKED",
    OPEN_SUCCESS = "OPEN_SUCCESS"
}
export declare enum ObservableDbCollectionEvent {
    COLLECTION_ERROR = "COLLECTION_ERROR",
    COLLECTION_ADD = "COLLECTION_ADD",
    COLLECTION_PUT = "COLLECTION_PUT",
    COLLECTION_DEL = "COLLECTION_DEL"
}
export interface ObservableDbSaveParams {
    db: string;
    collection: string;
    record: any;
    keyPath: string | string[];
    key: IDBValidKey;
}
export interface ObservableDbDeleteParams {
    db: string;
    collection: string;
    keyPath: string | string[];
    key: IDBValidKey;
}
