import './styles.css';
import { loadState, saveState } from './db';
import {
  defaultState,
  entryFromCard,
  makeId,
  nextAllowedReminder,
  stateToCsv,
  validateImportedState,
  type AppState,
  type Card,
  type HistoryEntry,
  type PrintEdition,
} from './state';
import {
  captureReturnedLicense,
  checkoutUrl,
  hasOptimisticUnlock,
  storeLicense,
  verifyLicense,
} from './license';

const main = document.querySelector<HTMLElement>('#main')!;
const toast = document.querySelector<HTMLElement>('#toast')!;
let state: AppState = defaultState();
let supporterUnlocked = hasOptimisticUnlock();
let reminderTimer: number | undefined;
let installPrompt: BeforeInstallPromptEvent | null = null;
let isOffline = !navigator.onLine;

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
    if (url.protocol === 'http:' || url.protocol === 'https:') return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Open required link <span aria-hidden="true">↗</span></a>`;
  } catch { /* Render as a local file or context note. */ }
  return `<span>${escapeHtml(resource)}</span>`;
}

async function persist(message?: string): Promise<boolean> {
  try {
    await saveState(state);
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
      <label for="resource">Required link, file, or place <span class="hint-inline">(optional)</span></label>
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
      <span class="hint">Saved locally. It appears when this app is open or next reopened; system notifications work while the installed app is running. Quiet hours are respected.</span>
    </div>`;
}

function emptyView(): string {
  return `
    <section class="empty-layout" aria-labelledby="page-title">
      <div>
        <p class="eyebrow">A note to your returning self</p>
        <h1 id="page-title">One clear step. Nothing else.</h1>
        <p class="lede">Leave the exact action that gets you moving again. No project plan, no coach, no streak—just the context you chose.</p>
        <figure class="hero-print">
          <img src="/assets/hero-card-640.webp" srcset="/assets/hero-card-640.webp 640w, /assets/hero-card.webp 1200w" sizes="(max-width: 800px) calc(100vw - 42px), 550px" width="1200" height="800" alt="A printed index card with a red check mark moving from scattered paper into open space" decoding="async" fetchpriority="high" />
        </figure>
      </div>
      <form class="paper-form" id="new-card-form" novalidate>
        <h2>Leave your card</h2>
        <p class="lede">Only the first two fields are required.</p>
        ${formFields()}
        <p class="form-error" id="new-card-error" role="alert"></p>
        <button class="button primary" type="submit">Set this next step</button>
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
        <p class="reminder-note"><span aria-hidden="true">●</span> Park when you are stopping but the task continues. Finished clears this card and keeps a ledger entry.</p>
      </article>
    </section>
    ${historyView()}`;
}

