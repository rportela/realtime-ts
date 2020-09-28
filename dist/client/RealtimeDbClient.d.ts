import ObservableDb from "../common/ObservableDb";
import JsonRpcClient from "./JsonRpcClient";
/**
 *
 */
export default class RealtimeDbClient extends JsonRpcClient {
    private dbs;
    private resolveDbs;
    private rejectDbs;
    /**
     * Instantiates a new instance of a realtime Db Client.
     * @param url
     * @param protocols
     */
    constructor(url?: string, protocols?: string[]);
    private loadLocalSchema;
    /**
     * Creates an instance and attaches listeners for the client db.
     * @param schema
     */
    private createLocalDb;
    private attachCollection;
    /**
     * Detaches event listeners from the client db instance.
     * @param db
     */
    private removeLocalDb;
    private detachCollection;
    /**
     * Handler for the get schema call.
     * @param params
     */
    private onRemoteSchema;
    /**
     * Event raised when a connection is established.
     */
    protected onConnect: () => void;
    /**
     * Event raised when a record is added to the remote database.
     * @param params
     */
    private onRemoteAdd;
    /**
     * Event raised when a record is put on the remote database.
     * @param params
     */
    private onRemotePut;
    /**
     * Event raised when a records is deleted on the remote database.
     * @param params
     */
    private onRemoteDelete;
    /**
     * Event raised when a record is added to the client db.
     * @param params
     */
    private onLocalAdd;
    /**
     * Event raised when a record is put on the client db.
     * @param params
     */
    private onLocalPut;
    /**
     * Event raised when a records is deleted from the client db.
     * @param params
     */
    private onLocalDelete;
    /**
     * Gets an observable db by it's name.
     * This method won't fail. It returns undefined when no database is found.
     * @param name
     */
    getDb(name: string): Promise<ObservableDb>;
}
