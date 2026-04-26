import { expect, test } from '@playwright/test';

const firebaseEmail = process.env.E2E_FIREBASE_EMAIL;
const firebasePassword = process.env.E2E_FIREBASE_PASSWORD;
const runFirebaseSmoke = process.env.E2E_FIREBASE_SMOKE === 'true';
const runGuestSmoke = process.env.E2E_FIREBASE_GUEST_SMOKE === 'true';

test.describe('firebase auth smoke', () => {
  test.beforeEach(async ({ context }) => {
    test.skip(!runFirebaseSmoke, 'Definí E2E_FIREBASE_SMOKE=true para ejecutar smoke auth contra Firebase.');

    await context.addInitScript(() => {
      window.localStorage.removeItem('nexus-crm-persistence-mode');
    });
  });

  test('ingresa con correo y contraseña', async ({ page }) => {
    test.skip(!firebaseEmail || !firebasePassword, 'Faltan E2E_FIREBASE_EMAIL y E2E_FIREBASE_PASSWORD.');

    await page.goto('/notes');
    await page.getByLabel('Correo electrónico').fill(firebaseEmail ?? '');
    await page.getByLabel('Contraseña').fill(firebasePassword ?? '');
    await page.getByRole('button', { name: 'Ingresar con correo' }).click();

    await expect(page).toHaveURL(/\/notes$/);
    await expect(page.locator('header').getByText('Notas')).toBeVisible();
  });

  test('permite continuar como invitado', async ({ page }) => {
    test.skip(!runGuestSmoke, 'Definí E2E_FIREBASE_GUEST_SMOKE=true para ejecutar el smoke de invitado.');

    await page.goto('/finances');
    await page.getByRole('button', { name: 'Continuar como invitado' }).click();

    await expect(page).toHaveURL(/\/finances$/);
    await expect(page.locator('header').getByText('Finanzas')).toBeVisible();
  });
});
