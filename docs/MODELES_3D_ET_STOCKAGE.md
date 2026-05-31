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

### Mise en place sur Vercel

1. Dashboard Vercel → **Storage** → **Create Database** → **Blob**.
2. Connecte le store au projet : Vercel injecte alors `BLOB_READ_WRITE_TOKEN`
   dans les variables d'environnement automatiquement.
3. (En local) copie ce token dans `.env.local` :
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXX
   ```
4. Redéploie. Les nouveaux uploads partent sur le Blob ; aucune migration des
   anciens fichiers n'est nécessaire (les URLs déjà stockées restent valides).

Le paquet `@vercel/blob` n'est importé que si le token existe (import dynamique),
donc aucun impact en dev sans token.

---

## Récapitulatif des champs DB

| Modèle    | Champ               | Rôle                                            |
|-----------|---------------------|-------------------------------------------------|
| `Product` | `model3dUrl`        | GLB spécifique au produit (sinon défaut catégorie) |
| `Order`   | `baseColor`         | Couleur du vêtement commandé                    |
| `Order`   | `productionFileUrl` | Rendu HD de la vue principale                   |
| `Order`   | `customizationData` | Personnalisation complète multi-vues (JSON)     |

> Après un pull, lance `npm run db:push` pour appliquer ces champs au schéma.
