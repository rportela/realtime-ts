import { DatabaseCollectionImplementation, DatabaseCollectionSchema, DbKey } from "../common/DatabaseDefinition";
import { DatabaseFilter } from "../common/DatabaseFilters";
import { DatabaseSortExpression } from "../common/DatabaseSorters";
export default class BrowserDbCollection<T> implements DatabaseCollectionImplementation<T> {
    private db;
    private schema;
    constructor(db: IDBDatabase, schema: DatabaseCollectionSchema);
    getDatabaseName(): string;
    getDatabaseVersion(): number;
    getName(): string;
    getKeyPath(): string | string[];
    isKeyAutoGenerated(): boolean;
    add(record: T): Promise<DbKey>;
    addBatch(records: T[]): Promise<DbKey[]>;
    put(record: T): Promise<DbKey>;
    putBatch(records: T[]): Promise<DbKey[]>;
    delete(key: DbKey): Promise<unknown>;
    get(key: DbKey): Promise<T>;
    all(): Promise<T[]>;
    filter(fn: (record: T) => boolean): Promise<T[]>;
    map<G>(fn: (record: T) => G): Promise<G[]>;
    forEach(fn: (record: T) => void): Promise<unknown>;
    count(): Promise<number>;
    query(filter?: DatabaseFilter, sort?: DatabaseSortExpression, offset?: number, limit?: number): Promise<T[]>;
    clear(): Promise<unknown>;
}
