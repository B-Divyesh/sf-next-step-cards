import { defaultState, type AppState } from './state';

const DB_NAME = 'next-step-cards';
const STORE = 'app-state';
const KEY = 'current';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in globalThis)) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
    request.onblocked = () => reject(new Error('Another tab is blocking the data store. Close other tabs and reload.'));
  });
}

export async function loadState(): Promise<AppState> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readonly');
    const request = transaction.objectStore(STORE).get(KEY);
    request.onsuccess = () => resolve((request.result as AppState | undefined) ?? defaultState());
    request.onerror = () => reject(request.error ?? new Error('Could not read your local card.'));
    transaction.oncomplete = () => db.close();
  });
}

export async function saveState(state: AppState): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(structuredClone(state), KEY);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Could not save your card.')); };
  });
}
