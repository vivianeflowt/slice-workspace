import { test, expect } from '@playwright/experimental-ct-react';
import { Window } from '../../src/components/ui/Window/Window';

// Helper para obter bounding box
async function getBoundingBox(locator) {
  const box = await locator.boundingBox();
  return box;
}

test.describe('Window Resize', () => {
  test('deve permitir redimensionar horizontalmente e verticalmente', async ({ mount, page }) => {
    const component = await mount(
      <Window title="Teste Resize" initialX={100} initialY={100}>
        Conteúdo
      </Window>
    );
    const windowDiv = component.locator('.window');
    const box = await getBoundingBox(windowDiv);

    // Redimensionar pela borda direita
    await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width + 80, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    const boxAfter = await getBoundingBox(windowDiv);
    expect(boxAfter.width).toBeGreaterThan(box.width);

    // Redimensionar pela borda inferior
    await page.mouse.move(boxAfter.x + boxAfter.width / 2, boxAfter.y + boxAfter.height - 4);
    await page.mouse.down();
    await page.mouse.move(boxAfter.x + boxAfter.width / 2, boxAfter.y + boxAfter.height + 60, { steps: 5 });
    await page.mouse.up();
    const boxAfter2 = await getBoundingBox(windowDiv);
    expect(boxAfter2.height).toBeGreaterThan(boxAfter.height);
  });
});
