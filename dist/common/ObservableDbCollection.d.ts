import { Listener } from "../common/Listeners";
import { DbCollection } from "./DbCollection";
import { DbCollectionSchema, DbKeyQuery } from "./DbSchema";
import { ObservableDb } from "./ObservableDb";
import { ObservableDbCollectionEvent } from "./ObservableDbEvent";
export default class ObservableDbCollection<T> implements DbCollection<T> {
    private db;
    private listeners;
    private collection;
    constructor(db: ObservableDb, collection: DbCollection<T>);
    getSchema(): DbCollectionSchema;
    getName(): string;
    getKeyPath(): string | string[];
    isAutoIncrement(): boolean;
    addListener(event: ObservableDbCollectionEvent, listener: Listener): void;
    removeListener(event: ObservableDbCollectionEvent, listener: Listener): void;
    /**
     * In a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
     * This is for adding new records to an object store.
     *
     * @param record
     * @param key
     */
    add(record: T): Promise<IDBValidKey>;
    put(record: T): Promise<IDBValidKey>;
    /**
     * returns an IDBRequest object, and, in a separate thread, deletes the store object selected by the specified key.
     * This is for deleting individual records out of an object store.
     *
     * @param key
     */
    delete(key: IDBValidKey): Promise<undefined>;
    /**
     * Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread.
     * This is for deleting all current records out of an object store.
     *
     */
    clear(): Promise<undefined>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
     * If no arguments are provided, it returns the total number of records in the collection.
     *
     * @param query
     */
    count(query?: DbKeyQuery): Promise<number>;
    /**
     * Returns an IDBRequest object retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
     *
     * @param query
     * @param count
     */
    getAll(query?: DbKeyQuery, count?: number): Promise<T[]>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns the store object store selected by the specified key.
     * This is for retrieving specific records from an object store.
     *
     * @param query
     */
    get(query: DbKeyQuery): Promise<T>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object.
     * Used for iterating through an object store by primary key with a cursor.
     *
     * @param fn
     * @param query
     * @param direction
     */
    forEach(fn: (record: T) => void, query?: DbKeyQuery, direction?: IDBCursorDirection): Promise<undefined>;
}
