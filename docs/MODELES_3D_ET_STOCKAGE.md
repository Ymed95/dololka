# Modèles 3D (GLB) & Stockage persistant

Ce document couvre deux sujets liés à la personnalisation :
1. L'aperçu **3D 360°** réaliste basé sur des modèles GLB.
2. Le **stockage persistant** des assets (designs + rendus de production) via Vercel Blob.

---

## 1. Aperçu 3D 360° (modèles GLB)

### Comment ça marche

- Le configurateur 2D (Konva) reste la **source de vérité** : c'est lui qui produit
  le PNG haute résolution de production. La 3D est un **aperçu réaliste**.
- Le design est projeté sur le mesh via un **Decal** (autocollant), donc **aucun
  dépliage UV spécifique n'est requis** sur le modèle.
- Composant : `components/customizer/Product3DViewer.tsx`.

### Modèles fournis par défaut (scaffold)

Des modèles GLB de placeholder sont générés dans `public/models/` :

| Catégorie produit       | Fichier              |
|-------------------------|----------------------|
| `tshirt`                | `/models/tshirt.glb` |
| `hoodie`, `sweatshirt`  | `/models/hoodie.glb` |
| `cap`                   | `/models/cap.glb`    |
| `mug`                   | `/models/mug.glb`    |

Ils sont volontairement simples. Pour les **régénérer** :

```bash
node scripts/generate-models.mjs
```

### Remplacer par de vrais modèles 3D pro

Deux façons :

**A. Globalement par catégorie** — remplace simplement le fichier dans
`public/models/<categorie>.glb`. Aucune autre modification nécessaire.

**B. Par produit (recommandé)** — renseigne le champ `model3dUrl` du produit
(modèle Prisma `Product`). Il prévaut sur le modèle par défaut de la catégorie.
La valeur peut être un chemin local (`/models/mon-tshirt.glb`) ou une URL Blob/CDN.

### Contrainte clé : la zone d'impression (`PrintArea`)

Pour un placement correct du decal, le GLB **doit contenir un node nommé
`PrintArea`** : un plan (PlaneGeometry) **invisible**, positionné sur la zone
d'impression (poitrine avant), sa normale orientée vers l'extérieur du vêtement.
Le viewer lit sa position, son orientation et ses dimensions pour y projeter le design.

- Si `PrintArea` est absent, le viewer retombe sur un placement centré
  automatique (face avant du bounding box) — fonctionnel mais moins précis.
- Le mesh « corps » ciblé par le decal est détecté automatiquement (plus gros volume).

Le script `scripts/generate-models.mjs` montre comment créer ce node ;
reproduis la même convention dans ton outil 3D (Blender → nommer l'objet `PrintArea`,
matériau transparent/invisible).

### Aspect & couleur

- Le **ratio** du design (largeur/hauteur) est conservé : il est inscrit dans la
  `PrintArea` sans déformation.
- La **couleur du vêtement** sélectionnée teinte les matériaux du mesh en temps réel.

---

## 2. Stockage persistant (Vercel Blob)

### Le problème

Sur Vercel (et tout hébergeur à FS éphémère), écrire dans `public/uploads/` ne
persiste pas entre les requêtes/déploiements. Les `productionFileUrl` seraient perdus.

### La solution

La route `app/api/upload/route.ts` choisit automatiquement le stockage, dans cet ordre :

1. **Vercel Blob** si `BLOB_READ_WRITE_TOKEN` est défini → URL CDN persistante.
2. **FS local** (`public/uploads/`) sinon → pratique en dev / serveur Node persistant.
3. **Fallback dataURL** côté client si tout échoue → ne bloque jamais la commande.

### Mise en place sur Vercel — guide pas à pas

#### 1. Créer le store Blob

1. Ouvre **vercel.com** et connecte-toi.
2. Va dans l'onglet **Storage** (en haut du dashboard, à côté de *Projects*).
   > Selon la version de l'interface, le bouton s'appelle **Create Database**,
   > **Create Store** ou **Connect Store** — c'est le même écran.
