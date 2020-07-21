"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbSelect_1 = require("../common/DbSelect");
const MongoDialect_1 = require("./MongoDialect");
class MongoDbSelect extends DbSelect_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    first() {
        const filter = MongoDialect_1.dbFilterToQuery(this._where);
        return this.db
            .getMongo()
            .then((db) => db.collection(this._from).findOne(filter));
    }
    toArray() {
        return this.db.getMongo().then((db) => {
            const filter = MongoDialect_1.dbFilterToQuery(this._where);
            const query = db.collection(this._from).find(filter);
            if (this._orderBy) {
                if (this._orderBy.next) {
                    throw new Error("MongoDB only allows sorting by a single field.");
                }
                else if (this._orderBy.descending === true) {
                    query.sort(this._orderBy.name, -1);
                }
                else {
                    query.sort(this._orderBy.name, 1);
                }
            }
            if (this._offset)
                query.skip(this._offset);
            if (this._limit)
                query.limit(this._limit);
            return query.toArray();
        });
    }
}
exports.default = MongoDbSelect;
