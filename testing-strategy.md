# Testing Strategy — Sito portfolio (daniilangelobravi.com)
> Generato: 2026-07-06 | Live: https://brvdln.github.io/daniilangelobravi/

---

## Stack di test consigliato

| Strumento | Uso |
|---|---|
| **Jest** | Unit test funzioni JS pure (validazione, calcoli) |
| **Playwright** | E2E, Stripe checkout, navigazione, layout |

```bash
npm install --save-dev jest @playwright/test
npx playwright install chromium
```

---

## Piramide di test

| Livello | Cosa | % |
|---|---|---|
| Unit | Funzioni JS pure (form validation, calcoli prezzo) | ~20% |
| Integration | Stripe checkout con carte test | ~30% |
| E2E | Navigazione, form contatti, rendering pagine | ~40% |
| Visual | Smoke layout mobile/desktop | ~10% |

---

## Aree critiche (in ordine di priorità)

### 1. Stripe checkout — PRIORITÀ MASSIMA

```js
// tests/stripe-checkout.spec.js
import { test, expect } from '@playwright/test';

test('checkout con carta valida va a buon fine', async ({ page }) => {
  await page.goto('https://brvdln.github.io/daniilangelobravi/pittura');
  await page.click('[data-testid="buy-button"]');
  // Riempi i campi Stripe con carta test
  const stripeFrame = page.frameLocator('iframe[name*="stripe"]');
  await stripeFrame.locator('[placeholder="Numero carta"]').fill('4242 4242 4242 4242');
  await stripeFrame.locator('[placeholder="MM / AA"]').fill('12/34');
  await stripeFrame.locator('[placeholder="CVC"]').fill('123');
  await page.click('[data-testid="submit-payment"]');
  await expect(page.locator('.payment-success')).toBeVisible({ timeout: 10000 });
});

test('checkout con carta rifiutata mostra errore', async ({ page }) => {
  // Carta test rifiutata: 4000 0000 0000 0002
  await page.goto('https://brvdln.github.io/daniilangelobravi/pittura');
  // ... stessa logica con carta rifiutata
  await expect(page.locator('.payment-error')).toBeVisible();
});
```

**Carte Stripe test utili:**
- `4242 4242 4242 4242` — pagamento riuscito
- `4000 0000 0000 0002` — carta rifiutata
- `4000 0025 0000 3155` — richiede autenticazione 3D Secure

### 2. Navigazione — nessun 404

```js
test('tutte le pagine principali caricano', async ({ page }) => {
  const pages = ['/', '/pittura', '/disegno', '/3d', '/corsi', '/contatti'];
  for (const path of pages) {
    const response = await page.goto('https://brvdln.github.io/daniilangelobravi' + path);
    expect(response.status()).toBeLessThan(400);
  }
});
```

### 3. Form contatti

```js
test('form contatti: email invalida blocca invio', async ({ page }) => {
  await page.goto('https://brvdln.github.io/daniilangelobravi/contatti');
  await page.fill('[name="email"]', 'email-non-valida');
  await page.click('[type="submit"]');
  await expect(page.locator('.error-email')).toBeVisible();
});

test('form contatti: invio valido mostra conferma', async ({ page }) => {
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="message"]', 'Messaggio di test');
  await page.click('[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 4. Layout responsive (smoke)

```js
test('homepage su mobile non ha overflow orizzontale', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://brvdln.github.io/daniilangelobravi/');
  const body = await page.locator('body');
  const bodyWidth = await body.evaluate(el => el.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(375);
});
```

---

## Eseguire i test

```bash
# E2E con Playwright
npx playwright test

# Report visivo
npx playwright show-report

# Solo test Stripe
npx playwright test stripe-checkout
```

---

## Coverage target

| Area | Target |
|---|---|
| Stripe checkout (test mode) | 100% dei percorsi visibili |
| Form contatti | 100% |
| Navigazione / no 404 | 100% |
| Layout responsive | Smoke su 375px e 1280px |

---

## Prossimo passo

1. Aggiungere `data-testid` agli elementi chiave in HTML (bottone acquisto, form, messaggi)
2. Creare `tests/` nella root del repo con i test Playwright
3. Aggiungere workflow GitHub Actions: esegui test su ogni push a `main`
