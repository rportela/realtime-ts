import { DbCollection } from "../common/DbCollection";
import { DbCollectionSchema, DbKeyQuery } from "../common/DbSchema";
import BrowserDbIndex from "./BrowserDbIndex";
/**
 * The IDBObjectStore interface of the IndexedDB API represents an object store in a database.
 * Records within an object store are sorted according to their keys.
 * This sorting enables fast insertion, look-up, and ordered retrieval.
 *
 */
export default class BrowserDbCollection<T> implements DbCollection<T> {
    private schema;
    private db;
    constructor(db: Promise<IDBDatabase>, schema: DbCollectionSchema);
    getSchema(): DbCollectionSchema;
    getName(): string;
    getKeyPath(): string | string[];
    isAutoIncrement(): boolean;
    /**
     * In a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
     * This is for adding new records to an object store.
     *
     * @param record
     * @param key
     */
    add(record: T, key?: IDBValidKey): Promise<IDBValidKey>;
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
     * returns an IDBRequest object, and, in a separate thread, deletes the store object selected by the specified key.
     * This is for deleting individual records out of an object store.
     *
     * @param key
     */
    delete(key: DbKeyQuery): Promise<undefined>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns the store object store selected by the specified key.
     * This is for retrieving specific records from an object store.
     *
     * @param query
     */
    get(query: DbKeyQuery): Promise<T>;
    /**
     * Returns an IDBRequest object, and, in a separate thread retrieves and returns the record key for the object in the object stored matching the specified parameter.
     *
     * @param query
     */
    getKey(query: DbKeyQuery): Promise<IDBValidKey>;
    /**
     * Returns an IDBRequest object retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
     *
     * @param query
     * @param count
     */
    getAll(query?: DbKeyQuery, count?: number): Promise<T[]>;
    /**
     * Returns an IDBRequest object retrieves record keys for all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
     *
     * @param query
     * @param count
     */
    getAllKeys(query?: DbKeyQuery, count?: number): Promise<IDBValidKey[]>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object.
     * Used for iterating through an object store by primary key with a cursor.
     *
     * @param fn
     * @param query
     * @param direction
     */
    forEach(fn: (record: T) => void, query?: DbKeyQuery, direction?: IDBCursorDirection): Promise<undefined>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object.
     * Used for iterating through an object store by primary key with a cursor.
     *
     * @param fn
     * @param query
     * @param direction
     */
    forEachKey(fn: (key: IDBValidKey) => void, query?: DbKeyQuery, direction?: IDBCursorDirection): Promise<undefined>;
    /**
     * Returns an IDBRequest object, and, in a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
     * This is for updating existing records in an object store when the transaction's mode is readwrite.
     *
     * @param record
     * @param key
     */
    put(record: T, key?: IDBValidKey): Promise<IDBValidKey>;
    index<T>(name: string): Promise<BrowserDbIndex<T>>;
}
