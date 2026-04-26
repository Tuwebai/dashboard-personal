import { expect, test } from '@playwright/test';

const shellRoutes = [
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

test.describe('shell deep links', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('nexus-crm-persistence-mode', 'local');
    });
  });

  for (const route of shellRoutes) {
    test(`mantiene ${route.path} al entrar directo`, async ({ page }) => {
      await page.goto(route.path);

      await expect(page).toHaveURL(route.path === '/' ? /\/$/ : new RegExp(`${route.path.replace('/', '\\/')}$`));
      await expect(page.getByText(route.label).first()).toBeVisible();
    });
  }
});
