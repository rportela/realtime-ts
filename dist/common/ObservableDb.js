"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDbEvent = void 0;
const Listeners_1 = require("./Listeners");
const ObservableDbCollection_1 = require("./ObservableDbCollection");
var ObservableDbEvent;
(function (ObservableDbEvent) {
    ObservableDbEvent["OBS_DB_DROP"] = "OBS_DB_DROP";
})(ObservableDbEvent = exports.ObservableDbEvent || (exports.ObservableDbEvent = {}));
/**
 * This is an observable DB.
 * You and add listeners to any collection and be notified when records are added, put or deleted.
 */
class ObservableDb {
    constructor(db) {
        this.db = db;
        this.collections = this.db
            .getCollections()
            .then((cols) => cols.map((col) => new ObservableDbCollection_1.ObservableDbCollection(col)));
        this.listeners = new Listeners_1.Listeners();
    }
    getName() {
        return this.db.getName();
    }
    getVersion() {
        return this.db.getVersion();
    }
    getCollections() {
        return this.collections;
    }
    getCollection(name) {
        return this.getCollections().then((cols) => cols.find((col) => col.getName() === name));
    }
    drop() {
        return this.db
            .drop()
            .then(() => this.listeners.notify(ObservableDbEvent.OBS_DB_DROP, this));
    }
    addListener(event, listener) {
        this.listeners.addListener(event, listener);
    }
    removeListener(event, listener) {
        this.listeners.removeListener(event, listener);
    }
    getSchema() {
        return this.db.getSchema();
    }
}
exports.default = ObservableDb;
