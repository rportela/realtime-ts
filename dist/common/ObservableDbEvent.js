"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDbCollectionEvent = exports.ObservableDbEvent = void 0;
/**
 *
 */
var ObservableDbEvent;
(function (ObservableDbEvent) {
    ObservableDbEvent["OPEN_ERROR"] = "OPEN_ERROR";
    ObservableDbEvent["OPEN_BLOCKED"] = "OPEN_BLOCKED";
    ObservableDbEvent["OPEN_SUCCESS"] = "OPEN_SUCCESS";
})(ObservableDbEvent = exports.ObservableDbEvent || (exports.ObservableDbEvent = {}));
var ObservableDbCollectionEvent;
(function (ObservableDbCollectionEvent) {
    ObservableDbCollectionEvent["COLLECTION_ERROR"] = "COLLECTION_ERROR";
    ObservableDbCollectionEvent["COLLECTION_ADD"] = "COLLECTION_ADD";
    ObservableDbCollectionEvent["COLLECTION_PUT"] = "COLLECTION_PUT";
    ObservableDbCollectionEvent["COLLECTION_DEL"] = "COLLECTION_DEL";
})(ObservableDbCollectionEvent = exports.ObservableDbCollectionEvent || (exports.ObservableDbCollectionEvent = {}));
