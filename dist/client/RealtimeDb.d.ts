import ObservableDb from "../common/ObservableDb";
export default class RealtimeDb {
    private client;
    private dbs;
    constructor(url?: string, protocols?: string[]);
    private createLocalDb;
    private removeLocalDb;
    private onRemoteAdd;
    private onRemotePut;
    private onRemoteDelete;
    private onRemoteSelect;
    private onRemoteGet;
    private onRemoteSchema;
    private onConnect;
    private onLocalAdd;
    private onLocalPut;
    private onLocalDelete;
    getDb(name: string): ObservableDb;
}
