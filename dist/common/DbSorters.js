"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbSort = void 0;
class DbSort {
    constructor(name, descending) {
        this.name = name;
        this.descending = descending;
    }
    createSorter() {
        if (this.descending === true) {
            return (a, b) => {
                const va = a[this.name];
                const vb = b[this.name];
                if (va > vb)
                    return 1;
                else if (va < vb)
                    return -1;
                else
                    return 0;
            };
        }
        else {
            return (a, b) => {
                const va = a[this.name];
                const vb = b[this.name];
                if (va < vb)
                    return 1;
                else if (va > vb)
                    return -1;
                else
                    return 0;
            };
        }
    }
    sort(arr) {
        arr.sort(this.createSorter());
        if (this.next)
            this.next.sort(arr);
    }
}
exports.DbSort = DbSort;
