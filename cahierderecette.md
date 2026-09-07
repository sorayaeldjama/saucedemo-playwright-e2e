# DOCUMENTATION QA : Cahier de Recette E2E[cite: 1]

* **Projet** : Application Web Sauce Demo[cite: 1]
* **Auteur** : EL DJAMA SORAYA[cite: 1]
* **Date** : Septembre 2026[cite: 1]
* **Version** : 1.0[cite: 1]

---

## 1. Cas de Test : E2E-01 (Happy Path)[cite: 1]

* **ID du Cas de test** : E2E-01[cite: 1]
* **Titre** : Parcours d'achat nominal avec le profil standard[cite: 1]
* **Prérequis** : L'utilisateur est sur la page de connexion.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Saisir le nom d'utilisateur `standard_user` et le mot de passe valide.[cite: 1]
2. Cliquer sur le bouton "Login".[cite: 1]
3. Sur la page catalogue, cliquer sur "Add to cart" pour deux articles différents.[cite: 1]
4. Cliquer sur l'icône du panier, puis sur "Checkout".[cite: 1]
5. Remplir le formulaire de livraison avec des données valides, puis cliquer sur "Continue".[cite: 1]
6. Sur la page de récapitulatif, cliquer sur le bouton "Finish".[cite: 1]

**Résultat attendu**[cite: 1] :
* Le système redirige vers la page de confirmation finale.[cite: 1]
* Le message « Thank you for your order! » est affiché, suivi de « Your order has been dispatched, and will arrive just as fast as the pony can get there! ».[cite: 1]

---

## 2. Cas de Test : E2E-02 (Persistance des données)[cite: 1]

* **ID du Cas de test** : E2E-02[cite: 1]
* **Titre** : Persistance des articles lors de l'actualisation de la page panier[cite: 1]
* **Prérequis** : L'utilisateur est connecté avec `standard_user` et se trouve sur la page catalogue.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Depuis le catalogue, cliquer sur "Add to cart" pour un article.[cite: 1]
2. Cliquer sur l'icône du panier pour accéder à la page panier.[cite: 1]
3. Une fois dans le panier, actualiser brutalement la page web (touche F5 ou rafraîchissement du navigateur).[cite: 1]

**Résultat attendu**[cite: 1] :
* L'utilisateur reste bien sur la page du panier.[cite: 1]
* L'article ajouté est toujours visible dans la liste.[cite: 1]
* Le badge du panier affiche toujours "1".[cite: 1]

---

## 3. Cas de Test : E2E-03 (Contrôle de validation)[cite: 1]

