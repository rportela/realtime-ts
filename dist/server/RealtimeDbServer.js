"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObservableDbCollection_1 = require("../common/ObservableDbCollection");
const RealtimeDbEvent_1 = require("../common/RealtimeDbEvent");
const RealtimeServer_1 = require("./RealtimeServer");
class RealtimeDbServer extends RealtimeServer_1.RealtimeServer {
    constructor(dbs, useHttps) {
        super(useHttps);
        this.clientAddRecord = (client, params) => {
            this.notifyClients(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_ADD, params, client);
            this.getDb(params.db)
                .getCollection(params.collection)
                .then((col) => col.add(params.record));
        };
        this.clientPutRecord = (client, params) => {
            this.notifyClients(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, params, client);
            this.getDb(params.db)
                .getCollection(params.collection)
                .then((col) => col.put(params.record));
        };
        this.clientDeleteRecord = (client, params) => {
            this.notifyClients(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_DEL, params, client);
            this.getDb(params.db)
                .getCollection(params.collection)
                .then((col) => col.delete(params.key));
        };
        this.notifyClient = (client, params) => this.getDb(params.db)
            .getCollection(params.collection)
            .then((col) => col.query(params.filter, params.sort, params.offset, params.limit))
            .then((rows) => rows.forEach((row) => client.notify(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, {
            db: params.db,
            collection: params.collection,
            record: row,
            key: undefined,
        })));
        this.dbs = dbs;
        this.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_ADD, this.clientAddRecord);
        this.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, this.clientPutRecord);
        this.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_DEL, this.clientDeleteRecord);
        this.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.SCHEMA, this.getSchema);
        this.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.NOTIFY, this.notifyClient);
    }
    getDb(name) {
        return this.dbs.find((d) => d.getName() === name);
    }
    getSchema() {
        return this.dbs.map((db) => db.getSchema());
    }
}
exports.default = RealtimeDbServer;
