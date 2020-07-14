import { Db } from "../common/Db";
import BrowserDbCollection from "./BrowserDbCollection";
import { DbSchema } from "../common/DbSchema";

/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 * This API uses indexes to enable high-performance searches of this data.
 * While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.
 * IndexedDB provides a solution.
 *
 */
export default class BrowserDb implements Db {
  readonly schema: DbSchema;
  private _collections: BrowserDbCollection<any>[];

  constructor(schema: DbSchema) {
    this.schema = schema;
    const open: Promise<IDBDatabase> = new Promise((resolve, reject) => {
      const req = indexedDB.open(schema.name, schema.version);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = () => {
        const db: IDBDatabase = req.result;
        for (const name of db.objectStoreNames) db.deleteObjectStore(name);
        for (const col of schema.collections) {
          const store = db.createObjectStore(col.name, {
            keyPath: col.keyPath,
            autoIncrement: col.autoIncrement,
          });
          if (col.indexes) {
            for (const idx of col.indexes) {
              store.createIndex(idx.name, idx.keyPath, { unique: idx.unique });
            }
          }
        }
      };
    });
    this._collections = schema.collections.map(
      (col) => new BrowserDbCollection(open, col)
    );
  }

  collection<T>(collection: string): BrowserDbCollection<T> {
    return this._collections.find((col) => col.name === collection);
  }
  collections(): BrowserDbCollection<any>[] {
    return this._collections;
  }
}
