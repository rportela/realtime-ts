"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbSchema_1 = require("../common/DbSchema");
/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 * This API uses indexes to enable high-performance searches of this data.
 * While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.
 * IndexedDB provides a solution.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
class BrowserDb {
    constructor(schema) {
        this.schema = schema;
        this.open = new Promise((resolve, reject) => {
            const req = indexedDB.open(schema.name, schema.version);
            req.onerror = () => reject(req.error);
            req.onblocked = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
            req.onupgradeneeded = () => {
                const db = req.result;
                for (const name of db.objectStoreNames)
                    db.deleteObjectStore(name);
                for (const col of schema.collections) {
                    const store = db.createObjectStore(col.name, {
                        keyPath: col.keyPath,
                        autoIncrement: col.autoIncrement,
                    });
                    if (col.indexes) {
                        for (const idx of col.indexes) {
                            store.createIndex(idx.name, idx.keyPath, { unique: idx.unique });
                        }
                    }
                }
            };
        });
    }
    /**
     * Finds a collection schema by name.
     * @param collection
     */
    getCollectionSchema(collection) {
        return this.schema.collections.find((c) => c.name === collection);
    }
    /**
     * Deletes the database.
     */
    dropDatabase() {
        return new Promise((resolve, reject) => {
            try {
                indexedDB.deleteDatabase(this.schema.name);
                const event = {
                    db: this.schema.name,
                    when: new Date(),
                };
                resolve(event);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    /**
     * Clears all records of a specific collection.
     * @param name
     */
    dropCollection(name) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            const req = db
                .transaction(name, "readwrite")
                .objectStore(name)
                .clear();
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve({
                db: this.schema.name,
                collection: name,
                when: new Date(),
            });
        }));
    }
    /**
     * Adds or updates a record in store with the given value and key.
     * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.
     * @param collection
     * @param record
     */
    add(collection, record) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            DbSchema_1.ensureId(this.getCollectionSchema(collection), record);
            const req = db
                .transaction(collection, "readwrite")
                .objectStore(collection)
                .add(record);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve({
                db: this.schema.name,
                collection: collection,
                record: record,
                key: req.result,
                when: new Date(),
            });
        }));
    }
    /**
     * Any existing record with the key will be replaced.
     * @param collection
     * @param record
     */
    put(collection, record) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            DbSchema_1.ensureId(this.getCollectionSchema(collection), record);
            const req = db
                .transaction(collection, "readwrite")
                .objectStore(collection)
                .put(record);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve({
                db: this.schema.name,
                collection: collection,
                record: record,
                key: req.result,
                when: new Date(),
            });
        }));
    }
    /**
     * Deletes records in store with the given key or in the given key range in query.
     * If successful, request's result will be undefined.
     *
     * @param collection
     * @param key
     */
    delete(collection, key) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            const req = db
                .transaction(collection, "readwrite")
                .objectStore(collection)
                .delete(key);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve({
                db: this.schema.name,
                collection: collection,
                key: key,
                when: new Date(),
            });
        }));
    }
    /**
     * Retrieves the number of records matching the given key or key range in query.
     * @param collection
     * @param filter
     */
    count(collection, filter) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            const store = db.transaction(collection).objectStore(collection);
            if (filter) {
                const req = store.openCursor();
                const test = filter.test;
                let count = 0;
                req.onsuccess = () => {
                    if (req.result) {
                        const cursor = req.result;
                        if (test(cursor.value))
                            count++;
                        cursor.continue();
                    }
                    else {
                        resolve(count);
                    }
                };
                req.onerror = () => reject(req.error);
            }
            else {
                const req = store.count();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }
        }));
    }
    /**
     * Gets the first record matching a query.
     * @param params
     */
    first(params) {
        return this.select(params).then((records) => records.length > 0 ? records[0] : undefined);
    }
    /**
     * Gets all the records matching a query.
     * @param params
     */
    select(params) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            const where = params.where;
            const store = db
                .transaction(params.collection)
                .objectStore(params.collection);
            if (where) {
                const req = store.openCursor();
                const test = where.test;
                const records = [];
                req.onsuccess = () => {
                    if (req.result) {
                        const cursor = req.result;
                        const value = cursor.value;
                        if (test(value))
                            records.push(value);
                        cursor.continue();
                    }
                    else {
                        resolve(records);
                    }
                };
                req.onerror = () => reject(req.error);
            }
            else {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }
        }).then((records) => {
            if (params.orderBy)
                params.orderBy.sort(records);
            if (params.offset)
                records.splice(0, params.offset);
            if (params.limit && params.limit > records.length)
                records.splice(params.limit, records.length - params.limit);
            return records;
        }));
    }
    /**
     * Applies a function to all records matching a query.
     * @param params
     */
    forEach(params) {
        return this.select(params).then((records) => records.forEach(params.iterator));
    }
    /**
     * Gets the database schema.
     */
    getSchema() {
        return this.schema;
    }
    /**
     * Gets the name of the database.
     */
    getName() {
        return this.schema.name;
    }
    /**
     * Gets the version of the database.
     */
    getVersion() {
        return this.schema.version;
    }
}
exports.default = BrowserDb;
