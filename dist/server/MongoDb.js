"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
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
    getName() {
        return this.schema.name;
    }
    getVersion() {
        return this.schema.version;
    }
    getCollections() {
        throw new Error("Method not implemented.");
    }
    getCollection(name) {
        return this.getCollections().then((cols) => cols.find((col) => col.getName() === name));
    }
    drop() {
        return this.open.then((db) => db.dropDatabase());
    }
    getSchema() {
        return this.schema;
    }
}
exports.default = MongoDb;
