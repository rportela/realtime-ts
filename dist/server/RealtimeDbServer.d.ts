import { DatabaseImplementation, DatabaseSchema } from "../common/DatabaseDefinition";
import { RealtimeServer } from "./RealtimeServer";
export default class RealtimeDbServer extends RealtimeServer {
    private dbs;
    constructor(dbs: DatabaseImplementation[], useHttps?: boolean);
    getDb(name: string): DatabaseImplementation;
    getSchema(): DatabaseSchema[];
    private clientAddRecord;
    private clientPutRecord;
    private clientDeleteRecord;
    private notifyClient;
}
