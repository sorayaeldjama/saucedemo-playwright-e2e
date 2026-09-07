import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';


const inventoryUrl = process.env.URL_INVENTORY as string;
const problemUser = process.env.PROBLEM_USER || 'problem_user';


test.describe('Feature: Résilience et Gestion des anomalies', () => {
  
  test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page); 
  await loginPage.goto(); 
  await loginPage.login('problem_user'); 
  await expect(page).toHaveURL(inventoryUrl);
});

test('E2E-05 : parcours dégradé avec problem_user et collecte d\'erreurs multiples (soft assertions)', async ({ page }) => {
    
    // Traçage de l'anomalie visuelle des images
    const firstItemImage = page.locator('.inventory_item_img img').first();
    const imageSrc = await firstItemImage.getAttribute('src');
    
    // Utilisation de soft assertion : note l'état sans stopper l'exécution
    expect.soft(imageSrc, "anomalie visuelle : image altérée").toContain('sl-404');

    // Traçage de l'anomalie fonctionnelle du panier
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addToCartButton.click();

    const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect.soft(removeButton).toHaveCount(1);
    
    // Tentative de retrait de l'article
    await removeButton.click();
    
    // Soft assertion : on confirme que l'action a échoué (le bouton est toujours là)
    await expect.soft(removeButton, "anomalie panier : bouton remove inactif").toHaveCount(1);
    
    // Poursuite du parcours dégradé vers le checkout
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Traçage de l'anomalie de formulaire au checkout
    await page.locator('[data-test="firstName"]').fill('Soraya');
    await page.locator('[data-test="lastName"]').fill('EL'); 
    await page.locator('[data-test="postalCode"]').fill('69000');
    
    await page.locator('[data-test="continue"]').click();

    // le profil problem_user a un bug sur le champ lastName (la saisie n'est pas prise en compte)
    // on valide que l'erreur bloquante apparaît bien à l'écran
    const errorMessage = page.locator('[data-test="error"]');
    await expect.soft(errorMessage, "anomalie checkout : blocage sur le last name").toBeVisible();
    await expect.soft(errorMessage).toContainText('Last Name is required');

  });

});