3. Choisis **Blob**.
4. Donne-lui un nom (ex. `dololka-assets`) puis **Create**.

#### 2. Connecter le store au projet

1. Une fois le store créé, ouvre-le → onglet **Projects** (ou **Connect Project**).
2. Sélectionne le projet **dololka** → **Connect**.
3. Laisse les trois environnements cochés (Production, Preview, Development).

Vercel ajoute alors **automatiquement** la variable `BLOB_READ_WRITE_TOKEN`
au projet. Tu peux le vérifier dans
*Projet → Settings → Environment Variables* : elle doit apparaître dans la liste.

#### 3. ⚠️ Redéployer (étape indispensable)

Une variable d'environnement **ne s'applique pas aux déploiements déjà en ligne**.
Sans redéploiement, rien ne change.

- *Projet → Deployments* → dernier déploiement → menu `···` → **Redeploy**
- ou pousse n'importe quel commit sur `main`.

#### 4. Vérifier que ça marche

1. Sur le site, personnalise un produit et **ajoute-le au panier**.
2. Ouvre les **outils de développement** du navigateur (`F12`)
   → onglet **Application** → **Local Storage** → ton domaine → clé `cart-storage`.
3. Cherche `designFileUrl` :

| Valeur observée | Signification |
|---|---|
| `https://….public.blob.vercel-storage.com/uploads/design-….png` | ✅ Blob actif, tout est bon |
| `/uploads/design-….png` | ⚠️ écriture disque locale — ne persistera pas sur Vercel |
| `data:image/png;base64,…` | ❌ aucun stockage : le token manque ou l'upload échoue |

Autre contrôle : dans le store Blob sur Vercel, l'onglet **Browser** doit
lister les fichiers déposés sous `uploads/`.

#### 5. En local (optionnel)

Pour tester le Blob depuis ta machine, copie le token dans `.env.local` :

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXX
```

Tu le trouves dans *Settings → Environment Variables* (bouton « afficher »),
ou via la CLI : `vercel env pull .env.local`.

Sans ce token en local, l'app écrit simplement dans `public/uploads/` :
c'est le comportement voulu en développement.

### Bon à savoir

- Le paquet `@vercel/blob` n'est importé **que si** le token existe (import
  dynamique) : aucun impact quand il est absent.
- Les fichiers sont publics (`access: 'public'`) — nécessaire pour que le
  navigateur et l'atelier puissent les afficher/télécharger. Les noms
  contiennent un UUID aléatoire, donc non devinables.
- Aucune migration des anciennes commandes n'est nécessaire : les URLs déjà
  enregistrées en base restent valides.
- Le plan Hobby inclut un quota gratuit de stockage et de bande passante
  (vérifie les limites en vigueur sur la page tarifs de Vercel). Les fichiers
  ici sont légers : le design du client et un aperçu plafonné à 1600 px.

### Si ça ne marche pas

| Symptôme | Cause probable | Correctif |
|---|---|---|
| `designFileUrl` reste en `data:` | Token absent ou pas de redéploiement | Refaire l'étape 3 |
| Erreur 500 sur `/api/upload` | Token invalide/expiré | Reconnecter le store au projet |
| « Fichier trop volumineux » | Design > 15 Mo | Demander une image plus légère au client |
| Le token existe mais rien ne s'envoie | Variable ajoutée au mauvais environnement | Vérifier qu'elle est cochée pour *Production* |

---

## Récapitulatif des champs DB

| Modèle    | Champ               | Rôle                                            |
|-----------|---------------------|-------------------------------------------------|
| `Product` | `model3dUrl`        | GLB spécifique au produit (sinon défaut catégorie) |
| `Order`   | `baseColor`         | Couleur du vêtement commandé                    |
| `Order`   | `productionFileUrl` | Rendu HD de la vue principale                   |
| `Order`   | `customizationData` | Personnalisation complète multi-vues (JSON)     |

> Après un pull, lance `npm run db:push` pour appliquer ces champs au schéma.
