#  Application de gestion de bibliothèque

Application web de gestion d'une bibliothèque de quartier développée dans le cadre du projet pratique **Akieni Academy – Cohorte 2**.

L'application permet au personnel de la bibliothèque de gérer les auteurs, les adhérents, les livres et les emprunts depuis une interface web.


##  Objectif du projet

L'objectif est de mettre en place une application permettant de centraliser la gestion des ressources de la bibliothèque et de suivre les emprunts et les retours de livres.

L'application comprend notamment :

* la gestion des auteurs ;
* la gestion des adhérents ;
* la gestion des livres ;
* la gestion des emprunts ;
* le suivi des retours ;
* la consultation de l'historique des emprunts ;
* le suivi des emprunts en retard ;
* un tableau de bord avec des statistiques.

##  Fonctionnalités

###  Auteurs

* Afficher la liste des auteurs
* Ajouter un auteur
* Modifier un auteur
* Supprimer un auteur
* Consulter les informations d'un auteur

###  Adhérents

* Afficher la liste des adhérents
* Ajouter un adhérent
* Modifier un adhérent
* Supprimer un adhérent
* Consulter l'historique des emprunts d'un adhérent

###  Livres

* Afficher la liste des livres
* Ajouter un livre
* Modifier un livre
* Supprimer un livre
* Associer un livre à un auteur
* Rechercher un livre par titre ou par auteur
* Utiliser la pagination
* Voir le statut du livre :

  * Disponible
  * Emprunté

###  Emprunts

* Créer un emprunt
* Choisir un adhérent
* Choisir un livre disponible
* Définir une date de retour prévue
* Empêcher l'emprunt d'un livre déjà emprunté
* Enregistrer automatiquement le changement de statut du livre
* Enregistrer le retour d'un livre
* Remettre automatiquement le livre à l'état disponible
* Identifier les emprunts en retard
* Consulter l'historique des emprunts

###  Tableau de bord

Le tableau de bord présente notamment :

* le nombre total de livres ;
* le nombre total d'adhérents ;
* le nombre d'emprunts en cours ;
* le nombre d'emprunts en retard ;
* le livre le plus emprunté ;
* l'adhérent le plus actif.


##  Technologies utilisées

### Backend

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **node-postgres (pg)**
* **dotenv**

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript**
* **Fetch API**
* **Flaticon UIcons**


##  Structure du projet


bibiotheque/
│
├── controllers/
│   ├── adherents.controller.js
│   ├── auteurs.controller.js
│   ├── dashboard.controller.js
│   ├── emprunts.controller.js
│   └── livres.controller.js
│
├── middlewares/
│   ├── error.middleware.js
│   ├── logger.middleware.js
│   └── validation.middleware.js
│
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── routes/
│   ├── adherents.routes.js
│   ├── auteurs.routes.js
│   ├── dashboard.routes.js
│   ├── emprunts.routes.js
│   └── livres.routes.js
│
├── .env
├── .gitignore
├── db.js
├── diagramme.png
├── package.json
├── package-lock.json
├── schema.sql
└── server.js


> Le dossier `node_modules/` est généré automatiquement lors de l'installation des dépendances et n'est pas versionné dans Git.


##  Base de données

Le projet utilise **PostgreSQL**.

La base de données contient quatre tables principales :

### `auteurs`

Stocke les informations sur les auteurs.

* `id`
* `nom`
* `nationalite`

### `adherents`

Stocke les informations sur les adhérents.

* `id`
* `nom`
* `contact`

### `livres`

Stocke les informations sur les livres.

* `id`
* `titre`
* `auteur_id`
* `annee_publication`
* `statut`

### `emprunts`

Stocke les informations relatives aux emprunts.

* `id`
* `adherent_id`
* `livre_id`
* `date_emprunt`
* `date_retour_prevue`
* `date_retour`

Le fichier `schema.sql` contient la structure de la base de données ainsi que les données initiales utilisées pour le développement.



