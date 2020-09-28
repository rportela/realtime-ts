"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbFilterExpressionToQuery = exports.dbFilterTermToQuery = exports.dbFilterToQuery = void 0;
const DatabaseFilters_1 = require("../common/DatabaseFilters");
/**
 *
 * @param filter
 */
exports.dbFilterToQuery = (filter) => {
    if (!filter)
        return undefined;
    switch (filter.getFilterType()) {
        case DatabaseFilters_1.DatabaseFilterType.EXPRESSION:
            return exports.dbFilterExpressionToQuery(filter);
        case DatabaseFilters_1.DatabaseFilterType.TERM:
            return exports.dbFilterTermToQuery(filter);
        default:
            throw new Error("Unable to convert o mongodb filter: " + filter);
    }
};
/**
 *
 * @param filter
 */
exports.dbFilterTermToQuery = (filter) => {
    const mFilter = {};
    switch (filter.comparison) {
        case DatabaseFilters_1.DatabaseFilterComparison.EQUAL_TO:
            mFilter[filter.name] = filter.value;
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.NOT_EQUAL_TO:
            mFilter["$not"] = {};
            mFilter["$not"][filter.name] = filter.value;
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.GREATER_OR_EQUAL:
            mFilter[filter.name] = { $gte: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.GREATER_THAN:
            mFilter[filter.name] = { $gt: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.LOWER_OR_EQUAL:
            mFilter[filter.name] = { $lte: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.LOWER_THAN:
            mFilter[filter.name] = { $le: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.IN:
            mFilter[filter.name] = { $in: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.NOT_IN:
            mFilter["$not"] = {};
            mFilter["$not"][filter.name] = { $in: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.LIKE:
            mFilter[filter.name] = { $expr: filter.value };
            break;
        case DatabaseFilters_1.DatabaseFilterComparison.NOT_LIKE:
            mFilter["$not"] = {};
            mFilter["$not"][filter.name] = { $expr: filter.value };
            break;
        default:
            throw new Error("Can't convert to mongo query " + filter.comparison);
    }
    return mFilter;
};
exports.dbFilterExpressionToQuery = (expression) => dbFilterNodeToQuery(expression.first);
const dbFilterNodeToQuery = (node) => {
    if (node.next) {
        switch (node.composition) {
            case DatabaseFilters_1.DatabaseFilterComposition.AND:
                return Object.assign(Object.assign({}, exports.dbFilterToQuery(node.filter)), dbFilterNodeToQuery(node.next));
            case DatabaseFilters_1.DatabaseFilterComposition.OR:
                return Object.assign(Object.assign({}, exports.dbFilterToQuery(node.filter)), { $or: dbFilterNodeToQuery(node.next) });
            default:
                throw new Error("Unknown filter composition " + node.composition);
        }
    }
    else
        return exports.dbFilterToQuery(node.filter);
};
