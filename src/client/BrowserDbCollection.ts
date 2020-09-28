import {
  DatabaseCollectionImplementation,
  DatabaseCollectionSchema,
  DbKey,
} from "../common/DatabaseDefinition";
import { DatabaseFilter } from "../common/DatabaseFilters";
import { DatabaseSortExpression } from "../common/DatabaseSorters";

export default class BrowserDbCollection<T>
  implements DatabaseCollectionImplementation<T> {
  private db: IDBDatabase;
  private schema: DatabaseCollectionSchema;

  constructor(db: IDBDatabase, schema: DatabaseCollectionSchema) {
    this.db = db;
    this.schema = schema;
  }

  getDatabaseName() {
    return this.db.name;
  }
  getDatabaseVersion() {
    return this.db.version;
  }
  getName(): string {
    return this.schema.name;
  }
  getKeyPath(): string | string[] {
    return this.schema.keyPath;
  }
  isKeyAutoGenerated(): boolean {
    return this.schema.autoGenerated;
  }
  add(record: T): Promise<DbKey> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name, "readwrite")
        .objectStore(this.schema.name)
        .add(record);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result as any);
    });
  }
  addBatch(records: T[]): Promise<DbKey[]> {
    return new Promise((resolve, reject) => {
      const store = this.db
        .transaction(this.schema.name, "readwrite")
        .objectStore(this.schema.name);

      const promises = records.map(
        (record) =>
          new Promise<DbKey>((resolve, reject) => {
            const req = store.add(record);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result as DbKey);
          })
      );

      return Promise.all(promises).then(resolve).catch(reject);
    });
  }
  put(record: T): Promise<DbKey> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name, "readwrite")
        .objectStore(this.schema.name)
        .put(record);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result as any);
    });
  }
  putBatch(records: T[]): Promise<DbKey[]> {
    return new Promise((resolve, reject) => {
      const store = this.db
        .transaction(this.schema.name, "readwrite")
        .objectStore(this.schema.name);

      const promises = records.map(
        (record) =>
          new Promise<DbKey>((resolve, reject) => {
            const req = store.put(record);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result as DbKey);
          })
      );

      return Promise.all(promises).then(resolve).catch(reject);
    });
  }
  delete(key: DbKey): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name, "readwrite")
        .objectStore(this.schema.name)
        .delete(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  get(key: DbKey): Promise<T> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name)
        .objectStore(this.schema.name)
        .get(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  all(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name)
        .objectStore(this.schema.name)
        .getAll();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  filter(fn: (record: T) => boolean): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name)
        .objectStore(this.schema.name)
        .openCursor();
      const res = [];
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const record = cursor.value;
          if (fn(record)) res.push(record);
          cursor.continue();
        } else {
          resolve(res);
        }
      };
    });
  }
  map<G>(fn: (record: T) => G): Promise<G[]> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name)
        .objectStore(this.schema.name)
        .openCursor();
      const res: G[] = [];
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const record = cursor.value;
          res.push(fn(record));
          cursor.continue();
        } else {
          resolve(res);
        }
      };
    });
  }
  forEach(fn: (record: T) => void): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name)
        .objectStore(this.schema.name)
        .openCursor();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const record = cursor.value;
          fn(record);
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
  count(): Promise<number> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction(this.schema.name)
        .objectStore(this.schema.name)
        .count();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  query(
    filter: DatabaseFilter,
    sort?: DatabaseSortExpression,
    offset?: number,
    limit?: number
  ): Promise<T[]> {
    return this.filter(filter.createTest()).then((records) => {
      if (sort) sort.sort(records);
      if (offset)
        return limit
          ? records.slice(offset, offset + limit)
          : records.slice(offset);
      else if (limit) return records.slice(0, limit);
      else return records;
    });
  }
}