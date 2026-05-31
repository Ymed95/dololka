// Génère des modèles GLB de scaffold (placeholders CC0) pour chaque type de
// produit. Ces meshes sont volontairement simples mais réalistes en silhouette ;
// ils sont destinés à être remplacés par de vrais modèles 3D pro.
//
// Usage : node scripts/generate-models.mjs
//
// Chaque mesh expose un node nommé "PrintArea" (un plan invisible) positionné
// sur la zone d'impression avant : le viewer y projette le design via <Decal>.

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
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0.0 })

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

/** T-shirt : torse + 2 manches, silhouette reconnaissable. */
function buildTshirt() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.6, 0.6), mat)
    torso.position.y = 0
    g.add(torso)

    const sleeveGeo = new THREE.BoxGeometry(0.9, 0.7, 0.55)
    const lSleeve = new THREE.Mesh(sleeveGeo, mat)
    lSleeve.position.set(-1.35, 0.9, 0)
    lSleeve.rotation.z = 0.5
    g.add(lSleeve)
    const rSleeve = new THREE.Mesh(sleeveGeo, mat)
    rSleeve.position.set(1.35, 0.9, 0)
    rSleeve.rotation.z = -0.5
    g.add(rSleeve)

    // Col
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 12, 24), mat)
    collar.position.set(0, 1.35, 0.05)
    collar.rotation.x = Math.PI / 2
    g.add(collar)

    g.add(printArea({ width: 1.2, height: 1.5, y: 0.1, z: 0.31 }))
    return g
}

/** Hoodie : torse plus large + capuche + poche. */
function buildHoodie() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.9, 0.75), mat)
    g.add(torso)

    const sleeveGeo = new THREE.BoxGeometry(1.0, 0.85, 0.7)
    const lSleeve = new THREE.Mesh(sleeveGeo, mat)
    lSleeve.position.set(-1.55, 1.0, 0)
    lSleeve.rotation.z = 0.45
    g.add(lSleeve)
    const rSleeve = new THREE.Mesh(sleeveGeo, mat)
    rSleeve.position.set(1.55, 1.0, 0)
    rSleeve.rotation.z = -0.45
    g.add(rSleeve)

    // Capuche
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.6), mat)
    hood.position.set(0, 1.5, -0.1)
    g.add(hood)

    // Poche kangourou
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.12), mat)
    pocket.position.set(0, -0.9, 0.4)
    g.add(pocket)

    g.add(printArea({ width: 1.3, height: 1.4, y: 0.25, z: 0.39 }))
    return g
}

/** Casquette : calotte + visière. */
function buildCap() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat)
    g.add(crown)

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.08, 32, 1, false, 0, Math.PI), mat)
    brim.position.set(0, 0.0, 0.85)
    brim.rotation.x = 0
    g.add(brim)

    g.add(printArea({ width: 0.9, height: 0.6, y: 0.45, z: 0.95 }))
    return g
}

/** Mug : cylindre + anse. */
function buildMug() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.2, 48), mat)
    g.add(body)

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.13, 16, 32, Math.PI), mat)
    handle.position.set(1.15, 0, 0)
    handle.rotation.z = Math.PI / 2
    g.add(handle)

    // Zone d'impression : on enroule le decal sur la face avant du cylindre
    g.add(printArea({ width: 1.4, height: 1.4, y: 0, z: 1.01 }))
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
