# DOLOLKA AGENCY — Document de Livraison Final

---

## Informations Projet

| | |
|---|---|
| **Client** | Dololka Agency |
| **Projet** | Site web agence de communication 360° + E-commerce de personnalisation |
| **Type** | Application web sur mesure (Full-Stack) |
| **Technologies** | Next.js 14, React, TypeScript, PostgreSQL, Stripe |
| **URL Production** | https://dololka.vercel.app |
| **Hébergement** | Vercel (serveur) + Neon (base de données PostgreSQL) |
| **Repository** | GitHub privé — github.com/Ymed95/dololka |
| **Date de livraison** | 18 février 2026 |

---

## PARTIE 1 — SITE VITRINE AGENCE 360°

### 1.1 Page d'Accueil
- Hero section premium avec identité agence 360°
- Barre de statistiques (projets réalisés, clients satisfaits, services, accompagnement)
- Section 6 services principaux avec liens vers les pages détaillées
- Section Boutique avec les 3 catégories (Personnalisation, Textile Vierge, Matériel)
- Aperçu rapide des produits (6 derniers)
- Section "Pourquoi choisir Dololka Agency" avec arguments clés
- Section témoignages clients
- Appel à l'action (devis gratuit + boutique)

### 1.2 Page L'Agence (/agence)
- Présentation de l'agence avec mission et vision
- 4 valeurs clés : Engagement, Créativité, Passion, Excellence
- Méthode de travail en 4 étapes (Écoute, Stratégie, Création, Livraison)
- Liste complète des services proposés
- Statistiques et lien vers le portfolio
- Appel à l'action

### 1.3 Page Services (/services)
Page principale listant les **12 services** avec icônes, descriptions, tags et liens :

| # | Service | Page dédiée |
|---|---|---|
| 1 | Création de site internet | /services/creation-site |
| 2 | Création digitale & graphisme | /services/graphisme |
| 3 | Gestion des réseaux sociaux | /services/reseaux-sociaux |
| 4 | Publicité & acquisition | /services/publicite |
| 5 | Branding & positionnement | /services/branding |
| 6 | Enseignes sur mesure | /services/enseignes |
| 7 | Photo & vidéo | /services/photo-video |
| 8 | Accompagnement marque textile | /services/textile |
| 9 | Conseil & stratégie | /services/conseil |
| 10 | E-commerce & business en ligne | /services/ecommerce |
| 11 | Production & fabrication textile | /services/production-textile |
| 12 | Community building & influence | /services/community |

Chaque sous-page contient :
- Description détaillée du service
- Liste de ce qui est inclus
- Processus en 4 étapes
- Tarifs indicatifs
- FAQ spécifique au service
- Appel à l'action (demande de devis)

### 1.4 Page Portfolio (/portfolio)
- Galerie de projets filtrable par catégorie (Branding, Web, Réseaux, Textile, Design, Pub, Photo)
- **100% dynamique** : les projets sont gérés depuis le panel admin
- Affichage avec gradient coloré, titre, description et tags
- Appel à l'action en bas de page

### 1.5 Page Contact (/contact)
- Formulaire de contact complet (nom, email, sujet, message)
- Accessible aux visiteurs inscrits ET non-inscrits
- Informations de contact (email, téléphone, horaires)
- Intégration automatique à la messagerie interne admin

### 1.6 Navigation
- **Navbar responsive** avec :
  - Logo + nom de l'agence
  - Liens : Accueil, L'Agence, Services (dropdown 12 sous-catégories), Boutique, Portfolio, Contact
  - Panier, compte utilisateur (menu déroulant contextuel)
  - **Menu hamburger mobile** complet
- **Footer professionnel** avec :
  - Description de l'agence
  - Navigation rapide
  - Liens services
  - Contact + liens légaux (FAQ, Livraison, CGV, Confidentialité)

### 1.7 Pages annexes
- Page FAQ (/faq)
- Page Livraison (/delivery)
- Page Confidentialité (/privacy)
- Page CGV (/terms)
- Redirection automatique /about → /agence

---

## PARTIE 2 — BOUTIQUE E-COMMERCE

### 2.1 Boutique (/boutique) — 3 onglets

**Onglet Personnalisation :**
- Tous les produits personnalisables depuis la BDD
- Filtrage par catégorie (T-shirt, Hoodie, Sweatshirt, Casquette, Mug, Gilet, Sac, Coque, Voiture)
- Barre de recherche
- Lien direct vers l'outil de personnalisation

**Onglet Textile Vierge :**
- Produits textiles sans personnalisation
- **100% dynamique** : géré depuis le panel admin
- Affichage avec image, description, tailles, prix
- Bouton "Commander" → page contact

**Onglet Matériel & Fournitures :**
- Presses à chaud, vinyles, encres, papier transfert, kits DTF, plotters
- **100% dynamique** : géré depuis le panel admin
- Bouton "Commander" → page contact

### 2.2 Outil de Personnalisation
- Canvas interactif (Konva.js) pour importer et positionner des designs
- Glisser-déposer, rotation, agrandissement, réduction
- Changement de couleur du produit en temps réel (16 couleurs)
- Prévisualisation multi-vues (Recto/Verso, ou 4 vues pour casquettes/voitures)
- Sauvegarde de la configuration par vue

