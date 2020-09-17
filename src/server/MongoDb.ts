import {
  Cursor,
  Db as mongodb,
  InsertOneWriteOpResult,
  MongoClient,
  UpdateWriteOpResult,
} from "mongodb";
import { Db } from "../common/Db";
import { DbFilter } from "../common/DbFilters";
import {
  DbCollectionSchema,
  DbForEachParameters,
  DbKey,
  DbQueryParameters,
  DbSchema,
} from "../common/DbSchema";
import { dbFilterToQuery } from "./MongoDialect";
import {
  DbDatabaseDrop,
  DbCollectionDrop,
  DbRecordAdd,
  DbRecordPut,
  DbRecordDelete,
} from "../common/DbEvents";

export default class MongoDb implements Db {
  private schema: DbSchema;
  private open: Promise<mongodb>;

  constructor(schema: DbSchema, url?: string) {
    this.schema = schema;
    this.open = new Promise<mongodb>((resolve, reject) => {
      const client: MongoClient = new MongoClient(
        url || process.env.MONGODB_URL,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      client.connect((err) => {
        if (err) reject(err);
        else resolve(client.db(schema.name));
      });
    });
  }
  getSchema(): DbSchema {
    return this.schema;
  }
  getName(): string {
    return this.schema.name;
  }
  getVersion(): number {
    return this.schema.version;
  }
  getCollectionSchema(collection: string): DbCollectionSchema {
    return this.schema.collections.find((c) => c.name === collection);
  }
  dropDatabase(): Promise<DbDatabaseDrop> {
    return this.open.then((db) =>
      db
        .dropDatabase()
        .then(
          () => ({ db: this.schema.name, when: new Date() } as DbDatabaseDrop)
        )
    );
  }
  dropCollection(name: string): Promise<DbCollectionDrop> {
    return this.open.then((db) =>
      db.dropCollection(name).then((result: boolean) => {
        if (result)
          return {
            db: this.schema.name,
            collection: name,
            when: new Date(),
          } as DbCollectionDrop;
        else throw new Error("Unable to delete collection " + name);
      })
    );
  
  }
  get<T>(collection: string, key: DbKey): Promise<T> {
    return this.open
      .then((db) => db.collection(collection))
      .then((col) => {
        const filter: any = {};
        filter[this.getCollectionSchema(collection).keyPath] = key;
        return col.findOne(filter);
      });
  }
  add<T>(collection: string, record: T): Promise<DbRecordAdd<T>> {
    return this.open.then((db) =>
      db
        .collection(collection)
        .insertOne(record)
        .then(
          (result: InsertOneWriteOpResult<any>) =>
            ({
              db: this.schema.name,
              collection: name,
              when: new Date(),
              record: record,
              key: result.insertedId,
            } as DbRecordAdd<T>)
        )
    );
  }
  put<T>(collection: string, record: T): Promise<DbRecordPut<T>> {
    const keyPath = this.getCollectionSchema(collection).keyPath || "_id";
    const key = record[keyPath];
    const filter = {};
    filter[keyPath] = key;
    return this.open.then((db) =>
      db
        .collection(collection)
        .updateOne(filter, record, { upsert: true })
        .then(
          (result: UpdateWriteOpResult) =>
            ({
              db: this.schema.name,
              collection: name,
              when: new Date(),
              record: record,
              key: key,
            } as DbRecordPut<T>)
        )
    );
  }
  delete<T>(collection: string, key: DbKey): Promise<DbRecordDelete> {
    const keyPath = this.getCollectionSchema(collection).keyPath || "_id";
    const filter = {};
    filter[keyPath] = key;
    return this.open.then((db) =>
      db
        .collection(collection)
        .deleteOne(filter)
        .then(
          () =>
            ({
              db: this.schema.name,
              collection: name,
              when: new Date(),
              key: key,
            } as DbRecordDelete)
        )
    );
  }
  count(collection: string, filter?: DbFilter): Promise<number> {
    return this.open
      .then((db) => db.collection(collection))
      .then((col) => col.countDocuments(dbFilterToQuery(filter)))
      .then((result: number | void) => (result ? result : 0));
  }
  createCursor<T>(params: DbQueryParameters): Promise<Cursor<T>> {
    return this.open
      .then((db) => db.collection(params.collection))
      .then((col) => col.find(dbFilterToQuery(params.where)))
      .then((cursor) => {
        if (params.orderBy)
          cursor.sort(params.orderBy.name, params.orderBy.descending ? -1 : 1);
        if (params.orderBy.next)
          throw new Error("Mongo only allows you to sort by a single field");
        if (params.offset) cursor.skip(params.offset);
        if (params.limit) cursor.limit(params.limit);
        return cursor;
      });
  }
  first<T>(params: DbQueryParameters): Promise<T> {
    return this.createCursor<T>(params).then((cursor) => cursor.next());
  }
  select<T>(params: DbQueryParameters): Promise<T[]> {
    return this.createCursor<T>(params).then((cursor) => cursor.toArray());
  }
  forEach<T>(params: DbForEachParameters<T>): Promise<any> {
    return this.createCursor<T>(params).then((cursor) =>
      cursor.forEach(params.iterator)
    );
  }
}
