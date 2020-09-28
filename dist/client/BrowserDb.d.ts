import { DatabaseCollectionImplementation, DatabaseImplementation, DatabaseSchema } from "../common/DatabaseDefinition";
/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 * This API uses indexes to enable high-performance searches of this data.
 * While Web Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data.
 * IndexedDB provides a solution.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export default class BrowserDb implements DatabaseImplementation {
    private schema;
    private open;
    private collections;
    constructor(schema: DatabaseSchema);
    getName(): string;
    getVersion(): number;
    getCollections(): Promise<DatabaseCollectionImplementation<any>[]>;
    getCollection<T>(name: string): Promise<DatabaseCollectionImplementation<T>>;
    drop(): Promise<unknown>;
    getSchema(): DatabaseSchema;
}