### 2.3 Panier & Commande
- Panier persistant (localStorage)
- Processus : Panier → Adresse livraison → Paiement Stripe
- Taille, couleur, quantité sauvegardées dans la commande
- Notes personnalisées visibles par l'admin

### 2.4 Paiement Stripe
- Redirection vers Stripe Checkout sécurisé
- Double vérification du paiement (redirect + webhook)
- Gestion des annulations et sessions expirées
- Support cartes bancaires (Visa, Mastercard, etc.)
- Prêt pour le mode live (il suffit de remplacer les clés test)

---

## PARTIE 3 — ESPACE CLIENT

### 3.1 Dashboard Client
- Statistiques personnelles (commandes, en cours, messages, total dépensé)
- Accès rapide aux commandes et messages

### 3.2 Mes Commandes
- Liste complète avec filtrage par statut
- Suivi en temps réel (En attente de paiement, En attente, En production, Expédié, Terminé)

### 3.3 Messagerie Client
- Interface chat avec l'équipe Dololka
- Réponse rapide et création de nouveaux sujets
- Marquage automatique des messages comme lus

---

## PARTIE 4 — PANEL ADMINISTRATEUR

### 4.1 Dashboard Admin
- KPIs en temps réel : commandes, en attente, chiffre d'affaires, clients, messages non lus
- 10 dernières commandes
- Accès rapide à toutes les sections admin

### 4.2 Gestion des Produits (3 onglets)
| Onglet | Ce que l'admin peut faire |
|---|---|
| **Personnalisation** | Ajouter/modifier/supprimer des produits personnalisables |
| **Textile Vierge** | Ajouter/modifier/supprimer des produits textile |
| **Matériel & Fournitures** | Ajouter/modifier/supprimer du matériel |

Pour chaque produit : nom, description, prix, catégorie, tailles disponibles, image, mockup (verso).

### 4.3 Gestion des Commandes
- Vue complète de toutes les commandes
- Filtrage par statut
- Changement de statut en un clic
- Détail complet : infos client, produit, design, position, coordonnées, notes
- **Téléchargement des designs clients** directement depuis le panel

### 4.4 Messagerie Admin
- Conversations groupées par client
- Indicateur de messages non lus
- Réponse directe aux clients

### 4.5 Gestion du Portfolio *(NOUVEAU)*
- Ajouter/modifier/supprimer des projets
- Champs : titre, description, catégorie, tags, couleur de fond, image
- Les projets apparaissent automatiquement sur la page publique /portfolio

### 4.6 Gestion des Utilisateurs *(NOUVEAU)*
- Liste de tous les utilisateurs inscrits
- Infos : nom, email, rôle, date d'inscription
- Statistiques par utilisateur : nombre de commandes, nombre de messages

---

## PARTIE 5 — TECHNIQUE

### 5.1 Stack Technologique

| Composant | Technologie | Rôle |
|---|---|---|
| Frontend | Next.js 14 + React 18 | Framework avec rendu serveur |
| Langage | TypeScript | Typage strict, fiabilité |
| Styles | Tailwind CSS | Design system responsive |
| Canvas | Konva.js / React-Konva | Outil de personnalisation |
| Auth | NextAuth.js | JWT + sessions sécurisées |
| Base de données | PostgreSQL (Neon) | Cloud, haute disponibilité |
| ORM | Prisma | Gestion de la BDD |
| Paiement | Stripe | Checkout sécurisé |
| Hébergement | Vercel | CDN mondial, déploiement auto |
| État | Zustand | Gestion du panier |
| Images | Sharp | Traitement d'images (fond transparent) |

### 5.2 Modèles de données

| Modèle | Description |
|---|---|
| **User** | Utilisateurs (clients + admins), auth, rôles |
| **Product** | Produits avec type (customizable / textile / materiel), catégorie, tailles |
| **Order** | Commandes avec données de personnalisation, statut, notes |
| **Message** | Messagerie interne entre clients et admin |
| **Portfolio** | Projets du portfolio (titre, description, catégorie, tags, couleur) |

### 5.3 API Routes (14 endpoints)

| Route | Méthodes | Description |
|---|---|---|
| /api/auth/[...nextauth] | GET, POST | Authentification |
| /api/products | GET, POST | Liste et création de produits |
| /api/products/[id] | GET, PUT, DELETE | Détail, modification, suppression |
| /api/orders | GET, POST | Liste et création de commandes |
| /api/orders/[id] | GET, PUT | Détail et mise à jour de commande |
| /api/messages | GET, POST | Messagerie |
| /api/messages/[id]/read | PUT | Marquer comme lu |
| /api/contact | POST | Formulaire de contact |
| /api/portfolio | GET, POST, PUT, DELETE | Gestion du portfolio |
| /api/users | GET | Liste des utilisateurs (admin) |
| /api/checkout/session | POST | Création session Stripe |
| /api/checkout/verify | GET | Vérification paiement |
| /api/webhooks/stripe | POST | Webhook Stripe |

