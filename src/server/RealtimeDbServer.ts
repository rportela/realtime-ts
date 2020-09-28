import {
  DatabaseImplementation,
  DatabaseSchema,
} from "../common/DatabaseDefinition";
import {
  ObservableDbEvents,
  ObservableDbKeyInfo,
  ObservableDbRecordInfo,
} from "../common/ObservableDbCollection";
import { RealtimeDbEvent, RealTimeDbQuery } from "../common/RealtimeDbEvent";
import { RealtimeServer } from "./RealtimeServer";
import RealtimeServerClient from "./RealtimeServerClient";

export default class RealtimeDbServer extends RealtimeServer {
  private dbs: DatabaseImplementation[];

  constructor(dbs: DatabaseImplementation[], useHttps?: boolean) {
    super(useHttps);
    this.dbs = dbs;

    this.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_ADD,
      this.clientAddRecord
    );
    this.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_PUT,
      this.clientPutRecord
    );
    this.addListener(
      ObservableDbEvents.OBS_DB_COLLECTION_DEL,
      this.clientDeleteRecord
    );
    this.setHandler(RealtimeDbEvent.SCHEMA, this.getSchema);
    this.setHandler(RealtimeDbEvent.NOTIFY, this.notifyClient);
  }

  getDb(name: string): DatabaseImplementation {
    return this.dbs.find((d) => d.getName() === name);
  }
  getSchema(): DatabaseSchema[] {
    return this.dbs.map((db) => db.getSchema());
  }

  private clientAddRecord = (
    client: RealtimeServerClient,
    params: ObservableDbRecordInfo
  ) => {
    this.notifyClients(
      ObservableDbEvents.OBS_DB_COLLECTION_ADD,
      params,
      client
    );
    this.getDb(params.db)
      .getCollection(params.collection)
      .then((col) => col.add(params.record));
  };

  private clientPutRecord = (
    client: RealtimeServerClient,
    params: ObservableDbRecordInfo
  ) => {
    this.notifyClients(
      ObservableDbEvents.OBS_DB_COLLECTION_PUT,
      params,
      client
    );
    this.getDb(params.db)
      .getCollection(params.collection)
      .then((col) => col.put(params.record));
  };

  private clientDeleteRecord = (
    client: RealtimeServerClient,
    params: ObservableDbKeyInfo
  ) => {
    this.notifyClients(
      ObservableDbEvents.OBS_DB_COLLECTION_DEL,
      params,
      client
    );
    this.getDb(params.db)
      .getCollection(params.collection)
      .then((col) => col.delete(params.key));
  };

  private notifyClient = (
    client: RealtimeServerClient,
    params: RealTimeDbQuery
  ) =>
    this.getDb(params.db)
      .getCollection(params.collection)
      .then((col) =>
        col.query(params.filter, params.sort, params.offset, params.limit)
      )
      .then((rows) =>
        rows.forEach((row) =>
          client.notify(ObservableDbEvents.OBS_DB_COLLECTION_PUT, {
            db: params.db,
            collection: params.collection,
            record: row,
            key: undefined,
          } as ObservableDbRecordInfo)
        )
      );
}
