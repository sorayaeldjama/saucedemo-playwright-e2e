import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';
import { SorterHelper } from '../healpers/sorterHelper'; 

const user_standard = process.env.STANDARD_USER as string;

test.describe('Feature: Tri et Filtrage du catalogue', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page); 
    await loginPage.goto(); 
    await loginPage.login(user_standard); 
  });

  test('E2E-06 : Validation du tri dynamique complet du catalogue (A-Z, Z-A, Prix Croissant, Prix Décroissant)', async ({ page }) => {
    
    // Tri par nom : a vers z
    await page.locator('.select_container').getByRole('combobox').selectOption('az');
    await expect(page.getByRole('combobox')).toHaveValue('az');
    
    const namesAz = await page.locator('.inventory_item_name').allTextContents();
    expect(namesAz).toEqual(SorterHelper.getExpectedNamesAtoZ(namesAz));


    // Tri par nom : z vers a 
    await page.locator('.select_container').getByRole('combobox').selectOption('za'); 
    await expect(page.getByRole('combobox')).toHaveValue('za');

    const namesZa = await page.locator('.inventory_item_name').allTextContents();
    expect(namesZa).toEqual(SorterHelper.getExpectedNamesZtoA(namesZa));
    
    // Vérification ciblée du premier élément (Z à A)
    expect(namesZa[0]).toContain('Test.allTheThings() T-Shirt');


    // Tri par prix : croissant
    await page.locator('.select_container').getByRole('combobox').selectOption('lohi');
    await expect(page.getByRole('combobox')).toHaveValue('lohi');
    
    const pricesLohi = await page.locator('.inventory_item_price').allTextContents(); 
    expect(pricesLohi).toEqual(SorterHelper.getExpectedPricesAscending(pricesLohi));


    // Tri par prix : décroissant
    await page.locator('.select_container').getByRole('combobox').selectOption('hilo');
    await expect(page.getByRole('combobox')).toHaveValue('hilo');
    
    const pricesHilo = await page.locator('.inventory_item_price').allTextContents(); 
    expect(pricesHilo).toEqual(SorterHelper.getExpectedPricesDescending(pricesHilo));

  });

});