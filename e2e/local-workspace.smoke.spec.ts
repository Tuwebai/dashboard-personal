import { expect, test } from '@playwright/test';

test.describe('workspace local smoke', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addInitScript(() => {
      if (!window.sessionStorage.getItem('e2e-local-workspace-ready')) {
        window.localStorage.clear();
        window.sessionStorage.setItem('e2e-local-workspace-ready', 'true');
      }
      window.localStorage.setItem('nexus-crm-persistence-mode', 'local');
    });

    await page.goto('/');
  });

  test('navega y persiste notas, hábitos y finanzas', async ({ page }) => {
    const noteTitle = `Nota E2E ${Date.now()}`;
    const habitName = `Hábito E2E ${Date.now()}`;
    const accountName = `Cuenta E2E ${Date.now()}`;
    const transactionName = `Movimiento E2E ${Date.now()}`;

    await page.getByRole('button', { name: 'Notas' }).first().click();
    await page.getByTestId('notes-create-button').click();
    await page.getByTestId('note-title-input').fill(noteTitle);
    await expect(page.getByText(noteTitle)).toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: 'Notas' }).first().click();
    await expect(page.getByText(noteTitle)).toBeVisible();

    await page.getByRole('button', { name: 'Hábitos' }).first().click();
    await page.getByTestId('habits-new-button').click();
    await page.getByTestId('habit-name-input').fill(habitName);
    await page.getByTestId('habits-submit-button').click();
    await expect(page.getByText(habitName).first()).toBeVisible();
    await page.locator('[data-testid^="habit-log-"][data-testid$="-today"]').first().click();
    await expect(page.locator('[data-testid^="habit-log-"][data-testid$="-today"]').first()).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await page.getByRole('button', { name: 'Hábitos' }).first().click();
    await expect(page.getByText(habitName).first()).toBeVisible();
    await expect(page.locator('[data-testid^="habit-log-"][data-testid$="-today"]').first()).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Finanzas' }).first().click();
    await page.getByTestId('finances-new-account-button').click();
    await page.getByTestId('account-name-input').fill(accountName);
    await page.getByTestId('account-save-button').click();
    await expect(page.getByText(accountName)).toBeVisible();

    await page.getByTestId('finances-add-transaction-button').click();
    await page.getByTestId('transaction-description-input').fill(transactionName);
    await page.getByTestId('transaction-amount-input').fill('2500');
    await page.getByTestId('transaction-save-button').click();
    await expect(page.getByText(transactionName).first()).toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: 'Finanzas' }).first().click();
    await expect(page.getByText(transactionName).first()).toBeVisible();

    await page.getByText(transactionName).first().click();
    await page.getByTestId('transaction-detail-delete-button').click();
    await page.getByRole('button', { name: 'Eliminar' }).last().click();
    await expect(page.getByText(transactionName)).toHaveCount(0);

    await page.getByRole('button', { name: 'Inicio' }).first().click();
    await expect(page.getByText('Buenas noches').or(page.getByText('Buen día')).or(page.getByText('Buenas tardes'))).toBeVisible();
  });
});
