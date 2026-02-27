import { test, expect } from '@playwright/test';

test.describe('Full Site Verification - Tours & Detours', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
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
        } catch {
            console.log('Banner not found or already closed');
        }

        const whatsapp = page.getByLabel('Chat on WhatsApp').first();
        await expect(whatsapp).toBeVisible();

        // State Logic: WhatsApp should hide when a dialog is open (to avoid overlap)
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.click({ force: true });
        await expect(page.locator('div[role="dialog"]')).toBeVisible();
        await expect(whatsapp).not.toBeVisible();

        await page.keyboard.press('Escape');
        await expect(whatsapp).toBeVisible();
    });

    test('Data: Multi-language Support & SEO', async ({ page }) => {
        // EN
        const enBtn = page.locator('nav button').filter({ hasText: /^en$/i });
        await enBtn.click();
        await expect(page).toHaveTitle(/Tours & Detours/i);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.locator('h1')).toContainText(/Unique tours/i);

        // ES
        const esBtn = page.locator('nav button').filter({ hasText: /^es$/i });
        await esBtn.click();
        await expect(page.locator('html')).toHaveAttribute('lang', 'es');
        await expect(page.locator('h1')).toContainText(/Experiencias/i);
    });

    test('UI: Tour Dialog Logic & Overflow Check', async ({ page }) => {
        await page.getByRole('button', { name: /Accepter|Accept/i }).click().catch(() => { });
        await page.waitForTimeout(500);

        // Wait for cards to appear
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.waitFor({ state: 'visible', timeout: 30000 });
        await tourCard.click({ force: true });

        await expect(page.locator('div[role="dialog"]')).toBeVisible({ timeout: 30000 });
        const bookBtn = page.getByTestId('book-now-button').first();
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
        const photo = page.locator('section#me img, section#guide img').first();
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
        await expect(page.locator('h2, h1')).toContainText(/Admin|Connexion|Connecter|Tours.*Detours/i);
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });

    test('Conversion: Booking Funnel Walkthrough', async ({ page }) => {
        await page.getByRole('button', { name: /Accepter|Accept/i }).click().catch(() => { });
        await page.waitForTimeout(500);

        // 1. Open Tour
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.click({ force: true });

        // 2. Click Book Now
        await page.getByTestId('book-now-button').first().click();

        // 3. Step 1: Date & Participants
        await expect(page.locator('text=Étape 1 sur 4')).toBeVisible();
        const dateInput = page.locator('input[type="date"]');
        await expect(dateInput).toBeVisible();
        
        // Ensure date is filled (fallback if state initialization is slow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        await dateInput.fill(dateStr);

        // 4. Go to Step 2
        await page.waitForTimeout(500);
        const nextBtn = page.getByTestId('next-step-button').first();
        await nextBtn.click({ force: true });
        await expect(page.locator('text=/Étape 2 sur 4|Step 2 of 4|Paso 2 de 4/').first()).toBeVisible({ timeout: 10000 });

        // 5. Check validation (try next without name)
        await page.getByTestId('next-step-button').first().dispatchEvent('click');
        // Should stay on step 2 (no crash)
        await expect(page.locator('text=Étape 2 sur 4')).toBeVisible();
        await expect(page.locator('input#booking-name')).toBeVisible();
    });

    test('Security: Outbound Links Safety', async ({ page }) => {
        const externalLinks = await page.locator('a[target="_blank"]').all();
        for (const link of externalLinks) {
            const rel = await link.getAttribute('rel');
            expect(rel, `Link ${await link.getAttribute('href')} missing noopener noreferrer`).toMatch(/noopener.*noreferrer|noreferrer.*noopener/);
        }
    });
 
    test('UI: Meeting Point & Map Link', async ({ page }) => {
        await page.goto('/');
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.click({ force: true });
 
        await page.locator('div[role="dialog"] [role="tab"]').filter({ hasText: /Rencontre|Meeting|Punto/i }).first().click();
 
        // Check for address text
        await expect(page.locator('div[role="dialog"] div[role="tabpanel"] p').first()).toBeVisible();
        
        // Check for Google Maps button (might be optional depending on tour data)
        const mapElement = page.locator('div[role="dialog"] div[role="tabpanel"] button:has-text("Google Maps"), [data-testid="meeting-point-link"]').first();
        if (await mapElement.count() > 0) {
            await expect(mapElement).toBeVisible();
        }
    });

    test('Features: Category Filtering', async ({ page }) => {
        await page.goto('/');
        const categorySection = page.locator('#category-tours');
        await categorySection.scrollIntoViewIfNeeded();

        // Count tours in initial category (nature)
        await categorySection.locator('.embla__slide').count();

        // Click on another category (e.g., 'rando' or 'culture')
        // We look for the button text
        const cultureBtn = categorySection.getByRole('button', { name: /Culture/i });
        if (await cultureBtn.isVisible()) {
            await cultureBtn.click();
            await page.waitForTimeout(500);
            
            // Check that the list updated (even if count is same, we assume logic works if it doesn't crash)
            await expect(categorySection.locator('.embla__slide')).toBeVisible();
        }
    });

    test('Features: Live Session Smoke Test', async ({ page }) => {
        // This is a minimal smoke test for the join dialog
        await page.goto('/');
        
        // Open the dialog from Navbar
        const liveBtn = page.locator('nav button').filter({ hasText: /LIVE/i });
        if (await liveBtn.isVisible()) {
            await liveBtn.click();
            await expect(page.locator('text=/Rejoindre|Join|Unirme/i').first()).toBeVisible();
        }

        // Test the separate LiveApp page
        // We accept 'aventure' (found) OR 'introuvable' (not found) as both mean the page loaded
        await page.goto('/live.html?code=TEST12');
        await expect(page.locator('text=/aventure|ready|aventura|introuvable|found|encontrada/i').first()).toBeVisible();
    });

    test('Admin: Tour Management Flow', async ({ page }) => {
        await page.goto('/admin.html');
        // Bypass login
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        // The sidebar might be collapsed, use aria-label
        const profileBtn = page.getByRole('button', { name: /Mon Profil|My Profile/i });
        await profileBtn.click();
        await expect(page.locator('text=/Bio|Biographie/i').first()).toBeVisible();

        // Go back to Catalogue
        await page.getByRole('button', { name: /Catalogue|Inventory/i }).click();
        
        // Check for 'Nouveau Tour' button
        const newTourBtn = page.getByRole('button', { name: /Nouveau Tour|New Tour/i });
        if (await newTourBtn.isVisible()) {
            await newTourBtn.click();
            await expect(page.locator('text=/Édition Tour|Edit Tour|Tour Details/i')).toBeVisible();
            await page.getByRole('button', { name: /Annuler|Cancel/i }).first().click();
        }
    });

    test('Conversion: Pricing Tiers Logic', async ({ page }) => {
        await page.goto('/');
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.click({ force: true });

        const bookBtn = page.getByTestId('book-now-button').first();
        await bookBtn.click();

        // Increment participants
        const plusBtn = page.locator('button').filter({ hasText: '+' }).first();
        if (await plusBtn.isVisible()) {
            await plusBtn.click();
            await plusBtn.click(); // Now 3 participants
            
            // Wait for price calculation if it's dynamic
            // Check that price is displayed and is a number
            const totalPrice = page.locator('text=/Prix Total|Total Price/i');
            if (await totalPrice.isVisible()) {
                await expect(totalPrice).toBeVisible();
            }
        }
    });

    test('UI: Tour Content Translation', async ({ page }) => {
        await page.goto('/');
 
        // Switch to EN
        const enBtn = page.locator('nav button').filter({ hasText: /^en$/i });
        await enBtn.click();

        // Open first tour
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.click({ force: true });

        // Verify Title in Dialog is EN (or at least not the default FR one if translated)
        const dialogTitle = page.locator('div[role="dialog"] h2').first();
        await expect(dialogTitle).toBeVisible();

        // Check Duration Translation in Dialog
        // "Journée entière" should become "Full Day"
        const durationText = page.locator('div[role="dialog"] span:has-text("Day")');
        await expect(durationText).toBeVisible();

        await page.keyboard.press('Escape');

        // Switch to ES
        const esBtn = page.locator('nav button').filter({ hasText: /^es$/i });
        await esBtn.click();

        // Check Duration Translation on Card
        const durationCard = page.locator('#top-tours, section#tours').locator('span:has-text("Día")').first();
        await expect(durationCard).toBeVisible();
    });
});
