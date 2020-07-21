import { DbCollectionSchema, DbKeyQuery } from "./DbSchema";
import { DbFilter } from "./DbFilters";
import { DbSort } from "./DbSorters";
/**
 * Represents a database collection.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbCollection<T> {
    /**
     * Gets the schema of the collection.
     */
    getSchema(): DbCollectionSchema;
    /**
     * Gets the name of the collection.
     */
    getName(): string;
    /**
     * Gets the key path of the collection.
     */
    getKeyPath(): string | string[];
    /**
     * Checks if the collection key is auto incremented.
     */
    isAutoIncrement(): boolean;
    /**
     * Stores the cloned value in the object store.
     * This is for adding new records to an object store.
     * @param record
     */
    add(record: T): Promise<IDBValidKey>;
    /**
     * This is for updating existing records in an object store when the transaction's mode is readwrite.
     *
     * @param record
     * @param key
     */
    put(record: T): Promise<IDBValidKey>;
    /**
     * Deletes the store object selected by the specified key.
     * This is for deleting individual records out of an object store.
     * @param key
     */
    delete(key: DbKeyQuery): Promise<undefined>;
    /**
     * Clears this object store in a separate thread.
     * This is for deleting all current records out of an object store.
     */
    clear(): Promise<undefined>;
    /**
     * Returns the total number of records that match the provided key or IDBKeyRange.
     * If no arguments are provided, it returns the total number of records in the collection.
     * @param query
     */
    count(query?: DbKeyQuery): Promise<number>;
    /**
     * Returns the store object store selected by the specified key.
     * This is for retrieving specific records from an object store.
     * @param query
     */
    get(query: DbKeyQuery): Promise<T>;
    /**
     * Retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
     * @param query
     * @param count
     */
    getAll(query?: DbKeyQuery, count?: number): Promise<T[]>;
    /**
     * Used for iterating through an object store by primary key with a cursor.
     * @param fn
     * @param query
     * @param direction
     */
    forEach(fn: (record: T) => void, query?: DbKeyQuery, direction?: IDBCursorDirection): Promise<any>;
    /**
     * Extended functionality to select records from the collection.
     * @param where
     * @param orderBy
     * @param offset
     * @param limit
     */
    select(where?: DbFilter, orderBy?: DbSort, offset?: number, limit?: number): Promise<any[]>;
}
