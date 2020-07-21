import { DbFilter, DbFilterOperation } from "./DbFilters";
import { DbSort } from "./DbSorters";

export type DbKey = string | number;

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
export const getRecordKey = (
  record: any,
  keyPath: string | string[]
): IDBValidKey | IDBValidKey[] =>
  Array.isArray(keyPath)
    ? keyPath.map((k: string) => record[k])
    : record[keyPath];

/**
 * Utility to set a key or a key array to a record using the keyPath.
 * @param record
 * @param keyPath
 * @param key
 */
export const setRecordKey = (
  record: any,
  keyPath: string | string[],
  key: IDBValidKey | IDBValidKey[]
) => {
  if (Array.isArray(keyPath)) {
    for (let i = 0; i < keyPath.length; i++) record[keyPath[i]] = key[i];
  } else {
    record[keyPath] = key;
  }
};

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

export const createId = (): string => {
  return new Date().getTime().toString(36) + Math.random().toString(36);
};

export const ensureId = (schema: DbCollectionSchema, record: any) => {
  if (schema.autoIncrement === true) return;
  const keyPath = schema.keyPath || "_id";
  let key = record[keyPath];
  if (!key) {
    key = createId();
    record[keyPath] = key;
  }
};
