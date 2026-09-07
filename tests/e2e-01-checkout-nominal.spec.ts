import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';


const user_standard = process.env.STANDARD_USER as string;
const inventoryUrl = process.env.URL_INVENTORY as string;
const cart_url = process.env.CART_URL as string;
const userFirstName = process.env.USER_FIRST_NAME as string;
const userLastName = process.env.USER_LAST_NAME as string;
const userPostalCode = process.env.USER_POSTAL_CODE as string;
const checkout_url = process.env.CHECKOUT_URL as string; 
const checkout_complete = process.env.CHECKOUT_COMPLETE as string; 



test.describe('Feature: Parcours d\'achat et Checkout', () => {
  
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page); 
  await loginPage.goto(); 
  await loginPage.login(user_standard); 
  await expect(page).toHaveURL(inventoryUrl);
});


test('E2E-01 : Parcours d\'achat nominal (Happy Path complet)', async ({ page }) => {
  
  // Navigation dans le catalogue et ajout de 2 articles distincts
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  
  // Vérification du badge du panier (2 articles)
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  // Accès au panier et vérification de la présence des articles
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(cart_url);
  
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);

  // Clic sur "Checkout"
  await page.getByRole('button', { name: 'Checkout' }).click()

  // Saisie d'informations valides
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await page.getByPlaceholder('First Name').fill(userFirstName);
  await page.getByPlaceholder('Last Name').fill(userLastName);
  await page.getByPlaceholder('Zip/Postal Code').fill(userPostalCode);
  await page.locator('[data-test="continue"]').click();
  await expect(page).toHaveURL(checkout_url);

  const itemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
  let calculatedSubtotal = 0;
  
  for (const priceText of itemPrices) {
    calculatedSubtotal += parseFloat(priceText.replace('$', ''));
  }

  const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent();
  const displayedSubtotal = parseFloat(subtotalText!.replace('Item total: $', ''));
  expect(displayedSubtotal).toBe(calculatedSubtotal);

  const taxText = await page.locator('[data-test="tax-label"]').textContent();
  const displayedTax = parseFloat(taxText!.replace('Tax: $', ''));
  
  const totalText = await page.locator('[data-test="total-label"]').textContent();
  const displayedTotal = parseFloat(totalText!.replace('Total: $', ''));

  const expectedTotal = parseFloat((displayedSubtotal + displayedTax).toFixed(2));
  expect(displayedTotal).toBe(expectedTotal);

  // Validation des informations de paiement et de livraison (Le petit plus QA !)
  await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
  await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');

  // Confirmation finale
  await page.locator('[data-test="finish"]').click();

  await expect(page).toHaveURL(checkout_complete);
  
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  await expect(page.locator('[data-test="complete-text"]')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

});
});