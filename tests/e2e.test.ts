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
            await page.waitForTimeout(500);
        } catch (e) {
            console.log('Banner not found or already closed');
        }

        const whatsapp = page.locator('a[href*="wa.me"]').last();
        await expect(whatsapp).toBeVisible();

        // State Logic: WhatsApp should hide when a dialog is open (to avoid overlap)
        const tourCard = page.locator('section#top-tours h3').first();
        await tourCard.click({ force: true });
        await expect(page.locator('div[role="dialog"]')).toBeVisible();
        await expect(whatsapp).not.toBeVisible();

        await page.keyboard.press('Escape');
        await expect(whatsapp).toBeVisible();
    });

    test('Data: Multi-language Support (Deep Check)', async ({ page }) => {
        // EN
        const enBtn = page.locator('nav button').filter({ hasText: /^en$/i });
        await enBtn.click();
        await expect(page.locator('h1')).toContainText(/Unique tours/i);
        // Deep check: "View Details" button text
        const firstViewBtn = page.locator('section#top-tours button').filter({ hasText: /View Details/i }).first();
        await expect(firstViewBtn).toBeVisible();

        // ES
        const esBtn = page.locator('nav button').filter({ hasText: /^es$/i });
        await esBtn.click();
        await expect(page.locator('h1')).toContainText(/Experiencias/i);
        // Deep check: "Ver detalles" button text
        const firstViewBtnEs = page.locator('section#top-tours button').filter({ hasText: /Ver detalles/i }).first();
        await expect(firstViewBtnEs).toBeVisible();
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

        expect(brokenAssets, `Found ${brokenAssets.length} broken assets: ${brokenAssets.join(', ')}`).toHaveLength(0);
    });

    test('UI: About Page Sticky & Mobile Responsiveness', async ({ page }) => {
        await page.goto('/#about');

        // Check for sticky photo on Desktop
        await page.setViewportSize({ width: 1280, height: 800 });
        const photo = page.locator('section#about img').first();
        const initialBox = await photo.boundingBox();

        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(500);
        const scrolledBox = await photo.boundingBox();

        // In sticky mode, the Y relative to viewport should be stable OR within a range
        // If it was absolute/static, it would have moved up significantly
        if (initialBox && scrolledBox) {
            expect(scrolledBox.y).toBeLessThan(initialBox.y + 100);
        }

        // Mobile Overflow Check (iPhone XR/12 Pro width: 390px)
        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload();

        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll, "Horizontal scroll detected on mobile! Overflow issue.").toBe(false);
    });

    test('Admin: Smoke Test & Login Access', async ({ page }) => {
        await page.goto('/admin.html');
        // Check for "Accès Admin" or "Se connecter"
        await expect(page.locator('h2, h1')).toContainText(/Admin|Connexion|Connecter/i);
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });
});
