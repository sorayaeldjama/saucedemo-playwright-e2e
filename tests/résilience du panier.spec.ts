import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page); 
  await loginPage.goto(); 
  await loginPage.login('standard_user', 'secret_sauce'); 
});

test('E2E-02 : Persistance du panier après rafraîchissement', async ({ page }) => {
  
  //  L'utilisateur est connecté et sur la page d'inventaire
  await expect(page).toHaveURL(/.*inventory.html/);

  //  Ajout d'un article au panier et vérification du badge
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Rafraîchissement brutal de la page (F5)
  await page.reload();

  //  Navigation vers le panier : l'article doit toujours être là (Persistance)
  // On vérifie d'abord que le badge affiche toujours "1" depuis l'accueil
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  
  // On entre dans le panier
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/.*cart.html/);
  
  // On vérifie qu'il y a bien 1 article listé dans le panier
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(1);

  //  Suppression de l'article (Attention au sélecteur qui change de 'add' à 'remove')
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  //  Vérification du panier vide
  // La liste des articles doit être vide
  await expect(cartItems).toHaveCount(0);
  // Le badge rouge en haut à droite doit complètement disparaître
  await expect(page.locator('.shopping_cart_badge')).toBeHidden();

  //  Retour au catalogue via le bouton "Continue Shopping"
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page).toHaveURL(/.*inventory.html/);

  //  Déconnexion
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  
  // Vérification finale du retour sur la page de login
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});