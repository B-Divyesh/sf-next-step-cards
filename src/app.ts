import './styles.css';
import { clearState, loadState, saveState, type StorageMode } from './db';
import {
  defaultState,
  demoState,
  entryFromCard,
  makeId,
  nextAllowedReminder,
  stateToCsv,
  validateImportedState,
  type AppState,
  type Card,
  type HistoryEntry,
} from './state';

const main = document.querySelector<HTMLElement>('#main')!;
const toast = document.querySelector<HTMLElement>('#toast')!;
let state: AppState = defaultState();
let reminderTimer: number | undefined;
let installPrompt: BeforeInstallPromptEvent | null = null;
let isOffline = !navigator.onLine;
const currentUrl = new URL(location.href);
const demoMode = currentUrl.pathname === '/demo' || currentUrl.pathname === '/demo/' || currentUrl.searchParams.get('demo') === '1';
const storageMode: StorageMode = demoMode ? 'demo' : 'real';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const displayDate = (iso: string): string => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
const dateTimeLocal = (iso: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

function showToast(message: string, duration = 4200): void {
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, duration);
}

function resourceMarkup(resource: string): string {
  if (!resource) return '<span>Nothing extra needed</span>';
  try {
    const url = new URL(resource);
    if (url.protocol === 'http:' || url.protocol === 'https:') return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Open link <span aria-hidden="true">↗</span></a>`;
  } catch { /* Render as a local file or context note. */ }
  return `<span>${escapeHtml(resource)}</span>`;
}

async function persist(message?: string): Promise<boolean> {
  try {
    await saveState(state, storageMode);
    if (message) showToast(message);
    return true;
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'Your change could not be saved.', 7000);
    return false;
  }
}

function cardFromForm(form: HTMLFormElement, existing?: Card): Card {
  const data = new FormData(form);
  const requestedReminder = String(data.get('reminderAt') ?? '');
  let reminderAt: string | null = null;
  if (requestedReminder) {
    const allowed = nextAllowedReminder(new Date(requestedReminder), state.settings.quietStart, state.settings.quietEnd);
    reminderAt = allowed.toISOString();
  }
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? makeId(),
    taskName: String(data.get('taskName') ?? '').trim(),
    nextAction: String(data.get('nextAction') ?? '').trim(),
    resource: String(data.get('resource') ?? '').trim(),
    why: String(data.get('why') ?? '').trim(),
    stopCondition: String(data.get('stopCondition') ?? '').trim(),
    reminderAt,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function formFields(card?: Card): string {
  return `
    <div class="field">
      <label for="task-name">Task name</label>
      <input id="task-name" name="taskName" maxlength="100" required autocomplete="off" value="${escapeHtml(card?.taskName ?? '')}" />
    </div>
    <div class="field">
      <label for="next-action">Next two-minute action</label>
      <textarea id="next-action" name="nextAction" maxlength="280" required placeholder="Open the draft and write one heading">${escapeHtml(card?.nextAction ?? '')}</textarea>
      <span class="hint">Start with a physical verb: open, call, write, find, send.</span>
    </div>
    <div class="field">
      <label for="resource">Link, file, or place <span class="hint-inline">(optional)</span></label>
      <input id="resource" name="resource" maxlength="500" value="${escapeHtml(card?.resource ?? '')}" placeholder="https://… or Drafts/outline.md" />
    </div>
    <div class="field-row">
      <div class="field">
        <label for="why">Why this matters <span class="hint-inline">(optional)</span></label>
        <textarea id="why" name="why" maxlength="240" placeholder="So tomorrow starts lighter">${escapeHtml(card?.why ?? '')}</textarea>
      </div>
      <div class="field">
        <label for="stop-condition">I can stop when… <span class="hint-inline">(optional)</span></label>
        <textarea id="stop-condition" name="stopCondition" maxlength="240" placeholder="The heading and three bullets exist">${escapeHtml(card?.stopCondition ?? '')}</textarea>
      </div>
    </div>
    <div class="field">
      <label for="reminder-at">Quiet reminder <span class="hint-inline">(optional)</span></label>
      <input id="reminder-at" name="reminderAt" type="datetime-local" value="${dateTimeLocal(card?.reminderAt ?? null)}" />
      <span class="hint">Choose a time. Quiet hours move a reminder to the next available time.</span>
    </div>`;
}

function emptyView(): string {
  return `
    ${demoBanner()}
    <section class="empty-layout" aria-labelledby="page-title">
      <div>
        <p class="eyebrow">A card for your return</p>
        <h1 id="page-title">Return to work with one clear next step.</h1>
        <p class="lede">For people resuming a task after an interruption, without reopening a full project plan.</p>
        <div class="hero-actions"><a class="button primary" href="/demo/">Try it with sample data</a><a class="button" href="#create-card">Create my card</a></div>
        <p class="action-outcome">See a filled card and history first.</p>
        <ul class="plain-facts" aria-label="Product facts"><li>Saved in this browser</li><li>Reload while offline after your first visit</li><li>Core tools are free</li></ul>
        <figure class="hero-print">
          <img src="/assets/hero-card-640.webp?v=1.0.3" srcset="/assets/hero-card-640.webp?v=1.0.3 640w, /assets/hero-card.webp?v=1.0.3 1200w" sizes="(max-width: 800px) calc(100vw - 42px), 550px" width="1200" height="800" alt="A printed index card with a red check mark moving from scattered paper into open space" decoding="async" fetchpriority="high" />
        </figure>
      </div>
      <form class="paper-form" id="new-card-form" novalidate>
        <h2 id="create-card">Create your next-step card</h2>
        <p class="lede">Only the first two fields are required.</p>
        ${formFields()}
        <p class="form-error" id="new-card-error" role="alert"></p>
        <button class="button primary" type="submit">Create my next-step card</button>
      </form>
    </section>
    ${historyView()}`;
}

function activeView(card: Card): string {
  const due = card.reminderAt && new Date(card.reminderAt).getTime() <= Date.now();
  return `
    <section class="workspace" aria-labelledby="page-title">
      ${isOffline ? '<div class="offline-banner" role="status"><p><strong>Offline and ready.</strong> Your card is saved on this device.</p></div>' : ''}
      ${due ? `<div class="reminder-banner" role="status"><p><strong>Gentle reminder:</strong> this step is here when you are ready.</p><button class="button small" id="dismiss-reminder" type="button">Dismiss reminder</button></div>` : ''}
      ${demoBanner()}
      <p class="eyebrow">Your active card</p>
      <h1 id="page-title">Welcome back to this step.</h1>
      <p class="lede">You already made the decision. Begin with the action on the card.</p>
      <article class="active-card" aria-labelledby="active-task">
        <div class="card-index"><span>Card 01 / Active</span><time datetime="${card.updatedAt}">Set ${displayDate(card.updatedAt)}</time></div>
        <h2 class="task-name" id="active-task">${escapeHtml(card.taskName)}</h2>
        <p class="label action-label">Do this next</p>
        <p class="next-action">${escapeHtml(card.nextAction)}</p>
        <dl class="context-grid">
          <div><dt>Bring along</dt><dd>${resourceMarkup(card.resource)}</dd></div>
          <div><dt>Why it matters</dt><dd>${escapeHtml(card.why || 'No reason needed—this step is enough.')}</dd></div>
          <div><dt>A good stopping point</dt><dd>${escapeHtml(card.stopCondition || 'After this small action is complete.')}</dd></div>
          <div><dt>Reminder</dt><dd>${card.reminderAt ? displayDate(card.reminderAt) : 'No reminder set'}</dd></div>
        </dl>
        <div class="decision-row" aria-label="Decide what happened">
          <button class="button success" id="complete-card" type="button">I finished this step</button>
          <button class="button primary" id="park-card" type="button">Park with a new next step</button>
          <button class="button" id="print-card" type="button">Print card</button>
        </div>
        <p class="reminder-note"><span aria-hidden="true">●</span> Park when you are stopping but the task continues. Finished clears this card and keeps it in history.</p>
      </article>
    </section>
    ${historyView()}`;
}

function historyView(): string {
  const items = state.history.slice().reverse().slice(0, 40);
  return `
    <section class="ledger" aria-labelledby="ledger-title">
      <div class="ledger-head"><div><p class="eyebrow">Your card record</p><h2 id="ledger-title">History</h2></div><p>${state.history.length} ${state.history.length === 1 ? 'entry' : 'entries'}</p></div>
      ${items.length === 0 ? '<p class="empty-ledger">Your card history appears here after you create a card.</p>' : `<ol class="history-list">${items.map(historyItem).join('')}</ol>`}
    </section>`;
}

function demoBanner(): string {
  if (!demoMode) return '';
  return `<aside class="demo-banner" aria-label="Demo controls"><p><strong>Demo — sample data, nothing is saved.</strong></p><div class="button-row"><button class="button small" id="reset-demo" type="button">Reset demo</button><button class="button small" id="start-real" type="button">Start for real</button></div></aside>`;
}

function historyItem(entry: HistoryEntry): string {
  const label = entry.kind === 'completed' ? 'Finished' : entry.kind === 'parked' ? 'Parked' : 'Started';
  return `<li class="history-item">
    <div class="history-mark ${entry.kind}">${label}<br><time datetime="${entry.timestamp}">${displayDate(entry.timestamp)}</time></div>
    <div class="history-copy"><p><strong>${escapeHtml(entry.taskName)}</strong></p><small>${escapeHtml(entry.action)}</small></div>
    ${state.active ? '' : `<button class="button small reuse-card" type="button" data-entry="${entry.id}">Use again</button>`}
  </li>`;
}

function dialogs(): string {
  return `
    <dialog id="park-dialog" aria-labelledby="park-title"><div class="dialog-inner">
      <div class="dialog-head"><div><p class="eyebrow">Leave a clean edge</p><h2 id="park-title">What comes next?</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close">×</button></div>
      <p>Update the card before you step away. This change appears in your history.</p>
      <form id="park-form" novalidate>${state.active ? formFields(state.active) : ''}<p class="form-error" id="park-error" role="alert"></p><div class="button-row"><button class="button primary" type="submit">Park this task</button><button class="button close-dialog" type="button">Keep current card</button></div></form>
    </div></dialog>
    <dialog id="data-dialog" aria-labelledby="data-title"><div class="dialog-inner">
      <div class="dialog-head"><div><p class="eyebrow">Your device, your data</p><h2 id="data-title">Manage data and settings</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close">×</button></div>
      <section class="settings-section"><h3>Quiet hours</h3><p>Reminder times inside this window move to the end of quiet hours.</p><form id="quiet-form"><div class="field-row"><div class="field"><label for="quiet-start">Start</label><select id="quiet-start" name="quietStart">${hourOptions(state.settings.quietStart)}</select></div><div class="field"><label for="quiet-end">End</label><select id="quiet-end" name="quietEnd">${hourOptions(state.settings.quietEnd)}</select></div></div><button class="button small" type="submit">Save quiet hours</button></form></section>
      <section class="settings-section"><h3>Local reminder permission</h3><p id="notification-status">${notificationStatus()}</p><button class="button small" id="notification-button" type="button" ${!('Notification' in window) ? 'disabled' : ''}>Allow system notifications</button></section>
      <section class="settings-section"><h3>Own your data</h3><p>JSON restores the full app. CSV opens your card history in a spreadsheet.</p><div class="button-row"><button class="button small" id="export-json" type="button">Export JSON</button><button class="button small" id="export-csv" type="button">Export CSV</button><label class="button small file-button">Import JSON<input id="import-json" type="file" accept="application/json,.json" /></label></div></section>
      <section class="settings-section"><h3>Install the app</h3><button class="button small" id="install-button" type="button" ${installPrompt ? '' : 'hidden'}>Install app</button></section>
      <section class="settings-section"><h3>Clear history</h3><p>This removes history but keeps the active card.</p><button class="button small danger" id="clear-history" type="button">Clear history</button></section>
    </div></dialog>`;
}

function hourOptions(selected: number): string {
  return Array.from({ length: 24 }, (_, hour) => `<option value="${hour}" ${selected === hour ? 'selected' : ''}>${new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date(2020, 0, 1, hour))}</option>`).join('');
}

function notificationStatus(): string {
  if (!('Notification' in window)) return 'This browser does not offer notification permission.';
  if (Notification.permission === 'granted') return 'Notification permission is allowed in this browser.';
  if (Notification.permission === 'denied') return 'Notification permission is blocked in browser settings.';
  return 'Choose this button to ask this browser for notification permission.';
}

function render(): void {
  document.documentElement.dataset.edition = 'vermillion';
  main.innerHTML = state.active ? activeView(state.active) : emptyView();
  document.querySelectorAll('dialog').forEach((node) => node.remove());
  document.body.insertAdjacentHTML('beforeend', dialogs());
  bindPageEvents();
  bindDialogEvents();
  scheduleReminder();
}

function validCardForm(form: HTMLFormElement, error: HTMLElement): boolean {
  if (!form.checkValidity()) {
    error.textContent = 'Add a task name and one small next action.';
    form.querySelector<HTMLElement>(':invalid')?.focus();
    return false;
  }
  error.textContent = '';
  return true;
}

function bindPageEvents(): void {
  document.querySelector('#reset-demo')?.addEventListener('click', async () => {
    state = demoState();
    if (await persist('Sample card reset.')) render();
  });
  document.querySelector('#start-real')?.addEventListener('click', async () => {
    try { await clearState('demo'); } catch { /* Leaving demo must still work if its storage was already cleared. */ }
    location.assign('/');
  });
  const newForm = document.querySelector<HTMLFormElement>('#new-card-form');
  newForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = document.querySelector<HTMLElement>('#new-card-error')!;
    if (!validCardForm(newForm, error)) return;
    const card = cardFromForm(newForm);
    state.active = card;
    state.history.push(entryFromCard(card, 'started'));
    if (await persist('Your next step is ready.')) render();
  });

  document.querySelector('#complete-card')?.addEventListener('click', async () => {
    if (!state.active) return;
    state.history.push(entryFromCard(state.active, 'completed'));
    state.active = null;
    if (await persist('Step finished. Your card is in history.')) render();
  });
  document.querySelector('#park-card')?.addEventListener('click', () => openDialog('park-dialog'));
  document.querySelector('#print-card')?.addEventListener('click', () => window.print());
  document.querySelector('#dismiss-reminder')?.addEventListener('click', async () => {
    if (state.active) state.active.reminderAt = null;
    if (await persist('Reminder dismissed.')) render();
  });
  document.querySelectorAll<HTMLButtonElement>('.reuse-card').forEach((button) => button.addEventListener('click', async () => {
    const entry = state.history.find((item) => item.id === button.dataset.entry);
    if (!entry || state.active) return;
    const now = new Date().toISOString();
    const card: Card = { id: makeId(), taskName: entry.taskName, nextAction: entry.action, resource: entry.resource, why: entry.why, stopCondition: entry.stopCondition, reminderAt: null, createdAt: now, updatedAt: now };
    state.active = card;
    state.history.push(entryFromCard(card, 'started'));
    if (await persist('Card returned to the desk.')) render();
  }));
}

function bindDialogEvents(): void {
  document.querySelectorAll<HTMLButtonElement>('.close-dialog').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
  const parkForm = document.querySelector<HTMLFormElement>('#park-form');
  parkForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = document.querySelector<HTMLElement>('#park-error')!;
    if (!validCardForm(parkForm, error) || !state.active) return;
    const updated = cardFromForm(parkForm, state.active);
    state.active = updated;
    state.history.push(entryFromCard(updated, 'parked'));
    if (await persist('Task parked. This card will be here when you return.')) render();
  });

  document.querySelector<HTMLFormElement>('#quiet-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    state.settings.quietStart = Number(data.get('quietStart'));
    state.settings.quietEnd = Number(data.get('quietEnd'));
    if (state.active?.reminderAt) state.active.reminderAt = nextAllowedReminder(new Date(state.active.reminderAt), state.settings.quietStart, state.settings.quietEnd).toISOString();
    if (await persist('Quiet hours saved.')) render();
  });

  document.querySelector('#notification-button')?.addEventListener('click', async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    showToast(permission === 'granted' ? 'Notification permission allowed.' : 'Notification permission was not allowed.');
    render();
    openDialog('data-dialog');
  });
  document.querySelector('#export-json')?.addEventListener('click', () => download(JSON.stringify(state, null, 2), 'next-step-cards.json', 'application/json'));
  document.querySelector('#export-csv')?.addEventListener('click', () => download(stateToCsv(state), 'next-step-history.csv', 'text/csv'));
  document.querySelector<HTMLInputElement>('#import-json')?.addEventListener('change', importJson);
  document.querySelector('#clear-history')?.addEventListener('click', async () => {
    if (!state.history.length) { showToast('History is already empty.'); return; }
    if (!confirm(`Clear ${state.history.length} history ${state.history.length === 1 ? 'entry' : 'entries'}? Your active card will stay.`)) return;
    state.history = [];
    if (await persist('History cleared.')) render();
  });
  document.querySelector('#install-button')?.addEventListener('click', async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    render();
  });
}

function openDialog(id: string): void {
  const dialog = document.querySelector<HTMLDialogElement>(`#${id}`);
  if (!dialog) return;
  dialog.showModal();
  window.setTimeout(() => dialog.querySelector<HTMLElement>('button, input, select, textarea, a')?.focus(), 0);
}

