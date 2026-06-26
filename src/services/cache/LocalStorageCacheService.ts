import type { ICacheService } from './ICacheService';

export class LocalStorageCacheService implements ICacheService {
  private prefix: string;

  constructor(prefix = 'ums_') {
    this.prefix = prefix;
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.getPrefixedKey(key));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getPrefixedKey(key), JSON.stringify(value));
    } catch {
      console.warn('[CacheService] Failed to write to localStorage', key);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getPrefixedKey(key));
    } catch {
      console.warn('[CacheService] Failed to remove from localStorage', key);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      console.warn('[CacheService] Failed to clear localStorage');
    }
  }
}
