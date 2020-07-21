"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbSchema_1 = require("../common/DbSchema");
const MongoDialect_1 = require("./MongoDialect");
class MongoDbCollection {
    constructor(schema, dbPromise) {
        this.schema = schema;
        this.colPromise = dbPromise.then((db) => db.collection(schema.name));
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
    add(record) {
        return this.colPromise
            .then((col) => col.insertOne(record))
            .then((res) => res.insertedId);
    }
    put(record) {
        const key = DbSchema_1.getRecordKey(record, this.schema.keyPath);
        const filter = MongoDialect_1.idbQueryToFilter(this.schema.keyPath, key);
        return this.colPromise
            .then((col) => col.updateOne(filter, record, {
            upsert: true,
        }))
            .then((r) => key);
    }
    delete(key) {
        const filter = MongoDialect_1.idbQueryToFilter(this.schema.keyPath, key);
        return this.colPromise
            .then((col) => col.deleteMany(filter))
            .then((res) => undefined);
    }
    clear() {
        return this.colPromise.then((col) => col.drop());
    }
    count(query) {
        const filter = MongoDialect_1.idbQueryToFilter(this.schema.keyPath, query);
        return this.colPromise
            .then((col) => col.countDocuments(filter))
            .then((res) => res || 0);
    }
    get(query) {
        const filter = MongoDialect_1.idbQueryToFilter(this.schema.keyPath, query);
        return this.colPromise.then((col) => col.findOne(filter));
    }
    getAll(query, count) {
        return this.colPromise.then((col) => {
            const filter = MongoDialect_1.idbQueryToFilter(this.schema.keyPath, query);
            const q = col.find(filter);
            if (count)
                q.limit(count);
            return q.toArray();
        });
    }
    forEach(fn, query, direction) {
        return this.colPromise.then((col) => {
            const filter = MongoDialect_1.idbQueryToFilter(this.schema.keyPath, query);
            const q = col.find(filter);
            switch (direction) {
                case "next":
                case "nextunique":
                    q.sort(this.schema.keyPath, 1);
                    break;
                case "prev":
                case "prevunique":
                    q.sort(this.schema.keyPath, -1);
                    break;
            }
            return q.forEach(fn).then(() => undefined);
        });
    }
    createCursor(where, orderBy, offset, limit) {
        return this.colPromise.then((col) => {
            const filter = MongoDialect_1.dbFilterToQuery(where);
            const q = col.find(filter);
            if (orderBy)
                q.sort(orderBy.name, orderBy.descending ? -1 : 1);
            if (offset)
                q.skip(offset);
            if (limit)
                q.limit(limit);
            return q;
        });
    }
    select(where, orderBy, offset, limit) {
        return this.createCursor(where, orderBy, offset, limit).then((c) => c.toArray());
    }
}
exports.default = MongoDbCollection;