function historyView(): string {
  const items = state.history.slice().reverse().slice(0, 40);
  return `
    <section class="ledger" aria-labelledby="ledger-title">
      <div class="ledger-head"><div><p class="eyebrow">Local ledger</p><h2 id="ledger-title">Re-entry history</h2></div><p>${state.history.length} ${state.history.length === 1 ? 'decision' : 'decisions'}</p></div>
      ${items.length === 0 ? '<p class="empty-ledger">Your decisions will appear here after you set the first card.</p>' : `<ol class="history-list">${items.map(historyItem).join('')}</ol>`}
    </section>`;
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
      <p>Update the card before you step away. This choice is recorded in your local ledger.</p>
      <form id="park-form" novalidate>${state.active ? formFields(state.active) : ''}<p class="form-error" id="park-error" role="alert"></p><div class="button-row"><button class="button primary" type="submit">Park this task</button><button class="button close-dialog" type="button">Keep current card</button></div></form>
    </div></dialog>
    <dialog id="data-dialog" aria-labelledby="data-title"><div class="dialog-inner">
      <div class="dialog-head"><div><p class="eyebrow">Your device, your data</p><h2 id="data-title">Data &amp; settings</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close">×</button></div>
      <section class="settings-section"><h3>Quiet hours</h3><p>Reminder times inside this window move to the end of quiet hours.</p><form id="quiet-form"><div class="field-row"><div class="field"><label for="quiet-start">Start</label><select id="quiet-start" name="quietStart">${hourOptions(state.settings.quietStart)}</select></div><div class="field"><label for="quiet-end">End</label><select id="quiet-end" name="quietEnd">${hourOptions(state.settings.quietEnd)}</select></div></div><button class="button small" type="submit">Save quiet hours</button></form></section>
      <section class="settings-section"><h3>Local reminder permission</h3><p id="notification-status">${notificationStatus()}</p><button class="button small" id="notification-button" type="button" ${!('Notification' in window) ? 'disabled' : ''}>Allow system notifications</button></section>
      <section class="settings-section"><h3>Own your data</h3><p>JSON restores the full app. CSV opens your decision history in a spreadsheet.</p><div class="button-row"><button class="button small" id="export-json" type="button">Export JSON</button><button class="button small" id="export-csv" type="button">Export CSV</button><label class="button small file-button">Import JSON<input id="import-json" type="file" accept="application/json,.json" /></label></div></section>
      <section class="settings-section"><h3>Install &amp; support</h3><div class="button-row"><button class="button small" id="install-button" type="button" ${installPrompt ? '' : 'hidden'}>Install app</button><button class="button small" id="open-support" type="button">Open supporter edition</button></div></section>
      <section class="settings-section"><h3>Clear the ledger</h3><p>This removes history but keeps the active card.</p><button class="button small danger" id="clear-history" type="button">Clear re-entry history</button></section>
    </div></dialog>
    <dialog id="support-dialog" aria-labelledby="support-title"><div class="dialog-inner">
      <div class="dialog-head"><div><p class="eyebrow">Optional, once</p><h2 id="support-title">Supporter print edition</h2></div><button class="icon-button close-dialog" type="button" aria-label="Close">×</button></div>
      <p class="price-stamp">US $6 · one-time purchase</p>
      <p>Every practical feature stays free. A supporter license adds two cosmetic ink-and-paper editions and helps keep this quiet utility available.</p>
      ${supporterUnlocked ? supporterControls() : `<div class="locked-note"><p><strong>Included:</strong> Moss Field and Night Ledger print editions. No subscription.</p><a class="button primary" href="${checkoutUrl()}">Buy supporter edition</a></div>`}
      <section class="settings-section"><h3>Restore a purchase</h3><p>Paste the license token from your receipt. Verification uses Sociobot, the merchant of record; payment details never reach this app.</p><form id="license-form"><div class="license-row"><label class="visually-hidden" for="license-token">License token</label><input id="license-token" name="license" required autocomplete="off" placeholder="Paste license token" /><button class="button" type="submit">Verify license</button></div><p class="form-error" id="license-error" role="status"></p></form></section>
      <p class="hint">Purchases and refunds are handled by Sociobot/Dodo. A refunded or revoked license stops unlocking supporter editions. See <a href="/privacy/">privacy</a> and <a href="/terms/">terms</a>.</p>
    </div></dialog>`;
}

function supporterControls(): string {
  return `<section class="settings-section"><h3>Your print editions are unlocked</h3><div class="edition-grid" aria-label="Choose print edition">
    ${editionButton('vermillion', 'Vermillion')}${editionButton('moss', 'Moss field')}${editionButton('night', 'Night ledger')}
  </div></section>`;
}

function editionButton(value: PrintEdition, label: string): string {
  return `<button class="edition-choice" type="button" data-edition="${value}" aria-pressed="${state.settings.printEdition === value}">${label}</button>`;
}

function hourOptions(selected: number): string {
  return Array.from({ length: 24 }, (_, hour) => `<option value="${hour}" ${selected === hour ? 'selected' : ''}>${new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date(2020, 0, 1, hour))}</option>`).join('');
}

function notificationStatus(): string {
  if (!('Notification' in window)) return 'This browser does not offer local system notifications. In-app reminders still work.';
  if (Notification.permission === 'granted') return 'System notifications are allowed while the app is running.';
  if (Notification.permission === 'denied') return 'Notifications are blocked in browser settings. In-app reminders still work.';
  return 'Optional. The app asks only when you choose this button.';
}

function render(): void {
  document.documentElement.dataset.edition = supporterUnlocked ? state.settings.printEdition : 'vermillion';
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
    if (await persist('Step finished. Your card is in the ledger.')) render();
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
    showToast(permission === 'granted' ? 'System notifications allowed.' : 'No problem. In-app reminders still work.');
    render();
    openDialog('data-dialog');
  });
  document.querySelector('#export-json')?.addEventListener('click', () => download(JSON.stringify(state, null, 2), 'next-step-cards.json', 'application/json'));
  document.querySelector('#export-csv')?.addEventListener('click', () => download(stateToCsv(state), 'next-step-history.csv', 'text/csv'));
  document.querySelector<HTMLInputElement>('#import-json')?.addEventListener('change', importJson);
  document.querySelector('#clear-history')?.addEventListener('click', async () => {
    if (!state.history.length) { showToast('The ledger is already empty.'); return; }
    if (!confirm(`Clear ${state.history.length} ledger ${state.history.length === 1 ? 'entry' : 'entries'}? Your active card will stay.`)) return;
    state.history = [];
    if (await persist('Re-entry history cleared.')) render();
  });
  document.querySelector('#install-button')?.addEventListener('click', async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    render();
  });
  document.querySelector('#open-support')?.addEventListener('click', () => { document.querySelector<HTMLDialogElement>('#data-dialog')?.close(); openDialog('support-dialog'); });

  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const error = document.querySelector<HTMLElement>('#license-error')!;
    const token = String(new FormData(form).get('license') ?? '').trim();
    if (!token) { error.textContent = 'Paste the license token from your receipt.'; return; }
    try { storeLicense(token); } catch (storageError) {
      error.textContent = storageError instanceof Error ? storageError.message : 'This license could not be saved.';
      return;
    }
    error.textContent = 'Checking your license…';
    const result = await verifyLicense(true);
    if (!result) { supporterUnlocked = true; error.textContent = 'Saved for offline use. Verification will retry when you are online.'; render(); openDialog('support-dialog'); return; }
    if (!result.valid) { supporterUnlocked = false; error.textContent = 'This license is not active. Check the token or use the purchase link.'; return; }
    supporterUnlocked = true;
    showToast('Supporter print editions unlocked. Thank you.');
    render();
    openDialog('support-dialog');
  });
  document.querySelectorAll<HTMLButtonElement>('.edition-choice').forEach((button) => button.addEventListener('click', async () => {
    if (!supporterUnlocked) return;
    state.settings.printEdition = button.dataset.edition as PrintEdition;
    if (await persist('Print edition changed.')) { render(); openDialog('support-dialog'); }
  }));
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
    const summary = `${imported.active ? '1 active card' : 'no active card'} and ${imported.history.length} ledger ${imported.history.length === 1 ? 'entry' : 'entries'}`;
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
  const returned = captureReturnedLicense();
  supporterUnlocked = hasOptimisticUnlock();
  try {
    state = validateImportedState(await loadState());
    render();
    if (returned) showToast('License received. Verifying your supporter edition…');
    const verified = await verifyLicense();
    if (verified && verified.valid !== supporterUnlocked) {
      supporterUnlocked = verified.valid;
      if (!verified.valid) {
        state.settings.printEdition = 'vermillion';
        await persist();
        showToast('The saved license is no longer active. Practical features remain available.', 7000);
      }
      render();
    }
  } catch (error) {
    main.innerHTML = `<section class="error-panel"><p class="eyebrow">Storage needs attention</p><h1>We couldn’t open your local card.</h1><p>${escapeHtml(error instanceof Error ? error.message : 'Local storage is unavailable.')}</p><p>Check private-browsing or storage settings, then reload. Nothing has been sent anywhere.</p><button class="button" type="button" onclick="location.reload()">Try again</button></section>`;
  }
  await registerServiceWorker();
  await probeConnectivity();
}

document.querySelector('#data-button')?.addEventListener('click', () => openDialog('data-dialog'));
document.querySelector('#support-button')?.addEventListener('click', () => openDialog('support-dialog'));
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event as BeforeInstallPromptEvent; });
window.addEventListener('online', () => { isOffline = false; showToast('Back online. Your local card was available throughout.'); render(); void probeConnectivity(); });
window.addEventListener('offline', () => { isOffline = true; showToast('You are offline. Your card remains available.'); render(); });

void init();
