import { Cursor } from "mongodb";
import { Db } from "../common/Db";
import { DbFilter } from "../common/DbFilters";
import { DbCollectionSchema, DbForEachParameters, DbKey, DbQueryParameters, DbSchema } from "../common/DbSchema";
import { DbDatabaseDrop, DbCollectionDrop, DbRecordAdd, DbRecordPut, DbRecordDelete } from "../common/DbEvents";
export default class MongoDb implements Db {
    private schema;
    private open;
    constructor(schema: DbSchema, url?: string);
    getSchema(): DbSchema;
    getName(): string;
    getVersion(): number;
    getCollectionSchema(collection: string): DbCollectionSchema;
    dropDatabase(): Promise<DbDatabaseDrop>;
    dropCollection(name: string): Promise<DbCollectionDrop>;
    add<T>(collection: string, record: T): Promise<DbRecordAdd<T>>;
    put<T>(collection: string, record: T): Promise<DbRecordPut<T>>;
    delete<T>(collection: string, key: DbKey): Promise<DbRecordDelete>;
    count(collection: string, filter?: DbFilter): Promise<number>;
    createCursor<T>(params: DbQueryParameters): Promise<Cursor<T>>;
    first<T>(params: DbQueryParameters): Promise<T>;
    select<T>(params: DbQueryParameters): Promise<T[]>;
    forEach<T>(params: DbForEachParameters<T>): Promise<any>;
}