* **ID du Cas de test** : E2E-03[cite: 1]
* **Titre** : Blocage de validation au Checkout avec formulaire vide[cite: 1]
* **Prérequis** : L'utilisateur est connecté et se trouve sur la page de Checkout (formulaire d'adresse).[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Laisser les champs du formulaire (First Name, Last Name, Zip/Postal Code) entièrement vides.[cite: 1]
2. Cliquer sur le bouton "Continue".[cite: 1]

**Résultat attendu**[cite: 1] :
* Le système bloque le passage à l'étape du récapitulatif.[cite: 1]
* Un message d'erreur rouge s'affiche exigeant le remplissage des champs obligatoires (ex: `Error: First Name is required`).[cite: 1]

---

## 4. Cas de Test : E2E-04 (Contrôle de sécurité)[cite: 1]

* **ID du Cas de test** : E2E-04[cite: 1]
* **Titre** : Accès refusé pour un compte verrouillé[cite: 1]
* **Prérequis** : L'utilisateur est sur la page de connexion.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Saisir le nom d'utilisateur `locked_out_user` et le mot de passe valide.[cite: 1]
2. Cliquer sur le bouton "Login".[cite: 1]

**Résultat attendu**[cite: 1] :
* Le système refuse la connexion.[cite: 1]
* Le message d'erreur explicite suivant s'affiche : `Epic sadface: Sorry, this user has been locked out.`[cite: 1]

---

## 5. Cas de Test : E2E-05 (Résilience et tolérance aux anomalies)[cite: 1]

* **ID du Cas de test** : E2E-05[cite: 1]
* **Titre** : Parcours dégradé avec collecte d'erreurs multiples[cite: 1]
* **Prérequis** : L'utilisateur est sur la page de connexion.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Se connecter avec le profil `problem_user` (connu pour générer des anomalies visuelles et fonctionnelles).[cite: 1]
2. Naviguer sur la page catalogue et tenter d'ajouter un article au panier.[cite: 1]
3. Tenter d'accéder à la page de Checkout et de soumettre le formulaire.[cite: 1]

**Résultat attendu**[cite: 1] :
* Le test ne s'arrête pas au premier échec (utilisation de Soft Assertions).[cite: 1]
* Le script capture et liste toutes les anomalies rencontrées (images manquantes, boutons inactifs) pour faciliter le diagnostic développeur.[cite: 1]

---

## 6. Cas de Test : E2E-06 (Tri et Algorithme)[cite: 1]

* **ID du Cas de test** : E2E-06[cite: 1]
* **Titre** : Tri dynamique complet du catalogue[cite: 1]
* **Prérequis** : L'utilisateur est connecté avec `standard_user` et se trouve sur la page catalogue.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Cliquer sur le menu déroulant de tri (Sort).[cite: 1]
2. Sélectionner successivement et valider chaque option de tri disponible[cite: 1] :
   * "Name (A to Z)" (az)[cite: 1]
   * "Name (Z to A)" (za)[cite: 1]
   * "Price (low to high)" (lohi)[cite: 1]
   * "Price (high to low)" (hilo)[cite: 1]

**Résultats attendus**[cite: 1] :
* À chaque sélection, la valeur du menu déroulant se met à jour correctement.[cite: 1]
* Les listes de prix et de libellés extraites de l'interface correspondent de manière exacte aux algorithmes de tri attendus (via le helper de validation).[cite: 1]
* Le premier élément affiché pour le tri Z à A correspond précisément au produit attendu (`Test.allTheThings() T-Shirt`).[cite: 1]

---

## 7. Cas de Test : E2E-07 (Performance et Latence)[cite: 1]

* **ID du Cas de test** : E2E-07[cite: 1]
* **Titre** : Tolérance à la latence réseau[cite: 1]
* **Prérequis** : L'utilisateur est sur la page de connexion.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Se connecter avec le profil `performance_glitch_user` (qui déclenche un délai de réponse serveur d'environ 5 secondes).[cite: 1]
2. Effectuer un ajout au panier complet jusqu'à la confirmation de commande.[cite: 1]

**Résultat attendu**[cite: 1] :
* Le système est lent mais fonctionnel.[cite: 1]
* Le script d'automatisation ne génère pas de faux-négatif (Timeout error) grâce aux attentes dynamiques du framework Playwright, et la commande est validée.[cite: 1]

---

## 8. Cas de Test : E2E-08 (Gestion de l'état et Navigation)[cite: 1]

* **ID du Cas de test** : E2E-08[cite: 1]
* **Titre** : Mise à jour du panier lors des retours en arrière et modifications[cite: 1]
* **Prérequis** : L'utilisateur est connecté et se trouve sur la page catalogue.[cite: 1]

**Étapes d'exécution**[cite: 1] :
1. Ajouter un article et cliquer sur l'icône du panier.[cite: 1]
2. Dans le panier, utiliser le bouton "Continue Shopping" (ou le bouton "Retour" du navigateur) pour revenir au catalogue.[cite: 1]
3. Cliquer sur "Remove" sur ce même article depuis le catalogue.[cite: 1]
4. Ajouter un autre article différent.[cite: 1]
5. Retourner dans le panier.[cite: 1]

**Résultat attendu**[cite: 1] :
* À l'étape 3, le badge du panier disparaît.[cite: 1]
* À l'étape 5, le panier contient uniquement le nouvel article ajouté, prouvant que le cache du navigateur et l'état du panier sont parfaitement synchronisés.[cite: 1]