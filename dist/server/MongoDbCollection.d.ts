import { Db as mongodb, Cursor } from "mongodb";
import { DbCollection } from "../common/DbCollection";
import { DbCollectionSchema, DbKeyQuery } from "../common/DbSchema";
import { DbFilter } from "../common/DbFilters";
import { DbSort } from "../common/DbSorters";
export default class MongoDbCollection<T> implements DbCollection<T> {
    private colPromise;
    private schema;
    constructor(schema: DbCollectionSchema, dbPromise: Promise<mongodb>);
    getSchema(): DbCollectionSchema;
    getName(): string;
    getKeyPath(): string | string[];
    isAutoIncrement(): boolean;
    add(record: T): Promise<IDBValidKey>;
    put(record: T): Promise<IDBValidKey>;
    delete(key: DbKeyQuery): Promise<undefined>;
    clear(): Promise<undefined>;
    count(query?: DbKeyQuery): Promise<number>;
    get(query: DbKeyQuery): Promise<T>;
    getAll(query?: DbKeyQuery, count?: number): Promise<T[]>;
    forEach(fn: (record: T) => void, query?: DbKeyQuery, direction?: IDBCursorDirection): Promise<undefined>;
    createCursor(where?: DbFilter, orderBy?: DbSort, offset?: number, limit?: number): Promise<Cursor<T>>;
    select(where?: DbFilter, orderBy?: DbSort, offset?: number, limit?: number): Promise<T[]>;
}
