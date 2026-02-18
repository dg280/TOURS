import { test, expect } from '@playwright/test';

test.describe('Full Site Verification - Tours & Detours', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/', { timeout: 30000 });
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('Critical: Cookie Banner & WhatsApp Visibility', async ({ page }) => {
        const acceptBtn = page.getByRole('button', { name: /Accepter|Accept/i });
        try {
            await acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
            await acceptBtn.click();
            await page.waitForTimeout(500); // Small delay for state to update
        } catch (e) {
            console.log('Banner not found or already closed');
        }

        const whatsapp = page.locator('a[href*="wa.me"]').last();
        await expect(whatsapp).toBeVisible();
    });

    test('Data: Multi-language Support (en/es)', async ({ page }) => {
        const enBtn = page.locator('nav button').filter({ hasText: /^en$/i });
        await enBtn.waitFor({ state: 'visible' });
        await enBtn.click();
        await expect(page.locator('h1')).toContainText(/Unique tours/i, { timeout: 10000 });

        const esBtn = page.locator('nav button').filter({ hasText: /^es$/i });
        await esBtn.waitFor({ state: 'visible' });
        await esBtn.click();
        await expect(page.locator('h1')).toContainText(/Experiencias/i, { timeout: 10000 });
    });

    test('UI: Tour Dialog Logic & Overflow Check', async ({ page }) => {
        await page.getByRole('button', { name: /Accepter|Accept/i }).click().catch(() => { });
        await page.waitForTimeout(500);

        // Wait for cards to appear
        const tourCard = page.locator('section#top-tours h3').first();
        await tourCard.waitFor({ state: 'visible', timeout: 30000 });
        await tourCard.click({ force: true });

        await expect(page.locator('div[role="dialog"]')).toBeVisible({ timeout: 30000 });
        const bookBtn = page.locator('div[role="dialog"] button').filter({ hasText: /Réserver|Book/i }).first();
        await expect(bookBtn).toBeVisible();

        // Specific test for MacBook Air overflow (text should not exceed container width)
        const isOverflowing = await bookBtn.evaluate((el) => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(isOverflowing, "The 'Book Now' button text is overflowing its container!").toBe(false);
    });

    test('Performance: Assets 404 check', async ({ page }) => {
        const brokenAssets: string[] = [];
        page.on('response', response => {
            if (response.status() === 404 && !response.url().includes('favicon')) {
                brokenAssets.push(response.url());
            }
        });

        await page.goto('/');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        expect(brokenAssets).toHaveLength(0);
    });
});
