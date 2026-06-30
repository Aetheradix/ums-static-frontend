import { useState, useEffect } from 'react';

/**
 * Simple hook for persisting state in browser localStorage.
 * The stored value is JSON‑stringified. If the key does not exist,
 * the provided defaultValue is used and written to storage.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      // ignore write errors (e.g., incognito mode)
    }
  };

  // Write default value the first time if nothing exists.
  useEffect(() => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
  }, []);

  return [value, set];
}
