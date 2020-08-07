# JSON rpc 2.0

One important component used both on the server side and on the client side is the JSON rpc class. It's an abstract class that exposes methods such as **handleCall**, **handleNotification** and **sendJson** so that the appropriate implementation can be made using either websocket on the browser or on the server.

> Based on the [JSON RPC](https://www.jsonrpc.org) made by Google.

This class contains handlers and listeners. You and either define handlers for messages that will be JSON encoded an called from a remote. Or you can add listeners that will be notified when a notification is send from a remote.

```javascript
export default class RealtimeServerClient extends JsonRpc {
    ...
    protected sendJson(json: string) {
    this.socket.send(json);
    }
    protected handleCall(method: string, params: any): Promise<any> {
        return this.handlers.invoke(method, this, params);
    }
    protected handleNotification(method: string, params: any): void {
        this.listeners.notify(method, this, params);
    }
}
```

```javascript
export default class RealtimeClient extends JsonRpc {
    ...
    /**
     * Either sends the message if connected.
     * Or stores it in a buffer for sending when connected.
     * @param json
     */
    protected sendJson(json: string) {
        if (this.connected) this.socket.send(json);
        else this.buffer.push(json);
    }

    /**
     * Handles a remote procedure call by invoking a handler out of the Handlers.
     * @param method
     * @param params
     */
    protected handleCall(method: string, params: any): any | Promise<any> {
        return this.handlers.invoke(method, params);
    }

    /**
     * Handles a notification by notifying all listeners.
     * @param method
     * @param params
     */
    protected handleNotification(method: string, params: any): void {
        this.listeners.notify(method, params);
    }
}
```


> Important: Clients may not always be connected by the server should be.