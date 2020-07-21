"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserDbSelect = void 0;
const DbSelect_1 = require("../common/DbSelect");
class BrowserDbSelect extends DbSelect_1.default {
    constructor(dbPromise) {
        super();
        this.dbPromise = dbPromise;
    }
    first() {
        return this.toArray().then((arr) => arr && arr.length > 0 ? arr[0] : undefined);
    }
    toArray() {
        return this.dbPromise.then((db) => new Promise((resolve, reject) => {
            const req = db
                .transaction(this._from)
                .objectStore(this._from)
                .getAll();
            req.onsuccess = () => {
                let arr = req.result;
                if (this._where)
                    arr = arr.filter((r) => this._where.test(r));
                if (this._orderBy)
                    this._orderBy.sort(arr);
                if (this._offset) {
                    arr =
                        this._limit && this._offset + this._limit > arr.length
                            ? arr.slice(this._offset, this._limit - this._offset)
                            : arr.slice(this._offset);
                }
                else if (this._limit && this._limit < arr.length) {
                    arr.splice(this._limit, arr.length - this._limit);
                }
                resolve(arr);
            };
            req.onerror = () => reject(req.error);
        }));
    }
}
exports.BrowserDbSelect = BrowserDbSelect;
