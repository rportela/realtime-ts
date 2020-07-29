"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbFilterExpression = exports.DbFilterNode = exports.DbFilterTerm = exports.DbFilterOperation = exports.DbFilterType = exports.DbFilterComparison = void 0;
var DbFilterComparison;
(function (DbFilterComparison) {
    DbFilterComparison[DbFilterComparison["EQUAL_TO"] = 0] = "EQUAL_TO";
    DbFilterComparison[DbFilterComparison["NOT_EQUAL_TO"] = 1] = "NOT_EQUAL_TO";
    DbFilterComparison[DbFilterComparison["GREATER_THAN"] = 2] = "GREATER_THAN";
    DbFilterComparison[DbFilterComparison["GREATER_OR_EQUAL"] = 3] = "GREATER_OR_EQUAL";
    DbFilterComparison[DbFilterComparison["LOWER_THAN"] = 4] = "LOWER_THAN";
    DbFilterComparison[DbFilterComparison["LOWER_OR_EQUAL"] = 5] = "LOWER_OR_EQUAL";
    DbFilterComparison[DbFilterComparison["IN"] = 6] = "IN";
    DbFilterComparison[DbFilterComparison["NOT_IN"] = 7] = "NOT_IN";
    DbFilterComparison[DbFilterComparison["LIKE"] = 8] = "LIKE";
    DbFilterComparison[DbFilterComparison["NOT_LIKE"] = 9] = "NOT_LIKE";
})(DbFilterComparison = exports.DbFilterComparison || (exports.DbFilterComparison = {}));
var DbFilterType;
(function (DbFilterType) {
    DbFilterType[DbFilterType["TERM"] = 0] = "TERM";
    DbFilterType[DbFilterType["NODE"] = 1] = "NODE";
    DbFilterType[DbFilterType["EXPRESSION"] = 2] = "EXPRESSION";
})(DbFilterType = exports.DbFilterType || (exports.DbFilterType = {}));
var DbFilterOperation;
(function (DbFilterOperation) {
    DbFilterOperation[DbFilterOperation["AND"] = 0] = "AND";
    DbFilterOperation[DbFilterOperation["OR"] = 1] = "OR";
})(DbFilterOperation = exports.DbFilterOperation || (exports.DbFilterOperation = {}));
class DbFilterTerm {
    constructor(name, comparison, value) {
        this.test = (record) => {
            switch (this.comparison) {
                case DbFilterComparison.EQUAL_TO:
                    return record[this.name] === this.value;
                case DbFilterComparison.NOT_EQUAL_TO:
                    return record[this.name] !== this.value;
                case DbFilterComparison.GREATER_THAN:
                    return record[this.name] > this.value;
                case DbFilterComparison.GREATER_OR_EQUAL:
                    return record[this.name] >= this.value;
                case DbFilterComparison.LOWER_THAN:
                    return record[this.name] < this.value;
                case DbFilterComparison.LOWER_OR_EQUAL:
                    return record[this.name] <= this.value;
                case DbFilterComparison.IN:
                    return this.value.indexOf(record[this.name]) >= 0;
                case DbFilterComparison.NOT_IN:
                    return this.value.indexOf(record[this.name]) < 0;
                case DbFilterComparison.LIKE:
                    if (!(this.value instanceof RegExp))
                        this.value = new RegExp(this.value, "ig");
                    return this.value.test(record[this.name]);
                case DbFilterComparison.NOT_LIKE:
                    if (!(this.value instanceof RegExp))
                        this.value = new RegExp(this.value, "ig");
                    return this.value.test(record[this.name]) === false;
                default:
                    throw new Error("Unknown db filter comparison: " + this.comparison);
            }
        };
        this.name = name;
        this.comparison = comparison;
        this.value = value;
    }
    getFilterType() {
        return DbFilterType.TERM;
    }
}
exports.DbFilterTerm = DbFilterTerm;
class DbFilterNode {
    constructor(filter) {
        this.test = (record) => {
            if (this.next) {
                switch (this.operation) {
                    case DbFilterOperation.AND:
                        return this.filter.test(record) && this.next.test(record);
                    case DbFilterOperation.OR:
                        return this.filter.test(record) || this.next.test(record);
                    default:
                        throw new Error("Unknown filter operation: " + this.operation);
                }
            }
            else
                return this.filter.test(record);
        };
        this.filter = filter;
    }
    getFilterType() {
        return DbFilterType.NODE;
    }
}
exports.DbFilterNode = DbFilterNode;
class DbFilterExpression {
    constructor(filter) {
        this.test = (record) => this.first.test(record);
        this.first = new DbFilterNode(filter);
        this.last = this.first;
    }
    getFilterType() {
        return DbFilterType.EXPRESSION;
    }
    and(filter) {
        this.last.operation = DbFilterOperation.AND;
        this.last.next = new DbFilterNode(filter);
        this.last = this.last.next;
        return this;
    }
    or(filter) {
        this.last.operation = DbFilterOperation.OR;
        this.last.next = new DbFilterNode(filter);
        this.last = this.last.next;
        return this;
    }
}
exports.DbFilterExpression = DbFilterExpression;
