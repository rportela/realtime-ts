"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureId = exports.createId = exports.setRecordKey = exports.getRecordKey = void 0;
/**
 * Utility to get a key or a key array from a record using the keyPath.
 * @param record
 * @param keyPath
 */
exports.getRecordKey = (record, keyPath) => Array.isArray(keyPath)
    ? keyPath.map((k) => record[k])
    : record[keyPath];
/**
 * Utility to set a key or a key array to a record using the keyPath.
 * @param record
 * @param keyPath
 * @param key
 */
exports.setRecordKey = (record, keyPath, key) => {
    if (Array.isArray(keyPath)) {
        const keyArr = key;
        for (let i = 0; i < keyPath.length; i++) {
            record[keyPath[i]] = keyArr[i];
        }
    }
    else {
        record[keyPath] = key;
    }
};
exports.createId = () => {
    return new Date().getTime().toString(36) + Math.random().toString(36);
};
exports.ensureId = (schema, record) => {
    if (schema.autoGenerated === true)
        return;
    const keyPath = schema.keyPath || "_id";
    let key = record[keyPath];
    if (!key) {
        key = exports.createId();
        record[keyPath] = key;
    }
};