##  Principales relations


AUTEURS
   │
   │ 1
   │
   └─────────── N LIVRES
                    │
                    │
                    │ 1
                    │
                    N
                EMPRUNTS
                    │
                    │ N
                    │
                    1
               ADHERENTS


* Un auteur peut avoir plusieurs livres.
* Un livre est associé à un auteur.
* Un adhérent peut avoir plusieurs emprunts.
* Un emprunt concerne un seul adhérent et un seul livre.
* Un livre peut avoir plusieurs emprunts au cours de son historique.



##  Installation

### 1. Cloner le projet


git clone <URL_DU_REPOSITORY>

Puis entrer dans le dossier :


cd bibiotheque


### 2. Installer les dépendances


npm install


### 3. Configurer PostgreSQL

Créer une base de données nommée :


bibliotheque

Puis exécuter le fichier :


schema.sql


dans PostgreSQL afin de créer les tables nécessaires.

### 4. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :


DB_USER=postgres
DB_HOST=localhost
DB_NAME=bibliotheque
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432



## ▶️ Lancer l'application

Installer les dépendances :


npm install


Puis démarrer le serveur :


npm start


Le serveur démarre normalement sur :

http://localhost:3000
L'interface de l'application est accessible depuis cette adresse.



##  API

### Auteurs


GET    /api/auteurs
GET    /api/auteurs/:id
POST   /api/auteurs
PUT    /api/auteurs/:id
DELETE /api/auteurs/:id


### Adhérents


GET    /api/adherents
GET    /api/adherents/:id
GET    /api/adherents/:id/emprunts
POST   /api/adherents
PUT    /api/adherents/:id
DELETE /api/adherents/:id


### Livres

GET    /api/livres
GET    /api/livres/:id
POST   /api/livres
PUT    /api/livres/:id
DELETE /api/livres/:id


La liste des livres accepte également la recherche et la pagination.

Exemple :


/api/livres?recherche=1984&page=1&limit=5


### Emprunts

GET    /api/emprunts
GET    /api/emprunts/:id
GET    /api/emprunts/retard
POST   /api/emprunts
PUT    /api/emprunts/:id/retour


### Dashboard


GET    /api/dashboard

##  Middlewares

L'application utilise plusieurs middlewares :

### Logger

Enregistre les requêtes reçues par le serveur avec :

* la date ;
* la méthode HTTP ;
* l'URL demandée.

### Validation

Vérifie la présence des champs obligatoires avant certaines opérations.

### Gestion des erreurs

Centralise la gestion des erreurs internes du serveur.



##  Tests réalisés

Les principales fonctionnalités ont été testées :

* [x] CRUD auteurs
* [x] CRUD adhérents
* [x] Historique des emprunts
* [x] CRUD livres
* [x] Recherche de livres
* [x] Pagination
* [x] Création d'un emprunt
* [x] Blocage d'un livre déjà emprunté
* [x] Retour d'un livre
* [x] Mise à jour automatique du statut du livre
* [x] Détection des emprunts en retard
* [x] Dashboard
* [x] Statistiques
* [x] Compteur des emprunts



##  Interface

L'application possède une interface permettant de naviguer entre :

* Tableau de bord
* Livres
* Auteurs
* Adhérents
* Emprunts
* Paramètres

Le tableau de bord constitue la page d'accueil de l'application.



## Projet pédagogique

Ce projet a été réalisé dans le cadre de la formation **Akieni Academy – Cohorte 2**, dans le but de mettre en pratique :

* Node.js ;
* Express.js ;
* PostgreSQL ;
* les API REST ;
* les opérations CRUD ;
* les relations entre tables ;
* les middlewares ;
* la communication frontend/backend ;
* la gestion des données avec JavaScript.



##  Auteur

Projet réalisé par Dreche NDONGALA dans le cadre de la formation  Akieni Academy – Cohorte 2.
