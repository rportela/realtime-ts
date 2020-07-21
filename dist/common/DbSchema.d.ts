import { DbFilter } from "./DbFilters";
import { DbSort } from "./DbSorters";
export declare type DbKey = string | number;
/**
 * Represents a database index schema.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbIndexSchema {
    readonly name: string;
    readonly keyPath: string | string[];
    readonly unique: boolean;
}
/**
 * Represents a database collection schema;
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbCollectionSchema {
    readonly name: string;
    readonly keyPath?: string;
    readonly autoIncrement?: boolean;
    readonly indexes?: DbIndexSchema[];
}
/**
 * Represents a database schema;
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbSchema {
    readonly name: string;
    readonly version?: number;
    readonly collections: DbCollectionSchema[];
}
/**
 * Utility to get a key or a key array from a record using the keyPath.
 * @param record
 * @param keyPath
 */
export declare const getRecordKey: (record: any, keyPath: string | string[]) => IDBValidKey | IDBValidKey[];
/**
 * Utility to set a key or a key array to a record using the keyPath.
 * @param record
 * @param keyPath
 * @param key
 */
export declare const setRecordKey: (record: any, keyPath: string | string[], key: IDBValidKey | IDBValidKey[]) => void;
export interface DbQueryParameters {
    collection: string;
    where?: DbFilter;
    orderBy?: DbSort;
    offset?: number;
    limit?: number;
}
export interface DbForEachParameters<T> extends DbQueryParameters {
    iterator: (record: T) => void;
}
export declare const createId: () => string;
export declare const ensureId: (schema: DbCollectionSchema, record: any) => void;
