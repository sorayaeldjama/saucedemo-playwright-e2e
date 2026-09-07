import { Page, Locator } from '@playwright/test';

import{step} from '../healpers/tets-step-decorator'

export class LoginPage {

    private readonly page : Page;
    private readonly usernameInput : Locator; 
    private readonly passwordInput : Locator;
    private readonly loginButton : Locator; 
    private readonly errorMessage : Locator; 


  constructor(page: Page) {
    this.page = page;
    
    // Utilisation de getByPlaceholder car SauceDemo n'a pas de <label> pour ces champs
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    
    // Utilisation de getByRole pour le bouton (très robuste)
    this.loginButton = page.getByRole('button', { name: 'Login' });
    
    // On conserve data-test pour l'erreur, car le bloc d'erreur de SauceDemo 
    // n'a pas de rôle ARIA spécifique (comme role="alert")
    this.errorMessage = page.locator('[data-test="error"]');
  }
  @step
  async goto (){
    await this.page.goto(process.env.BASE_URL!);
  }
  @step
  async login(username : string){
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(process.env.SECRET_PASSWORD!);
    await this.loginButton.click();
  }
}