import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';


test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page); 
  await loginPage.goto(); 
  await loginPage.login('standard_user', 'secret_sauce'); 
   // On vérifie  qu'on est bien sur la page d'inventaire
  await expect(page).toHaveURL(/.*inventory.html/);
});


test('E2E-01 : Parcours d\'achat nominal (Happy Path complet)', async ({ page }) => {
  
  // Navigation dans le catalogue et ajout de 2 articles distincts
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  
  // Vérification du badge du panier (2 articles)
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // Accès au panier et vérification de la présence des articles
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/.*cart.html/);
  
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);

  // Clic sur "Checkout"
  await page.locator('[data-test="checkout"]').click();

  // Saisie d'informations valides
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('75000');
  await page.locator('[data-test="continue"]').click();

  // Validation de la page "Overview" (calcul correct du total + taxes)
  await expect(page).toHaveURL(/.*checkout-step-two.html/);

  const itemPrices = await page.locator('.inventory_item_price').allTextContents();
  let calculatedSubtotal = 0;
  
  for (const priceText of itemPrices) {
    calculatedSubtotal += parseFloat(priceText.replace('$', ''));
  }

  const subtotalText = await page.locator('.summary_subtotal_label').textContent();
  const displayedSubtotal = parseFloat(subtotalText!.replace('Item total: $', ''));
  expect(displayedSubtotal).toBe(calculatedSubtotal);

  const taxText = await page.locator('.summary_tax_label').textContent();
  const displayedTax = parseFloat(taxText!.replace('Tax: $', ''));
  
  const totalText = await page.locator('.summary_total_label').textContent();
  const displayedTotal = parseFloat(totalText!.replace('Total: $', ''));

  const expectedTotal = parseFloat((displayedSubtotal + displayedTax).toFixed(2));
  expect(displayedTotal).toBe(expectedTotal);

  // Confirmation finale
  await page.locator('[data-test="finish"]').click();

  // Vérification de la page "Checkout: Complete!"
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // 1. Indiquer à Playwright d'attendre un événement de téléchargement
  const downloadPromise = page.waitForEvent('download');
  
  // 2. Cliquer sur le bouton qui déclenche le PDF (sélecteur fictif pour l'exemple)
  await page.locator('[data-test="download-invoice"]').click();
  
  // 3. Récupérer l'objet de téléchargement
  const download = await downloadPromise;
  
  // 4. Sauvegarder le fichier localement dans votre projet
  const path = './downloads/facture.pdf';
  await download.saveAs(path);
  
  // 5. Lire le contenu du PDF (nécessite fs et pdf-parse importés en haut du fichier)
  const dataBuffer = fs.readFileSync(path);
  const pdfData = await pdf(dataBuffer);
  
  // 6. Vérifier que les données de la commande sont bien dans le document
  expect(pdfData.text).toContain('John Doe');
  expect(pdfData.text).toContain(expectedTotal.toString()); // Vérifie le total calculé plus haut
  
  // =========================================================

  // Déconnexion
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
