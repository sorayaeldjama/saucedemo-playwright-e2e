import {test} from '@playwright/test'
import { LoginPage } from '../pages/loginPage'




test('test login page', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    
})