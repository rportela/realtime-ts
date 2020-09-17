import { Db } from "../common/Db";
import { DbCollectionDrop, DbDatabaseDrop, DbRecordAdd, DbRecordDelete, DbRecordPut } from "../common/DbEvents";
import { DbFilter } from "../common/DbFilters";
import { DbCollectionSchema, DbForEachParameters, DbKey, DbQueryParameters, DbSchema } from "../common/DbSchema";
/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 * This API uses indexes to enable high-performance searches of this data.
 * While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.
 * IndexedDB provides a solution.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export default class BrowserDb implements Db {
    private schema;
    private open;
    constructor(schema: DbSchema);
    get<T>(collection: string, key: DbKey): Promise<T>;
    /**
     * Finds a collection schema by name.
     * @param collection
     */
    getCollectionSchema(collection: string): DbCollectionSchema;
    /**
     * Deletes the database.
     */
    dropDatabase(): Promise<DbDatabaseDrop>;
    /**
     * Clears all records of a specific collection.
     * @param name
     */
    dropCollection(name: string): Promise<DbCollectionDrop>;
    /**
     * Adds or updates a record in store with the given value and key.
     * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.
     * @param collection
     * @param record
     */
    add<T>(collection: string, record: T): Promise<DbRecordAdd<T>>;
    /**
     * Any existing record with the key will be replaced.
     * @param collection
     * @param record
     */
    put<T>(collection: string, record: T): Promise<DbRecordPut<T>>;
    /**
     * Deletes records in store with the given key or in the given key range in query.
     * If successful, request's result will be undefined.
     *
     * @param collection
     * @param key
     */
    delete(collection: string, key: DbKey): Promise<DbRecordDelete>;
    /**
     * Retrieves the number of records matching the given key or key range in query.
     * @param collection
     * @param filter
     */
    count(collection: string, filter?: DbFilter): Promise<number>;
    /**
     * Gets the first record matching a query.
     * @param params
     */
    first<T>(params: DbQueryParameters): Promise<T>;
    /**
     * Gets all the records matching a query.
     * @param params
     */
    select<T>(params: DbQueryParameters): Promise<T[]>;
    /**
     * Applies a function to all records matching a query.
     * @param params
     */
    forEach<T>(params: DbForEachParameters<T>): Promise<any>;
    /**
     * Gets the database schema.
     */
    getSchema(): DbSchema;
    /**
     * Gets the name of the database.
     */
    getName(): string;
    /**
     * Gets the version of the database.
     */
    getVersion(): number;
}
