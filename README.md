# realtime-ts

A real time engine using websocket with node and typescript.
This project also adds support for local dbs using indexedDB and synchronization with remote databases such as mongo db.

## Handlers

Handlers are present on the common interface as they serve both sides. With handler you can define a name and the implementation of a method that can be called from a remote source.

**Server Side** handlers can be called from the client using a websocket. Something similar to a Remote Procedure Call.

**Client Side** handlers can be called from the server to execute actions on the client side.

There can be only one handler per name, by definition.

```javascript
const handlers = new Handlers();
handlers.setHandler("ALERT_USER", (message: string) => {
  window.alert(message);
});
```

That can be invoked in a later part of your code. Handlers can return a value. Always wrapped in a **promise**.

```javascript
handlers.invoke("ALERT_USER", "I'm a message to the user");
```

or

```javascript
const r: Promise<number> = handlers.invoke("ADD", 10, 20);
r.then((result) => console.log(result));
```

Or it can be removed by calling:

```javascript
handlers.removeHandler("ALERT_USER");
```

## Listeners

Another common implementation on both the server and the client is the use of listeners. A listener does not returns anything. Multiple functions can listen to an event and they work very well for notification messages.

```javascript
const listeners = new Listeners();
listeners.addListener("ON_NOTIFICATION", (message: string) => {
  console.log(message);
});
listeners.addListener("ON_NOTIFICATION", (message: string) => {
  window.alert(message);
});
```

Those methods are attached to a named event that can be called:

```javascript
listeners.notify("ON_NOTIFICATION", "I'm a notification");
```

Listeners can be removed using the **removeListener** method on the class.

> Those are the core concepts on both the client and the server. You'll find addHandler, addListener, removeHandler, removeListener, invoke and notify on a lot of the classes in this implementation.

## The Server

The Realtime server implements the standard node **http** or **https** createServer method and we use the **ws** library to create a socket attached to that server.

```javascript
const server = new RealtimeServer();
server.addHandler(
  "CALL_ME_MAYBE",
  (client: RealtimeServerClient, params?: any) => {
    return "Thanks for your call " + client.id;
  }
);
server.listen(1337);
```

## The Client

The realtime client uses a browser websocket implementation to connect to a realtime server.

```javascript
const client = new RealtimeClient("ws://localhost:1337");
const result: Promise<string> = client.call("CALL_ME_MAYBE");
result.then((answer) => console.log(answer));
```
