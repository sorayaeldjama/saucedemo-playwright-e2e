Markdown

#  SauceDemo E2E Test Automation - Playwright

Ce projet a été réalisé dans le cadre d'un test technique de recrutement. Il s'agit d'une suite de tests automatisés de bout en bout (**End-to-End**) pour le site e-commerce [SauceDemo](https://www.saucedemo.com/), développée avec **Playwright** et **TypeScript**.

## Stack Technique
* **Framework de Test** : [Playwright](https://playwright.dev/)
* **Langage** : TypeScript
* **Design Pattern** : Page Object Model (POM)
* **Reporting** : Playwright HTML Reporter
* **Version Control** : Git / GitHub


## Structure du Projet
```text
├── tests/                 # Scripts de tests E2E automatisés
├── page-objects/          # Classes Page Object Model (POM)
├── globalTeardown.ts      # Script de nettoyage post-exécution (gestion des téléchargements)
├── CAHIER_DE_RECETTE.md   # Cahier de recette fonctionnel (Cas de test E2E-01 à E2E-08)
├── playwright.config.ts   # Fichier de configuration global Playwright
└── package.json           # Dépendances et scripts du projet 
```

## Documentation Fonctionnelle

Le cahier de recette complet détaillant l'ensemble des scénarios de test (parcours nominal, sécurité, persistance, etc.) est disponible dans le fichier CAHIER_DE_RECETTE.md.
## Installation & Exécution
1. Prérequis
```bash
    Node.js (recommandé : version LTS)
```

2. Installation des dépendances

-  Installation des modules nécessaires ainsi que les navigateurs Playwright :

```bash
npm install
npx playwright install
```

3. Lancer les tests

    Exécuter les tests en mode headless (arrière-plan) :
    
```bash
    npx playwright test
```
Exécuter les tests avec l'interface graphique (UI Mode) :
```bash
    npx playwright test --ui
```
Afficher le rapport de test HTML :
```bash
    npx playwright show-report
```
Nettoyage Automatisé

Le projet intègre un mécanisme de Global Teardown (globalTeardown.ts) configuré dans playwright.config.ts, permettant de nettoyer automatiquement les ressources temporaires (comme les dossiers de téléchargement) à la fin de l'exécution des tests.