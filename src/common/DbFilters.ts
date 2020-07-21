export enum DbFilterComparison {
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

export enum DbFilterType {
  TERM,
  NODE,
  EXPRESSION,
}

export enum DbFilterOperation {
  AND,
  OR,
}

export interface DbFilter {
  test(record: any): boolean;
  getFilterType(): DbFilterType;
}

export class DbFilterTerm implements DbFilter {
  name: string;
  comparison: DbFilterComparison;
  value: any;
  constructor(name: string, comparison: DbFilterComparison, value: any) {
    this.name = name;
    this.comparison = comparison;
    this.value = value;
  }
  test(record: any): boolean {
    switch (this.comparison) {
      case DbFilterComparison.EQUAL_TO:
        return record[this.name] === this.value;
      case DbFilterComparison.NOT_EQUAL_TO:
        return record[this.name] !== this.value;
      case DbFilterComparison.GREATER_THAN:
        return record[this.name] > this.value;
      case DbFilterComparison.GREATER_OR_EQUAL:
        return record[this.name] >= this.value;
      case DbFilterComparison.LOWER_THAN:
        return record[this.name] < this.value;
      case DbFilterComparison.LOWER_OR_EQUAL:
        return record[this.name] <= this.value;
      case DbFilterComparison.IN:
        return this.value.indexOf(record[this.name]) >= 0;
      case DbFilterComparison.NOT_IN:
        return this.value.indexOf(record[this.name]) < 0;
      case DbFilterComparison.LIKE:
        if (!(this.value instanceof RegExp))
          this.value = new RegExp(this.value, "ig");
        return (this.value as RegExp).test(record[this.name]);
      case DbFilterComparison.NOT_LIKE:
        if (!(this.value instanceof RegExp))
          this.value = new RegExp(this.value, "ig");
        return (this.value as RegExp).test(record[this.name]) === false;
      default:
        throw new Error("Unknown db filter comparison: " + this.comparison);
    }
  }
  getFilterType(): DbFilterType {
    return DbFilterType.TERM;
  }
}

export class DbFilterNode implements DbFilter {
  filter: DbFilter;
  operation?: DbFilterOperation;
  next?: DbFilterNode;
  constructor(filter: DbFilter) {
    this.filter = filter;
  }
  test(record: any): boolean {
    if (this.next) {
      switch (this.operation) {
        case DbFilterOperation.AND:
          return this.filter.test(record) && this.next.test(record);
        case DbFilterOperation.OR:
          return this.filter.test(record) || this.next.test(record);
        default:
          throw new Error("Unknown filter operation: " + this.operation);
      }
    } else return this.filter.test(record);
  }
  getFilterType(): DbFilterType {
    return DbFilterType.NODE;
  }
}

export class DbFilterExpression implements DbFilter {
  first: DbFilterNode;
  last: DbFilterNode;
  constructor(filter: DbFilter) {
    this.first = new DbFilterNode(filter);
    this.last = this.first;
  }
  test(record: any): boolean {
    return this.first.test(record);
  }
  getFilterType(): DbFilterType {
    return DbFilterType.EXPRESSION;
  }
  and(filter: DbFilter): DbFilterExpression {
    this.last.operation = DbFilterOperation.AND;
    this.last.next = new DbFilterNode(filter);
    this.last = this.last.next;
    return this;
  }
  or(filter: DbFilter): DbFilterExpression {
    this.last.operation = DbFilterOperation.OR;
    this.last.next = new DbFilterNode(filter);
    this.last = this.last.next;
    return this;
  }
}
