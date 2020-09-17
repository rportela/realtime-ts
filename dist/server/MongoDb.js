"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const MongoDialect_1 = require("./MongoDialect");
class MongoDb {
    constructor(schema, url) {
        this.schema = schema;
        this.open = new Promise((resolve, reject) => {
            const client = new mongodb_1.MongoClient(url || process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            client.connect((err) => {
                if (err)
                    reject(err);
                else
                    resolve(client.db(schema.name));
            });
        });
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
    getCollectionSchema(collection) {
        return this.schema.collections.find((c) => c.name === collection);
    }
    dropDatabase() {
        return this.open.then((db) => db
            .dropDatabase()
            .then(() => ({ db: this.schema.name, when: new Date() })));
    }
    dropCollection(name) {
        return this.open.then((db) => db.dropCollection(name).then((result) => {
            if (result)
                return {
                    db: this.schema.name,
                    collection: name,
                    when: new Date(),
                };
            else
                throw new Error("Unable to delete collection " + name);
        }));
    }
    get(collection, key) {
        return this.open
            .then((db) => db.collection(collection))
            .then((col) => {
            const filter = {};
            filter[this.getCollectionSchema(collection).keyPath] = key;
            return col.findOne(filter);
        });
    }
    add(collection, record) {
        return this.open.then((db) => db
            .collection(collection)
            .insertOne(record)
            .then((result) => ({
            db: this.schema.name,
            collection: name,
            when: new Date(),
            record: record,
            key: result.insertedId,
        })));
    }
    put(collection, record) {
        const keyPath = this.getCollectionSchema(collection).keyPath || "_id";
        const key = record[keyPath];
        const filter = {};
        filter[keyPath] = key;
        return this.open.then((db) => db
            .collection(collection)
            .updateOne(filter, record, { upsert: true })
            .then((result) => ({
            db: this.schema.name,
            collection: name,
            when: new Date(),
            record: record,
            key: key,
        })));
    }
    delete(collection, key) {
        const keyPath = this.getCollectionSchema(collection).keyPath || "_id";
        const filter = {};
        filter[keyPath] = key;
        return this.open.then((db) => db
            .collection(collection)
            .deleteOne(filter)
            .then(() => ({
            db: this.schema.name,
            collection: name,
            when: new Date(),
            key: key,
        })));
    }
    count(collection, filter) {
        return this.open
            .then((db) => db.collection(collection))
            .then((col) => col.countDocuments(MongoDialect_1.dbFilterToQuery(filter)))
            .then((result) => (result ? result : 0));
    }
    createCursor(params) {
        return this.open
            .then((db) => db.collection(params.collection))
            .then((col) => col.find(MongoDialect_1.dbFilterToQuery(params.where)))
            .then((cursor) => {
            if (params.orderBy)
                cursor.sort(params.orderBy.name, params.orderBy.descending ? -1 : 1);
            if (params.orderBy.next)
                throw new Error("Mongo only allows you to sort by a single field");
            if (params.offset)
                cursor.skip(params.offset);
            if (params.limit)
                cursor.limit(params.limit);
            return cursor;
        });
    }
    first(params) {
        return this.createCursor(params).then((cursor) => cursor.next());
    }
    select(params) {
        return this.createCursor(params).then((cursor) => cursor.toArray());
    }
    forEach(params) {
        return this.createCursor(params).then((cursor) => cursor.forEach(params.iterator));
    }
}
exports.default = MongoDb;
