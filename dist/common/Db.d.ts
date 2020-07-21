import { DbCollectionDrop, DbRecordDelete, DbDatabaseDrop, DbRecordAdd, DbRecordPut } from "./DbEvents";
import { DbCollectionSchema, DbForEachParameters, DbKey, DbQueryParameters, DbSchema } from "./DbSchema";
import { DbFilter } from "./DbFilters";
/**
 * This is the skeleton of a database.
 * It exposes the schema as readonly, and a set of method for reaching the collections.
 * @author Rodrigo Portela
 */
export interface Db {
    getSchema(): DbSchema;
    getName(): string;
    getVersion(): number | undefined;
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
}
