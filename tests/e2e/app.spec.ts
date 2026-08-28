import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no serious accessibility violations in key states', async ({ page }) => {
  await page.goto('/');
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

  await page.getByLabel('Task name').fill('Accessible task');
  await page.getByLabel('Next two-minute action').fill('Open the accessible draft');
  await page.getByRole('button', { name: 'Set this next step' }).click();
  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  results = await new AxeBuilder({ page }).include('#park-dialog').analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('captures and verifies a returned supporter license without exposing it in the URL', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/next-step-cards/verify?license=test-license', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/?license=test-license');
  await expect(page).toHaveURL('/');
  const directSupportButton = page.getByRole('button', { name: 'Supporter edition' });
  if (await directSupportButton.isVisible()) {
    await directSupportButton.click();
  } else {
    await page.getByRole('button', { name: 'Data & settings' }).click();
    await page.getByRole('button', { name: 'Open supporter edition' }).click();
  }
  await expect(page.getByText('Your print editions are unlocked')).toBeVisible();
  await page.getByRole('button', { name: 'Moss field' }).click();
  await expect.poll(() => page.locator('html').getAttribute('data-edition')).toBe('moss');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:next-step-cards'))).toBe('test-license');
});

test('creates, parks, completes, and reuses a card', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByLabel('Task name').fill('Send the project note');
  await page.getByLabel('Next two-minute action').fill('Open the draft and write the subject line');
  await page.getByLabel('Required link, file, or place').fill('Drafts/project-note.md');
  await page.getByLabel('Why this matters').fill('The team can continue tomorrow');
  await page.getByRole('button', { name: 'Set this next step' }).click();

  await expect(page.locator('.next-action')).toHaveText('Open the draft and write the subject line');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Send the project note' })).toBeVisible();

  await page.getByRole('button', { name: 'Park with a new next step' }).click();
  await page.locator('#park-dialog').getByLabel('Next two-minute action').fill('Read the first paragraph aloud');
  await page.getByRole('button', { name: 'Park this task' }).click();
  await expect(page.locator('.next-action')).toHaveText('Read the first paragraph aloud');

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
  await page.goto('/');
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

test('wraps a maximum-length unbroken task name at 390px without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const taskName = 'T'.repeat(100);
  await page.getByLabel('Task name').fill(taskName);
  await page.getByLabel('Next two-minute action').fill('A'.repeat(280));
  await page.getByRole('button', { name: 'Set this next step' }).click();

  await expect(page.getByRole('heading', { name: taskName })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
