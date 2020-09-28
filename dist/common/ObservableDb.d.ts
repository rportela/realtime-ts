import { DatabaseCollectionImplementation, DatabaseImplementation, DatabaseSchema } from "./DatabaseDefinition";
import { Listener } from "./Listeners";
export declare enum ObservableDbEvent {
    OBS_DB_DROP = "OBS_DB_DROP"
}
/**
 * This is an observable DB.
 * You and add listeners to any collection and be notified when records are added, put or deleted.
 */
export default class ObservableDb implements DatabaseImplementation {
    private listeners;
    private db;
    private collections;
    constructor(db: DatabaseImplementation);
    getName(): string;
    getVersion(): number;
    getCollections(): Promise<DatabaseCollectionImplementation<any>[]>;
    getCollection<T>(name: string): Promise<DatabaseCollectionImplementation<T>>;
    drop(): Promise<unknown>;
    addListener(event: ObservableDbEvent, listener: Listener): void;
    removeListener(event: ObservableDbEvent, listener: Listener): void;
    getSchema(): DatabaseSchema;
}
