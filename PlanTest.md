## Plans de test 
### Objectif :

Ce document définit la stratégie global de test pour l'application e-commerce Sauce Demo, lobjectif principale est de garantir la qualité et fiabilité de tunnel d'achat critique, depuis l'authentification de l'utilisateur jusqu'à la validation finale de la commande.

### Périmetre (in scope):

Les testes se concentreront exclusivement sur les fonctionnalités liées au parcours utilisateur principal (Front-End):

- Authentification: connexion avec des identifiants valides et gestiosn des erreurs ( identifiants invanlide et champs vides)
- Catalogues de produits : 
- Gestion du panier : 
- Processus de commande (Checkout) : 

### Hors Perimétre (out of scope):
Tests de Performance : L'évaluation des temps de réponse sous charge, les tests de volume et les tests de stress ne sont pas couverts par cette campagne.

Tests de Sécurité : Les tests d'intrusion (Pen-testing) et les audits de vulnérabilités techniques (injections SQL, failles XSS) ne font pas l'objet de ces scénarios.



Environnement de test :
Les campagnes de tests manuels et automatisés seront exécutées dans les conditions suivantes afin de garantir une couverture représentative des usages clients :

URL cible : [https://www.saucedemo.com/](https://www.saucedemo.com/)

Navigateurs Desktop (ordinateur) :

Google Chrome (dernière version stable)

Mozilla Firefox (dernière version stable)

Résolutions et Écrans :

Desktop standard (1920 x 1080)

Simulation Mobile via les DevTools (résolution type iPhone 12 / Samsung Galaxy S20) pour vérifier le Responsive Design du tunnel d'achat.

Données de test : Utilisation des profils utilisateurs fournis par la plateforme (notamment standard_user, problem_user, et locked_out_user pour les tests d'erreurs).


Critères de sortie (ou critères d'arrêt) :
La campagne de test pour la version en cours sera considérée comme terminée et prête pour la signature du PV de recette lorsque l'ensemble des conditions suivantes sera réuni :

Couverture : 100 % des cas de test définis dans le périmètre (in scope) ont été exécutés.

Taux de réussite : Au moins 95 % des tests exécutés ont un statut "Succès" (Pass).

Zéro défaut critique : Aucune anomalie de criticité Bloquante (empêchant l'achat) ou Majeure (défaut fonctionnel grave sans contournement) n'est ouverte ou en cours de traitement.

Gestion des défauts mineurs : Les anomalies mineures ou cosmétiques restantes ont été documentées, évaluées et acceptées par le Product Owner (ou le client) pour une correction ultérieure.

Livrable : Le rapport de synthèse des tests a été rédigé et diffusé à l'équipe.


Conception des scenarios de tests : 

1- Vérifier la conenxion 
2- 

# 1. La conception des Cas de Test (Test Cases)



[Lien vers la matrice de test au format Excel](https://docs.google.com/spreadsheets/d/1W6WhLs4ufIbWq1_aalT3GKSkdgRJB_MZiNk4oGKyKr8/edit?gid=0#gid=0)