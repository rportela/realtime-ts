import { DbSchema } from "./DbSchema";
import { DbCollection } from "./DbCollection";

/**
 * This is the skeleton of a database.
 * It exposes the schema as readonly, and a set of method for reaching the collections.
 * @author Rodrigo Portela
 */
export interface Db {
  readonly schema: DbSchema;
  collections(): DbCollection<any>[];
  collection<T>(name: string): DbCollection<T>;
}
