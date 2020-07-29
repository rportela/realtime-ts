import {
  DbEvent,
  DbRecordAdd,
  DbRecordDelete,
  DbRecordPut,
} from "../common/DbEvents";
import { DbSchema } from "../common/DbSchema";
import ObservableDb from "../common/ObservableDb";
import {
  RealtimeDbEvent,
  RealtimeDbGetParams,
  RealtimeDbSelectParams,
} from "../common/RealtimeDbEvent";
import BrowserDb from "./BrowserDb";
import { RealtimeClient, RealtimeClientEvent } from "./RealtimeClient";

const RTSDB_LOCAL_KEY = "RTSDB_SCHEMA";

/**
 *
 */
export default class RealtimeDbClient extends RealtimeClient {
  private dbs: ObservableDb[];

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
    this.addListener(RealtimeClientEvent.CONNECT, this.onConnect);
    this.addListener(DbEvent.DB_RECORD_ADD, this.onRemoteAdd);
    this.addListener(DbEvent.DB_RECORD_DELETE, this.onRemoteDelete);
    this.addListener(DbEvent.DB_RECORD_PUT, this.onRemotePut);
    this.setHandler(RealtimeDbEvent.SELECT, this.onRemoteSelect);
    this.setHandler(RealtimeDbEvent.GET, this.onRemoteGet);

    const localSchema = localStorage.getItem(RTSDB_LOCAL_KEY);
    if (localSchema) {
      const schemas: DbSchema[] = JSON.parse(localSchema);
      this.dbs = schemas.map(this.createLocalDb);
    }
  }

  /**
   * Creates an instance and attaches listeners for the client db.
   * @param schema
   */
  private createLocalDb = (schema: DbSchema): ObservableDb => {
    const db = new ObservableDb(new BrowserDb(schema));
    db.addListener(DbEvent.DB_RECORD_ADD, this.onLocalAdd);
    db.addListener(DbEvent.DB_RECORD_PUT, this.onLocalPut);
    db.addListener(DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
    return db;
  };

  /**
   * Detaches event listeners from the client db instance.
   * @param db
   */
  private removeLocalDb = (db: ObservableDb) => {
    db.addListener(DbEvent.DB_RECORD_ADD, this.onLocalAdd);
    db.addListener(DbEvent.DB_RECORD_PUT, this.onLocalPut);
    db.addListener(DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
  };

  /**
   * Event raised when a record is added to the remote database.
   * @param params
   */
  private onRemoteAdd = (params: DbRecordAdd<any>) => {
    this.getDb(params.db).add(params.collection, params.record);
  };

  /**
   * Event raised when a record is put on the remote database.
   * @param params
   */
  private onRemotePut = (params: DbRecordPut<any>) => {
    this.getDb(params.db).put(params.collection, params.record);
  };

  /**
   * Event raised when a records is deleted on the remote database.
   * @param params
   */
  private onRemoteDelete = (params: DbRecordDelete) => {
    this.getDb(params.db).delete(params.collection, params.key);
  };

  /**
   * Handler for the select records call.
   * @param params
   */
  private onRemoteSelect = (params: RealtimeDbSelectParams): Promise<any[]> => {
    return this.getDb(params.db).select(params);
  };

  /**
   * Handler for the get record call.
   * @param params
   */
  private onRemoteGet = (params: RealtimeDbGetParams): Promise<any> => {
    return this.getDb(params.db).first(params);
  };

  /**
   * Handler for the get schema call.
   * @param params
   */
  private onRemoteSchema = (params: DbSchema[]) => {
    if (this.dbs) this.dbs.forEach(this.removeLocalDb);
    this.dbs = params.map(this.createLocalDb);
    localStorage.setItem(RTSDB_LOCAL_KEY, JSON.stringify(params));
  };

  /**
   * Event raised when a connection is established.
   */
  private onConnect = () => {
    this.call(RealtimeDbEvent.SCHEMA).then(this.onRemoteSchema);
  };

  /**
   * Event raised when a record is added to the client db.
   * @param params
   */
  private onLocalAdd = (params: DbRecordAdd<any>) => {
    this.notify(DbEvent.DB_RECORD_ADD, params);
  };

  /**
   * Event raised when a record is put on the client db.
   * @param params
   */
  private onLocalPut = (params: DbRecordPut<any>) => {
    this.notify(DbEvent.DB_RECORD_PUT, params);
  };

  /**
   * Event raised when a records is deleted from the client db.
   * @param params
   */
  private onLocalDelete = (params: DbRecordDelete) => {
    this.notify(DbEvent.DB_RECORD_DELETE, params);
  };

  /**
   * Gets an observable db by it's name.
   * This method won't fail. It returns undefined when no database is found.
   * @param name
   */
  getDb(name: string): ObservableDb {
    return this.dbs.find((d) => d.getName() === name);
  }
}
