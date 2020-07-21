import {
  DbFilter,
  DbFilterComparison,
  DbFilterExpression,
  DbFilterNode,
  DbFilterOperation,
  DbFilterTerm,
  DbFilterType,
} from "../common/DbFilters";

/**
 *
 * @param filter
 */
export const dbFilterToQuery = (filter: DbFilter): any => {
  if (!filter) return undefined;
  switch (filter.getFilterType()) {
    case DbFilterType.EXPRESSION:
      return dbFilterExpressionToQuery(filter as DbFilterExpression);
    case DbFilterType.TERM:
      return dbFilterTermToQuery(filter as DbFilterTerm);
    default:
      throw new Error("Unable to convert o mongodb filter: " + filter);
  }
};

/**
 *
 * @param filter
 */
export const dbFilterTermToQuery = (filter: DbFilterTerm): any => {
  const mFilter: any = {};
  switch (filter.comparison) {
    case DbFilterComparison.EQUAL_TO:
      mFilter[filter.name] = filter.value;
      break;
    case DbFilterComparison.NOT_EQUAL_TO:
      mFilter["$not"] = {};
      mFilter["$not"][filter.name] = filter.value;
      break;
    case DbFilterComparison.GREATER_OR_EQUAL:
      mFilter[filter.name] = { $gte: filter.value };
      break;
    case DbFilterComparison.GREATER_THAN:
      mFilter[filter.name] = { $gt: filter.value };
      break;
    case DbFilterComparison.LOWER_OR_EQUAL:
      mFilter[filter.name] = { $lte: filter.value };
      break;
    case DbFilterComparison.LOWER_THAN:
      mFilter[filter.name] = { $le: filter.value };
      break;
    case DbFilterComparison.IN:
      mFilter[filter.name] = { $in: filter.value };
      break;
    case DbFilterComparison.NOT_IN:
      mFilter["$not"] = {};
      mFilter["$not"][filter.name] = { $in: filter.value };
      break;
    case DbFilterComparison.LIKE:
      mFilter["$not"] = {};
      mFilter["$not"][filter.name] = { $expr: filter.value };
      break;
    default:
      throw new Error("Can't convert to mongo query " + filter.comparison);
  }
  return mFilter;
};

export const dbFilterExpressionToQuery = (
  expression: DbFilterExpression
): any => dbFilterNodeToQuery(expression.first);

const dbFilterNodeToQuery = (node: DbFilterNode): any => {
  if (node.next) {
    switch (node.operation) {
      case DbFilterOperation.AND:
        return {
          ...dbFilterToQuery(node.filter),
          ...dbFilterNodeToQuery(node.next),
        };
      case DbFilterOperation.OR:
        return {
          ...dbFilterToQuery(node.filter),
          $or: dbFilterNodeToQuery(node.next),
        };
      default:
        throw new Error("Unknown filter operation " + node.operation);
    }
  } else return dbFilterToQuery(node.filter);
};
