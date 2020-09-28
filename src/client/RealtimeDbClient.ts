import { DatabaseSchema } from "../common/DatabaseDefinition";
import ObservableDb from "../common/ObservableDb";
import {
  ObservableDbCollection,
  ObservableDbEvents,
  ObservableDbKeyInfo,
  ObservableDbRecordInfo,
} from "../common/ObservableDbCollection";
import { RealtimeDbEvent } from "../common/RealtimeDbEvent";
import BrowserDb from "./BrowserDb";
import JsonRpcClient from "./JsonRpcClient";

const RTSDB_SCHEMA = "RTSDB_SCHEMA";

/**
 *
 */
export default class RealtimeDbClient extends JsonRpcClient {
  private dbs: Promise<ObservableDb[]>;
  private resolveDbs: (dbs: ObservableDb[]) => void;
  private rejectDbs: (err: any) => void;

  /**
   * Instantiates a new instance of a realtime Db Client.
   * @param url
   * @param protocols
   */
  constructor(
    url: string = "ws://localhost",
    protocols: string[] = ["wss", "ws"]
  ) {
    super(url, protocols);
    this.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_ADD,
      this.onRemoteAdd
    );
    this.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_PUT,
      this.onRemotePut
    );
    this.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_DEL,
      this.onRemoteDelete
    );
    if (!this.loadLocalSchema()) {
      this.dbs = new Promise((resolve, reject) => {
        this.resolveDbs = resolve;
        this.rejectDbs = reject;
      });
    }
  }

  private loadLocalSchema() {
    const localSchema = localStorage.getItem(RTSDB_SCHEMA);
    if (localSchema) {
      try {
        const schemas: DatabaseSchema[] = JSON.parse(localSchema);
        this.dbs = Promise.resolve(schemas.map((s) => this.createLocalDb(s)));
        return true;
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  /**
   * Creates an instance and attaches listeners for the client db.
   * @param schema
   */
  private createLocalDb = (schema: DatabaseSchema): ObservableDb => {
    const db = new ObservableDb(new BrowserDb(schema));
    db.getCollections().then((cols) =>
      cols.forEach((col) =>
        this.attachCollection(col as ObservableDbCollection<any>)
      )
    );
    return db;
  };

  private attachCollection = (col: ObservableDbCollection<any>) => {
    col.addListener(ObservableDbEvents.OBS_DB_COLLECTION_ADD, this.onLocalAdd);
    col.addListener(ObservableDbEvents.OBS_DB_COLLECTION_PUT, this.onLocalPut);
    col.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_DEL,
      this.onLocalDelete
    );
  };

  /**
   * Detaches event listeners from the client db instance.
   * @param db
   */
  private removeLocalDb = (db: ObservableDb) => {
    db.getCollections().then((cols) =>
      cols.forEach((col) =>
        this.detachCollection(col as ObservableDbCollection<any>)
      )
    );
  };

  private detachCollection = (col: ObservableDbCollection<any>) => {
    col.removeListener(
      ObservableDbEvents.OBS_DB_COLLECTION_ADD,
      this.onLocalAdd
    );
    col.removeListener(
      ObservableDbEvents.OBS_DB_COLLECTION_PUT,
      this.onLocalPut
    );
    col.removeListener(
      ObservableDbEvents.OBS_DB_COLLECTION_DEL,
      this.onLocalDelete
    );
  };

  /**
   * Handler for the get schema call.
   * @param params
   */
  private onRemoteSchema = (params: DatabaseSchema[]) => {
    const localSchema = localStorage.getItem(RTSDB_SCHEMA);
    const pre: Promise<unknown> = localSchema
      ? this.dbs.then((dbs) => dbs.forEach((db) => this.removeLocalDb(db)))
      : Promise.resolve();
    localStorage.setItem(RTSDB_SCHEMA, JSON.stringify(params));
    this.dbs = pre.then(() => params.map((s) => this.createLocalDb(s)));
  };

  /**
   * Event raised when a connection is established.
   */
  protected onConnect = () => {
    super.onConnect();
    this.call(RealtimeDbEvent.SCHEMA).then(this.onRemoteSchema);
  };

  /**
   * Event raised when a record is added to the remote database.
   * @param params
   */
  private onRemoteAdd = (params: ObservableDbRecordInfo) => {
    this.getDb(params.db)
      .then((db) => db.getCollection(params.collection))
      .then((col) => col.add(params.record));
  };

  /**
   * Event raised when a record is put on the remote database.
   * @param params
   */
  private onRemotePut = (params: ObservableDbRecordInfo) => {
    this.getDb(params.db)
      .then((db) => db.getCollection(params.collection))
      .then((col) => col.add(params.record));
  };

  /**
   * Event raised when a records is deleted on the remote database.
   * @param params
   */
  private onRemoteDelete = (params: ObservableDbKeyInfo) => {
    this.getDb(params.db)
      .then((db) => db.getCollection(params.collection))
      .then((col) => col.delete(params.key));
  };

  /**
   * Event raised when a record is added to the client db.
   * @param params
   */
  private onLocalAdd = (params: ObservableDbRecordInfo) => {
    this.notify(ObservableDbEvents.OBS_DB_COLLECTION_ADD, params);
  };

  /**
   * Event raised when a record is put on the client db.
   * @param params
   */
  private onLocalPut = (params: ObservableDbRecordInfo) => {
    this.notify(ObservableDbEvents.OBS_DB_COLLECTION_PUT, params);
  };

  /**
   * Event raised when a records is deleted from the client db.
   * @param params
   */
  private onLocalDelete = (params: ObservableDbKeyInfo) => {
    this.notify(ObservableDbEvents.OBS_DB_COLLECTION_DEL, params);
  };

  /**
   * Gets an observable db by it's name.
   * This method won't fail. It returns undefined when no database is found.
   * @param name
   */
  getDb(name: string): Promise<ObservableDb> {
    return this.dbs.then((dbs) => dbs.find((d) => d.getName() === name));
  }
}
