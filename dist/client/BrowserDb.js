"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbSchema_1 = require("../common/DbSchema");
/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 * This API uses indexes to enable high-performance searches of this data.
 * While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.
 * IndexedDB provides a solution.
 *
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
    getCollectionSchema(collection) {
        return this.schema.collections.find((c) => c.name === collection);
    }
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
    count(collection, filter) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            const store = db.transaction(collection).objectStore(collection);
            if (filter) {
                const req = store.openCursor();
                let count = 0;
                req.onsuccess = () => {
                    if (req.result) {
                        const cursor = req.result;
                        if (filter.test(cursor.value))
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
    first(params) {
        return this.select(params).then((records) => records.length > 0 ? records[0] : undefined);
    }
    select(params) {
        return this.open.then((db) => new Promise((resolve, reject) => {
            const where = params.where;
            const store = db
                .transaction(params.collection)
                .objectStore(params.collection);
            if (where) {
                const req = store.openCursor();
                const records = [];
                req.onsuccess = () => {
                    if (req.result) {
                        const cursor = req.result;
                        const value = cursor.value;
                        if (where.test(value))
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
    forEach(params) {
        return this.select(params).then((records) => records.forEach(params.iterator));
    }
    getSchema() {
        return this.schema;
    }
    getName() {
        return this.schema.name;
    }
    getVersion() {
        return this.schema.version;
    }
}
exports.default = BrowserDb;
