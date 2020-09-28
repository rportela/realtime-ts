/**
 * This enumerates all possible (aka coded) comparisons between values.
 *
 * @author Rodrigo Portela
 */
export declare enum DatabaseFilterComparison {
    EQUAL_TO = 0,
    NOT_EQUAL_TO = 1,
    GREATER_THAN = 2,
    GREATER_OR_EQUAL = 3,
    LOWER_THAN = 4,
    LOWER_OR_EQUAL = 5,
    IN = 6,
    NOT_IN = 7,
    LIKE = 8,
    NOT_LIKE = 9
}
/**
 * This enumerates possible filter types so you can know how to decode them.
 *
 * @author Rodrigo Portela
 */
export declare enum DatabaseFilterType {
    TERM = 0,
    NODE = 1,
    EXPRESSION = 2
}
/**
 * This enumerates possible filter compositions so you can know how to decode them.
 *
 * @author Rodrigo Portela
 */
export declare enum DatabaseFilterComposition {
    AND = 0,
    OR = 1
}
/**
 * This represents the general shape of a database filter so you can further query and decode them.
 *
 * @author Rodrigo Portela
 */
export interface DatabaseFilter {
    createTest: () => (record: any) => boolean;
    getFilterType(): DatabaseFilterType;
}
/**
 * This represents the comparison of a single column or document attribute with a provided value.
 *
 * @author Rodrigo Portela
 */
export declare class DatabaseFilterTerm implements DatabaseFilter {
    name: string;
    comparison: DatabaseFilterComparison;
    value: any;
    constructor(name: string, comparison: DatabaseFilterComparison, value: any);
    createTest: () => (record: any) => boolean;
    getFilterType(): DatabaseFilterType;
}
/**
 * This is a part of an expression.
 * Basically the composition of two filters with a boolean operator.
 *
 * @author Rodrigo Portela
 */
export declare class DatabaseFilterNode implements DatabaseFilter {
    filter: DatabaseFilter;
    composition?: DatabaseFilterComposition;
    next?: DatabaseFilterNode;
    constructor(filter: DatabaseFilter);
    createTest: () => (record: any) => boolean;
    getFilterType(): DatabaseFilterType;
}
/**
 * This represents a filter expression.
 * A sequence of nodes joined by the available filter compositions.
 * Also, this class is specially crafted so you can do chained operations.
 *
 * @author Rodrigo Portela
 */
export declare class DatabaseFilterExpression implements DatabaseFilter {
    first: DatabaseFilterNode;
    last: DatabaseFilterNode;
    constructor(filter: DatabaseFilter);
    createTest: () => (record: any) => boolean;
    getFilterType(): DatabaseFilterType;
    append(composition: DatabaseFilterComposition, filter: DatabaseFilter): this;
    and(filter: DatabaseFilter): DatabaseFilterExpression;
    or(filter: DatabaseFilter): DatabaseFilterExpression;
}
