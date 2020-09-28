import {
  DatabaseImplementation,
  DatabaseSchema
} from "./DatabaseDefinition";
import { Listener, Listeners } from "./Listeners";
import { ObservableDbCollection } from "./ObservableDbCollection";

export enum ObservableDbEvent {
  OBS_DB_DROP = "OBS_DB_DROP",
}

/**
 * This is an observable DB.
 * You and add listeners to any collection and be notified when records are added, put or deleted.
 */
export default class ObservableDb implements DatabaseImplementation {
  private listeners: Listeners;
  private db: DatabaseImplementation;
  private collections: Promise<ObservableDbCollection<any>[]>;

  constructor(db: DatabaseImplementation) {
    this.db = db;
    this.collections = this.db
      .getCollections()
      .then((cols) => cols.map((col) => new ObservableDbCollection(col)));
    this.listeners = new Listeners();
  }

  getName(): string {
    return this.db.getName();
  }
  getVersion(): number {
    return this.db.getVersion();
  }
  getCollections(): Promise<ObservableDbCollection<any>[]> {
    return this.collections;
  }
  getCollection<T>(name: string): Promise<ObservableDbCollection<T>> {
    return this.getCollections().then((cols) =>
      cols.find((col) => col.getName() === name)
    );
  }
  drop(): Promise<unknown> {
    return this.db
      .drop()
      .then(() => this.listeners.notify(ObservableDbEvent.OBS_DB_DROP, this));
  }
  addListener(event: ObservableDbEvent, listener: Listener) {
    this.listeners.addListener(event, listener);
  }
  removeListener(event: ObservableDbEvent, listener: Listener) {
    this.listeners.removeListener(event, listener);
  }
  getSchema(): DatabaseSchema {
    return this.db.getSchema();
  }
}
