import { Db } from "../common/Db";
import { DbCollectionDrop, DbDatabaseDrop, DbRecordAdd, DbRecordDelete, DbRecordPut } from "../common/DbEvents";
import { DbFilter } from "../common/DbFilters";
import { DbCollectionSchema, DbForEachParameters, DbKey, DbQueryParameters, DbSchema } from "../common/DbSchema";
/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 * This API uses indexes to enable high-performance searches of this data.
 * While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.
 * IndexedDB provides a solution.
 *
 */
export default class BrowserDb implements Db {
    private schema;
    private open;
    constructor(schema: DbSchema);
    getCollectionSchema(collection: string): DbCollectionSchema;
    dropDatabase(): Promise<DbDatabaseDrop>;
    dropCollection(name: string): Promise<DbCollectionDrop>;
    add<T>(collection: string, record: T): Promise<DbRecordAdd<T>>;
    put<T>(collection: string, record: T): Promise<DbRecordPut<T>>;
    delete(collection: string, key: DbKey): Promise<DbRecordDelete>;
    count(collection: string, filter?: DbFilter): Promise<number>;
    first<T>(params: DbQueryParameters): Promise<T>;
    select<T>(params: DbQueryParameters): Promise<T[]>;
    forEach<T>(params: DbForEachParameters<T>): Promise<any>;
    getSchema(): DbSchema;
    getName(): string;
    getVersion(): number;
}
