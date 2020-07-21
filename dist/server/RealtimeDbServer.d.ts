import { Db } from "../common/Db";
import { RealtimeServer } from "./RealtimeServer";
export default class RealtimeDbServer extends RealtimeServer {
    private dbs;
    constructor(dbs: Db[], useHttps?: boolean);
    private clientAddRecord;
    private clientPutRecord;
    private clientDeleteRecord;
    private notifyClient;
    getDb(name: string): Db;
    getSchema: () => import("../common/DbSchema").DbSchema[];
}
