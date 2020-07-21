"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Listeners_1 = require("../common/Listeners");
const ObservableDbEvent_1 = require("./ObservableDbEvent");
class ObservableDbCollection {
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
        this.listeners = new Listeners_1.Listeners();
    }
    getSchema() {
        return this.collection.getSchema();
    }
    getName() {
        return this.collection.getName();
    }
    getKeyPath() {
        return this.collection.getKeyPath();
    }
    isAutoIncrement() {
        return this.collection.isAutoIncrement();
    }
    addListener(event, listener) {
        this.listeners.addListener(event, listener);
    }
    removeListener(event, listener) {
        this.listeners.removeListener(event, listener);
    }
    /**
     * In a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
     * This is for adding new records to an object store.
     *
     * @param record
     * @param key
     */
    add(record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .add(record)
                .then((newKey) => {
                const res = {
                    db: this.db.getName(),
                    collection: this.getName(),
                    record: record,
                    keyPath: this.getKeyPath(),
                    key: newKey,
                };
                this.listeners.notify(ObservableDbEvent_1.ObservableDbCollectionEvent.COLLECTION_PUT, res);
                return res;
            })
                .catch((err) => {
                this.listeners.notify(ObservableDbEvent_1.ObservableDbCollectionEvent.COLLECTION_ERROR, err);
                return null;
            });
        });
    }
    put(record) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .put(record)
                .then((key) => {
                const res = {
                    db: this.db.getName(),
                    collection: this.getName(),
                    record: record,
                    keyPath: this.getKeyPath(),
                    key: key,
                };
                this.listeners.notify(ObservableDbEvent_1.ObservableDbCollectionEvent.COLLECTION_PUT, res);
                return res;
            })
                .catch((err) => {
                this.listeners.notify(ObservableDbEvent_1.ObservableDbCollectionEvent.COLLECTION_ERROR, err);
                return null;
            });
        });
    }
    /**
     * returns an IDBRequest object, and, in a separate thread, deletes the store object selected by the specified key.
     * This is for deleting individual records out of an object store.
     *
     * @param key
     */
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection
                .delete(key)
                .then(() => {
                const res = {
                    db: this.db.getName(),
                    collection: this.getName(),
                    keyPath: this.getKeyPath(),
                    key: key,
                };
                this.listeners.notify(ObservableDbEvent_1.ObservableDbCollectionEvent.COLLECTION_DEL, res);
                return undefined;
            })
                .catch((err) => {
                this.listeners.notify(ObservableDbEvent_1.ObservableDbCollectionEvent.COLLECTION_ERROR, err);
                return undefined;
            });
        });
    }
    /**
     * Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread.
     * This is for deleting all current records out of an object store.
     *
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.clear();
        });
    }
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
     * If no arguments are provided, it returns the total number of records in the collection.
     *
     * @param query
     */
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.count(query);
        });
    }
    /**
     * Returns an IDBRequest object retrieves all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
     *
     * @param query
     * @param count
     */
    getAll(query, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.getAll(query, count);
        });
    }
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns the store object store selected by the specified key.
     * This is for retrieving specific records from an object store.
     *
     * @param query
     */
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.get(query);
        });
    }
    /**
     * Returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object.
     * Used for iterating through an object store by primary key with a cursor.
     *
     * @param fn
     * @param query
     * @param direction
     */
    forEach(fn, query, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.forEach(fn, query, direction);
        });
    }
}
exports.default = ObservableDbCollection;
