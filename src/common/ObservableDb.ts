import { Db } from "./Db";
import {
  DbCollectionDrop,
  DbEvent,
  DbRecordAdd,
  DbRecordDelete,
  DbRecordPut,
  DbDatabaseDrop,
} from "./DbEvents";
import { DbFilter } from "./DbFilters";
import {
  DbCollectionSchema,
  DbForEachParameters,
  DbKey,
  DbQueryParameters,
  DbSchema,
} from "./DbSchema";
import { Listener, Listeners } from "../common/Listeners";

/**
 * This is an observable DB.
 * You and add listeners to any collection and be notified when records are added, put or deleted.
 */
export default class ObservableDb implements Db {
  private listeners: Listeners = new Listeners();
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  getSchema(): DbSchema {
    return this.db.getSchema();
  }

  getName(): string {
    return this.db.getName();
  }
  getVersion(): number {
    return this.db.getVersion();
  }
  getCollectionSchema(collection: string): DbCollectionSchema {
    return this.db.getCollectionSchema(collection);
  }
  dropDatabase(): Promise<DbDatabaseDrop> {
    return this.db.dropDatabase().then((event: DbDatabaseDrop) => {
      this.listeners.notify(DbEvent.DB_DATABASE_DROP, event);
      return event;
    });
  }
  dropCollection(name: string): Promise<DbCollectionDrop> {
    return this.db.dropCollection(name).then((event: DbCollectionDrop) => {
      this.listeners.notify(DbEvent.DB_COLLECTION_DROP, event);
      return event;
    });
  }
  add<T>(collection: string, record: T): Promise<DbRecordAdd<T>> {
    return this.db.add(collection, record).then((event: DbRecordAdd<T>) => {
      this.listeners.notify(DbEvent.DB_RECORD_ADD, event);
      return event;
    });
  }
  put<T>(collection: string, record: T): Promise<DbRecordPut<T>> {
    return this.db.put(collection, record).then((event: DbRecordPut<T>) => {
      this.listeners.notify(DbEvent.DB_RECORD_PUT, event);
      return event;
    });
  }
  delete<T>(collection: string, key: DbKey): Promise<DbRecordDelete> {
    return this.db.delete(collection, key).then((event: DbRecordDelete) => {
      this.listeners.notify(DbEvent.DB_RECORD_DELETE, event);
      return event;
    });
  }
  count(collection: string, filter?: DbFilter): Promise<number> {
    return this.db.count(collection, filter);
  }
  first<T>(params: DbQueryParameters): Promise<T> {
    return this.db.first(params);
  }
  select<T>(params: DbQueryParameters): Promise<T[]> {
    return this.db.select(params);
  }
  forEach<T>(params: DbForEachParameters<T>): Promise<any> {
    return this.db.forEach(params);
  }
  addListener(event: DbEvent, listener: Listener) {
    this.listeners.addListener(event, listener);
  }
  removeListener(event: DbEvent, listener: Listener) {
    this.listeners.removeListener(event, listener);
  }
}
