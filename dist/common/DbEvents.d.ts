import { DbKey } from "./DbSchema";
export declare enum DbEvent {
    DB_RECORD_ADD = "DB_RECORD_ADD",
    DB_RECORD_PUT = "DB_RECORD_PUT",
    DB_RECORD_DELETE = "DB_RECORD_DELETE",
    DB_COLLECTION_DROP = "DB_COLLECTION_DROP",
    DB_DATABASE_DROP = "DB_DATABASE_DROP"
}
export interface DbRecordAdd<T> {
    db: string;
    collection: string;
    record: T;
    key: DbKey;
    when: Date;
}
export interface DbRecordPut<T> {
    db: string;
    collection: string;
    record: T;
    key: DbKey;
    when: Date;
}
export declare type DbRecordSave<T> = DbRecordAdd<T> | DbRecordPut<T>;
export interface DbRecordDelete {
    db: string;
    collection: string;
    key: DbKey;
    when: Date;
}
export interface DbDatabaseDrop {
    db: string;
    when: Date;
}
export interface DbCollectionDrop {
    db: string;
    collection: string;
    when: Date;
}
