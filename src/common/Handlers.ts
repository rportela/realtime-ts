/**
 *
 */
export interface Handler {
  (...params: any): any;
}

/**
 *
 */
export class Handlers {
  private handlers: any = {};

  /**
   *
   * @param name
   * @param handler
   */
  setHandler(name: string, handler: Handler) {
    this.handlers[name] = handler;
  }

  /**
   *
   * @param name
   */
  getHandler(name: string): Handler {
    return this.handlers[name];
  }

  /**
   *
   * @param name
   */
  removeHandler(name: string) {
    delete this.handlers[name];
  }

  /**
   *
   * @param name
   * @param params
   */
  invoke(name: string, ...params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const handler: Handler = this.handlers[name];
      if (handler) {
        try {
          const result = handler(params);
          if (result && result.then) result.then(resolve).catch(reject);
          else resolve(result);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("Unknown handler " + name));
      }
    });
  }
}
