# Dololka Agency

Site de l'agence de communication 360° **Dololka Agency**, incluant une
boutique en ligne avec personnalisation de produits (t-shirts, hoodies,
casquettes, mugs…) : éditeur 2D, aperçu 3D interactif, paiement Stripe et
espace d'administration complet.

## ✨ Fonctionnalités

### Site vitrine
- Pages agence, services, portfolio, contact, FAQ, livraison, CGV, confidentialité
- **Services gérés depuis l'admin** : ajout, modification, suppression,
  réordonnancement, masquage (contenu complet : description, prestations,
  étapes, tarifs, FAQ)
- **Statistiques d'accueil éditables** depuis l'admin

### Boutique & personnalisation
- Catalogue avec filtres par catégorie
- **Éditeur 2D (Konva)** : upload du design, déplacement, redimensionnement,
  rotation, couleur du produit, recto/verso
- **Aperçu 3D 360° (React Three Fiber)** : modèle GLB, rotation libre,
  et **édition directe** — glisser le design sur le produit met à jour la
  position 2D automatiquement
- **Choix des faces à imprimer** : seules les faces sélectionnées partent
  en production
- Sélecteur de quantité, panier persistant (conservé si le paiement échoue)
- Paiement **Stripe Checkout** + webhooks

### Espace client
- Historique et suivi des commandes
- Messagerie avec l'agence

### Espace administrateur
- Tableau de bord et gestion des commandes
- **Aperçu de la personnalisation** (produit + couleur + design positionné)
  et **téléchargement du design d'origine** pour la production
- Position, taille et rotation détaillées **pour chaque face imprimée**
- Gestion des produits, services, portfolio, utilisateurs
- Messagerie (réponse interne aux clients, réponse par email aux visiteurs)

## 🛠️ Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Next.js 14 (App Router), React 18 |
| Langage | TypeScript |
| Styling | Tailwind CSS |
| Base de données | **PostgreSQL (Neon)** via Prisma ORM |
| Éditeur 2D | React Konva |
| 3D | Three.js + React Three Fiber + drei |
| Animations | Framer Motion |
| État | Zustand (panier persistant) |
| Authentification | NextAuth.js (JWT, rôles client/admin) |
| Paiement | Stripe Checkout + webhooks |
| Stockage fichiers | Vercel Blob (avec repli disque local) |
| Hébergement | Vercel |

## 📦 Installation

> Prérequis : Node.js 18+ et une base PostgreSQL accessible.

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'environnement**
   ```bash
   cp .env.local.example .env.local
   ```
   Puis renseigner les variables (voir section ci-dessous).

3. **Créer le schéma en base**
   ```bash
   npm run db:push
   ```

4. **(Optionnel) Peupler la base**
   ```bash
   npm run db:seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   → http://localhost:3000

## 🔐 Variables d'environnement

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion PostgreSQL (Neon) |
| `NEXTAUTH_SECRET` | Clé de signature des sessions |
| `NEXTAUTH_URL` | URL publique du site |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Signature des webhooks Stripe |
| `BLOB_READ_WRITE_TOKEN` | Stockage persistant des designs (Vercel Blob) |

> ⚠️ `BLOB_READ_WRITE_TOKEN` est **indispensable en production** : le système de
> fichiers de Vercel est éphémère. Voir `docs/MODELES_3D_ET_STOCKAGE.md`.

## 📜 Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Génère le client Prisma, synchronise le schéma, build Next.js |
| `npm run start` | Serveur de production |
| `npm run lint` | Analyse du code |
| `npm run db:push` | Applique le schéma Prisma à la base |
| `npm run db:studio` | Interface visuelle de la base |
| `npm run db:seed` | Données de démonstration |
| `node scripts/generate-models.mjs` | Régénère les modèles 3D (GLB) |

## 📁 Structure

```
app/
├── page.tsx                # Accueil
├── agence/ services/       # Site vitrine (services dynamiques : /services/[slug])
├── boutique/ product/[id]/ # Catalogue et fiche produit
├── customize/[id]/         # Éditeur de personnalisation (2D + 3D)
├── cart/ checkout/         # Panier et tunnel de paiement
├── client/                 # Espace client (commandes, messages)
├── admin/                  # Administration
│   ├── orders/ products/ services/ settings/
│   ├── portfolio/ users/ messages/
└── api/                    # Routes API
    ├── auth/ checkout/ orders/ products/
    ├── services/ stats/ portfolio/ users/
    ├── messages/ contact/ upload/ webhooks/

components/
├── customizer/             # CustomizationCanvas (2D), Product3DViewer (3D)
├── admin/                  # OrderDesignPreview
├── ui/                     # Button, Card, Input, Badge
└── Navbar.tsx, Footer.tsx

lib/
├── production/             # Rendu des visuels et upload des assets
├── stores/                 # Panier et utilisateur (Zustand)
├── types/                  # Types partagés de personnalisation
└── servicesData.ts         # Accès aux services (avec repli)

prisma/schema.prisma        # Modèles de données
public/models/              # Modèles 3D (GLB)
docs/                       # Documentation technique
scripts/                    # Génération des modèles 3D
```

## 🗄️ Modèle de données

| Modèle | Rôle |
|---|---|
| `User` | Clients et administrateurs (champ `role`) |
| `Product` | Produits, avec `model3dUrl` pour l'aperçu 3D |
| `Order` | Commandes : couleur, design, visuel de production, personnalisation complète (JSON) |
| `Message` | Messagerie client ↔ agence, y compris visiteurs sans compte |
| `Service` | Services éditables depuis l'admin |
| `SiteStat` | Statistiques de la page d'accueil |
| `Portfolio` | Réalisations |

## 🎨 Modèles 3D

Les modèles GLB de `public/models/` sont générés par
`scripts/generate-models.mjs` et servent de base stylisée. Ils peuvent être
remplacés par de vrais modèles professionnels sans aucune modification de code
(fichier de même nom, ou champ `model3dUrl` du produit).

👉 Convention requise : le GLB doit contenir un node **`PrintArea`** délimitant
la zone d'impression. Détails dans `docs/MODELES_3D_ET_STOCKAGE.md`.

## 🚀 Déploiement

Le projet est déployé sur **Vercel**, connecté à la branche `main`.

Le script de build exécute `prisma db push` : le schéma de la base est
synchronisé automatiquement à chaque déploiement.

Checklist avant mise en production :
1. Variables d'environnement renseignées (dont `BLOB_READ_WRITE_TOKEN`)
2. Store Vercel Blob créé et connecté au projet
3. Webhook Stripe configuré vers `/api/webhooks/stripe`

## 📚 Documentation

- `docs/MODELES_3D_ET_STOCKAGE.md` — modèles 3D et stockage persistant
- `LIVRABLE_DOLOLKA.md` — document de livraison
- `DEVIS_DOLOLKA.md` — devis

## 📄 Licence

Projet privé — tous droits réservés.
