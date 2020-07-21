export interface Listener {
  (...params: any[]): void;
}

export class Listeners {
  private listeners: any = {};
  addListener(method: string, listener: Listener) {
    const arr = this.listeners[method];
    if (!arr) {
      this.listeners[method] = [listener];
    } else {
      const idx = arr.indexOf(listener);
      if (idx < 0) arr.push(listener);
    }
  }
  removeListener(method: string, listener: Listener) {
    const arr = this.listeners[method];
    if (arr) {
      const idx = arr.indexOf(listener);
      if (idx >= 0) arr.splice(idx, 1);
    }
  }
  notify(method: string, ...params: any[]) {
    const arr = this.listeners[method];
    if (arr) {
      arr.forEach((listener) => {
        try {
          listener(params);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}
