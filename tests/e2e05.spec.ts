import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Feature: Résilience et Gestion des anomalies', () => {

  test('E2E-05 : Parcours dégradé avec problem_user (Resilience)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Connexion avec le profil dégradé
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com/');
    await loginPage.login('problem_user', process.env.SECRET_PASSWORD || 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);

    // Vérification des images (Utilisation du locator sémantique)
    const backpackImage = page.getByAltText('Sauce Labs Backpack');
    await expect.soft(
      backpackImage, 
      "ANOMALIE FRONT-END : L'image du produit ne correspond pas à l'article attendu."
    ).toHaveAttribute('src', /.*sauce-backpack.*/);

    // 3. Tentative d'ajout au panier
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect.soft(
      cartBadge, 
      "ANOMALIE PANIER : Le compteur d'articles ne s'est pas mis à jour correctement."
    ).toHaveText('1');

    // Passage en caisse (Checkout)
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // Remplissage du formulaire (Utilisation du Web-First Assertion)
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    
    await expect.soft(
      page.locator('[data-test="lastName"]'), 
      "ANOMALIE CHECKOUT : Le champ 'Last Name' refuse la saisie ou est corrompu."
    ).toHaveValue('Doe');

    await page.locator('[data-test="postalCode"]').fill('75000');
    await page.locator('[data-test="continue"]').click();

    // Vérification du blocage final (Hard assertion)
    await expect(page).not.toHaveURL(/.*checkout-step-two.html/);
  });

});