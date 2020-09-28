import { DatabaseFilter, DatabaseFilterExpression, DatabaseFilterTerm } from "../common/DatabaseFilters";
/**
 *
 * @param filter
 */
export declare const dbFilterToQuery: (filter: DatabaseFilter) => any;
/**
 *
 * @param filter
 */
export declare const dbFilterTermToQuery: (filter: DatabaseFilterTerm) => any;
export declare const dbFilterExpressionToQuery: (expression: DatabaseFilterExpression) => any;
