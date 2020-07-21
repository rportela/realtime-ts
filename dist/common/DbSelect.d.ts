import { DbFilter } from "./DbFilters";
import { DbSort } from "./DbSorters";
export default abstract class DbSelect {
    _from?: string;
    _where?: DbFilter;
    _offset?: number;
    _limit?: number;
    _orderBy?: DbSort;
    from(name: string): DbSelect;
    where(filter: DbFilter): DbSelect;
    andWhere(filter: DbFilter): DbSelect;
    offset(value: number): DbSelect;
    limit(value: number): DbSelect;
    orderBy(name: string, descending?: boolean): DbSelect;
    thenOrderBy(name: string, descending?: boolean): DbSelect;
    abstract first(): Promise<any>;
    abstract toArray(): Promise<any[]>;
}
