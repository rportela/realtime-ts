export declare enum DbFilterComparison {
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
export declare enum DbFilterType {
    TERM = 0,
    NODE = 1,
    EXPRESSION = 2
}
export declare enum DbFilterOperation {
    AND = 0,
    OR = 1
}
export interface DbFilter {
    test: (record: any) => boolean;
    getFilterType(): DbFilterType;
}
export declare class DbFilterTerm implements DbFilter {
    name: string;
    comparison: DbFilterComparison;
    value: any;
    constructor(name: string, comparison: DbFilterComparison, value: any);
    test: (record: any) => boolean;
    getFilterType(): DbFilterType;
}
export declare class DbFilterNode implements DbFilter {
    filter: DbFilter;
    operation?: DbFilterOperation;
    next?: DbFilterNode;
    constructor(filter: DbFilter);
    test: (record: any) => boolean;
    getFilterType(): DbFilterType;
}
export declare class DbFilterExpression implements DbFilter {
    first: DbFilterNode;
    last: DbFilterNode;
    constructor(filter: DbFilter);
    test: (record: any) => boolean;
    getFilterType(): DbFilterType;
    and(filter: DbFilter): DbFilterExpression;
    or(filter: DbFilter): DbFilterExpression;
}
