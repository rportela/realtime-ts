import { DatabaseCollectionImplementation, DatabaseImplementation, DatabaseSchema } from "../common/DatabaseDefinition";
export default class MongoDb implements DatabaseImplementation {
    private schema;
    private open;
    constructor(schema: DatabaseSchema, url?: string);
    getName(): string;
    getVersion(): number;
    getCollections(): Promise<DatabaseCollectionImplementation<any>[]>;
    getCollection<T>(name: string): Promise<DatabaseCollectionImplementation<T>>;
    drop(): Promise<unknown>;
    getSchema(): DatabaseSchema;
}
