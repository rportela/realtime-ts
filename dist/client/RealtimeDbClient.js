"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObservableDb_1 = require("../common/ObservableDb");
const ObservableDbCollection_1 = require("../common/ObservableDbCollection");
const RealtimeDbEvent_1 = require("../common/RealtimeDbEvent");
const BrowserDb_1 = require("./BrowserDb");
const JsonRpcClient_1 = require("./JsonRpcClient");
const RTSDB_SCHEMA = "RTSDB_SCHEMA";
/**
 *
 */
class RealtimeDbClient extends JsonRpcClient_1.default {
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
            db.getCollections().then((cols) => cols.forEach((col) => this.attachCollection(col)));
            return db;
        };
        this.attachCollection = (col) => {
            col.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_ADD, this.onLocalAdd);
            col.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, this.onLocalPut);
            col.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_DEL, this.onLocalDelete);
        };
        /**
         * Detaches event listeners from the client db instance.
         * @param db
         */
        this.removeLocalDb = (db) => {
            db.getCollections().then((cols) => cols.forEach((col) => this.detachCollection(col)));
        };
        this.detachCollection = (col) => {
            col.removeListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_ADD, this.onLocalAdd);
            col.removeListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, this.onLocalPut);
            col.removeListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_DEL, this.onLocalDelete);
        };
        /**
         * Handler for the get schema call.
         * @param params
         */
        this.onRemoteSchema = (params) => {
            const localSchema = localStorage.getItem(RTSDB_SCHEMA);
            const pre = localSchema
                ? this.dbs.then((dbs) => dbs.forEach((db) => this.removeLocalDb(db)))
                : Promise.resolve();
            localStorage.setItem(RTSDB_SCHEMA, JSON.stringify(params));
            this.dbs = pre.then(() => params.map((s) => this.createLocalDb(s)));
        };
        /**
         * Event raised when a connection is established.
         */
        this.onConnect = () => {
            super.onConnect();
            this.call(RealtimeDbEvent_1.RealtimeDbEvent.SCHEMA).then(this.onRemoteSchema);
        };
        /**
         * Event raised when a record is added to the remote database.
         * @param params
         */
        this.onRemoteAdd = (params) => {
            this.getDb(params.db)
                .then((db) => db.getCollection(params.collection))
                .then((col) => col.add(params.record));
        };
        /**
         * Event raised when a record is put on the remote database.
         * @param params
         */
        this.onRemotePut = (params) => {
            this.getDb(params.db)
                .then((db) => db.getCollection(params.collection))
                .then((col) => col.add(params.record));
        };
        /**
         * Event raised when a records is deleted on the remote database.
         * @param params
         */
        this.onRemoteDelete = (params) => {
            this.getDb(params.db)
                .then((db) => db.getCollection(params.collection))
                .then((col) => col.delete(params.key));
        };
        /**
         * Event raised when a record is added to the client db.
         * @param params
         */
        this.onLocalAdd = (params) => {
            this.notify(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_ADD, params);
        };
        /**
         * Event raised when a record is put on the client db.
         * @param params
         */
        this.onLocalPut = (params) => {
            this.notify(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, params);
        };
        /**
         * Event raised when a records is deleted from the client db.
         * @param params
         */
        this.onLocalDelete = (params) => {
            this.notify(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_DEL, params);
        };
        this.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_ADD, this.onRemoteAdd);
        this.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_PUT, this.onRemotePut);
        this.addListener(ObservableDbCollection_1.ObservableDbEvents.OBS_DB_COLLECTION_DEL, this.onRemoteDelete);
        if (!this.loadLocalSchema()) {
            this.dbs = new Promise((resolve, reject) => {
                this.resolveDbs = resolve;
                this.rejectDbs = reject;
            });
        }
    }
    loadLocalSchema() {
        const localSchema = localStorage.getItem(RTSDB_SCHEMA);
        if (localSchema) {
            try {
                const schemas = JSON.parse(localSchema);
                this.dbs = Promise.resolve(schemas.map((s) => this.createLocalDb(s)));
                return true;
            }
            catch (err) {
                console.error(err);
            }
        }
        return false;
    }
    /**
     * Gets an observable db by it's name.
     * This method won't fail. It returns undefined when no database is found.
     * @param name
     */
    getDb(name) {
        return this.dbs.then((dbs) => dbs.find((d) => d.getName() === name));
    }
}
exports.default = RealtimeDbClient;
