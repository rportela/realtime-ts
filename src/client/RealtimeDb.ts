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

export default class RealtimeDb {
  private client: RealtimeClient;
  private dbs: ObservableDb[];
  constructor(
    url: string = "ws://localhost",
    protocols: string[] = ["wss", "ws"]
  ) {
    this.client = new RealtimeClient(url, protocols);
    this.client.addListener(RealtimeClientEvent.CONNECT, this.onConnect);
    this.client.addListener(DbEvent.DB_RECORD_ADD, this.onRemoteAdd);
    this.client.addListener(DbEvent.DB_RECORD_DELETE, this.onRemoteDelete);
    this.client.addListener(DbEvent.DB_RECORD_PUT, this.onRemotePut);
    this.client.setHandler(RealtimeDbEvent.SELECT, this.onRemoteSelect);
    this.client.setHandler(RealtimeDbEvent.GET, this.onRemoteGet);

    const localSchema = localStorage.getItem(RTSDB_LOCAL_KEY);
    if (localSchema) {
      const schemas: DbSchema[] = JSON.parse(localSchema);
      this.dbs = schemas.map(this.createLocalDb);
    }
  }

  private createLocalDb = (schema: DbSchema): ObservableDb => {
    const db = new ObservableDb(new BrowserDb(schema));
    db.addListener(DbEvent.DB_RECORD_ADD, this.onLocalAdd);
    db.addListener(DbEvent.DB_RECORD_PUT, this.onLocalPut);
    db.addListener(DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
    return db;
  };

  private removeLocalDb = (db: ObservableDb) => {
    db.addListener(DbEvent.DB_RECORD_ADD, this.onLocalAdd);
    db.addListener(DbEvent.DB_RECORD_PUT, this.onLocalPut);
    db.addListener(DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
  };

  private onRemoteAdd = (params: DbRecordAdd<any>) => {
    this.getDb(params.db).add(params.collection, params.record);
  };

  private onRemotePut = (params: DbRecordPut<any>) => {
    this.getDb(params.db).put(params.collection, params.record);
  };

  private onRemoteDelete = (params: DbRecordDelete) => {
    this.getDb(params.db).delete(params.collection, params.key);
  };

  private onRemoteSelect = (params: RealtimeDbSelectParams): Promise<any[]> => {
    return this.getDb(params.db).select(params);
  };

  private onRemoteGet = (params: RealtimeDbGetParams): Promise<any> => {
    return this.getDb(params.db).first(params);
  };

  private onRemoteSchema = (params: DbSchema[]) => {
    if (this.dbs) this.dbs.forEach(this.removeLocalDb);
    this.dbs = params.map(this.createLocalDb);
    localStorage.setItem(RTSDB_LOCAL_KEY, JSON.stringify(params));
  };

  private onConnect = () => {
    this.client.call(RealtimeDbEvent.SCHEMA).then(this.onRemoteSchema);
  };

  private onLocalAdd = (params: DbRecordAdd<any>) => {
    this.client.notify(DbEvent.DB_RECORD_ADD, params);
  };

  private onLocalPut = (params: DbRecordPut<any>) => {
    this.client.notify(DbEvent.DB_RECORD_PUT, params);
  };

  private onLocalDelete = (params: DbRecordDelete) => {
    this.client.notify(DbEvent.DB_RECORD_DELETE, params);
  };

  getDb(name: string): ObservableDb {
    return this.dbs.find((d) => d.getName() === name);
  }
}
