"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrowserDbCollection {
    constructor(db, schema) {
        this.db = db;
        this.schema = schema;
    }
    getDatabaseName() {
        return this.db.name;
    }
    getDatabaseVersion() {
        return this.db.version;
    }
    getName() {
        return this.schema.name;
    }
    getKeyPath() {
        return this.schema.keyPath;
    }
    isKeyAutoGenerated() {
        return this.schema.autoGenerated;
    }
    add(record) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name, "readwrite")
                .objectStore(this.schema.name)
                .add(record);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    addBatch(records) {
        return new Promise((resolve, reject) => {
            const store = this.db
                .transaction(this.schema.name, "readwrite")
                .objectStore(this.schema.name);
            const promises = records.map((record) => new Promise((resolve, reject) => {
                const req = store.add(record);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => resolve(req.result);
            }));
            return Promise.all(promises).then(resolve).catch(reject);
        });
    }
    put(record) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name, "readwrite")
                .objectStore(this.schema.name)
                .put(record);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    putBatch(records) {
        return new Promise((resolve, reject) => {
            const store = this.db
                .transaction(this.schema.name, "readwrite")
                .objectStore(this.schema.name);
            const promises = records.map((record) => new Promise((resolve, reject) => {
                const req = store.put(record);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => resolve(req.result);
            }));
            return Promise.all(promises).then(resolve).catch(reject);
        });
    }
    delete(key) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name, "readwrite")
                .objectStore(this.schema.name)
                .delete(key);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    get(key) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name)
                .objectStore(this.schema.name)
                .get(key);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    all() {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name)
                .objectStore(this.schema.name)
                .getAll();
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    filter(fn) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name)
                .objectStore(this.schema.name)
                .openCursor();
            const res = [];
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
                const cursor = req.result;
                if (cursor) {
                    const record = cursor.value;
                    if (fn(record))
                        res.push(record);
                    cursor.continue();
                }
                else {
                    resolve(res);
                }
            };
        });
    }
    map(fn) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name)
                .objectStore(this.schema.name)
                .openCursor();
            const res = [];
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
                const cursor = req.result;
                if (cursor) {
                    const record = cursor.value;
                    res.push(fn(record));
                    cursor.continue();
                }
                else {
                    resolve(res);
                }
            };
        });
    }
    forEach(fn) {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name)
                .objectStore(this.schema.name)
                .openCursor();
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
                const cursor = req.result;
                if (cursor) {
                    const record = cursor.value;
                    fn(record);
                    cursor.continue();
                }
                else {
                    resolve();
                }
            };
        });
    }
    count() {
        return new Promise((resolve, reject) => {
            const req = this.db
                .transaction(this.schema.name)
                .objectStore(this.schema.name)
                .count();
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    query(filter, sort, offset, limit) {
        return (filter ? this.filter(filter.createTest()) : this.all()).then((records) => {
            if (sort)
                sort.sort(records);
            if (offset)
                return limit
                    ? records.slice(offset, offset + limit)
                    : records.slice(offset);
            else if (limit)
                return records.slice(0, limit);
            else
                return records;
        });
    }
}
exports.default = BrowserDbCollection;
