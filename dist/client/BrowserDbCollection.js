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
const BrowserDbIndex_1 = require("./BrowserDbIndex");
/**
 * The IDBObjectStore interface of the IndexedDB API represents an object store in a database.
 * Records within an object store are sorted according to their keys.
 * This sorting enables fast insertion, look-up, and ordered retrieval.
 *
 */
class BrowserDbCollection {
    constructor(db, schema) {
        this.db = db;
        this.schema = schema;
    }
    getSchema() {
        return this.schema;
    }
    getName() {
        return this.schema.name;
    }
    getKeyPath() {
        return this.schema.keyPath;
    }
    isAutoIncrement() {
        return this.schema.autoIncrement;
    }
    /**
     * In a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
     * This is for adding new records to an object store.
     *
     * @param record
     * @param key
     */
    add(record, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name, "readwrite")
                    .objectStore(this.schema.name)
                    .add(record, key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
        });
    }
    /**
     * Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread.
     * This is for deleting all current records out of an object store.
     *
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name, "readwrite")
                    .objectStore(this.schema.name)
                    .clear();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
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
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .count(query);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
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
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name, "readwrite")
                    .objectStore(this.schema.name)
                    .delete(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
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
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .get(query);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
        });
    }
    /**
     * Returns an IDBRequest object, and, in a separate thread retrieves and returns the record key for the object in the object stored matching the specified parameter.
     *
     * @param query
     */
    getKey(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .getKey(query);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
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
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .getAll(query, count);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
        });
    }
    /**
     * Returns an IDBRequest object retrieves record keys for all objects in the object store matching the specified parameter or all objects in the store if no parameters are given.
     *
     * @param query
     * @param count
     */
    getAllKeys(query, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .getAllKeys(query, count);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
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
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .openCursor(query, direction);
                req.onsuccess = () => {
                    const cursor = req.result;
                    if (cursor) {
                        try {
                            fn(cursor.value);
                            cursor.continue();
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                    else
                        resolve();
                };
                req.onerror = () => reject(req.error);
            }));
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
    forEachKey(fn, query, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name)
                    .objectStore(this.schema.name)
                    .openKeyCursor(query, direction);
                req.onsuccess = () => {
                    const cursor = req.result;
                    if (cursor) {
                        try {
                            fn(cursor.key);
                            cursor.continue();
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                    else
                        resolve();
                };
                req.onerror = () => reject(req.error);
            }));
        });
    }
    /**
     * Returns an IDBRequest object, and, in a separate thread, creates a structured clone of the value, and stores the cloned value in the object store.
     * This is for updating existing records in an object store when the transaction's mode is readwrite.
     *
     * @param record
     * @param key
     */
    put(record, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                const req = db
                    .transaction(this.schema.name, "readwrite")
                    .objectStore(this.schema.name)
                    .put(record, key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }));
        });
    }
    index(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.then((db) => new Promise((resolve, reject) => {
                try {
                    new BrowserDbIndex_1.default(db
                        .transaction(this.schema.name, "readwrite")
                        .objectStore(this.schema.name)
                        .index(name));
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
}
exports.default = BrowserDbCollection;
