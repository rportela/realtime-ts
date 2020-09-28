export interface Listener {
  (...params: any[]): void;
}

export class Listeners {
  private listeners: any = {};
  addListener(event: string, listener: Listener) {
    let l: Listener[] = this.listeners[event];
    if (l === undefined) {
      l = [listener];
      this.listeners[event] = l;
    } else {
      const idx = l.indexOf(listener);
      if (idx < 0) l.push(listener);
    }
  }
  removeListener(event: string, listener: Listener) {
    const l: Listener[] = this.listeners[event];
    if (l) {
      const idx = l.indexOf(listener);
      if (idx >= 0) l.splice(idx, 1);
    }
  }
  notify(event: string, ...params: any[]) {
    const l: Listener[] = this.listeners[event];
    if (l) {
      l.forEach((listener) => {
        try {
          listener(params);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}
