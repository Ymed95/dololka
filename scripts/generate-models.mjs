// Génère des modèles GLB stylisés pour chaque type de produit.
// V2 : silhouettes réalistes (extrusion biseautée d'un contour de vêtement)
// au lieu de boîtes assemblées. Destinés à être remplacés par de vrais
// modèles 3D pro pour un rendu photoréaliste (voir docs/MODELES_3D_ET_STOCKAGE.md).
//
// Usage : node scripts/generate-models.mjs
//
// Chaque modèle expose un node "PrintArea" (plan invisible) sur la zone
// d'impression avant : le viewer y projette le design via <Decal>.

import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// --- Polyfills minimaux pour faire tourner GLTFExporter (binaire) hors navigateur ---
// GLTFExporter utilise reader.onloadend (et result), pas onload : on couvre les deux.
class NodeFileReader {
    _fire(blob, makeResult) {
        blob.arrayBuffer()
            .then((ab) => {
                this.result = makeResult(ab)
                const ev = { target: this }
                this.onload && this.onload(ev)
                this.onloadend && this.onloadend(ev)
            })
            .catch((err) => {
                this.error = err
                const ev = { target: this }
                this.onerror && this.onerror(ev)
                this.onloadend && this.onloadend(ev)
            })
    }
    readAsArrayBuffer(blob) {
        this._fire(blob, (ab) => ab)
    }
    readAsDataURL(blob) {
        this._fire(blob, (ab) => {
            const b64 = Buffer.from(ab).toString('base64')
            return `data:${blob.type || 'application/octet-stream'};base64,${b64}`
        })
    }
}
globalThis.FileReader = globalThis.FileReader || NodeFileReader

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'models')
mkdirSync(OUT_DIR, { recursive: true })

const FABRIC = () =>
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, metalness: 0.0 })

/** Plan invisible marquant la zone d'impression avant (pour le Decal). */
function printArea({ width, height, y, z }) {
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ visible: false })
    )
    mesh.name = 'PrintArea'
    mesh.position.set(0, y, z)
    return mesh
}

/** Extrusion biseautée d'un contour 2D → volume doux type vêtement. */
function extrudeGarment(shape, { depth = 0.42, bevel = 0.16 } = {}) {
    const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 6,
        curveSegments: 32,
    })
    // Centre l'épaisseur sur z=0 (face avant ≈ +depth/2+bevel).
    geo.translate(0, 0, -depth / 2)
    return geo
}

/** Contour d'un t-shirt (face avant), origine au centre poitrine. */
function tshirtShape({ tw = 0.95, hemY = -1.55, underarmY = 0.5, shoulderY = 1.35, sleeveX = 1.72, sleeveTopY = 1.02, sleeveBotY = 0.28, neckW = 0.36, neckDip = 0.28 } = {}) {
    const s = new THREE.Shape()
    // Ourlet bas (léger arrondi)
    s.moveTo(-tw, hemY)
    s.quadraticCurveTo(0, hemY - 0.07, tw, hemY)
    // Côté droit jusqu'à l'aisselle
    s.quadraticCurveTo(tw + 0.06, (hemY + underarmY) / 2, tw * 0.98, underarmY)
    // Dessous de manche droite
    s.lineTo(sleeveX, sleeveBotY)
    // Bout de manche
    s.quadraticCurveTo(sleeveX + 0.12, (sleeveBotY + sleeveTopY) / 2, sleeveX * 0.94, sleeveTopY)
    // Dessus de manche → épaule
    s.quadraticCurveTo(sleeveX * 0.5, shoulderY - 0.02, neckW + 0.22, shoulderY)
    // Col droit → creux du col → col gauche
    s.lineTo(neckW, shoulderY + 0.02)
    s.quadraticCurveTo(0, shoulderY - neckDip, -neckW, shoulderY + 0.02)
    // Épaule gauche → manche gauche (miroir)
    s.lineTo(-neckW - 0.22, shoulderY)
    s.quadraticCurveTo(-sleeveX * 0.5, shoulderY - 0.02, -sleeveX * 0.94, sleeveTopY)
    s.quadraticCurveTo(-sleeveX - 0.12, (sleeveBotY + sleeveTopY) / 2, -sleeveX, sleeveBotY)
    s.lineTo(-tw * 0.98, underarmY)
    s.quadraticCurveTo(-tw - 0.06, (hemY + underarmY) / 2, -tw, hemY)
    s.closePath()
    return s
}

