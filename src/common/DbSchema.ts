/**
 * Represents a database index schema.
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbIndexSchema {
  readonly name: string;
  readonly keyPath: string | string[];
  readonly unique?: boolean;
}

/**
 * Represents a database collection schema;
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbCollectionSchema {
  readonly name: string;
  readonly keyPath?: string | string[];
  readonly autoIncrement?: boolean;
  readonly indexes?: DbIndexSchema[];
}

/**
 * Represents a database schema;
 * @author Rodrigo Portela <rodrigo.portela@gmail.com>
 */
export interface DbSchema {
  readonly name: string;
  readonly version?: number;
  readonly collections: DbCollectionSchema[];
}