### 5.4 Sécurité
- Authentification JWT avec sessions chiffrées
- Validation de mot de passe (longueur, majuscules, chiffres)
- Routes admin protégées (vérification rôle côté serveur)
- Webhook Stripe avec vérification de signature
- HTTPS en production (Vercel)

---

## PARTIE 6 — RESPONSIVE & MOBILE

- Menu hamburger mobile sur toutes les pages
- Grilles adaptatives (1 → 2 → 3 → 4 colonnes selon la taille d'écran)
- Tailles de texte ajustées pour mobile
- Boutons CTA pleine largeur sur mobile
- Onglets scrollables horizontalement
- Navigation sticky optimisée

---

## PARTIE 7 — DÉCOMPOSITION DU PRIX

### Phase 1 — Site e-commerce initial

| Poste | Montant |
|---|---|
| Développement Frontend (pages, composants, responsive) | 800 € |
| Outil de Personnalisation (canvas, drag & drop, couleurs) | 700 € |
| Authentification (inscription, connexion, rôles) | 300 € |
| Panel Administrateur (dashboard, commandes, produits, messages) | 500 € |
| Espace Client (dashboard, commandes, messagerie) | 300 € |
| Intégration Stripe (paiement, webhooks, vérification) | 400 € |
| Base de données & API (modèles, routes, validation) | 300 € |
| Déploiement (Vercel, Neon, DNS) | 200 € |
| **Sous-total Phase 1** | **3 500 €** |

### Phase 2 — Refonte Agence 360° & Autonomie Admin

| Poste | Montant |
|---|---|
| Refonte page d'accueil (agence 360°, hero, sections) | 200 € |
| Page L'Agence (mission, vision, valeurs, méthode) | 150 € |
| Page Services + 12 sous-pages détaillées | 400 € |
| Page Portfolio dynamique | 150 € |
| Page Boutique restructurée (3 onglets, dynamique) | 250 € |
| Navbar refaite (dropdown, mobile, responsive) | 100 € |
| Footer mis à jour | 50 € |
| Panel Admin : produits par type (3 onglets) | 200 € |
| Panel Admin : gestion portfolio CRUD | 150 € |
| Panel Admin : gestion utilisateurs | 100 € |
| Mise à jour BDD (types produits, modèle Portfolio) | 100 € |
| API nouvelles (portfolio, users, products type) | 150 € |
| **Sous-total Phase 2** | **2 000 € |

### Total

| | |
|---|---|
| **TOTAL PROJET** | **5 500 €** |

---

## PARTIE 8 — LIVRABLES

- Code source complet sur repository GitHub privé
- Site déployé et fonctionnel en production sur Vercel
- Base de données PostgreSQL configurée sur Neon
- Intégration Stripe opérationnelle (prêt pour le mode live)
- Panel administrateur complet et autonome
- Ce document de livraison

---

## PARTIE 9 — IDENTIFIANTS

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | admin@custompro.com | password123 |

⚠️ **Il est fortement recommandé de changer le mot de passe admin en production.**

---

## PARTIE 10 — GUIDE RAPIDE ADMIN

### Comment ajouter un produit :
1. Se connecter en tant qu'admin
2. Aller dans le menu → Gestion Produits
3. Choisir l'onglet (Personnalisation / Textile Vierge / Matériel)
4. Cliquer sur "Ajouter un produit"
5. Remplir les champs et valider

### Comment ajouter un projet au portfolio :
1. Se connecter en tant qu'admin
2. Aller dans le menu → Portfolio
3. Cliquer sur "Ajouter un projet"
4. Remplir titre, description, catégorie, tags et couleur
5. Le projet apparaît automatiquement sur la page publique

### Comment gérer une commande :
1. Se connecter en tant qu'admin
2. Aller dans le menu → Gestion Commandes
3. Changer le statut avec le menu déroulant
4. Cliquer sur "Détails" pour voir les infos complètes et télécharger le design

### Comment répondre à un message :
1. Se connecter en tant qu'admin
2. Aller dans le menu → Messages
3. Cliquer sur la conversation
4. Taper la réponse et envoyer

---

## PARTIE 11 — POUR PASSER EN PRODUCTION STRIPE

1. Activer le compte Stripe (vérification d'identité sur stripe.com)
2. Récupérer les clés **live** (pk_live_... et sk_live_...)
3. Dans Vercel → Settings → Environment Variables :
   - Remplacer `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` par la clé publique live
   - Remplacer `STRIPE_SECRET_KEY` par la clé secrète live
4. Configurer le webhook live dans Stripe Dashboard → Developers → Webhooks
5. Mettre à jour `STRIPE_WEBHOOK_SECRET` avec le nouveau secret

---

## PARTIE 12 — ÉVOLUTIONS FUTURES (optionnel)

- Envoi d'emails automatiques (confirmation commande, suivi)
- Notifications push
- Système de codes promo
- Export des commandes (CSV/PDF)
- Blog / actualités
- Mode sombre
- Analytics avancé
- Multi-langue

---

*Document de livraison généré le 18/02/2026*
*Projet réalisé par Ymed95*
