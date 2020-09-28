import { DbKey } from "./DatabaseDefinition";
import { DatabaseFilter } from "./DatabaseFilters";
import { DatabaseSortExpression } from "./DatabaseSorters";
export declare enum RealtimeDbEvent {
    SCHEMA = "RTSDB_GET_SCHEMA",
    NOTIFY = "RTSDB_NOTIFY",
    GET = "RTSDB_GET",
    SELECT = "RTSDB_SELECT"
}
export interface RealTimeDbQuery {
    db: string;
    collection: string;
    filter?: DatabaseFilter;
    sort?: DatabaseSortExpression;
    offset?: number;
    limit?: number;
}
export interface RealTimeDbGet {
    db: string;
    collection: string;
    key: DbKey;
}
