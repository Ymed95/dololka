// Génère les modèles GLB stylisés pour l'aperçu 3D 360°.
// Formes arrondies (silhouettes extrudées avec bevel, lathe pour le mug),
// destinées à être remplaçables par de vrais modèles pro sans toucher au code.
//
// Usage : node scripts/generate-models.mjs
//
// Conventions attendues par le viewer (Product3DViewer) :
// - Un node "PrintArea" (plan invisible) : zone d'impression AVANT.
// - Un node "PrintAreaBack" (optionnel) : zone d'impression ARRIÈRE.
// - Le mesh « corps » (le plus volumineux) reçoit les decals.

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
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0.0 })
const CERAMIC = () =>
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.02 })

/** Plan invisible marquant une zone d'impression. */
function printArea({ name = 'PrintArea', width, height, x = 0, y, z, rotX = 0, rotY = 0 }) {
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ visible: false })
    )
    mesh.name = name
    mesh.position.set(x, y, z)
    mesh.rotation.set(rotX, rotY, 0)
    return mesh
}

/** Silhouette 2D d'un t-shirt (contour avant), extrudée avec bevel. */
function tshirtShape({ torsoHalf = 1.0, sleeveTip = 1.8, shoulderY = 1.28, hemY = -1.35 }) {
    const s = new THREE.Shape()
    s.moveTo(-torsoHalf + 0.05, hemY)
    // Flanc gauche
    s.lineTo(-torsoHalf - 0.02, 0.55)
    // Dessous de manche
    s.lineTo(-sleeveTip + 0.18, 0.26)
    // Bout de manche arrondi
    s.quadraticCurveTo(-sleeveTip - 0.05, 0.38, -sleeveTip + 0.04, 0.74)
    // Dessus de manche vers l'épaule
    s.lineTo(-1.02, shoulderY)
    // Épaule arrondie vers le col
    s.quadraticCurveTo(-0.7, shoulderY + 0.15, -0.36, shoulderY + 0.17)
    // Encolure (creux)
    s.quadraticCurveTo(0, shoulderY - 0.12, 0.36, shoulderY + 0.17)
    s.quadraticCurveTo(0.7, shoulderY + 0.15, 1.02, shoulderY)
    s.lineTo(sleeveTip - 0.04, 0.74)
    s.quadraticCurveTo(sleeveTip + 0.05, 0.38, sleeveTip - 0.18, 0.26)
    s.lineTo(torsoHalf + 0.02, 0.55)
    s.lineTo(torsoHalf - 0.05, hemY)
    // Ourlet légèrement courbe
    s.quadraticCurveTo(0, hemY - 0.08, -torsoHalf + 0.05, hemY)
    return s
}

function extrudeGarment(shape, depth = 0.5) {
    const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.11,
        bevelSize: 0.09,
        bevelSegments: 5,
        curveSegments: 24,
    })
    geo.translate(0, 0, -depth / 2)
    geo.computeBoundingBox()
    return geo
}

/** T-shirt : silhouette extrudée + col. */
function buildTshirt() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const body = new THREE.Mesh(extrudeGarment(tshirtShape({}), 0.5), mat)
    body.name = 'tshirt_body'
    g.add(body)

    // Col (anneau aplati sur l'encolure)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.07, 12, 32), mat)
    collar.position.set(0, 1.32, 0.02)
    collar.rotation.x = Math.PI / 2.15
    collar.scale.set(1, 1, 0.6)
    g.add(collar)

    const frontZ = 0.37
    g.add(printArea({ width: 1.3, height: 1.6, y: 0.0, z: frontZ }))
    g.add(printArea({ name: 'PrintAreaBack', width: 1.3, height: 1.6, y: 0.0, z: -frontZ, rotY: Math.PI }))
    return g
}

