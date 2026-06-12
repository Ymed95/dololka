# Site de Personnalisation de Produits - CustomPro

Site e-commerce complet permettant aux clients de personnaliser des produits (t-shirts, pulls, casquettes, tasses, etc.) directement en ligne avec un outil de design interactif.

## 🎨 Fonctionnalités Principales

### Pour les Clients
- **Catalogue de produits** - Parcourir et sélectionner des produits personnalisables
- **Outil de personnalisation interactif** - Interface canvas avec drag & drop
  - Upload de logo/design
  - Positionnement précis (avant/arrière, gauche/centre/droite)
  - Redimensionnement et rotation
  - Prévisualisation en temps réel
- **Panier et paiement** - Processus de commande simplifié
- **Espace client** - Historique des commandes et suivi de statut
- **Messagerie intégrée** - Communication directe avec le créateur

### Pour les Administrateurs
- **Tableau de bord** - Statistiques et aperçu des commandes
- **Gestion des commandes** - Visualisation complète des personnalisations
  - Téléchargement des fichiers clients
  - Détails exacts de positionnement et dimensions
  - Mise à jour des statuts
- **Gestion des produits** - Ajout, modification et suppression de produits
- **Messagerie** - Réponse aux clients

## 🛠️ Technologies Utilisées

- **Framework**: Next.js 14+ (React 18)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: SQLite avec Prisma ORM
- **Canvas**: React Konva (pour l'éditeur de personnalisation)
- **État**: Zustand
- **Authentification**: NextAuth.js (structure prête)

## 📦 Installation

> **Note**: Vous devez avoir Node.js installé sur votre machine

1. **Installer les dépendances**
   \`\`\`bash
   cd product-customizer
   npm install
   \`\`\`

2. **Initialiser la base de données**
   \`\`\`bash
   npx prisma db push
   \`\`\`

3. **Lancer le serveur de développement**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Ouvrir dans le navigateur**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 📁 Structure du Projet

\`\`\`
product-customizer/
├── app/                      # Routes Next.js
│   ├── page.tsx              # Page d'accueil
│   ├── product/[id]/         # Détail produit
│   ├── customize/[id]/       # Outil de personnalisation
│   ├── cart/                 # Panier
│   ├── client/               # Espace client
│   │   ├── dashboard/
│   │   ├── orders/
│   │   └── messages/
│   └── admin/                # Espace administrateur
│       ├── dashboard/
│       ├── products/
│       └── orders/
├── components/               # Composants React
│   ├── ui/                   # Composants UI de base
│   ├── customizer/           # Éditeur de personnalisation
│   └── Navbar.tsx
├── prisma/                   # Configuration base de données
│   └── schema.prisma
└── public/                   # Assets statiques
\`\`\`

## 🎯 Flux Utilisateur

1. **Client** visite le site et parcourt le catalogue
2. **Sélection** d'un produit et clic sur "Personnaliser"
3. **Upload** d'un logo/design dans l'éditeur interactif
4. **Positionnement** et ajustement du design sur le produit
5. **Ajout au panier** et passage de commande
6. **Paiement** (système simulé pour la démo)
7. **Créateur** reçoit la commande avec tous les détails dans l'espace admin
8. **Production** et mise à jour du statut
9. **Communication** via messagerie si nécessaire

## 💡 Fonctionnalités Avancées à Ajouter

- Authentification réelle avec NextAuth.js
- Intégration Stripe pour paiements réels
- Stockage cloud (AWS S3, Cloudinary) pour les fichiers
- Notifications par email
- Migration vers PostgreSQL/Supabase pour production
- Panel de couleurs pour personnalisation
- Prévisualisation 3D plus réaliste
- Export en haute résolution pour production

## 📝 Base de Données

Le schéma Prisma inclut:
- **User** - Utilisateurs (clients et admin)
- **Product** - Produits disponibles
- **Order** - Commandes avec détails de personnalisation
- **Message** - Messages entre clients et créateur

Pour visualiser la base de données:
\`\`\`bash
npx prisma studio
\`\`\`

## 🎨 Design System

Le site utilise un design system moderne avec:
- Palette de couleurs primaires et secondaires
- Typographie premium (Inter)
- Gradients et effets glass
- Animations fluides
- Components réutilisables (Button, Card, Badge, Input)

## 🚀 Déploiement

Pour déployer en production:

1. Build l'application
   \`\`\`bash
   npm run build
   \`\`\`

2. Déployer sur Vercel (recommandé pour Next.js)
   \`\`\`bash
   npx vercel deploy
   \`\`\`

## 📞 Support

Pour toute question ou problème, consultez la documentation Next.js et Prisma, ou contactez l'équipe de développement.

## 📄 Licence

Projet privé - Tous droits réservés
\`\`\
 
