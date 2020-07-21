import { DbFilter, DbFilterExpression, DbFilterTerm } from "../common/DbFilters";
/**
 *
 * @param filter
 */
export declare const dbFilterToQuery: (filter: DbFilter) => any;
/**
 *
 * @param filter
 */
export declare const dbFilterTermToQuery: (filter: DbFilterTerm) => any;
export declare const dbFilterExpressionToQuery: (expression: DbFilterExpression) => any;
