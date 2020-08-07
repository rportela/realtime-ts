# Realtime Database

In this library we have implemented a realtime database that syncs records on both local indexedDB and a remote db such as mongo db (already included) or any other database that implements our common interface.

Common events are sent over the wire to be implemented on both the client and the server sides. We provide a working implementation using **indexedDB** on the client and **MongoDb** on the server.

```javascript
export enum DbEvent {
  DB_RECORD_ADD = "DB_RECORD_ADD",
  DB_RECORD_PUT = "DB_RECORD_PUT",
  DB_RECORD_DELETE = "DB_RECORD_DELETE",
  DB_COLLECTION_DROP = "DB_COLLECTION_DROP",
  DB_DATABASE_DROP = "DB_DATABASE_DROP",
}
```

> Queries are available using handlers and you can watch for record changes using the events above.

## Schema

One of the most important parts of this implementations is the definition of the schema. It is important to notice that we're using document stores so no column specification is required. Just plain database and collection enumerations are required.

> Client side database are reset based on the version number of the schema. See example below:

```javascript
export const schema = {
  name: "crm",
  version: 12,
  collections: [
    {
      name: "person",
      keyPath: "_id",
    },
    {
      name: "company",
      keyPath: "_id",
    },
    {
      name: "interaction",
      keyPath: "_id",
    },
    {
      name: "message",
      keyPath: "_id",
    },
  ],
};
```

The schema above defines a single database with four collections. The only required information is the key path. It determines the unique identifier for entries in the collection. That information is used to identify if a record should be updated or inserted and also helps methods such as **get** that only receives the id as the parameter.

## Server

A server can then be declared as:

```javascript
const mongodb = new MongoDb(schema, settings.mongoUrl);
const server = new RealtimeDbServer([mongodb], settings.useHttps);
```

> A server can have any number of databases, that' why the parameter mongodb is passed inside brackets.

## Clients

A client connects to the server, retrieves it's schema and creates the appropriate local collections on a client database. We've included indexedDB, an API available on most modern browsers. To use it, simply instantiate on the client side:

```javascript
const DbServer = new RealtimeDb("ws://localhost:1337");
```

After that you can easily grab a reference for a database and start execution method calls and the changed records will be notified to the server and further informed to every listening client.

Here's an example method call:

```javascript
DbServer.getDb("crm").put("person", {
  name: "Rodrigo Portela",
  title: "Juggernaut",
});
```

The code above will put a new record on the local environment, be it indexedDB or any other implementation and will also fire a **notification** to the server with the name "DB_RECORD_PUT" and the server will handle that and do the appropriate PUT on the desired collection.

> The implementing server should also broadcast the message so every listening client would also "PUT" the same record as soon as possible.

