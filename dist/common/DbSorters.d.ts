export interface DbComparer {
    (a: any, b: any): number;
}
export declare class DbSort {
    name: string;
    descending?: boolean;
    next?: DbSort;
    constructor(name: string, descending?: boolean);
    createSorter(): DbComparer;
    sort(arr: any[]): void;
}
