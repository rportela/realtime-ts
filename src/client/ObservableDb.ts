import { DbSchema } from "../common/DbSchema";
import { Listener, Listeners } from "../common/Listeners";
import { ObservableDbCollection } from "./ObservableDbCollection";
import BrowserDb from "./BrowserDb";
export enum ObservableDbEvent {
  OPEN_ERROR = "OPEN_ERROR",
  OPEN_BLOCKED = "OPEN_BLOCKED",
  OPEN_SUCCESS = "OPEN_SUCCESS",
}
export class ObservableDb {
  private listeners: Listeners;
  private browserDb: BrowserDb;
  private collections: ObservableDbCollection<any>[];

  constructor(schema: DbSchema) {
    this.listeners = new Listeners();
    this.browserDb = new BrowserDb(schema);
    this.collections = this.browserDb
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
  static drop(name: string): void {
    indexedDB.deleteDatabase(name);
  }
}
