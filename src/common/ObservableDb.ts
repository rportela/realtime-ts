import { Db } from "./Db";
import { Listener, Listeners } from "./Listeners";
import { ObservableDbCollection } from "./ObservableDbCollection";

/**
 *
 */
export enum ObservableDbEvent {
  OPEN_ERROR = "OPEN_ERROR",
  OPEN_BLOCKED = "OPEN_BLOCKED",
  OPEN_SUCCESS = "OPEN_SUCCESS",
}
/**
 *
 */
export class ObservableDb {
  private listeners: Listeners;
  private db: Db;
  private collections: ObservableDbCollection<any>[];

  constructor(db: Db) {
    this.listeners = new Listeners();
    this.db = db;
    this.collections = this.db
      .collections()
      .map((col) => new ObservableDbCollection(col));
  }

  addListener(event: ObservableDbEvent, listener: Listener) {
    this.listeners.addListener(event, listener);
  }
  removeListener(event: ObservableDbEvent, listener: Listener) {
    this.listeners.removeListener(event, listener);
  }
  collection<T>(name: string): ObservableDbCollection<T> {
    return this.collections.find((col) => name === col.name());
  }
}
