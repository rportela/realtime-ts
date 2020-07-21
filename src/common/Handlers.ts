export interface Handler {
  (...params: any[]): any;
}

export class Handlers {
  private handlers: any = {};
  setHandler(method: string, handler: Handler) {
    this.handlers[method] = handler;
  }
  removeHandler(method: string) {
    delete this.handlers[method];
  }
  invoke(method: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const handler: Handler = this.handlers[method];
      if (handler) {
        try {
          const result = handler(params);
          if (result && result.then) result.then(resolve).catch(reject);
          else resolve(result);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error("No handler found for " + method));
      }
    });
  }
}
