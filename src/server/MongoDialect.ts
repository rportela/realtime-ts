import {
  DatabaseFilter,
  DatabaseFilterComparison,
  DatabaseFilterComposition,
  DatabaseFilterExpression,
  DatabaseFilterNode,
  DatabaseFilterTerm,
  DatabaseFilterType,
} from "../common/DatabaseFilters";

/**
 *
 * @param filter
 */
export const dbFilterToQuery = (filter: DatabaseFilter): any => {
  if (!filter) return undefined;
  switch (filter.getFilterType()) {
    case DatabaseFilterType.EXPRESSION:
      return dbFilterExpressionToQuery(filter as DatabaseFilterExpression);
    case DatabaseFilterType.TERM:
      return dbFilterTermToQuery(filter as DatabaseFilterTerm);
    default:
      throw new Error("Unable to convert o mongodb filter: " + filter);
  }
};

/**
 *
 * @param filter
 */
export const dbFilterTermToQuery = (filter: DatabaseFilterTerm): any => {
  const mFilter: any = {};
  switch (filter.comparison) {
    case DatabaseFilterComparison.EQUAL_TO:
      mFilter[filter.name] = filter.value;
      break;
    case DatabaseFilterComparison.NOT_EQUAL_TO:
      mFilter["$not"] = {};
      mFilter["$not"][filter.name] = filter.value;
      break;
    case DatabaseFilterComparison.GREATER_OR_EQUAL:
      mFilter[filter.name] = { $gte: filter.value };
      break;
    case DatabaseFilterComparison.GREATER_THAN:
      mFilter[filter.name] = { $gt: filter.value };
      break;
    case DatabaseFilterComparison.LOWER_OR_EQUAL:
      mFilter[filter.name] = { $lte: filter.value };
      break;
    case DatabaseFilterComparison.LOWER_THAN:
      mFilter[filter.name] = { $le: filter.value };
      break;
    case DatabaseFilterComparison.IN:
      mFilter[filter.name] = { $in: filter.value };
      break;
    case DatabaseFilterComparison.NOT_IN:
      mFilter["$not"] = {};
      mFilter["$not"][filter.name] = { $in: filter.value };
      break;
    case DatabaseFilterComparison.LIKE:
      mFilter[filter.name] = { $expr: filter.value };
      break;
    case DatabaseFilterComparison.NOT_LIKE:
      mFilter["$not"] = {};
      mFilter["$not"][filter.name] = { $expr: filter.value };
      break;
    default:
      throw new Error("Can't convert to mongo query " + filter.comparison);
  }
  return mFilter;
};

export const dbFilterExpressionToQuery = (
  expression: DatabaseFilterExpression
): any => dbFilterNodeToQuery(expression.first);

const dbFilterNodeToQuery = (node: DatabaseFilterNode): any => {
  if (node.next) {
    switch (node.composition) {
      case DatabaseFilterComposition.AND:
        return {
          ...dbFilterToQuery(node.filter),
          ...dbFilterNodeToQuery(node.next),
        };
      case DatabaseFilterComposition.OR:
        return {
          ...dbFilterToQuery(node.filter),
          $or: dbFilterNodeToQuery(node.next),
        };
      default:
        throw new Error("Unknown filter composition " + node.composition);
    }
  } else return dbFilterToQuery(node.filter);
};
