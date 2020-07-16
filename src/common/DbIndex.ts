import { DbIndexSchema } from "./DbSchema";

/**
 * Represents a database index.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbIndex<T> extends DbIndexSchema {
  /**
   * Returns the number of records within a key range.
   * @param key
   */
  count(key?: IDBKeyRange): Promise<number>;

  /**
   * Finds either the value in the referenced object store that corresponds to the given key or the first corresponding value,
   * if key is set to an IDBKeyRange.
   * @param key
   */
  get(key?: IDBValidKey | IDBKeyRange): Promise<T>;

  /**
   * Gets all objects that are present on this index.
   * Optionally you can pass a key or a key range to limit the results.
   * @param key
   */
  getAll(key?: IDBValidKey | IDBKeyRange): Promise<T[]>;
}
