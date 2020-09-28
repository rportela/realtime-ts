"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSortExpression = exports.DatabaseSortNode = exports.DatabaseSortDirection = void 0;
/**
 * This simple enum tells all the possible directions of a sort.
 *
 * @author Rodrigo Portela
 */
var DatabaseSortDirection;
(function (DatabaseSortDirection) {
    DatabaseSortDirection[DatabaseSortDirection["ASCENDING"] = 0] = "ASCENDING";
    DatabaseSortDirection[DatabaseSortDirection["DESCENDING"] = 1] = "DESCENDING";
})(DatabaseSortDirection = exports.DatabaseSortDirection || (exports.DatabaseSortDirection = {}));
/**
 * This class joins two filters.
 * It combines a column or attribute name with a direction to sort.
 * Optionally indicates the next sort node.
 * You should use this convention to decode to a database dialect.
 * The naive implementation is included.
 *
 * @author Rodrigo Portela
 */
class DatabaseSortNode {
    constructor(name, direction) {
        this.createAscendingComparer = (a, b) => {
            const left = a[this.name];
            const right = b[this.name];
            if (left < right)
                return -1;
            if (left === right)
                return 0;
            else
                return 1;
        };
        this.createDescendingComparer = (a, b) => {
            const left = a[this.name];
            const right = b[this.name];
            if (left > right)
                return -1;
            if (left === right)
                return 0;
            else
                return 1;
        };
        this.name = name;
        this.direction = direction;
    }
    createComparer() {
        switch (this.direction) {
            case DatabaseSortDirection.ASCENDING:
                return this.createAscendingComparer;
            case DatabaseSortDirection.DESCENDING:
                return this.createDescendingComparer;
            default:
                throw new Error("Unknown sort direction " + this.direction);
        }
    }
}
exports.DatabaseSortNode = DatabaseSortNode;
/**
 * This is a joined sort expression that performs sequential sorts based on the nodes.
 * You should use this description to create a sort expression on a database or on a set of records.
 * The javascript sort implementation is included.
 *
 * @author Rodrigo Portela
 */
class DatabaseSortExpression {
    constructor(direction, ...names) {
        if (names.length < 1)
            throw new Error("You need to provide at least one name to the sort expression.");
        this.first = new DatabaseSortNode(names[0], direction);
        this.last = this.first;
        for (let i = 1; i < names.length; i++) {
            this.last.next = new DatabaseSortNode(names[i], direction);
            this.last = this.last.next;
        }
    }
    thenOrderBy(direction, ...name) {
        for (const n of name) {
            this.last.next = new DatabaseSortNode(n, direction);
            this.last = this.last.next;
        }
        return this;
    }
    sort(array) {
        let node = this.first;
        while (node !== undefined) {
            array.sort(node.createAscendingComparer);
            node = node.next;
        }
    }
}
exports.DatabaseSortExpression = DatabaseSortExpression;
