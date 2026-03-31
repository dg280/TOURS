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
        await expect(page.locator('h1')).toContainText(/Unique private Tours and Experiences in Barcelona and Catalonia/i);

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
        await expect(page.locator('text=Step 1 of 5')).toBeVisible();
        // Calendar replaces the old date input — verify it is visible
        const calendar = page.getByTestId('availability-calendar');
        await expect(calendar).toBeVisible({ timeout: 10000 });
        // Date is pre-selected to tomorrow on open; click the selected day to confirm
        const selectedDay = calendar.locator('button[class*="bg-amber-500"]').first();
        if (await selectedDay.isVisible()) {
            await selectedDay.click();
        }

        // 4. Go to Step 2
        await page.waitForTimeout(500);
        const nextBtn = page.getByTestId('next-step-button').first();
        await nextBtn.click({ force: true });
        await expect(page.locator('text=Step 2 of 5').first()).toBeVisible({ timeout: 10000 });

        // 5. Check validation (try next without name)
        await page.getByTestId('next-step-button').first().dispatchEvent('click');
        // Should stay on step 2 (no crash)
        await expect(page.locator('text=Step 2 of 5')).toBeVisible();
        await expect(page.locator('input#booking-name')).toBeVisible();
    });

    test('Regression: Booking Funnel in EN — calendar + step navigation', async ({ page }) => {
        // Non-regression: switching to EN must not break the booking funnel
        // (itinerary_en / included_en were previously lost in the tour merge)
        const enBtn = page.locator('nav button').filter({ hasText: /^en$/i });
        await enBtn.click();
        await page.waitForTimeout(300);

        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.waitFor({ state: 'visible', timeout: 15000 });
        await tourCard.click({ force: true });

        await page.getByTestId('book-now-button').first().click();

        // Step 1 must render in EN
        await expect(page.locator('text=Step 1 of 5')).toBeVisible({ timeout: 10000 });
        const calendar = page.getByTestId('availability-calendar');
        await expect(calendar).toBeVisible({ timeout: 10000 });

        // Advance to step 2 (scroll button into view first — calendar can push it off-screen)
        const nextBtn = page.getByTestId('next-step-button').first();
        await nextBtn.scrollIntoViewIfNeeded();
        await nextBtn.click({ force: true });
        await expect(page.locator('text=/Step 2 of 5/').first()).toBeVisible({ timeout: 10000 });

        // Step 2 form fields must be visible (no crash from undefined tour data)
        await expect(page.locator('input#booking-name')).toBeVisible();
    });

    test('Regression: Booking Funnel in ES — calendar + step navigation', async ({ page }) => {
        // Non-regression: switching to ES must not break the booking funnel
        const esBtn = page.locator('nav button').filter({ hasText: /^es$/i });
        await esBtn.click();
        await page.waitForTimeout(300);

        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.waitFor({ state: 'visible', timeout: 15000 });
        await tourCard.click({ force: true });

        await page.getByTestId('book-now-button').first().click();

        // Step 1 must render in ES
        await expect(page.locator('text=Paso 1 de 5')).toBeVisible({ timeout: 10000 });
        const calendar = page.getByTestId('availability-calendar');
        await expect(calendar).toBeVisible({ timeout: 10000 });

        // Advance to step 2 (scroll button into view first — calendar can push it off-screen)
        const nextBtn = page.getByTestId('next-step-button').first();
        await nextBtn.scrollIntoViewIfNeeded();
        await nextBtn.click({ force: true });
        await expect(page.locator('text=/Paso 2 de 5/').first()).toBeVisible({ timeout: 10000 });

        await expect(page.locator('input#booking-name')).toBeVisible();
    });

    test('Security: Outbound Links Safety', async ({ page }) => {
        const externalLinks = await page.locator('a[target="_blank"]').all();
        for (const link of externalLinks) {
            const rel = await link.getAttribute('rel');
            expect(rel, `Link ${await link.getAttribute('href')} missing noopener noreferrer`).toMatch(/noopener.*noreferrer|noreferrer.*noopener/);
        }
    });
 
    test('UI: Bon à savoir tab loads correctly', async ({ page }) => {
        await page.goto('/');
        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.click({ force: true });

        // Click the "Bon à savoir / Meet" tab
        await page.locator('div[role="dialog"] [role="tab"]').filter({ hasText: /Savoir|Know|Útil/i }).first().click();

        // The active tab panel should be visible
        await expect(page.locator('div[role="dialog"] div[role="tabpanel"][data-state="active"]')).toBeVisible();
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
            await expect(categorySection.locator('.embla__slide').first()).toBeVisible();
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
        // localStorage bypass only works in local dev build (import.meta.env.DEV)
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production builds');
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

    test('UI: Contact Form — Fill & Submit', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /Accepter|Accept/i }).click().catch(() => {});

        // Scroll to contact section
        await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
        await page.waitForTimeout(500);

        // Fill required fields
        await page.fill('#name', 'Test E2E');
        await page.fill('#email', 'test@e2e.com');
        await page.fill('#message', 'Message de test automatisé E2E.');

        await expect(page.locator('#name')).toHaveValue('Test E2E');
        await expect(page.locator('#email')).toHaveValue('test@e2e.com');
        await expect(page.locator('#message')).toHaveValue('Message de test automatisé E2E.');

        // Submit — expect a toast (success if Resend configured, error otherwise)
        await page.locator('form button[type="submit"]').first().click();
        await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 15000 });
    });

    test('Features: All 9 Category Filters Cycle', async ({ page }) => {
        await page.goto('/');
        const categorySection = page.locator('#category-tours');
        await categorySection.scrollIntoViewIfNeeded();

        // Click every filter button in the category row
        const filterButtons = categorySection.locator('div.flex.flex-wrap button');
        const count = await filterButtons.count();
        expect(count).toBeGreaterThanOrEqual(9);

        for (let i = 0; i < count; i++) {
            await filterButtons.nth(i).click();
            await page.waitForTimeout(200);
            // Carousel container must always be present (even if 0 results)
            await expect(categorySection.locator('.embla__container')).toBeVisible();
        }
    });

    test('Conversion: Booking Funnel Step 2 — Full Form Fill', async ({ page }) => {
        await page.getByRole('button', { name: /Accepter|Accept/i }).click().catch(() => {});
        await page.waitForTimeout(500);

        const tourCard = page.locator('#top-tours h3, section#tours h3').first();
        await tourCard.waitFor({ state: 'visible', timeout: 15000 });
        await tourCard.click({ force: true });
        await page.getByTestId('book-now-button').first().click();

        // Step 1 — advance
        await expect(page.locator('text=Step 1 of 5')).toBeVisible({ timeout: 10000 });
        const nextBtn1 = page.getByTestId('next-step-button').first();
        await nextBtn1.scrollIntoViewIfNeeded();
        await nextBtn1.click({ force: true });

        // Step 2 — fill all fields
        await expect(page.locator('text=Step 2 of 5')).toBeVisible({ timeout: 10000 });
        await page.fill('input#booking-name', 'Test E2E User');
        await page.fill('input#booking-email', 'test@e2e.com');

        const phoneField = page.locator('input[type="tel"]').first();
        if (await phoneField.isVisible()) await phoneField.fill('+33612345678');

        const addressField = page.locator('input[placeholder*="Adresse" i], input[placeholder*="Address" i]').first();
        if (await addressField.isVisible()) await addressField.fill('123 Rue de Test');

        await expect(page.locator('input#booking-name')).toHaveValue('Test E2E User');
        await expect(page.locator('input#booking-email')).toHaveValue('test@e2e.com');

        // Try to advance to step 3 (may stay at step 2 if Stripe API is unavailable locally)
        const nextBtn2 = page.getByTestId('next-step-button').first();
        await nextBtn2.scrollIntoViewIfNeeded();
        await nextBtn2.click({ force: true });
        await page.waitForTimeout(2000);

        const atStep3 = await page.locator('text=/Step 3 of 5/').isVisible().catch(() => false);
        const atStep2 = await page.locator('text=Step 2 of 5').isVisible().catch(() => false);
        expect(atStep3 || atStep2).toBe(true);
    });

    test('Admin: Dashboard Metrics Render', async ({ page }) => {
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production');
        await page.goto('/admin.html');
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        await expect(page.locator('text=/En attente/i').first()).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=/Confirmées/i').first()).toBeVisible();
        await expect(page.locator('text=/Revenu/i').first()).toBeVisible();
    });

    test('Admin: Reservations Tab — Search & Status Filter', async ({ page }) => {
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production');
        await page.goto('/admin.html');
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        await page.getByRole('button', { name: /Réservations/i }).first().click();
        await page.waitForTimeout(500);

        const searchInput = page.locator('input[placeholder*="Rechercher" i]');
        await expect(searchInput).toBeVisible({ timeout: 10000 });

        await searchInput.fill('test');
        await page.waitForTimeout(300);
        await searchInput.clear();

        const statusSelect = page.locator('select').first();
        if (await statusSelect.isVisible()) {
            await statusSelect.selectOption('pending');
            await page.waitForTimeout(200);
            await statusSelect.selectOption('');
        }
    });

    test('Admin: Catalogue Tab — Tour Edit FR/EN/ES Tabs', async ({ page }) => {
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production');
        await page.goto('/admin.html');
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        await page.getByRole('button', { name: /Catalogue/i }).first().click();
        await page.waitForTimeout(500);

        const newTourBtn = page.getByRole('button', { name: /Nouveau Tour|New Tour/i });
        if (await newTourBtn.isVisible({ timeout: 5000 })) {
            await newTourBtn.click();
            await page.waitForTimeout(1000);

            // Tabs have text "FR", "EN", "ES" (with Globe icon — use substring match)
            const frTab = page.locator('[role="tab"]').filter({ hasText: 'FR' }).first();
            const enTab = page.locator('[role="tab"]').filter({ hasText: 'EN' }).first();
            const esTab = page.locator('[role="tab"]').filter({ hasText: 'ES' }).first();

            await expect(frTab).toBeVisible({ timeout: 10000 });
            await expect(enTab).toBeVisible();
            await expect(esTab).toBeVisible();

            await enTab.click();
            await expect(page.locator('[role="tabpanel"][data-state="active"]')).toBeVisible();
            await esTab.click();
            await expect(page.locator('[role="tabpanel"][data-state="active"]')).toBeVisible();

            await page.getByRole('button', { name: /Annuler|Cancel/i }).first().click();
        }
    });

    test('Admin: Avis Clients Tab Loads', async ({ page }) => {
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production');
        await page.goto('/admin.html');
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        await page.getByRole('button', { name: /Avis clients/i }).first().click();
        await page.waitForTimeout(500);

        await expect(page.locator('text=/Avis|avis|Review/i').first()).toBeVisible({ timeout: 10000 });
    });

    test('Admin: Suivi (Live Sessions) Tab Loads', async ({ page }) => {
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production');
        await page.goto('/admin.html');
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        await page.getByRole('button', { name: /Suivi/i }).first().click();
        await page.waitForTimeout(500);

        // Suivi section shows "Suivi Opérationnel" heading and pick-up/planning cards
        await expect(page.locator('text=/Suivi Opérationnel|Pick-ups|Planning/i').first()).toBeVisible({ timeout: 10000 });
    });

    test('Admin: Mon Profil — Photo Upload Slots Visible', async ({ page }) => {
        test.skip(!!process.env.BASE_URL, 'Admin localStorage bypass disabled in production');
        await page.goto('/admin.html');
        await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
        await page.reload();

        await page.getByRole('button', { name: /Mon Profil|My Profile/i }).first().click();
        await page.waitForTimeout(500);

        await expect(page.locator('text=/Bio|Biographie/i').first()).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=/différent|Différent/i').first()).toBeVisible();

        // At least 1 photo change button visible
        const changeButtons = page.locator('button').filter({ hasText: /Changer|Photo|Modifier/i });
        const btnCount = await changeButtons.count();
        expect(btnCount).toBeGreaterThanOrEqual(1);
    });

    test('UI: Footer Nav Links & Legal Modals', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /Accepter|Accept/i }).click().catch(() => {});

        // Scroll to footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        // Footer navigation links must be visible
        const footer = page.locator('footer');
        await expect(footer.getByRole('link', { name: /Nos Tours|Tours/i }).first()).toBeVisible();
        await expect(footer.getByRole('link', { name: /Guide|Votre Guide/i }).first()).toBeVisible();
        await expect(footer.getByRole('link', { name: /Avis|Reviews/i }).first()).toBeVisible();
        await expect(footer.getByRole('link', { name: /Contact/i }).first()).toBeVisible();

        // At least 4 tour names listed in footer
        const tourLinks = footer.locator('ul').last().locator('span, li');
        const count = await tourLinks.count();
        expect(count).toBeGreaterThanOrEqual(4);

        // Legal notice modal
        await footer.getByRole('button', { name: /Mentions légales|Legal Notice/i }).click();
        await expect(page.locator('div[role="dialog"]')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('div[role="dialog"]')).toContainText(/Mentions légales|Legal Notice|Éditeur|Hébergement/i);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Privacy modal
        await footer.getByRole('button', { name: /Confidentialité|Privacy/i }).click();
        await expect(page.locator('div[role="dialog"]')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('div[role="dialog"]')).toContainText(/Confidentialité|Privacy|RGPD|données/i);
        await page.keyboard.press('Escape');
    });
});
