export interface DbComparer {
  (a: any, b: any): number;
}

export class DbSort {
  name: string;
  descending?: boolean;
  next?: DbSort;
  constructor(name: string, descending?: boolean) {
    this.name = name;
    this.descending = descending;
  }
  createSorter(): DbComparer {
    if (this.descending === true) {
      return (a: any, b: any) => {
        const va = a[this.name];
        const vb = b[this.name];
        if (va > vb) return 1;
        else if (va < vb) return -1;
        else return 0;
      };
    } else {
      return (a: any, b: any) => {
        const va = a[this.name];
        const vb = b[this.name];
        if (va < vb) return 1;
        else if (va > vb) return -1;
        else return 0;
      };
    }
  }
  sort(arr: any[]) {
    arr.sort(this.createSorter());
    if (this.next) this.next.sort(arr);
  }
}