function buildTshirt() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const body = new THREE.Mesh(extrudeGarment(tshirtShape()), mat)
    g.add(body)

    // Bord de col (liseré)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.055, 12, 40, Math.PI), mat)
    collar.position.set(0, 1.32, 0.30)
    collar.rotation.z = Math.PI
    g.add(collar)

    g.add(printArea({ width: 1.3, height: 1.6, y: 0.05, z: 0.42 }))
    return g
}

function buildHoodie() {
    const g = new THREE.Group()
    const mat = FABRIC()

    // Corps plus large et plus long qu'un t-shirt, manches longues
    const body = new THREE.Mesh(
        extrudeGarment(
            tshirtShape({ tw: 1.05, hemY: -1.7, underarmY: 0.35, shoulderY: 1.4, sleeveX: 1.95, sleeveTopY: 1.05, sleeveBotY: -0.9, neckW: 0.4, neckDip: 0.22 }),
            { depth: 0.5, bevel: 0.18 }
        ),
        mat
    )
    g.add(body)

    // Capuche : demi-sphère aplatie derrière la nuque
    const hood = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 32, 20, 0, Math.PI * 2, 0, Math.PI / 1.7),
        mat
    )
    hood.scale.set(1.15, 0.85, 1.0)
    hood.position.set(0, 1.42, -0.08)
    g.add(hood)

    // Poche kangourou (extrusion arrondie, légèrement en avant)
    const pocketShape = new THREE.Shape()
    pocketShape.moveTo(-0.62, -0.32)
    pocketShape.lineTo(0.62, -0.32)
    pocketShape.lineTo(0.48, 0.3)
    pocketShape.quadraticCurveTo(0, 0.38, -0.48, 0.3)
    pocketShape.closePath()
    const pocket = new THREE.Mesh(
        new THREE.ExtrudeGeometry(pocketShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 16 }),
        mat
    )
    pocket.position.set(0, -1.05, 0.40)
    g.add(pocket)

    // Cordons
    for (const x of [-0.16, 0.16]) {
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.55, 12), mat)
        cord.position.set(x, 0.95, 0.45)
        g.add(cord)
    }

    g.add(printArea({ width: 1.25, height: 1.0, y: 0.45, z: 0.48 }))
    return g
}

function buildCap() {
    const g = new THREE.Group()
    const mat = FABRIC()

    // Calotte légèrement aplatie
    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
        mat
    )
    crown.scale.set(1, 0.82, 1)
    g.add(crown)

    // Bouton sommet
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), mat)
    button.position.set(0, 0.84, 0)
    g.add(button)

    // Visière incurvée (demi-anneau plat incliné)
    const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(1.02, 1.12, 0.07, 48, 1, false, -Math.PI / 2, Math.PI),
        mat
    )
    brim.position.set(0, -0.02, 0.52)
    brim.rotation.x = -0.16
    g.add(brim)

    g.add(printArea({ width: 0.85, height: 0.5, y: 0.38, z: 0.97 }))
    return g
}

function buildMug() {
    const g = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.02 })

    // Corps légèrement conique (plus étroit en bas), proportions de vraie tasse
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.84, 2.3, 64), mat)
    g.add(body)

    // Lèvre supérieure
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.045, 12, 64), mat)
    lip.position.set(0, 1.15, 0)
    lip.rotation.x = Math.PI / 2
    g.add(lip)

    // Anse : demi-tore ouvert vers l'EXTÉRIEUR (rotation -PI/2 ; +PI/2
    // projetterait l'arc dans le corps du mug et n'en laisserait que les bouts).
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.11, 20, 48, Math.PI), mat)
    handle.position.set(0.88, 0, 0)
    handle.rotation.z = -Math.PI / 2
    g.add(handle)

    g.add(printArea({ width: 1.3, height: 1.3, y: 0, z: 0.93 }))
    return g
}

const builders = {
    tshirt: buildTshirt,
    hoodie: buildHoodie,
    cap: buildCap,
    mug: buildMug,
}

const exporter = new GLTFExporter()

for (const [name, build] of Object.entries(builders)) {
    const scene = new THREE.Scene()
    const model = build()
    model.name = `${name}_model`
    scene.add(model)

    const ab = await exporter.parseAsync(scene, { binary: true })
    const outPath = path.join(OUT_DIR, `${name}.glb`)
    writeFileSync(outPath, Buffer.from(ab))
    console.log(`✓ ${name}.glb (${(ab.byteLength / 1024).toFixed(1)} Ko)`)
}

console.log('Modèles générés dans public/models/')
