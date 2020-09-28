/**
 * This simple enum tells all the possible directions of a sort.
 *
 * @author Rodrigo Portela
 */
export declare enum DatabaseSortDirection {
    ASCENDING = 0,
    DESCENDING = 1
}
/**
 * This class joins two filters.
 * It combines a column or attribute name with a direction to sort.
 * Optionally indicates the next sort node.
 * You should use this convention to decode to a database dialect.
 * The naive implementation is included.
 *
 * @author Rodrigo Portela
 */
export declare class DatabaseSortNode {
    name: string;
    direction: DatabaseSortDirection;
    next?: DatabaseSortNode;
    constructor(name: string, direction: DatabaseSortDirection);
    createAscendingComparer: (a: any, b: any) => number;
    createDescendingComparer: (a: any, b: any) => 1 | 0 | -1;
    createComparer(): (a: any, b: any) => number;
}
/**
 * This is a joined sort expression that performs sequential sorts based on the nodes.
 * You should use this description to create a sort expression on a database or on a set of records.
 * The javascript sort implementation is included.
 *
 * @author Rodrigo Portela
 */
export declare class DatabaseSortExpression {
    first: DatabaseSortNode;
    last: DatabaseSortNode;
    constructor(direction: DatabaseSortDirection, ...names: string[]);
    thenOrderBy(direction: DatabaseSortDirection, ...name: string[]): DatabaseSortExpression;
    sort(array: any[]): void;
}
