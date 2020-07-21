"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbFilterExpressionToQuery = exports.dbFilterTermToQuery = exports.dbFilterToQuery = void 0;
const DbFilters_1 = require("../common/DbFilters");
/**
 *
 * @param filter
 */
exports.dbFilterToQuery = (filter) => {
    if (!filter)
        return undefined;
    switch (filter.getFilterType()) {
        case DbFilters_1.DbFilterType.EXPRESSION:
            return exports.dbFilterExpressionToQuery(filter);
        case DbFilters_1.DbFilterType.TERM:
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
        case DbFilters_1.DbFilterComparison.EQUAL_TO:
            mFilter[filter.name] = filter.value;
            break;
        case DbFilters_1.DbFilterComparison.NOT_EQUAL_TO:
            mFilter["$not"] = {};
            mFilter["$not"][filter.name] = filter.value;
            break;
        case DbFilters_1.DbFilterComparison.GREATER_OR_EQUAL:
            mFilter[filter.name] = { $gte: filter.value };
            break;
        case DbFilters_1.DbFilterComparison.GREATER_THAN:
            mFilter[filter.name] = { $gt: filter.value };
            break;
        case DbFilters_1.DbFilterComparison.LOWER_OR_EQUAL:
            mFilter[filter.name] = { $lte: filter.value };
            break;
        case DbFilters_1.DbFilterComparison.LOWER_THAN:
            mFilter[filter.name] = { $le: filter.value };
            break;
        case DbFilters_1.DbFilterComparison.IN:
            mFilter[filter.name] = { $in: filter.value };
            break;
        case DbFilters_1.DbFilterComparison.NOT_IN:
            mFilter["$not"] = {};
            mFilter["$not"][filter.name] = { $in: filter.value };
            break;
        case DbFilters_1.DbFilterComparison.LIKE:
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
        switch (node.operation) {
            case DbFilters_1.DbFilterOperation.AND:
                return Object.assign(Object.assign({}, exports.dbFilterToQuery(node.filter)), dbFilterNodeToQuery(node.next));
            case DbFilters_1.DbFilterOperation.OR:
                return Object.assign(Object.assign({}, exports.dbFilterToQuery(node.filter)), { $or: dbFilterNodeToQuery(node.next) });
            default:
                throw new Error("Unknown filter operation " + node.operation);
        }
    }
    else
        return exports.dbFilterToQuery(node.filter);
};
