import { defaultState, type AppState } from './state';

const DB_NAME = 'next-step-cards';
const STORE = 'app-state';
const KEY = 'current';

export type StorageMode = 'real' | 'demo';

function databaseName(mode: StorageMode): string {
  return mode === 'demo' ? `demo:${DB_NAME}` : DB_NAME;
}

function openDatabase(mode: StorageMode): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const request = indexedDB.open(databaseName(mode), 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
    request.onblocked = () => reject(new Error('Another tab is blocking the data store. Close other tabs and reload.'));
  });
}

export async function loadState(mode: StorageMode = 'real'): Promise<AppState> {
  const db = await openDatabase(mode);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readonly');
    const request = transaction.objectStore(STORE).get(KEY);
    request.onsuccess = () => resolve((request.result as AppState | undefined) ?? defaultState());
    request.onerror = () => reject(request.error ?? new Error('Could not read your local card.'));
    transaction.oncomplete = () => db.close();
  });
}

export async function saveState(state: AppState, mode: StorageMode = 'real'): Promise<void> {
  const db = await openDatabase(mode);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(structuredClone(state), KEY);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not save your card.')); };
  });
}

export async function clearState(mode: StorageMode): Promise<void> {
  const db = await openDatabase(mode);
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).clear();
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not reset sample data.')); };
  });
}
