import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';


const inventoryUrl = process.env.URL_INVENTORY as string;
const userStandard = process.env.STANDARD_USER as string;
const cartUrl = process.env.CART_URL as string;
const baseUrl = process.env.BASE_URL as string; 

test.describe('Feature: Persistance du panier (Cart Persistence)', () => {
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page); 
  await loginPage.goto(); 
  await loginPage.login(userStandard ); 
});

test('E2E-02 : Persistance des articles lors de l\'actualisation de la page panier', async ({ page }) => {
  
  //  L'utilisateur est connecté et sur la page d'inventaire
  await expect(page).toHaveURL(inventoryUrl);

  // Ajout d'un article au panier et vérification du badge
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // On vérifie d'abord que le badge affiche toujours "1" depuis l'accueil
await expect(page.locator('.shopping_cart_badge')).toHaveText('1');  
  // // On entre dans le panier
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(cartUrl);
  
  // On vérifie qu'il y a bien 1 article listé dans le panier
  const inventoryItems = page.locator('[data-test="inventory-item"]');

// On vérifie qu'il y en a exactement 1
await expect(inventoryItems).toHaveCount(1);
  // Rafraîchissement brutal de la page (F5)
  await page.reload();

  await expect(inventoryItems).toHaveCount(1);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  //  Suppression de l'article (Attention au sélecteur qui change de 'add' à 'remove')
 await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  //  Vérification du panier vide
  // La liste des articles doit être vide
  // Le badge rouge en haut à droite doit complètement disparaître
  await expect(page.locator('.shopping_cart_badge')).toBeHidden();

  //  Retour au catalogue via le bouton "Continue Shopping"
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page).toHaveURL(inventoryUrl);

  //  Déconnexion
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  
  // Vérification finale du retour sur la page de login
  await expect(page).toHaveURL(baseUrl);
});
});