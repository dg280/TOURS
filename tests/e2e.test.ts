import { test, expect } from '@playwright/test';

test.describe('Non-regression UI & Data', () => {
    test.beforeEach(async ({ page }) => {
        // Go to live site or use localhost if running locally
        await page.goto('https://tours-five-olive.vercel.app/?reset=true');
        // Wait for images and data to load
        await page.waitForTimeout(2000);
    });

    test('Check that tour images are appearing', async ({ page }) => {
        const images = await page.locator('section#tours img');
        const count = await images.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const src = await img.getAttribute('src');
            expect(src).toBeTruthy();
            expect(src).not.toContain('undefined');

            // Check if image loads correctly (naturalWidth > 0)
            const isLoaded = await img.evaluate((node: HTMLImageElement) => {
                return node.complete && node.naturalWidth > 0;
            });
            expect(isLoaded).toBeTruthy();
        }
    });

    test('Check for critical Supabase/Console errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.reload();
        await page.waitForTimeout(2000);

        const supabaseErrors = errors.filter(e => e.toLowerCase().includes('supabase') || e.toLowerCase().includes('site_config'));
        expect(supabaseErrors).toHaveLength(0);
    });

    test('Check header and footer styles', async ({ page }) => {
        const navbar = await page.locator('nav');
        await expect(navbar).toBeVisible();

        const footer = await page.locator('footer');
        await expect(footer).toBeVisible();

        // Premium check: Dark footer
        const footerBg = await footer.evaluate(el => window.getComputedStyle(el).backgroundColor);
        // Expecting something very dark (rgb(10, 10, 10) or similar)
        expect(footerBg).toMatch(/rgb\(10,\s*10,\s*10\)/);

        // No newsletter check
        const newsletter = await footer.locator('input[type="email"]').count();
        expect(newsletter).toBe(0);
    });
});
