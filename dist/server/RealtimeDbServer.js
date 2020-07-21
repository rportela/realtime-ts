"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbEvents_1 = require("../common/DbEvents");
const RealtimeDbEvent_1 = require("../common/RealtimeDbEvent");
const RealtimeServer_1 = require("./RealtimeServer");
class RealtimeDbServer extends RealtimeServer_1.RealtimeServer {
    constructor(dbs, useHttps) {
        super(useHttps);
        this.clientAddRecord = (client, params) => {
            this.notifyClients(DbEvents_1.DbEvent.DB_RECORD_ADD, params, client);
            this.getDb(params.db).add(params.collection, params.record);
        };
        this.clientPutRecord = (client, params) => {
            this.notifyClients(DbEvents_1.DbEvent.DB_RECORD_PUT, params, client);
            this.getDb(params.db).put(params.collection, params.record);
        };
        this.clientDeleteRecord = (client, params) => {
            this.notifyClients(DbEvents_1.DbEvent.DB_RECORD_DELETE, params, client);
            this.getDb(params.db).delete(params.collection, params.key);
        };
        this.notifyClient = (client, params) => {
            const db = this.getDb(params.db);
            const keyPath = db.getCollectionSchema(params.collection).keyPath;
            db.forEach({
                collection: params.collection,
                where: params.filter,
                iterator: (record) => {
                    const message = {
                        db: params.db,
                        collection: params.collection,
                        record: record,
                        key: record[keyPath],
                        when: record["updated_at"],
                    };
                    client.notify(DbEvents_1.DbEvent.DB_RECORD_PUT, message);
                },
            });
        };
        this.getSchema = () => {
            return this.dbs.map((d) => d.getSchema());
        };
        this.dbs = dbs;
        this.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.clientAddRecord);
        this.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.clientPutRecord);
        this.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.clientDeleteRecord);
        this.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.SCHEMA, this.getSchema);
        this.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.NOTIFY, this.notifyClient);
    }
    getDb(name) {
        return this.dbs.find((d) => d.getName() === name);
    }
}
exports.default = RealtimeDbServer;
