import { Db } from "./Db";
import { DbCollectionDrop, DbEvent, DbRecordAdd, DbRecordDelete, DbRecordPut, DbDatabaseDrop } from "./DbEvents";
import { DbFilter } from "./DbFilters";
import { DbCollectionSchema, DbForEachParameters, DbKey, DbQueryParameters, DbSchema } from "./DbSchema";
import { Listener } from "../common/Listeners";
/**
 * This is an observable DB.
 * You and add listeners to any collection and be notified when records are added, put or deleted.
 */
export default class ObservableDb implements Db {
    private listeners;
    private db;
    constructor(db: Db);
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
    first<T>(params: DbQueryParameters): Promise<T>;
    select<T>(params: DbQueryParameters): Promise<T[]>;
    forEach<T>(params: DbForEachParameters<T>): Promise<any>;
    addListener(event: DbEvent, listener: Listener): void;
    removeListener(event: DbEvent, listener: Listener): void;
}
