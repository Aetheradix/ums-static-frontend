type SubscriberCallbackFunc<T> = (params: T) => void;

class PubSub {
  readonly events: {
    [k: string]: SubscriberCallbackFunc<unknown>[];
  } = {};

  // Subscribe to an event
  subscribe<T>(event: Events.Event, callback: SubscriberCallbackFunc<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback as SubscriberCallbackFunc<unknown>);
  }

  // Unsubscribe from an event
  unsubscribe<T>(event: Events.Event, callback: SubscriberCallbackFunc<T>) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== callback);
  }

  // Publish an event
  publish<T>(event: Events.Event, data: T) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

export default new PubSub();
