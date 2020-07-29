"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbEvents_1 = require("../common/DbEvents");
const ObservableDb_1 = require("../common/ObservableDb");
const RealtimeDbEvent_1 = require("../common/RealtimeDbEvent");
const BrowserDb_1 = require("./BrowserDb");
const RealtimeClient_1 = require("./RealtimeClient");
const RTSDB_LOCAL_KEY = "RTSDB_SCHEMA";
/**
 *
 */
class RealtimeDbClient extends RealtimeClient_1.RealtimeClient {
    /**
     * Instantiates a new instance of a realtime Db Client.
     * @param url
     * @param protocols
     */
    constructor(url = "ws://localhost", protocols = ["wss", "ws"]) {
        super(url, protocols);
        /**
         * Creates an instance and attaches listeners for the client db.
         * @param schema
         */
        this.createLocalDb = (schema) => {
            const db = new ObservableDb_1.default(new BrowserDb_1.default(schema));
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.onLocalAdd);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.onLocalPut);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
            return db;
        };
        /**
         * Detaches event listeners from the client db instance.
         * @param db
         */
        this.removeLocalDb = (db) => {
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.onLocalAdd);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.onLocalPut);
            db.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.onLocalDelete);
        };
        /**
         * Event raised when a record is added to the remote database.
         * @param params
         */
        this.onRemoteAdd = (params) => {
            this.getDb(params.db).add(params.collection, params.record);
        };
        /**
         * Event raised when a record is put on the remote database.
         * @param params
         */
        this.onRemotePut = (params) => {
            this.getDb(params.db).put(params.collection, params.record);
        };
        /**
         * Event raised when a records is deleted on the remote database.
         * @param params
         */
        this.onRemoteDelete = (params) => {
            this.getDb(params.db).delete(params.collection, params.key);
        };
        /**
         * Handler for the select records call.
         * @param params
         */
        this.onRemoteSelect = (params) => {
            return this.getDb(params.db).select(params);
        };
        /**
         * Handler for the get record call.
         * @param params
         */
        this.onRemoteGet = (params) => {
            return this.getDb(params.db).first(params);
        };
        /**
         * Handler for the get schema call.
         * @param params
         */
        this.onRemoteSchema = (params) => {
            if (this.dbs)
                this.dbs.forEach(this.removeLocalDb);
            this.dbs = params.map(this.createLocalDb);
            localStorage.setItem(RTSDB_LOCAL_KEY, JSON.stringify(params));
        };
        /**
         * Event raised when a connection is established.
         */
        this.onConnect = () => {
            this.call(RealtimeDbEvent_1.RealtimeDbEvent.SCHEMA).then(this.onRemoteSchema);
        };
        /**
         * Event raised when a record is added to the client db.
         * @param params
         */
        this.onLocalAdd = (params) => {
            this.notify(DbEvents_1.DbEvent.DB_RECORD_ADD, params);
        };
        /**
         * Event raised when a record is put on the client db.
         * @param params
         */
        this.onLocalPut = (params) => {
            this.notify(DbEvents_1.DbEvent.DB_RECORD_PUT, params);
        };
        /**
         * Event raised when a records is deleted from the client db.
         * @param params
         */
        this.onLocalDelete = (params) => {
            this.notify(DbEvents_1.DbEvent.DB_RECORD_DELETE, params);
        };
        this.addListener(RealtimeClient_1.RealtimeClientEvent.CONNECT, this.onConnect);
        this.addListener(DbEvents_1.DbEvent.DB_RECORD_ADD, this.onRemoteAdd);
        this.addListener(DbEvents_1.DbEvent.DB_RECORD_DELETE, this.onRemoteDelete);
        this.addListener(DbEvents_1.DbEvent.DB_RECORD_PUT, this.onRemotePut);
        this.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.SELECT, this.onRemoteSelect);
        this.setHandler(RealtimeDbEvent_1.RealtimeDbEvent.GET, this.onRemoteGet);
        const localSchema = localStorage.getItem(RTSDB_LOCAL_KEY);
        if (localSchema) {
            const schemas = JSON.parse(localSchema);
            this.dbs = schemas.map(this.createLocalDb);
        }
    }
    /**
     * Gets an observable db by it's name.
     * This method won't fail. It returns undefined when no database is found.
     * @param name
     */
    getDb(name) {
        return this.dbs.find((d) => d.getName() === name);
    }
}
exports.default = RealtimeDbClient;
