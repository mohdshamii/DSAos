import { get, set, del } from 'idb-keyval';

const PREFIX = 'dsaos_';

export async function saveToIdb<T>(key: string, value: T): Promise<void> {
  try {
    await set(`${PREFIX}${key}`, value);
  } catch (err) {
    console.error('Failed to save to IndexedDB:', err);
  }
}

export async function getFromIdb<T>(key: string, fallback: T): Promise<T> {
  try {
    const val = await get<T>(`${PREFIX}${key}`);
    return val !== undefined ? val : fallback;
  } catch (err) {
    console.error('Failed to read from IndexedDB:', err);
    return fallback;
  }
}

export async function removeFromIdb(key: string): Promise<void> {
  try {
    await del(`${PREFIX}${key}`);
  } catch (err) {
    console.error('Failed to delete from IndexedDB:', err);
  }
}

// LocalStorage helpers for quick synchronous state
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return defaultValue;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}
