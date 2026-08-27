export type HistoryKind = 'started' | 'parked' | 'completed';
export type PrintEdition = 'vermillion' | 'moss' | 'night';

export interface Card {
  id: string;
  taskName: string;
  nextAction: string;
  resource: string;
  why: string;
  stopCondition: string;
  reminderAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  cardId: string;
  taskName: string;
  action: string;
  resource: string;
  why: string;
  stopCondition: string;
  kind: HistoryKind;
  timestamp: string;
}

export interface Settings {
  quietStart: number;
  quietEnd: number;
  printEdition: PrintEdition;
}

export interface AppState {
  schemaVersion: 1;
  active: Card | null;
  history: HistoryEntry[];
  settings: Settings;
}

export const defaultState = (): AppState => ({
  schemaVersion: 1,
  active: null,
  history: [],
  settings: { quietStart: 21, quietEnd: 8, printEdition: 'vermillion' },
});

export function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function entryFromCard(card: Card, kind: HistoryKind, timestamp = new Date().toISOString()): HistoryEntry {
  return {
    id: makeId(),
    cardId: card.id,
    taskName: card.taskName,
    action: card.nextAction,
    resource: card.resource,
    why: card.why,
    stopCondition: card.stopCondition,
    kind,
    timestamp,
  };
}

export function isQuietHour(hour: number, start: number, end: number): boolean {
  if (start === end) return false;
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export function nextAllowedReminder(requested: Date, quietStart: number, quietEnd: number): Date {
  if (!isQuietHour(requested.getHours(), quietStart, quietEnd)) return requested;
  const allowed = new Date(requested);
  allowed.setMinutes(0, 0, 0);
  allowed.setHours(quietEnd);
  if (quietStart > quietEnd && requested.getHours() >= quietStart) allowed.setDate(allowed.getDate() + 1);
  return allowed;
}

export function validateImportedState(value: unknown): AppState {
  if (!value || typeof value !== 'object') throw new Error('This file does not contain Next Step Cards data.');
  const candidate = value as Partial<AppState>;
  if (candidate.schemaVersion !== 1 || !Array.isArray(candidate.history)) throw new Error('This export version is not supported.');
  const settings = candidate.settings;
  if (!settings || !Number.isInteger(settings.quietStart) || !Number.isInteger(settings.quietEnd)) throw new Error('The settings in this export are incomplete.');
  const validCard = (card: unknown): card is Card => {
    if (!card || typeof card !== 'object') return false;
    const item = card as Partial<Card>;
    return typeof item.id === 'string' && typeof item.taskName === 'string' && typeof item.nextAction === 'string'
      && typeof item.resource === 'string' && typeof item.why === 'string' && typeof item.stopCondition === 'string'
      && (item.reminderAt === null || typeof item.reminderAt === 'string')
      && typeof item.createdAt === 'string' && typeof item.updatedAt === 'string';
  };
  if (candidate.active !== null && candidate.active !== undefined && !validCard(candidate.active)) throw new Error('The active card in this export is damaged.');
  if (!candidate.history.every((entry) => entry && typeof entry.id === 'string' && typeof entry.cardId === 'string'
    && typeof entry.taskName === 'string' && typeof entry.action === 'string' && typeof entry.resource === 'string'
    && typeof entry.why === 'string' && typeof entry.stopCondition === 'string' && typeof entry.timestamp === 'string'
    && ['started', 'parked', 'completed'].includes(entry.kind))) throw new Error('A history entry in this export is damaged.');
  return {
    schemaVersion: 1,
    active: candidate.active ?? null,
    history: candidate.history.slice(0, 1000) as HistoryEntry[],
    settings: {
      quietStart: Math.max(0, Math.min(23, settings.quietStart)),
      quietEnd: Math.max(0, Math.min(23, settings.quietEnd)),
      printEdition: ['vermillion', 'moss', 'night'].includes(settings.printEdition) ? settings.printEdition : 'vermillion',
    },
  };
}

export function stateToCsv(state: AppState): string {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const header = ['decision', 'task', 'next action', 'resource', 'why', 'stop condition', 'time'];
  const rows = state.history.map((entry) => [entry.kind, entry.taskName, entry.action, entry.resource, entry.why, entry.stopCondition, entry.timestamp]);
  return [header, ...rows].map((row) => row.map(quote).join(',')).join('\n');
}
