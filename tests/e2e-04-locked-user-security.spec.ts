import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';
const inventoryUrl = process.env.URL_INVENTORY as string;


test.describe('Feature: Sécurité et Authentification', () => {

     test.beforeEach(async ({ page }) => {
     const loginPage = new LoginPage(page); 
     await loginPage.goto(); 
     await loginPage.login('locked_out_user'); 
   });
   

  test('E2E-04 : Blocage du compte utilisateur et prévention d\'accès direct par URL (Security Bypass)', async ({ page }) => {

    // Vérification immédiate du message "epic sadface" après la tentative de connexion
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

    // Vérification stricte (Forçage de navigation vers l'inventaire)
    await page.goto(inventoryUrl);
    
    // Vérification du blocage de sécurité
    const securityError = page.locator('[data-test="error"]');
    await expect(securityError).toBeVisible();
    await expect(securityError).toContainText("Epic sadface: You can only access '/inventory.html' when you are logged in.");
    
    // Vérification finale : l'URL ne doit pas contenir inventory.html
    await expect(page).not.toHaveURL(inventoryUrl);
  });

});