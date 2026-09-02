import {test, expect} from '@playwright/test'
import { LoginPage } from '../pages/loginPage'

test.beforeAll(({page})=>{

})

test.beforeEach(async({page})=>{
    const loginPage = new LoginPage(page); 
    await loginPage.goto();
    await loginPage.login('', '');
})


test('E2E-01 : Parcours d achat nominal', async ({page}) => {

    await page.getByText('Login').click();

})

test('E2E-01 : Parcours d\'achat nominal (Happy Path complet)', async ({ page }) => {
  
  // 1. Connexion avec standard_user
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  
  // Vérification que la connexion a réussi
  await expect(page).toHaveURL(/.*inventory.html/);

  // 2 & 3. Navigation dans le catalogue et ajout de 2 articles distincts
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  
  // Vérification du badge du panier (2 articles)
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // 4. Accès au panier et vérification de la présence des articles
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/.*cart.html/);
  
  // Vérifier qu'il y a exactement 2 éléments dans la liste du panier
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);

  // 5. Clic sur "Checkout"
  await page.locator('[data-test="checkout"]').click();

  // 6. Saisie d'informations valides
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('75000');
  await page.locator('[data-test="continue"]').click();

  // 7. Validation de la page "Overview" (calcul correct du total + taxes)
  await expect(page).toHaveURL(/.*checkout-step-two.html/);

  // -- DÉBUT DE LA VÉRIFICATION DES PRIX --
  // Récupérer le texte de tous les prix des articles
  const itemPrices = await page.locator('.inventory_item_price').allTextContents();
  let calculatedSubtotal = 0;
  
  for (const priceText of itemPrices) {
    // Retirer le symbole '$' et convertir la chaîne en nombre décimal
    calculatedSubtotal += parseFloat(priceText.replace('$', ''));
  }

  // Récupérer le sous-total affiché sur la page
  const subtotalText = await page.locator('.summary_subtotal_label').textContent();
  const displayedSubtotal = parseFloat(subtotalText!.replace('Item total: $', ''));
  
  // Vérifier que la somme des articles correspond au sous-total affiché
  expect(displayedSubtotal).toBe(calculatedSubtotal);

  // Récupérer la taxe et le total final affichés
  const taxText = await page.locator('.summary_tax_label').textContent();
  const displayedTax = parseFloat(taxText!.replace('Tax: $', ''));
  
  const totalText = await page.locator('.summary_total_label').textContent();
  const displayedTotal = parseFloat(totalText!.replace('Total: $', ''));

  // Vérifier que Sous-total + Taxes = Total final affiché
  // L'utilisation de toFixed(2) évite les bugs d'arrondi classiques de JavaScript avec les nombres flottants
  const expectedTotal = parseFloat((displayedSubtotal + displayedTax).toFixed(2));
  expect(displayedTotal).toBe(expectedTotal);
  // -- FIN DE LA VÉRIFICATION DES PRIX --

  // 8. Confirmation finale
  await page.locator('[data-test="finish"]').click();

  // 9. Vérification de la page "Checkout: Complete!"
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // 10. Déconnexion
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  
  // Vérification du retour à la page d'accueil
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

