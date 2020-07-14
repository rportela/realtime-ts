import { DbCollectionSchema, DbIndexSchema } from "../common/DbSchema";
import { DbCollection } from "../common/DbCollection";

/**
 * The IDBObjectStore interface of the IndexedDB API represents an object store in a database.
 * Records within an object store are sorted according to their keys.
 * This sorting enables fast insertion, look-up, and ordered retrieval.
 *
 */
export default class BrowserDbCollection<T> implements DbCollection<T> {
  readonly name: string;
  readonly keyPath?: string | string[];
  readonly autoIncrement?: boolean;
  readonly indexes?: DbIndexSchema[];
  private db: Promise<IDBDatabase>;

  constructor(db: Promise<IDBDatabase>, schema: DbCollectionSchema) {
    this.db = db;
    this.name = schema.name;
    this.keyPath = schema.keyPath;
    this.autoIncrement = schema.autoIncrement;
    this.indexes = schema.indexes;
  }

  /**
   * In a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
   * This is for adding new records to an object store.
   *
   * @param record
   * @param key
   */
  async add(record: T, key?: IDBValidKey): Promise<IDBValidKey> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name, "readwrite")
            .objectStore(this.name)
            .add(record, key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread.
   * This is for deleting all current records out of an object store.
   *
   */
  async clear(): Promise<undefined> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name, "readwrite")
            .objectStore(this.name)
            .clear();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
   * If no arguments are provided, it returns the total number of records in the collection.
   *
   * @param query
   */
  async count(
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<number> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .count(query);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * returns an IDBRequest object, and, in a separate thread, deletes the store object selected by the specified key.
   * This is for deleting individual records out of an object store.
   *
   * @param key
   */
  async delete(
    key:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<undefined> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name, "readwrite")
            .objectStore(this.name)
            .delete(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object, and, in a separate thread, returns the store object store selected by the specified key.
   * This is for retrieving specific records from an object store.
   *
   * @param query
   */
  async get(
    query:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<T> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .get(query);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object, and, in a separate thread retrieves and returns the record key for the object in the object stored matching the specified parameter.
   *
   * @param query
   */
  async getKey(
    query:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange
  ): Promise<IDBValidKey> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .getKey(query);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
   *
   * @param query
   * @param count
   */
  async getAll(
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange,
    count?: number
  ): Promise<T[]> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .getAll(query, count);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object retrieves record keys for all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
   *
   * @param query
   * @param count
   */
  async getAllKeys(
    query?:
      | string
      | number
      | Date
      | ArrayBufferView
      | ArrayBuffer
      | IDBArrayKey
      | IDBKeyRange,
    count?: number
  ): Promise<IDBValidKey[]> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .getAllKeys(query, count);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object.
   * Used for iterating through an object store by primary key with a cursor.
   *
   * @param fn
   * @param query
   * @param direction
   */
  async forEach(
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
  ): Promise<undefined> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .openCursor(query, direction);
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
              try {
                fn(cursor.value);
                cursor.continue();
              } catch (e) {
                reject(e);
              }
            } else resolve();
          };
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object.
   * Used for iterating through an object store by primary key with a cursor.
   *
   * @param fn
   * @param query
   * @param direction
   */
  async forEachKey(
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
  ): Promise<undefined> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name)
            .objectStore(this.name)
            .openKeyCursor(query, direction);
          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor) {
              try {
                fn(cursor.key);
                cursor.continue();
              } catch (e) {
                reject(e);
              }
            } else resolve();
          };
          req.onerror = () => reject(req.error);
        })
    );
  }

  /**
   * Returns an IDBRequest object, and, in a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
   * This is for updating existing records in an object store when the transaction's mode is readwrite.
   *
   * @param record
   * @param key
   */
  async put(record: T, key?: IDBValidKey): Promise<IDBValidKey> {
    return this.db.then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db
            .transaction(this.name, "readwrite")
            .objectStore(this.name)
            .put(record, key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    );
  }
}
