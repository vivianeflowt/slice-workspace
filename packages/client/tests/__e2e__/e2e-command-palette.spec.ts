import { expect, Page, test, type } from '@playwright/test';

import { APP_URL } from './__fixtures__/constants';

// Helper para abrir o command palette
async function openCommandPalette(page: Page) {
  // Tenta Ctrl+Q
  await page.keyboard.press('Control+KeyQ');
  // Se não abrir, tenta Ctrl+K
  if (!(await page.locator('input[placeholder*="ação"]').isVisible())) {
    await page.keyboard.press('Control+KeyK');
  }
}

test.describe('Command Palette (kbar)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('abre com Ctrl+Q ou Ctrl+K e exibe ações principais', async ({ page }) => {
    await openCommandPalette(page);
    // Verifica se o input de busca está visível
    await expect(page.locator('input[placeholder*="ação"]').first()).toBeVisible();
    // Verifica se as ações principais aparecem
    await expect(page.locator('text=Nova Janela')).toBeVisible();
    await expect(page.locator('text=Minimizar Todas')).toBeVisible();
    await expect(page.locator('text=Busca Global')).toBeVisible();
  });
});
