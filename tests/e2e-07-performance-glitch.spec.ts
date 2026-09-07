import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';

const inventoryUrl = process.env.URL_INVENTORY as string;
const performanceUser = process.env.PERFORMANCE_GLITCH_USER ;

test.describe('Feature: Gestion de la latence et des performances', () => {

  test('E2E-07 : Tolérance aux temps de réponse dégradés et résilience UI (performance_glitch_user)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Initialisation de la navigation et démarrage du chronomètre
    await loginPage.goto(); 
    const startTime = Date.now();

    // Connexion avec le profil instable (déclenchement du délai serveur)
    await loginPage.login(performanceUser!);

    // Validation de la redirection vers l'inventaire avec un timeout étendu (SLA)
    await expect(page).toHaveURL(inventoryUrl, { timeout: 10000 });
    
   // Mesure de la durée totale de chargement
    const loadTime = Date.now() - startTime;
    console.log(`Temps de connexion constaté : ${loadTime} ms`);
    
    // Vérification du respect du seuil de performance (SLA < 10 secondes)
    expect(loadTime).toBeLessThan(10000);

    // Vérification de la réactivité post-latence de l'interface
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

});