function download(content: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast(`${filename} exported.`);
}

async function importJson(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const imported = validateImportedState(JSON.parse(await file.text()));
    const summary = `${imported.active ? '1 active card' : 'no active card'} and ${imported.history.length} history ${imported.history.length === 1 ? 'entry' : 'entries'}`;
    if (!confirm(`Import ${summary}? This replaces the data currently on this device.`)) return;
    state = imported;
    if (await persist('Your data was imported.')) render();
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'That file could not be imported.', 7000);
  } finally { input.value = ''; }
}

function scheduleReminder(): void {
  window.clearTimeout(reminderTimer);
  if (!state.active?.reminderAt) return;
  const delay = new Date(state.active.reminderAt).getTime() - Date.now();
  if (delay <= 0) {
    if ('Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => registration.showNotification('Your next step is ready', { body: state.active?.nextAction, icon: '/icons/icon-192.png', tag: 'next-step-card' })).catch(() => undefined);
    }
    return;
  }
  if (delay < 2_147_000_000) reminderTimer = window.setTimeout(() => render(), delay);
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload when convenient.', 9000);
      });
    });
  } catch { showToast('Offline setup did not finish. The app still works while connected.', 6500); }
}

async function probeConnectivity(): Promise<void> {
  if (!navigator.onLine) {
    if (!isOffline) {
      isOffline = true;
      render();
    }
    return;
  }

  let nextOffline = false;
  try {
    const response = await fetch(`/manifest.webmanifest?connectivity=${Date.now()}`, { cache: 'no-store' });
    nextOffline = !response.ok;
  } catch {
    nextOffline = true;
  }
  if (nextOffline !== isOffline) {
    isOffline = nextOffline;
    render();
  }
}

