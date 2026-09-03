import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Feature: Sécurité et Authentification', () => {

  test('E2E-04 : Parcours utilisateur bloqué (Rejet initial)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Navigation vers la page de connexion
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com/');

    // 2. Tentative de connexion avec locked_out_user
    await loginPage.login('locked_out_user', process.env.SECRET_PASSWORD || 'secret_sauce');

    // 3. Vérification immédiate du message "Epic sadface"
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

    // 4. Vérification stricte (Forçage de navigation vers l'inventaire)
    const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';
    await page.goto(`${baseUrl}inventory.html`);
    
    // Vérification du blocage de sécurité
    const securityError = page.locator('[data-test="error"]');
    await expect(securityError).toBeVisible();
    await expect(securityError).toContainText("Epic sadface: You can only access '/inventory.html' when you are logged in.");
    
    // Vérification finale : l'URL ne doit pas contenir inventory.html
    await expect(page).not.toHaveURL(/.*inventory.html/);
  });

});