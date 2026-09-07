import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';

const user_standard = process.env.STANDARD_USER as string;
const inventoryUrl = process.env.URL_INVENTORY as string;

test.describe('Feature: Gestion de l\'état et Navigation', () => {
const cart_url = process.env.CART_URL as string;

  test.beforeEach(async ({ page }) => {
     const loginPage = new LoginPage(page); 
     await loginPage.goto(); 
     await loginPage.login(user_standard); 
   });
   

  test('E2E-08 : Synchronisation du panier lors des retours au catalogue et modifications', async ({ page }) => {
    
    const cartBadge = page.locator('.shopping_cart_badge');
    
   // Ajout d'un article et accès au panier
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(cartBadge).toHaveText('1');
    
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);

    // Retour au catalogue via le bouton "Continue Shopping"
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(inventoryUrl);

    // Suppression de l'article depuis le catalogue
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // Vérification de la disparition du badge du panier
    await expect(cartBadge).toHaveCount(0);
    // Ajout d'un nouvel article de substitution
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(cartBadge).toHaveText('1');

    // Retour au panier pour l'inspection finale
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(cart_url);

    // Validation de l'intégrité du contenu du panier
    const cartItems = page.locator('.cart_item');
    
    // Vérification de la présence d'une unique ligne de produit
    await expect(cartItems).toHaveCount(1);
    
    // Vérification stricte du libellé du produit actif
    const itemName = page.locator('.inventory_item_name');
    await expect(itemName).toHaveText('Sauce Labs Bike Light');
  });

});