"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbFilters_1 = require("./DbFilters");
const DbSorters_1 = require("./DbSorters");
class DbSelect {
    from(name) {
        this._from = name;
        return this;
    }
    where(filter) {
        this._where = filter;
        return this;
    }
    andWhere(filter) {
        if (this._where) {
            if (this._where.getFilterType() === DbFilters_1.DbFilterType.EXPRESSION)
                this._where.and(filter);
            else
                this._where = new DbFilters_1.DbFilterExpression(filter);
        }
        else
            this._where = filter;
        return this;
    }
    offset(value) {
        this._offset = value;
        return this;
    }
    limit(value) {
        this._limit = value;
        return this;
    }
    orderBy(name, descending) {
        this._orderBy = new DbSorters_1.DbSort(name, descending);
        return this;
    }
    thenOrderBy(name, descending) {
        let last = this._orderBy;
        while (last && last.next)
            last = last.next;
        if (last)
            last.next = new DbSorters_1.DbSort(name, descending);
        else
            this._orderBy = new DbSorters_1.DbSort(name, descending);
        return this;
    }
}
exports.default = DbSelect;
