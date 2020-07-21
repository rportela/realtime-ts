import { DbIndex } from "../common/DbIndex";
export default class BrowserDbIndex<T> implements DbIndex<T> {
    constructor(idx: IDBIndex);
    count(key?: IDBKeyRange): Promise<number>;
    get(key?: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey): Promise<T>;
    getAll(key?: string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey): Promise<T[]>;
    name: string;
    keyPath: string | string[];
    unique: boolean;
}
