import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function createRealCard(page: import('@playwright/test').Page, name = 'Prepare grant outline'): Promise<void> {
  await page.goto('/');
  await page.getByLabel('Task name').fill(name);
  await page.getByLabel('Next two-minute action').fill('Open the draft and write one heading');
  await page.getByRole('button', { name: 'Create my next-step card' }).click();
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

test('@claim:demo-ready loads a realistic sample in one visit', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Next Step Cards');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await page.goto('/demo/');
  await expect(page).toHaveTitle('Demo — Next Step Cards');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
  await expect(page.locator('.history-item')).toHaveCount(2);
});

test('@claim:demo-isolated never reads or changes real cards', async ({ page }) => {
  await createRealCard(page, 'Real card must remain');
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Next two-minute action').fill('Write one sample heading');
  await page.getByRole('button', { name: 'Park this task' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Real card must remain' })).toBeVisible();
});

test('@claim:offline-reload reloads the demo after its first visit while offline', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.goto('/demo/');
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await expect(page.getByText('Offline and ready.')).toBeVisible();
});

test('@claim:privacy-local keeps the demo flow on this origin and in its own browser store', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Next two-minute action').fill('Write one sample heading');
  await page.getByRole('button', { name: 'Park this task' }).click();
  expect([...origins]).toEqual([new URL(page.url()).origin]);
  const names = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(names).toContain('demo:next-step-cards');
  expect(names).not.toContain('next-step-cards');
});

test('@claim:csv-export exports a history row, not only a button', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const output = await readFile((await (await download).path())!, 'utf8');
  expect(output).toContain('"decision","task","next action"');
  expect(output).toContain('Prepare the neighborhood workshop brief');
});

test('@claim:json-export exports the active sample card', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const json = JSON.parse(await readFile((await (await download).path())!, 'utf8'));
  expect(json.active.taskName).toBe('Draft the community grant outline');
  expect(json.history).toHaveLength(2);
});

test('@claim:quiet-hours moves a parked sample reminder outside quiet hours', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Quiet reminder').fill('2030-01-01T22:15');
  await page.getByRole('button', { name: 'Park this task' }).click();
  const reminder = await page.evaluate(async () => new Promise<string | null>((resolve, reject) => {
    const request = indexedDB.open('demo:next-step-cards');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const tx = request.result.transaction('app-state'); const get = tx.objectStore('app-state').get('current'); get.onsuccess = () => resolve(get.result.active.reminderAt); };
  }));
  const adjusted = new Date(reminder!);
  expect(adjusted.getHours()).toBe(8);
  expect(adjusted.getDate()).toBe(2);
});

test('@claim:free-core lets a visitor complete a sample card without payment', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'I finished this step' }).click();
  await expect(page.getByRole('heading', { name: 'Return to work with one clear next step.' })).toBeVisible();
});

test('@claim:completion-history keeps a finished sample card in history', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'I finished this step' }).click();
  await expect(page.getByRole('heading', { name: 'Return to work with one clear next step.' })).toBeVisible();
  await expect(page.locator('.history-item').filter({ hasText: 'Draft the community grant outline' })).toContainText('Finished');
  await page.reload();
  await expect(page.locator('.history-item').filter({ hasText: 'Draft the community grant outline' })).toContainText('Finished');
});

test('@claim:park-history records the revised action in history', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Next two-minute action').fill('Write the budget heading in the grant outline.');
  await page.getByRole('button', { name: 'Park this task' }).click();
  await expect(page.locator('.next-action')).toHaveText('Write the budget heading in the grant outline.');
  await expect(page.locator('.history-item').filter({ hasText: 'Write the budget heading in the grant outline.' })).toContainText('Parked');
  await page.reload();
  await expect(page.locator('.history-item').filter({ hasText: 'Write the budget heading in the grant outline.' })).toContainText('Parked');
});

test('@claim:json-import restores a complete demo backup', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const backupPath = await (await download).path();
  expect(backupPath).not.toBeNull();
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Next two-minute action').fill('Change this action before restoring the backup.');
  await page.getByRole('button', { name: 'Park this task' }).click();
  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  await page.getByLabel('Start').selectOption('20');
  await page.getByLabel('End').selectOption('7');
  await page.getByRole('button', { name: 'Save quiet hours' }).click();

  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#import-json').setInputFiles(backupPath!);
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await expect(page.locator('.history-item')).toHaveCount(2);
  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  await expect(page.getByLabel('Start')).toHaveValue('21');
  await expect(page.getByLabel('End')).toHaveValue('8');
});

test('@claim:clear-history-preserves-active clears only demo history', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Manage data and settings' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear history' }).click();
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await expect(page.getByText('0 entries')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Draft the community grant outline' })).toBeVisible();
  await expect(page.getByText('0 entries')).toBeVisible();
});

test('has no serious accessibility violations and supports route focus', async ({ page }) => {
  await page.goto('/demo/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveURL('/privacy/');
  await expect(page.locator('h1')).toBeFocused();
});

test('keeps the first screen and maximum values within a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Manage data and settings' })).toBeVisible();
  await page.getByRole('link', { name: 'Create my card' }).click();
  await page.getByLabel('Task name').fill('T'.repeat(100));
  await page.getByLabel('Next two-minute action').fill('A'.repeat(280));
  await page.getByRole('button', { name: 'Create my next-step card' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test('serves the designed static 404 document', async ({ page }) => {
  const response = await page.goto('/404.html');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'This page is not here.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to your card' })).toBeVisible();
});
