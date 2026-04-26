import { expect, test } from '@playwright/test';

const mobileShellRoutes = [
  { path: '/', label: 'Inicio' },
  { path: '/goals', label: 'Objetivos' },
  { path: '/weekly-planning', label: 'Planificación semanal' },
  { path: '/journaling', label: 'Diario' },
  { path: '/focus', label: 'Foco' },
  { path: '/tasks', label: 'Tareas' },
  { path: '/habits', label: 'Hábitos' },
  { path: '/routines', label: 'Rutinas' },
  { path: '/finances', label: 'Finanzas' },
  { path: '/calendar', label: 'Calendario' },
  { path: '/notes', label: 'Notas' },
  { path: '/settings', label: 'Ajustes' },
] as const;

test.describe('shell responsive audit', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('nexus-crm-persistence-mode', 'local');
    });
  });

  for (const route of mobileShellRoutes) {
    test(`mantiene ${route.path} sin overflow horizontal en mobile`, async ({ page }) => {
      await page.goto(route.path);

      await expect(page).toHaveURL(route.path === '/' ? /\/$/ : new RegExp(`${route.path.replace('/', '\\/')}$`));
      await expect(page.locator('header').getByText(route.label)).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth > 1;
      });

      expect(hasHorizontalOverflow).toBeFalsy();
    });
  }

  test('permite navegar entre módulos desde el sidebar mobile', async ({ page }) => {
    await page.goto('/settings');

    await page.getByLabel('Abrir navegación').click();
    await page.getByRole('button', { name: 'Notas' }).first().click();
    await expect(page).toHaveURL(/\/notes$/);
    await expect(page.locator('header').getByText('Notas')).toBeVisible();

    await page.getByLabel('Abrir navegación').click();
    await page.getByRole('button', { name: 'Finanzas' }).first().click();
    await expect(page).toHaveURL(/\/finances$/);
    await expect(page.locator('header').getByText('Finanzas')).toBeVisible();

    await page.getByLabel('Abrir navegación').click();
    await page.getByRole('button', { name: 'Ajustes' }).first().click();
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.locator('header').getByText('Ajustes')).toBeVisible();
  });
});
