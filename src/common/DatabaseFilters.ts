/**
 * This enumerates all possible (aka coded) comparisons between values.
 *
 * @author Rodrigo Portela
 */
export enum DatabaseFilterComparison {
  EQUAL_TO,
  NOT_EQUAL_TO,
  GREATER_THAN,
  GREATER_OR_EQUAL,
  LOWER_THAN,
  LOWER_OR_EQUAL,
  IN,
  NOT_IN,
  LIKE,
  NOT_LIKE,
}

/**
 * This enumerates possible filter types so you can know how to decode them.
 *
 * @author Rodrigo Portela
 */
export enum DatabaseFilterType {
  TERM,
  NODE,
  EXPRESSION,
}

/**
 * This enumerates possible filter compositions so you can know how to decode them.
 *
 * @author Rodrigo Portela
 */
export enum DatabaseFilterComposition {
  AND,
  OR,
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
export class DatabaseFilterTerm implements DatabaseFilter {
  name: string;
  comparison: DatabaseFilterComparison;
  value: any;
  constructor(name: string, comparison: DatabaseFilterComparison, value: any) {
    this.name = name;
    this.comparison = comparison;
    this.value = value;
  }
  createTest = () => {
    switch (this.comparison) {
      case DatabaseFilterComparison.EQUAL_TO:
        return (record: any) => record[this.name] === this.value;
      case DatabaseFilterComparison.NOT_EQUAL_TO:
        return (record: any) => record[this.name] !== this.value;
      case DatabaseFilterComparison.GREATER_THAN:
        return (record: any) => record[this.name] > this.value;
      case DatabaseFilterComparison.GREATER_OR_EQUAL:
        return (record: any) => record[this.name] >= this.value;
      case DatabaseFilterComparison.LOWER_THAN:
        return (record: any) => record[this.name] < this.value;
      case DatabaseFilterComparison.LOWER_OR_EQUAL:
        return (record: any) => record[this.name] <= this.value;
      case DatabaseFilterComparison.IN:
        return (record: any) => this.value.indexOf(record[this.name]) >= 0;
      case DatabaseFilterComparison.NOT_IN:
        return (record: any) => this.value.indexOf(record[this.name]) < 0;
      case DatabaseFilterComparison.LIKE:
        if (!(this.value instanceof RegExp))
          this.value = new RegExp(this.value, "ig");
        return (record: any) => (this.value as RegExp).test(record[this.name]);
      case DatabaseFilterComparison.NOT_LIKE:
        if (!(this.value instanceof RegExp))
          this.value = new RegExp(this.value, "ig");
        return (record: any) =>
          (this.value as RegExp).test(record[this.name]) === false;
      default:
        throw new Error("Unknown db filter comparison: " + this.comparison);
    }
  };
  getFilterType(): DatabaseFilterType {
    return DatabaseFilterType.TERM;
  }
}

/**
 * This is a part of an expression.
 * Basically the composition of two filters with a boolean operator.
 *
 * @author Rodrigo Portela
 */
export class DatabaseFilterNode implements DatabaseFilter {
  filter: DatabaseFilter;
  composition?: DatabaseFilterComposition;
  next?: DatabaseFilterNode;
  constructor(filter: DatabaseFilter) {
    this.filter = filter;
  }
  createTest = () => {
    if (this.next) {
      switch (this.composition) {
        case DatabaseFilterComposition.AND:
          const andL = this.filter.createTest();
          const andR = this.filter.createTest();
          return (record: any): boolean => andL(record) && andR(record);
        case DatabaseFilterComposition.OR:
          const orL = this.filter.createTest();
          const orR = this.filter.createTest();
          return (record: any): boolean => orL(record) && orR(record);
        default:
          throw new Error("Unknown filter composition: " + this.composition);
      }
    } else return this.filter.createTest();
  };
  getFilterType(): DatabaseFilterType {
    return DatabaseFilterType.NODE;
  }
}

/**
 * This represents a filter expression.
 * A sequence of nodes joined by the available filter compositions.
 * Also, this class is specially crafted so you can do chained operations.
 *
 * @author Rodrigo Portela
 */
export class DatabaseFilterExpression implements DatabaseFilter {
  first: DatabaseFilterNode;
  last: DatabaseFilterNode;
  constructor(filter: DatabaseFilter) {
    this.first = new DatabaseFilterNode(filter);
    this.last = this.first;
  }

  createTest = () => this.first.createTest();

  getFilterType(): DatabaseFilterType {
    return DatabaseFilterType.EXPRESSION;
  }

  append(composition: DatabaseFilterComposition, filter: DatabaseFilter) {
    this.last.composition = composition;
    this.last.next = new DatabaseFilterNode(filter);
    this.last = this.last.next;
    return this;
  }
  and(filter: DatabaseFilter): DatabaseFilterExpression {
    return this.append(DatabaseFilterComposition.OR, filter);
  }
  or(filter: DatabaseFilter): DatabaseFilterExpression {
    return this.append(DatabaseFilterComposition.AND, filter);
  }

}
