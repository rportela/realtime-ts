"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbEvents_1 = require("./DbEvents");
const Listeners_1 = require("../common/Listeners");
/**
 * This is an observable DB.
 * You and add listeners to any collection and be notified when records are added, put or deleted.
 */
class ObservableDb {
    constructor(db) {
        this.listeners = new Listeners_1.Listeners();
        this.db = db;
    }
    getSchema() {
        return this.db.getSchema();
    }
    getName() {
        return this.db.getName();
    }
    getVersion() {
        return this.db.getVersion();
    }
    getCollectionSchema(collection) {
        return this.db.getCollectionSchema(collection);
    }
    dropDatabase() {
        return this.db.dropDatabase().then((event) => {
            this.listeners.notify(DbEvents_1.DbEvent.DB_DATABASE_DROP, event);
            return event;
        });
    }
    dropCollection(name) {
        return this.db.dropCollection(name).then((event) => {
            this.listeners.notify(DbEvents_1.DbEvent.DB_COLLECTION_DROP, event);
            return event;
        });
    }
    add(collection, record) {
        return this.db.add(collection, record).then((event) => {
            this.listeners.notify(DbEvents_1.DbEvent.DB_RECORD_ADD, event);
            return event;
        });
    }
    put(collection, record) {
        return this.db.put(collection, record).then((event) => {
            this.listeners.notify(DbEvents_1.DbEvent.DB_RECORD_PUT, event);
            return event;
        });
    }
    delete(collection, key) {
        return this.db.delete(collection, key).then((event) => {
            this.listeners.notify(DbEvents_1.DbEvent.DB_RECORD_DELETE, event);
            return event;
        });
    }
    count(collection, filter) {
        return this.db.count(collection, filter);
    }
    first(params) {
        return this.db.first(params);
    }
    select(params) {
        return this.db.select(params);
    }
    forEach(params) {
        return this.db.forEach(params);
    }
    addListener(event, listener) {
        this.listeners.addListener(event, listener);
    }
    removeListener(event, listener) {
        this.listeners.removeListener(event, listener);
    }
}
exports.default = ObservableDb;
