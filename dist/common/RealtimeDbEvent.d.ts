import { DbFilter } from "./DbFilters";
import { DbQueryParameters } from "./DbSchema";
export declare enum RealtimeDbEvent {
    SCHEMA = "RTSDB_GET_SCHEMA",
    NOTIFY = "RTSDB_NOTIFY",
    GET = "RTSDB_GET",
    SELECT = "RTSDB_SELECT"
}
export interface RealtimeDbNotifyParams {
    db: string;
    collection: string;
    filter?: DbFilter;
}
export interface RealtimeDbSelectParams extends DbQueryParameters {
    db: string;
}
export interface RealtimeDbGetParams extends DbQueryParameters {
    db: string;
}
