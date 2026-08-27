import { describe, expect, it } from 'vitest';
import { defaultState, isQuietHour, nextAllowedReminder, stateToCsv, validateImportedState } from '../src/state';

describe('quiet hours', () => {
  it('handles a window that crosses midnight', () => {
    expect(isQuietHour(22, 21, 8)).toBe(true);
    expect(isQuietHour(3, 21, 8)).toBe(true);
    expect(isQuietHour(12, 21, 8)).toBe(false);
  });

  it('defers an evening reminder until the next allowed morning', () => {
    const requested = new Date(2026, 7, 27, 22, 15);
    const allowed = nextAllowedReminder(requested, 21, 8);
    expect(allowed.getDate()).toBe(28);
    expect(allowed.getHours()).toBe(8);
    expect(allowed.getMinutes()).toBe(0);
  });

  it('does not change a reminder outside quiet hours', () => {
    const requested = new Date(2026, 7, 27, 14, 15);
    expect(nextAllowedReminder(requested, 21, 8).getTime()).toBe(requested.getTime());
  });
});

describe('portable data', () => {
  it('accepts a complete export', () => {
    expect(validateImportedState(defaultState())).toEqual(defaultState());
  });

  it('rejects incomplete data', () => {
    expect(() => validateImportedState({ schemaVersion: 1, history: [] })).toThrow(/settings/i);
  });

  it('escapes commas and quotes in CSV', () => {
    const state = defaultState();
    state.history.push({
      id: '1', cardId: 'card', kind: 'completed', taskName: 'Write, now', action: 'Say "hello"',
      resource: '', why: '', stopCondition: '', timestamp: '2026-08-27T12:00:00.000Z',
    });
    expect(stateToCsv(state)).toContain('"Write, now","Say ""hello"""');
  });
});
