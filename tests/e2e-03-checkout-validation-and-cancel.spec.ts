import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';


const standardUser = process.env.STANDARD_USER || 'standard_user';
const inventoryUrl = process.env.URL_INVENTORY as string;
const cart_url = process.env.CART_URL as string;
const checkout_url = process.env.CHECKOUT_URL as string; 
const checkout_complete = process.env.CHECKOUT_COMPLETE as string; 


test.describe('Feature: Processus de commande (Checkout)', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      standardUser 
    );
    await expect(page).toHaveURL(inventoryUrl);
  });

  test('E2E-03 : Validation des champs obligatoires au Checkout et annulation de la commande (Unhappy Path)', async ({ page }) => {
    
    // Ajout d'un article au panier depuis le catalogue
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Navigation vers le panier et initialisation du Checkout
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(cart_url);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(checkout_url);

    // Contrôle de validation : Soumission du formulaire vide
    await page.locator('[data-test="continue"]').click();
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error: First Name is required');

    // Contrôle de validation : Soumission avec saisie partielle (Prénom uniquement)
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    // La constante errorMessage est déjà déclarée à l'étape 3, on la réutilise simplement
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Error: Last Name is required');

    // Saisie des champs restants et validation du formulaire
    await page.locator('[data-test="lastName"]').fill('EL');
    await page.locator('[data-test="postalCode"]').fill('69000');
    await page.locator('[data-test="continue"]').click();

    // Accès au récapitulatif (Overview) et annulation de la commande
    await expect(page).toHaveURL(checkout_complete);
    await page.locator('[data-test="cancel"]').click();

    // Vérification du routage vers le catalogue après abandon
    await expect(page).toHaveURL(inventoryUrl);
  });
});