# DOLOLKA AGENCY - Rapport de Livraison & Devis

---

## Informations Projet

| | |
|---|---|
| **Client** | Dololka Agency |
| **Projet** | Plateforme e-commerce de personnalisation de produits |
| **Type** | Application web sur mesure (Full-Stack) |
| **Technologies** | Next.js 14, React, TypeScript, PostgreSQL, Stripe |
| **URL Production** | https://dololka.vercel.app |
| **Hébergement** | Vercel (serveur) + Neon (base de données) |

---

## 1. Fonctionnalités Livrées

### 1.1 Catalogue Produits
- Affichage dynamique de 9 catégories de produits (T-shirts, Hoodies, Sweatshirts, Casquettes, Mugs, Tote Bags, Gilets sans manches, Gilets manches longues, Voitures)
- Fiches produits détaillées avec images haute qualité
- Système de filtrage par catégorie
- Barre de recherche de produits
- Images produits avec fond transparent professionnel (traitement automatisé)

### 1.2 Outil de Personnalisation (Customizer)
- Canvas interactif permettant l'import de designs/logos clients
- Positionnement par glisser-déposer du design sur le produit
- Outils de transformation : rotation, agrandissement, réduction
- Changement de couleur du produit en temps réel (16 couleurs disponibles)
- Prévisualisation multi-vues (Recto/Verso, ou 4 vues pour casquettes/voitures)
- Sauvegarde de la configuration de personnalisation par vue

### 1.3 Système d'Authentification
- Inscription client avec validation de mot de passe (longueur, majuscules, chiffres)
- Connexion sécurisée (JWT + sessions chiffrées)
- Gestion des rôles : Client et Administrateur
- Protection des routes sensibles (middleware)
- Redirection automatique selon le rôle après connexion

### 1.4 Panier & Commande
- Panier persistant (localStorage)
- Processus de commande en 3 étapes : Panier → Livraison → Confirmation
- Formulaire d'adresse de livraison complet
- Sauvegarde de la taille, couleur et quantité dans chaque commande
- Gestion d'erreurs avec messages clairs

### 1.5 Paiement en Ligne (Stripe)
- Intégration complète de Stripe Checkout
- Redirection vers la page de paiement sécurisée Stripe
- Vérification automatique du paiement (double vérification : redirect + webhook)
- Gestion des paiements annulés (retour au panier avec message)
- Suppression automatique des commandes non payées (sessions expirées)
- Support cartes bancaires (Visa, Mastercard, etc.)

### 1.6 Espace Client
- Dashboard personnalisé avec statistiques (commandes, en cours, messages, total dépensé)
- Liste des commandes avec filtrage par statut
- Messagerie intégrée style chat avec l'équipe Dololka
- Réponse rapide et création de nouveaux sujets
- Marquage automatique des messages comme lus

### 1.7 Panel Administrateur
- Dashboard avec KPIs en temps réel (revenus, commandes, produits, messages)
- Gestion complète des commandes (visualisation, changement de statut, détail)
- Téléchargement des designs clients directement depuis le panneau commandes
- Gestion des produits (ajout, modification, suppression)
- Messagerie admin avec vue conversations groupées par client
- Réponse aux messages clients et notifications de messages non-lus

### 1.8 Formulaire de Contact
- Formulaire accessible aux visiteurs inscrits et non-inscrits
- Validation des champs (email, nom, sujet, message)
- Intégration automatique à la messagerie interne pour les clients inscrits
- Stockage des messages visiteurs avec identification claire pour l'admin

### 1.9 Pages Statiques
- Page d'accueil avec hero section, catalogue, avantages et appel à l'action
- Page "À propos" avec mission, valeurs et guide d'utilisation
- Page Contact avec formulaire et informations de contact
- Page FAQ
- Page Livraison
- Page de confirmation de commande

### 1.10 Design & UX
- Design responsive (mobile, tablette, desktop)
- Logo intégré avec fond transparent
- Footer professionnel avec liens et informations de contact
- Navigation intuitive avec menu utilisateur contextuel
- Animations et transitions fluides
- Branding cohérent "Dololka Agency" sur l'ensemble du site

---

## 2. Infrastructure Technique

| Composant | Technologie | Description |
|---|---|---|
| Frontend | Next.js 14 + React 18 | Framework moderne avec rendu serveur |
| Langage | TypeScript | Typage strict pour la fiabilité |
| Styles | Tailwind CSS | Design system responsive |
| Canvas | Konva.js / React-Konva | Outil de personnalisation interactif |
| Authentification | NextAuth.js | JWT + sessions sécurisées |
| Base de données | PostgreSQL (Neon) | Base relationnelle en cloud |
| ORM | Prisma | Gestion de la base de données |
| Paiement | Stripe | Paiement sécurisé en ligne |
| Hébergement | Vercel | Déploiement automatique, CDN mondial |
| Repository | GitHub (privé) | Versioning du code source |

---

## 3. Décomposition du Prix

| Poste | Description | Montant |
|---|---|---|
| Développement Frontend | Pages, composants, responsive design, animations | 800 € |
| Outil de Personnalisation | Canvas interactif, drag & drop, couleurs, multi-vues | 700 € |
| Système d'Authentification | Inscription, connexion, rôles, sécurité | 300 € |
| Panel Administrateur | Dashboard, commandes, produits, messagerie | 500 € |
| Espace Client | Dashboard, commandes, messagerie | 300 € |
| Intégration Stripe | Paiement, webhooks, vérification, gestion erreurs | 400 € |
| Base de données & API | Modèles, routes API, validation, sécurité | 300 € |
| Déploiement & Mise en production | Vercel, Neon, configuration, DNS | 200 € |
| **TOTAL** | | **3 500 €** |

---

## 4. Livrables

- Code source complet sur repository GitHub privé
- Site déployé et fonctionnel en production
- Base de données PostgreSQL configurée et peuplée
- Intégration Stripe opérationnelle (mode test, prêt pour le mode live)
- Comptes administrateur et client de démonstration
- Documentation des variables d'environnement (.env.local.example)

---

## 5. Identifiants de Démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@custompro.com | password123 |
| Client | client@example.com | password123 |

*Il est recommandé de changer ces mots de passe en production.*

---

## 6. Maintenance & Évolutions Futures (optionnel)

Les évolutions suivantes peuvent être envisagées ultérieurement :

- Envoi d'emails automatiques (confirmation commande, suivi)
- Notifications push
- Tableau de bord analytics avancé
- Système de promotions / codes promo
- Export des commandes (CSV/PDF)
- Optimisation SEO avancée
- Mode sombre

---

*Document généré le 17/02/2026*
*Projet réalisé par Ymed95*
