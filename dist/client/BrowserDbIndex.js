"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrowserDbIndex {
    constructor(idx) {
        this.name = idx.name;
        this.keyPath = idx.keyPath;
        this.unique = idx.unique;
    }
    count(key) {
        throw new Error("Method not implemented.");
    }
    get(key) {
        throw new Error("Method not implemented.");
    }
    getAll(key) {
        throw new Error("Method not implemented.");
    }
}
exports.default = BrowserDbIndex;
