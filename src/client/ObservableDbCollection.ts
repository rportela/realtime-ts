import { DbCollectionSchema } from "../common/DbSchema";
import { Listener, Listeners } from "../common/Listeners";
import BrowserDbCollection from "./BrowserDbCollection";

export enum ObservableDbCollectionEvent {
  COLLECTION_ERROR = "COLLECTION_ERROR",
  COLLECTION_ADD = "COLLECTION_ADD",
  COLLECTION_PUT = "COLLECTION_PUT",
  COLLECTION_DEL = "COLLECTION_DEL",
}

export interface ObservableDbCollectionSaveEvent {
  record: any;
  collection: string;
  keyPath: string | string[];
  key: IDBValidKey;
}

export interface ObservableDbCollectionDeleteEvent {
  collection: string;
  keyPath: string | string[];
  key: IDBValidKey;
}

export class ObservableDbCollection<T> {
  private listeners: Listeners;
  private collection: BrowserDbCollection<T>;

  constructor(collection: BrowserDbCollection<T>) {
    this.collection = collection;
    this.listeners = this.listeners;
  }

  schema(): DbCollectionSchema {
    return this.collection;
  }
  name(): string {
    return this.collection.name;
  }
  keyPath(): string | string[] {
    return this.collection.keyPath;
  }

  /**
   * In a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
   * This is for adding new records to an object store.
   *
   * @param record
   * @param key
   */
  async add(record: T, key?: IDBValidKey): Promise<IDBValidKey> {
    return this.collection
      .add(record)
      .then((key: IDBValidKey) => {
        const res: ObservableDbCollectionSaveEvent = {
          record: record,
          collection: this.collection.name,
          keyPath: this.collection.keyPath,
          key: key,
        };
        this.listeners.notify(ObservableDbCollectionEvent.COLLECTION_PUT, res);
        return res;
      })
      .catch((err) => {
        this.listeners.notify(
          ObservableDbCollectionEvent.COLLECTION_ERROR,
          err
        );
        return null;
      });
  }

  async put(record: T): Promise<ObservableDbCollectionSaveEvent> {
    return this.collection
      .put(record)
      .then((key: IDBValidKey) => {
        const res: ObservableDbCollectionSaveEvent = {
          record: record,
          collection: this.collection.name,
          keyPath: this.collection.keyPath,
          key: key,
        };
        this.listeners.notify(ObservableDbCollectionEvent.COLLECTION_PUT, res);
        return res;
      })
      .catch((err) => {
        this.listeners.notify(
          ObservableDbCollectionEvent.COLLECTION_ERROR,
          err
        );
        return null;
      });
  }

  /**
   * returns an IDBRequest object, and, in a separate thread, deletes the store object selected by the specified key.
   * This is for deleting individual records out of an object store.
   *
   * @param key
   */
  async delete(key: IDBValidKey): Promise<undefined> {
    return this.collection
      .delete(key)
      .then(() => {
        const res: ObservableDbCollectionDeleteEvent = {
          collection: this.collection.name,
          keyPath: this.collection.keyPath,
          key: key,
        };
        this.listeners.notify(ObservableDbCollectionEvent.COLLECTION_DEL, res);
        return res;
      })
      .catch((err) => {
        this.listeners.notify(
          ObservableDbCollectionEvent.COLLECTION_ERROR,
          err
        );
        return null;
      });
  }

  /**
   * Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread.
   * This is for deleting all current records out of an object store.
   *
   */
  async clear(): Promise<undefined> {
    return this.collection.clear();
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
    return this.collection.count(query);
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
    return this.collection.getAll(query, count);
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
    return this.collection.get(query);
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
    return this.collection.getKey(query);
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
    return this.collection.getAllKeys(query, count);
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
    return this.collection.forEach(fn, query, direction);
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
    return this.collection.forEachKey(fn, query, direction);
  }
  addListener(event: ObservableDbCollectionEvent, listener: Listener) {
    this.listeners.addListener(event, listener);
  }

  removeListener(event: ObservableDbCollectionEvent, listener: Listener) {
    this.listeners.removeListener(event, listener);
  }
}
