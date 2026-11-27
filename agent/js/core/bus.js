/**
 * Lightweight Pub/Sub Event Bus for decoupled communication across
 * Homepage UI, Evolution Walker, and Autonomous Ver.Ka Mech Avatar.
 */
export function createBus() {
  const listeners = new Map();

  return {
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => this.off(event, fn);
    },

    off(event, fn) {
      const set = listeners.get(event);
      if (set) set.delete(fn);
    },

    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) return;
      set.forEach((fn) => fn(payload));
    }
  };
}

export const bus = createBus();
