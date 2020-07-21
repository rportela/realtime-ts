import { Db } from "../common/Db";
import {
  DbRecordDelete,
  DbEvent,
  DbRecordAdd,
  DbRecordPut,
} from "../common/DbEvents";
import { DbForEachParameters } from "../common/DbSchema";
import {
  RealtimeDbEvent,
  RealtimeDbNotifyParams,
} from "../common/RealtimeDbEvent";
import { RealtimeServer } from "./RealtimeServer";
import RealtimeServerClient from "./RealtimeServerClient";

export default class RealtimeDbServer extends RealtimeServer {
  private dbs: Db[];

  constructor(dbs: Db[], useHttps?: boolean) {
    super(useHttps);
    this.dbs = dbs;
    this.addListener(DbEvent.DB_RECORD_ADD, this.clientAddRecord);
    this.addListener(DbEvent.DB_RECORD_PUT, this.clientPutRecord);
    this.addListener(DbEvent.DB_RECORD_DELETE, this.clientDeleteRecord);
    this.setHandler(RealtimeDbEvent.SCHEMA, this.getSchema);
    this.setHandler(RealtimeDbEvent.NOTIFY, this.notifyClient);
  }

  private clientAddRecord = (
    client: RealtimeServerClient,
    params: DbRecordAdd<any>
  ) => {
    this.notifyClients(DbEvent.DB_RECORD_ADD, params, client);
    this.getDb(params.db).add(params.collection, params.record);
  };

  private clientPutRecord = (
    client: RealtimeServerClient,
    params: DbRecordPut<any>
  ) => {
    this.notifyClients(DbEvent.DB_RECORD_PUT, params, client);
    this.getDb(params.db).put(params.collection, params.record);
  };

  private clientDeleteRecord = (
    client: RealtimeServerClient,
    params: DbRecordDelete
  ) => {
    this.notifyClients(DbEvent.DB_RECORD_DELETE, params, client);
    this.getDb(params.db).delete(params.collection, params.key);
  };

  private notifyClient = (
    client: RealtimeServerClient,
    params: RealtimeDbNotifyParams
  ) => {
    const db = this.getDb(params.db);
    const keyPath = db.getCollectionSchema(params.collection).keyPath;
    db.forEach({
      collection: params.collection,
      where: params.filter,
      iterator: (record: any) => {
        const message: DbRecordPut<any> = {
          db: params.db,
          collection: params.collection,
          record: record,
          key: record[keyPath],
          when: record["updated_at"],
        };
        client.notify(DbEvent.DB_RECORD_PUT, message);
      },
    } as DbForEachParameters<any>);
  };

  getDb(name: string): Db {
    return this.dbs.find((d) => d.getName() === name);
  }

  getSchema = () => {
    return this.dbs.map((d) => d.getSchema());
  };
}
