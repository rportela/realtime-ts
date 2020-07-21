"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbEvents_1 = require("../common/DbEvents");
const ObservableDb_1 = require("../common/ObservableDb");
const RealtimeDbEvent_1 = require("../common/RealtimeDbEvent");
const BrowserDb_1 = require("./BrowserDb");
const RealtimeClient_1 = require("./RealtimeClient");
const RTSDB_LOCAL_KEY = "RTSDB_SCHEMA";
class RealtimeDb {
    constructor(url = "ws://localhost", protocols = ["wss", "ws"]) {
        this.createLocalDb = (schema) => {
            const db = new ObservableDb_1.default(new BrowserDb_1.default(schema));
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.onLocalAdd);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.onLocalPut);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
            return db;
        };
        this.removeLocalDb = (db) => {
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.onLocalAdd);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.onLocalPut);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
        };
        this.onRemoteAdd = (params) => {
            this.getDb(params.db).add(params.collection, params.record);
        };
        this.onRemotePut = (params) => {
            this.getDb(params.db).put(params.collection, params.record);
        };
        this.onRemoteDelete = (params) => {
            this.getDb(params.db).delete(params.collection, params.key);
        };
        this.onRemoteSelect = (params) => {
            return this.getDb(params.db).select(params);
        };
        this.onRemoteGet = (params) => {
            return this.getDb(params.db).first(params);
        };
        this.onRemoteSchema = (params) => {
            if (this.dbs)
                this.dbs.forEach(this.removeLocalDb);
            this.dbs = params.map(this.createLocalDb);
            localStorage.setItem(RTSDB_LOCAL_KEY, JSON.stringify(params));
        };
        this.onConnect = () => {
            this.client.call(RealtimeDbEvent_1.RealtimeDbEvent.SCHEMA).then(this.onRemoteSchema);
        };
        this.onLocalAdd = (params) => {
            this.client.notify(DbEvents_1.DbEvent.DB_RECORD_ADD, params);
        };
        this.onLocalPut = (params) => {
            this.client.notify(DbEvents_1.DbEvent.DB_RECORD_PUT, params);
        };
        this.onLocalDelete = (params) => {
            this.client.notify(DbEvents_1.DbEvent.DB_RECORD_DELETE, params);
        };
        this.client = new RealtimeClient_1.RealtimeClient(url, protocols);
        this.client.addListener(RealtimeClient_1.RealtimeClientEvent.CONNECT, this.onConnect);
        this.client.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.onRemoteAdd);
        this.client.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.onRemoteDelete);
        this.client.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.onRemotePut);
        this.client.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.SELECT, this.onRemoteSelect);
        this.client.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.GET, this.onRemoteGet);
        const localSchema = localStorage.getItem(RTSDB_LOCAL_KEY);
        if (localSchema) {
            const schemas = JSON.parse(localSchema);
            this.dbs = schemas.map(this.createLocalDb);
        }
    }
    getDb(name) {
        return this.dbs.find((d) => d.getName() === name);
    }
}
exports.default = RealtimeDb;
