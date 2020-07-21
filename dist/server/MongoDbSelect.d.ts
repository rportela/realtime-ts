import DbSelect from "../common/DbSelect";
import MongoDb from "./MongoDb";
export default class MongoDbSelect extends DbSelect {
    private db;
    constructor(db: MongoDb);
    first(): Promise<any>;
    toArray(): Promise<any[]>;
}
