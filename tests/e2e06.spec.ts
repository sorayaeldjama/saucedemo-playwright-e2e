import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Feature: Tri et Filtrage du catalogue', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com/');
    
    await loginPage.login(
      process.env.STANDARD_USER || 'standard_user', 
      process.env.SECRET_PASSWORD || 'secret_sauce'
    );
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('E2E-06 : Validation du tri dynamique des articles (Data Sorting)', async ({ page }) => {
    
    // Modification du filtre pour trier par Prix (Croissant)
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('lohi'); // 'lohi' est la valeur HTML (Low to High)

    // Extraction brute de tous les prix affichés sur la page
    const priceLocators = page.locator('.inventory_item_price');
    const priceTexts = await priceLocators.allTextContents(); 
    // Résultat brut : ["$7.99", "$9.99", "$15.99", ...]

    // Nettoyage des données : on retire le '$' et on convertit les chaînes en nombres (Float)
    const actualPrices = priceTexts.map(price => parseFloat(price.replace('$', '')));

    // Création d'un tableau de référence trié mathématiquement
    // On utilise le spread operator [...] pour ne pas modifier le tableau d'origine
    const expectedSortedPrices = [...actualPrices].sort((a, b) => a - b);

    // Vérification stricte : l'ordre affiché doit correspondre à l'ordre mathématique
    expect(actualPrices).toEqual(expectedSortedPrices);

    // Modification du filtre pour trier par Nom (Z vers A)
    await sortDropdown.selectOption('za'); // 'za' est la valeur HTML (Z to A)

    // Extraction de tous les noms d'articles
    const nameLocators = page.locator('.inventory_item_name');
    const nameTexts = await nameLocators.allTextContents();

    // Création d'un tableau de référence trié alphabétiquement à l'envers
    const expectedSortedNames = [...nameTexts].sort((a, b) => b.localeCompare(a));

    // Vérification de l'ordre complet
    expect(nameTexts).toEqual(expectedSortedNames);

    // Vérification ciblée sur le premier élément (comme demandé dans le scénario)
    expect(nameTexts[0]).toContain('Test.allTheThings() T-Shirt');
  });

});