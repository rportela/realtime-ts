import { DbFilter, DbFilterType, DbFilterExpression } from "./DbFilters";
import { DbSort } from "./DbSorters";

export default abstract class DbSelect {
  _from?: string;
  _where?: DbFilter;
  _offset?: number;
  _limit?: number;
  _orderBy?: DbSort;

  from(name: string): DbSelect {
    this._from = name;
    return this;
  }

  where(filter: DbFilter): DbSelect {
    this._where = filter;
    return this;
  }

  andWhere(filter: DbFilter): DbSelect {
    if (this._where) {
      if (this._where.getFilterType() === DbFilterType.EXPRESSION)
        (this._where as DbFilterExpression).and(filter);
      else this._where = new DbFilterExpression(filter);
    } else this._where = filter;
    return this;
  }

  offset(value: number): DbSelect {
    this._offset = value;
    return this;
  }

  limit(value: number): DbSelect {
    this._limit = value;
    return this;
  }

  orderBy(name: string, descending?: boolean): DbSelect {
    this._orderBy = new DbSort(name, descending);
    return this;
  }

  thenOrderBy(name: string, descending?: boolean): DbSelect {
    let last = this._orderBy;
    while (last && last.next) last = last.next;
    if (last) last.next = new DbSort(name, descending);
    else this._orderBy = new DbSort(name, descending);
    return this;
  }

  abstract first(): Promise<any>;
  abstract toArray(): Promise<any[]>;
}
