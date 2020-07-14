import { DbSchema } from "./DbSchema";
import { DbCollection } from "./DbCollection";

/**
 * 
 */
export interface Db {
  readonly schema: DbSchema;
  collections(): DbCollection<any>[];
  collection<T>(name: string): DbCollection<T>;
}
