import { expect, test } from '@playwright/test';

test('creates, parks, completes, and reuses a card', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByLabel('Task name').fill('Send the project note');
  await page.getByLabel('Next two-minute action').fill('Open the draft and write the subject line');
  await page.getByLabel('Required link, file, or place').fill('Drafts/project-note.md');
  await page.getByLabel('Why this matters').fill('The team can continue tomorrow');
  await page.getByRole('button', { name: 'Set this next step' }).click();

  await expect(page.getByText('Open the draft and write the subject line', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Send the project note' })).toBeVisible();

  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Next two-minute action').fill('Read the first paragraph aloud');
  await page.getByRole('button', { name: 'Park this task' }).click();
  await expect(page.getByText('Read the first paragraph aloud', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'I finished this step' }).click();
  await expect(page.getByRole('heading', { name: 'One clear step. Nothing else.' })).toBeVisible();
  await page.getByRole('button', { name: 'Use again' }).first().click();
  await expect(page.getByRole('heading', { name: 'Send the project note' })).toBeVisible();
});

test('keeps the active card available offline', async ({ page, context }) => {
  await page.goto('/');
  await page.getByLabel('Task name').fill('Offline task');
  await page.getByLabel('Next two-minute action').fill('Write one offline sentence');
  await page.getByRole('button', { name: 'Set this next step' }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Offline task' })).toBeVisible();
  await expect(page.getByText('Offline and ready.')).toBeVisible();
});

test('fits the primary workflow at 390px and supports keyboard submission', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByLabel('Task name').focus();
  await page.keyboard.type('Keyboard task');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Press one useful key');
  await page.getByRole('button', { name: 'Set this next step' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Keyboard task' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
