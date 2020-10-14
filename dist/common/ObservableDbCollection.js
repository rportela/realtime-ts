"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDbCollection = exports.ObservableDbEvents = void 0;
const Listeners_1 = require("./Listeners");
var ObservableDbEvents;
(function (ObservableDbEvents) {
    ObservableDbEvents["OBS_DB_COLLECTION_ADD"] = "OBS_DB_COLLECTION_ADD";
    ObservableDbEvents["OBS_DB_COLLECTION_PUT"] = "OBS_DB_COLLECTION_PUT";
    ObservableDbEvents["OBS_DB_COLLECTION_DEL"] = "OBS_DB_COLLECTION_DEL";
    ObservableDbEvents["OBS_DB_COLLECTION_CLEAR"] = "OBS_DB_COLLECTION_CLEAR";
})(ObservableDbEvents = exports.ObservableDbEvents || (exports.ObservableDbEvents = {}));
class ObservableDbCollection {
    constructor(collection) {
        this.notifyAdd = (record, key) => {
            this.listeners.notify(ObservableDbEvents.OBS_DB_COLLECTION_ADD, {
                db: this.collection.getDatabaseName(),
                version: this.collection.getDatabaseVersion(),
                collection: this.collection.getName(),
                record: record,
                key: key,
            });
            return key;
        };
        this.notifyPut = (record, key) => {
            this.listeners.notify(ObservableDbEvents.OBS_DB_COLLECTION_PUT, {
                db: this.collection.getDatabaseName(),
                version: this.collection.getDatabaseVersion(),
                collection: this.collection.getName(),
                record: record,
                key: key,
            });
            return key;
        };
        this.notifyDel = (key) => {
            this.listeners.notify(ObservableDbEvents.OBS_DB_COLLECTION_DEL, {
                db: this.collection.getDatabaseName(),
                version: this.collection.getDatabaseVersion(),
                collection: this.collection.getName(),
                key: key,
            });
            return key;
        };
        this.collection = collection;
        this.listeners = new Listeners_1.Listeners();
    }
    clear() {
        return this.collection.clear().then((result) => {
            this.listeners.notify(ObservableDbEvents.OBS_DB_COLLECTION_CLEAR, {
                db: this.collection.getDatabaseName(),
                version: this.collection.getDatabaseVersion(),
                collection: this.collection.getName(),
            });
            return result;
        });
    }
    getDatabaseName() {
        return this.collection.getDatabaseName();
    }
    getDatabaseVersion() {
        return this.collection.getDatabaseVersion();
    }
    getName() {
        return this.collection.getName();
    }
    getKeyPath() {
        return this.collection.getKeyPath();
    }
    isKeyAutoGenerated() {
        return this.collection.isKeyAutoGenerated();
    }
    add(record) {
        return this.collection
            .add(record)
            .then((key) => this.notifyAdd(record, key));
    }
    addBatch(records) {
        return this.collection.addBatch(records).then((keys) => {
            for (let i = 0; i < keys.length; i++)
                this.notifyAdd(records[i], keys[i]);
            return keys;
        });
    }
    putBatch(records) {
        return this.collection.putBatch(records).then((keys) => {
            for (let i = 0; i < keys.length; i++)
                this.notifyAdd(records[i], keys[i]);
            return keys;
        });
    }
    put(record) {
        return this.collection
            .put(record)
            .then((key) => this.notifyPut(record, key));
    }
    delete(key) {
        return this.collection.delete(key).then(this.notifyDel);
    }
    get(key) {
        return this.collection.get(key);
    }
    all() {
        return this.collection.all();
    }
    filter(fn) {
        return this.collection.filter(fn);
    }
    map(fn) {
        return this.collection.map(fn);
    }
    forEach(fn) {
        return this.collection.forEach(fn);
    }
    count() {
        return this.collection.count();
    }
    query(filter, sort, offset, limit) {
        return this.collection.query(filter, sort, offset, limit);
    }
    addListener(event, listener) {
        this.listeners.addListener(event, listener);
    }
    removeListener(event, listener) {
        this.listeners.removeListener(event, listener);
    }
}
exports.ObservableDbCollection = ObservableDbCollection;
