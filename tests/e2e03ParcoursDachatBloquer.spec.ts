import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Feature: Checkout (Parcours d\'achat)', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com/');
    
    await loginPage.login(
      process.env.STANDARD_USER || 'standard_user', 
      process.env.SECRET_PASSWORD || 'secret_sauce'
    );
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('E2E-03 : Parcours d\'achat avec blocages de validation (Unhappy Path Checkout)', async ({ page }) => {
    
    await test.step('1. Ajout d\'un article au catalogue', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    await test.step('2. Passage en caisse (Checkout)', async () => {
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL(/.*cart.html/);
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    await test.step('3. Clic sur Continue avec formulaire vide et vérification de l\'erreur', async () => {
      await page.locator('[data-test="continue"]').click();
      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText('Error: First Name is required');
    });

    await test.step('4. Saisie partielle (uniquement le prénom) et nouvelle tentative', async () => {
      await page.locator('[data-test="firstName"]').fill('John');
      await page.locator('[data-test="continue"]').click();
      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText('Error: Last Name is required');
    });

    await test.step('5. Saisie complète des informations restantes', async () => {
      await page.locator('[data-test="lastName"]').fill('EL');
      await page.locator('[data-test="postalCode"]').fill('69000');
      await page.locator('[data-test="continue"]').click();
    });

    await test.step('6. Annulation de la commande à l\'étape Overview', async () => {
      await expect(page).toHaveURL(/.*checkout-step-two.html/);
      await page.locator('[data-test="cancel"]').click();
    });

    await test.step('7. Vérification du retour au catalogue', async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
    });

  });

});