async function init(): Promise<void> {
  if (demoMode) {
    document.title = 'Demo — Next Step Cards';
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', 'Try a realistic sample card and history. Nothing is saved to your cards.');
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', 'https://next-step-cards.sociobot.in/demo/');
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', 'Demo — Next Step Cards');
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', 'Demo — Next Step Cards');
  }
  try {
    const loaded = validateImportedState(await loadState(storageMode));
    state = demoMode && !loaded.active && loaded.history.length === 0 ? demoState() : loaded;
    if (demoMode && !loaded.active && loaded.history.length === 0) await saveState(state, 'demo');
    render();
  } catch (error) {
    main.innerHTML = `<section class="error-panel"><p class="eyebrow">Storage needs attention</p><h1>We couldn’t open your local card.</h1><p>${escapeHtml(error instanceof Error ? error.message : 'Local storage is unavailable.')}</p><p>Check private-browsing or storage settings, then reload.</p><button class="button" type="button" onclick="location.reload()">Try again</button></section>`;
  }
  await registerServiceWorker();
  await probeConnectivity();
}

document.querySelector('#data-button')?.addEventListener('click', () => openDialog('data-dialog'));
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event as BeforeInstallPromptEvent; });
window.addEventListener('online', () => { isOffline = false; showToast('Back online. Your local card was available throughout.'); render(); void probeConnectivity(); });
window.addEventListener('offline', () => { isOffline = true; showToast('You are offline. Your card remains available.'); render(); });

void init();
