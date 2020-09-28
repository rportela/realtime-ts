"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFilterExpression = exports.DatabaseFilterNode = exports.DatabaseFilterTerm = exports.DatabaseFilterComposition = exports.DatabaseFilterType = exports.DatabaseFilterComparison = void 0;
/**
 * This enumerates all possible (aka coded) comparisons between values.
 *
 * @author Rodrigo Portela
 */
var DatabaseFilterComparison;
(function (DatabaseFilterComparison) {
    DatabaseFilterComparison[DatabaseFilterComparison["EQUAL_TO"] = 0] = "EQUAL_TO";
    DatabaseFilterComparison[DatabaseFilterComparison["NOT_EQUAL_TO"] = 1] = "NOT_EQUAL_TO";
    DatabaseFilterComparison[DatabaseFilterComparison["GREATER_THAN"] = 2] = "GREATER_THAN";
    DatabaseFilterComparison[DatabaseFilterComparison["GREATER_OR_EQUAL"] = 3] = "GREATER_OR_EQUAL";
    DatabaseFilterComparison[DatabaseFilterComparison["LOWER_THAN"] = 4] = "LOWER_THAN";
    DatabaseFilterComparison[DatabaseFilterComparison["LOWER_OR_EQUAL"] = 5] = "LOWER_OR_EQUAL";
    DatabaseFilterComparison[DatabaseFilterComparison["IN"] = 6] = "IN";
    DatabaseFilterComparison[DatabaseFilterComparison["NOT_IN"] = 7] = "NOT_IN";
    DatabaseFilterComparison[DatabaseFilterComparison["LIKE"] = 8] = "LIKE";
    DatabaseFilterComparison[DatabaseFilterComparison["NOT_LIKE"] = 9] = "NOT_LIKE";
})(DatabaseFilterComparison = exports.DatabaseFilterComparison || (exports.DatabaseFilterComparison = {}));
/**
 * This enumerates possible filter types so you can know how to decode them.
 *
 * @author Rodrigo Portela
 */
var DatabaseFilterType;
(function (DatabaseFilterType) {
    DatabaseFilterType[DatabaseFilterType["TERM"] = 0] = "TERM";
    DatabaseFilterType[DatabaseFilterType["NODE"] = 1] = "NODE";
    DatabaseFilterType[DatabaseFilterType["EXPRESSION"] = 2] = "EXPRESSION";
})(DatabaseFilterType = exports.DatabaseFilterType || (exports.DatabaseFilterType = {}));
/**
 * This enumerates possible filter compositions so you can know how to decode them.
 *
 * @author Rodrigo Portela
 */
var DatabaseFilterComposition;
(function (DatabaseFilterComposition) {
    DatabaseFilterComposition[DatabaseFilterComposition["AND"] = 0] = "AND";
    DatabaseFilterComposition[DatabaseFilterComposition["OR"] = 1] = "OR";
})(DatabaseFilterComposition = exports.DatabaseFilterComposition || (exports.DatabaseFilterComposition = {}));
/**
 * This represents the comparison of a single column or document attribute with a provided value.
 *
 * @author Rodrigo Portela
 */
class DatabaseFilterTerm {
    constructor(name, comparison, value) {
        this.createTest = () => {
            switch (this.comparison) {
                case DatabaseFilterComparison.EQUAL_TO:
                    return (record) => record[this.name] === this.value;
                case DatabaseFilterComparison.NOT_EQUAL_TO:
                    return (record) => record[this.name] !== this.value;
                case DatabaseFilterComparison.GREATER_THAN:
                    return (record) => record[this.name] > this.value;
                case DatabaseFilterComparison.GREATER_OR_EQUAL:
                    return (record) => record[this.name] >= this.value;
                case DatabaseFilterComparison.LOWER_THAN:
                    return (record) => record[this.name] < this.value;
                case DatabaseFilterComparison.LOWER_OR_EQUAL:
                    return (record) => record[this.name] <= this.value;
                case DatabaseFilterComparison.IN:
                    return (record) => this.value.indexOf(record[this.name]) >= 0;
                case DatabaseFilterComparison.NOT_IN:
                    return (record) => this.value.indexOf(record[this.name]) < 0;
                case DatabaseFilterComparison.LIKE:
                    if (!(this.value instanceof RegExp))
                        this.value = new RegExp(this.value, "ig");
                    return (record) => this.value.test(record[this.name]);
                case DatabaseFilterComparison.NOT_LIKE:
                    if (!(this.value instanceof RegExp))
                        this.value = new RegExp(this.value, "ig");
                    return (record) => this.value.test(record[this.name]) === false;
                default:
                    throw new Error("Unknown db filter comparison: " + this.comparison);
            }
        };
        this.name = name;
        this.comparison = comparison;
        this.value = value;
    }
    getFilterType() {
        return DatabaseFilterType.TERM;
    }
}
exports.DatabaseFilterTerm = DatabaseFilterTerm;
/**
 * This is a part of an expression.
 * Basically the composition of two filters with a boolean operator.
 *
 * @author Rodrigo Portela
 */
class DatabaseFilterNode {
    constructor(filter) {
        this.createTest = () => {
            if (this.next) {
                switch (this.composition) {
                    case DatabaseFilterComposition.AND:
                        const andL = this.filter.createTest();
                        const andR = this.filter.createTest();
                        return (record) => andL(record) && andR(record);
                    case DatabaseFilterComposition.OR:
                        const orL = this.filter.createTest();
                        const orR = this.filter.createTest();
                        return (record) => orL(record) && orR(record);
                    default:
                        throw new Error("Unknown filter composition: " + this.composition);
                }
            }
            else
                return this.filter.createTest();
        };
        this.filter = filter;
    }
    getFilterType() {
        return DatabaseFilterType.NODE;
    }
}
exports.DatabaseFilterNode = DatabaseFilterNode;
/**
 * This represents a filter expression.
 * A sequence of nodes joined by the available filter compositions.
 * Also, this class is specially crafted so you can do chained operations.
 *
 * @author Rodrigo Portela
 */
class DatabaseFilterExpression {
    constructor(filter) {
        this.createTest = () => this.first.createTest();
        this.first = new DatabaseFilterNode(filter);
        this.last = this.first;
    }
    getFilterType() {
        return DatabaseFilterType.EXPRESSION;
    }
    append(composition, filter) {
        this.last.composition = composition;
        this.last.next = new DatabaseFilterNode(filter);
        this.last = this.last.next;
        return this;
    }
    and(filter) {
        return this.append(DatabaseFilterComposition.OR, filter);
    }
    or(filter) {
        return this.append(DatabaseFilterComposition.AND, filter);
    }
}
exports.DatabaseFilterExpression = DatabaseFilterExpression;
