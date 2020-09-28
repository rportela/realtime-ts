/**
 * This simple enum tells all the possible directions of a sort.
 *
 * @author Rodrigo Portela
 */
export enum DatabaseSortDirection {
  ASCENDING,
  DESCENDING,
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
export class DatabaseSortNode {
  name: string;
  direction: DatabaseSortDirection;
  next?: DatabaseSortNode;

  constructor(name: string, direction: DatabaseSortDirection) {
    this.name = name;
    this.direction = direction;
  }

  createAscendingComparer = (a: any, b: any): number => {
    const left = a[this.name];
    const right = b[this.name];
    if (left < right) return -1;
    if (left === right) return 0;
    else return 1;
  };

  createDescendingComparer = (a: any, b: any) => {
    const left = a[this.name];
    const right = b[this.name];
    if (left > right) return -1;
    if (left === right) return 0;
    else return 1;
  };

  createComparer(): (a: any, b: any) => number {
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

/**
 * This is a joined sort expression that performs sequential sorts based on the nodes.
 * You should use this description to create a sort expression on a database or on a set of records.
 * The javascript sort implementation is included.
 *
 * @author Rodrigo Portela
 */
export class DatabaseSortExpression {
  first: DatabaseSortNode;
  last: DatabaseSortNode;

  constructor(direction: DatabaseSortDirection, ...names: string[]) {
    if (names.length < 1)
      throw new Error(
        "You need to provide at least one name to the sort expression."
      );
    this.first = new DatabaseSortNode(names[0], direction);
    this.last = this.first;
    for (let i = 1; i < names.length; i++) {
      this.last.next = new DatabaseSortNode(names[i], direction);
      this.last = this.last.next;
    }
  }

  thenOrderBy(
    direction: DatabaseSortDirection,
    ...name: string[]
  ): DatabaseSortExpression {
    for (const n of name) {
      this.last.next = new DatabaseSortNode(n, direction);
      this.last = this.last.next;
    }
    return this;
  }

  sort(array: any[]) {
    let node = this.first;
    while (node !== undefined) {
      array.sort(node.createAscendingComparer);
      node = node.next;
    }
  }
}
