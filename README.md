# Projet Article Décoration

Ce projet est une application web développée avec Angular 17, permettant la gestion d'articles de décoration. L'application offre une interface moderne et intuitive pour gérer un catalogue d'articles de décoration d'intérieur, avec des fonctionnalités de gestion des catégories et des articles.

## Fonctionnalités Principales

- **Gestion des Articles**
  - Affichage du catalogue d'articles
  - Ajout de nouveaux articles
  - Modification des articles existants
  - Suppression d'articles
  - Gestion des stocks
  - Upload d'images

- **Gestion des Catégories**
  - Affichage des catégories
  - Ajout de nouvelles catégories
  - Modification des catégories
  - Suppression de catégories

- **Interface Utilisateur**
  - Design responsive avec Bootstrap
  - Navigation intuitive
  - Notifications avec SweetAlert2
  - Interface moderne et professionnelle

##  Technologies Utilisées

### Frontend
- **Framework**: Angular 17.3.0
- **UI Framework**: Bootstrap 5.3.6
- **Icons**: 
  - Font Awesome 6.7.2
  - Bootstrap Icons 1.12.1
- **Notifications**: SweetAlert2 11.21.0

### Backend (Développement)
- **API**: JSON Server
- **Base de données**: JSON (db.json)

##  Prérequis

- Node.js (version recommandée: 18.x ou supérieure)
- npm (généralement installé avec Node.js)
- Angular CLI 17.3.11
- Git

##  Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd ProjetArticleDecoration
```

2. Installez les dépendances :
```bash
npm install
```

##  Démarrage

1. Démarrez le serveur JSON (backend de développement) :
```bash
npm run server
```
Le serveur JSON sera accessible à l'adresse `http://localhost:3000`

2. Dans un autre terminal, démarrez l'application Angular :
```bash
npm start
```
L'application sera accessible à l'adresse `http://localhost:4200`

##  Scripts Disponibles

- `npm start` : Démarre le serveur de développement Angular
- `npm run server` : Démarre le serveur JSON
- `npm run build` : Compile l'application pour la production

##  Structure du Projet

```
projet-article-decoration/
├── src/                    # Code source principal
│   ├── app/               # Composants Angular
│   │   ├── accueil/      # Page d'accueil
│   │   ├── article-dashboard/  # Gestion des articles
│   │   ├── category-dashboard/ # Gestion des catégories
│   │   ├── navbar/       # Barre de navigation
│   │   └── shared/       # Composants partagés
│   ├── assets/           # Ressources statiques
│   │   └── images/      # Images des articles
│   └── styles/           # Fichiers de style
├── db.json               # Base de données JSON
├── angular.json          # Configuration Angular
└── package.json          # Dépendances et scripts
```

##  Structure des Données

### Catégories
```json
{
  "id": "string",
  "name": "string"
}
```

### Articles
```json
{
  "id": "string",
  "nomArt": "string",
  "description": "string",
  "categorie": "string",
  "prix": "number",
  "stock": "number",
  "image": "string"
}
```

##  Configuration

### Serveur JSON
Le serveur JSON est configuré dans `json-server.config.js` avec les paramètres suivants :
- Port : 3000
- Routes personnalisées pour les articles et catégories

