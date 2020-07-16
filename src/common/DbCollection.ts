import { DbCollectionSchema } from "./DbSchema";

/**
 * Represents a database collection.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbCollection<T> extends DbCollectionSchema {
  /**
   * Stores the cloned value in the object store.
   * This is for adding new records to an object store.
   * @param record
   * @param key
   */
  add(record: T, key?: IDBValidKey): Promise<IDBValidKey>;

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
  count(
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<number>;

  /**
   * Deletes the store object selected by the specified key.
   * This is for deleting individual records out of an object store.
   * @param key
   */
  delete(
    key:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<undefined>;

  /**
   * Returns the store object store selected by the specified key.
   * This is for retrieving specific records from an object store.
   * @param query
   */
  get(
    query:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<T>;

  /**
   * Retrieves and returns the record key for the object in the object stored matching the specified parameter.
   * @param query
   */
  getKey(
    query:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<IDBValidKey>;

  /**
   * Retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
   * @param query
   * @param count
   */
  getAll(
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange,
    count?: number
  ): Promise<T[]>;

  /**
   * Retrieves record keys for all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
   * @param query
   * @param count
   */
  getAllKeys(
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange,
    count?: number
  ): Promise<IDBValidKey[]>;

  /**
   * Used for iterating through an object store by primary key with a cursor.
   * @param fn
   * @param query
   * @param direction
   */
  forEach(
    fn: (record: T) => void,
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange,
    direction?: IDBCursorDirection
  ): Promise<undefined>;

  /**
   * Used for iterating through an object store by primary key with a cursor.
   * @param fn
   * @param query
   * @param direction
   */
  forEachKey(
    fn: (key: IDBValidKey) => void,
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange,
    direction?: IDBCursorDirection
  ): Promise<undefined>;

  /**
   * This is for updating existing records in an object store when the transaction's mode is readwrite.
   *
   * @param record
   * @param key
   */
  put(record: T, key?: IDBValidKey): Promise<IDBValidKey>;
}