/** Hoodie : silhouette plus large + capuche, poche et cordons. */
function buildHoodie() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const body = new THREE.Mesh(
        extrudeGarment(tshirtShape({ torsoHalf: 1.12, sleeveTip: 1.95, shoulderY: 1.3, hemY: -1.45 }), 0.6),
        mat
    )
    body.name = 'hoodie_body'
    g.add(body)

    // Capuche : calotte basse et reculée derrière la nuque (pas de « balle »
    // au-dessus des épaules)
    const hood = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.5),
        mat
    )
    hood.position.set(0, 1.12, -0.34)
    hood.scale.set(1.05, 0.8, 0.9)
    hood.rotation.x = 0.35
    g.add(hood)

    // Poche kangourou (extrusion fine arrondie)
    const pocketShape = new THREE.Shape()
    pocketShape.moveTo(-0.62, -0.32)
    pocketShape.lineTo(0.62, -0.32)
    pocketShape.lineTo(0.5, 0.3)
    pocketShape.quadraticCurveTo(0, 0.38, -0.5, 0.3)
    pocketShape.closePath()
    const pocketGeo = new THREE.ExtrudeGeometry(pocketShape, {
        depth: 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 12,
    })
    const pocket = new THREE.Mesh(pocketGeo, mat)
    pocket.position.set(0, -0.95, 0.38)
    g.add(pocket)

    // Cordons
    for (const dx of [-0.17, 0.17]) {
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), mat)
        cord.position.set(dx, 0.98, 0.42)
        g.add(cord)
    }

    const frontZ = 0.43
    g.add(printArea({ width: 1.35, height: 1.25, y: 0.28, z: frontZ }))
    g.add(printArea({ name: 'PrintAreaBack', width: 1.35, height: 1.6, y: 0.0, z: -frontZ, rotY: Math.PI }))
    return g
}

/** Casquette : calotte ovale + visière inclinée + bouton. */
function buildCap() {
    const g = new THREE.Group()
    const mat = FABRIC()

    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2),
        mat
    )
    crown.name = 'cap_crown'
    crown.scale.set(1, 0.85, 1.05)
    g.add(crown)

    // Visière : demi-ellipse extrudée, inclinée vers le bas
    const visorShape = new THREE.Shape()
    visorShape.moveTo(-0.92, 0)
    visorShape.quadraticCurveTo(-0.85, 0.72, 0, 0.8)
    visorShape.quadraticCurveTo(0.85, 0.72, 0.92, 0)
    visorShape.closePath()
    const visorGeo = new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 16,
    })
    const visor = new THREE.Mesh(visorGeo, mat)
    visor.rotation.x = -Math.PI / 2 - 0.13
    visor.position.set(0, 0.05, 0.92)
    g.add(visor)

    // Bouton sommet
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), mat)
    button.position.set(0, 0.86, 0)
    g.add(button)

    g.add(printArea({ width: 0.95, height: 0.55, y: 0.42, z: 0.95, rotX: -0.3 }))
    g.add(printArea({ name: 'PrintAreaBack', width: 0.7, height: 0.35, y: 0.35, z: -0.97, rotX: 0.25, rotY: Math.PI }))
    return g
}

/** Mug : profil tourné (paroi + intérieur creux) + anse torique. */
function buildMug() {
    const g = new THREE.Group()
    const mat = CERAMIC()

    const profile = [
        new THREE.Vector2(0.0, -1.1),
        new THREE.Vector2(0.82, -1.1),
        new THREE.Vector2(0.97, -0.98),
        new THREE.Vector2(1.0, -0.6),
        new THREE.Vector2(1.0, 0.95),
        new THREE.Vector2(0.97, 1.08),
        new THREE.Vector2(0.9, 1.08),
        new THREE.Vector2(0.87, 0.95),
        new THREE.Vector2(0.87, -0.85),
        new THREE.Vector2(0.0, -0.88),
    ]
    const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), mat)
    body.name = 'mug_body'
    g.add(body)

    // Anse
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.11, 14, 36, Math.PI), mat)
    handle.position.set(1.02, 0.05, 0)
    handle.rotation.z = -Math.PI / 2
    g.add(handle)

    g.add(printArea({ width: 1.2, height: 1.3, y: 0.0, z: 1.01 }))
    g.add(printArea({ name: 'PrintAreaBack', width: 1.2, height: 1.3, y: 0.0, z: -1.01, rotY: Math.PI }))
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
