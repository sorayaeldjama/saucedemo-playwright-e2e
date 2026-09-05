import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Feature: Gestion de la latence et des performances', () => {

  test('E2E-07 : Tolérance à la latence avec performance_glitch_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Lancement d'un chronomètre (très apprécié en QA pour mesurer l'impact d'un glitch)
    const startTime = Date.now();

    // Connexion avec le profil qui simule des lenteurs serveur
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com/');
    await loginPage.login('performance_glitch_user', process.env.SECRET_PASSWORD || 'secret_sauce');

    // Vérification dynamique du changement de page
    // Le "glitch" fige l'application pendant ~5 secondes. 
    // Playwright ne plantera pas car toHaveURL est une assertion "Web-First" qui patiente automatiquement.
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Calcul et affichage du temps de réponse (facultatif mais excellent pour le débogage)
    const loadTime = Date.now() - startTime;
    console.log(`Temps de connexion constaté : ${loadTime} ms`);

    // Ajout d'un article au panier
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addToCartButton.click();

    // Vérification de la mise à jour de l'interface
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });

});