// Ajoute le repère "PrintArea" à un modèle 3D acheté, afin que le
// configurateur sache où projeter le design du client.
//
// Le repère est un plan invisible placé sur la poitrine du vêtement.
// Sa position et sa taille sont exprimées en fractions de la boîte englobante
// du maillage principal, ce qui rend le script indépendant de l'échelle du modèle.
//
// Usage :
//   node scripts/add-print-area.mjs entree.glb sortie.glb [options]
//
// Options (valeurs par défaut entre parenthèses) :
//   --width=0.42     largeur de la zone, en fraction de la largeur du vêtement
//   --height=0.34    hauteur de la zone, en fraction de la hauteur
//   --y=0.62         hauteur du centre (0 = bas du vêtement, 1 = haut)
//   --depth=1.02     avancée devant la surface (1 = pile sur la boîte englobante)
//   --mesh=NomExact  force le maillage cible au lieu du plus volumineux

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { readFileSync, writeFileSync } from 'fs'

// --- Polyfill FileReader : requis par GLTFExporter en binaire hors navigateur ---
class NodeFileReader {
    _fire(blob, make) {
        blob.arrayBuffer()
            .then((ab) => {
                this.result = make(ab)
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
    readAsArrayBuffer(blob) { this._fire(blob, (ab) => ab) }
    readAsDataURL(blob) {
        this._fire(blob, (ab) =>
            `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(ab).toString('base64')}`)
    }
}
globalThis.FileReader = globalThis.FileReader || NodeFileReader

const [input, output] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (!input || !output) {
    console.error('Usage : node scripts/add-print-area.mjs entree.glb sortie.glb [--width=0.42 --height=0.34 --y=0.62]')
    process.exit(1)
}

const opt = (name, def) => {
    const found = process.argv.find((a) => a.startsWith(`--${name}=`))
    if (!found) return def
    const raw = found.split('=')[1]
    const num = Number(raw)
    return Number.isFinite(num) ? num : raw
}

const WIDTH = opt('width', 0.42)
const HEIGHT = opt('height', 0.34)
const Y_RATIO = opt('y', 0.62)
const DEPTH = opt('depth', 1.02)
const FORCE_MESH = opt('mesh', null)

const buf = readFileSync(input)
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

new GLTFLoader().parse(arrayBuffer, '', async (gltf) => {
    const scene = gltf.scene
    scene.updateMatrixWorld(true)

    // Retire un éventuel repère déjà présent, pour rester idempotent.
    const existing = []
    scene.traverse((o) => { if (o.name === 'PrintArea') existing.push(o) })
    existing.forEach((o) => o.parent?.remove(o))
    if (existing.length) console.log('Repère existant retiré (remplacement).')

    // Maillage cible : celui imposé, sinon le plus volumineux (le corps).
    let target = null
    let maxVolume = -1
    scene.traverse((o) => {
        if (!o.isMesh) return
        if (FORCE_MESH) {
            if (o.name === FORCE_MESH) target = o
            return
        }
        o.geometry.computeBoundingBox()
        const s = new THREE.Vector3()
        o.geometry.boundingBox.getSize(s)
        const v = s.x * s.y * s.z
        if (v > maxVolume) { maxVolume = v; target = o }
    })

    if (!target) {
        console.error(FORCE_MESH ? `Maillage "${FORCE_MESH}" introuvable.` : 'Aucun maillage trouvé.')
        process.exit(1)
    }

    target.geometry.computeBoundingBox()
    const bb = target.geometry.boundingBox
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    bb.getSize(size)
    bb.getCenter(center)

    console.log('Maillage cible :', target.name || '(sans nom)',
        '| dimensions', [size.x, size.y, size.z].map((n) => n.toFixed(2)).join(' x '))

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(size.x * WIDTH, size.y * HEIGHT),
        new THREE.MeshBasicMaterial({ visible: false })
    )
    plane.name = 'PrintArea'
    plane.position.set(
        center.x,
        bb.min.y + size.y * Y_RATIO,
        // Légèrement devant la face avant pour que le decal se projette dessus.
        bb.max.z * DEPTH
    )
    // Le repère vit dans le même espace que le maillage cible.
    target.add(plane)

    console.log('Repère ajouté     : position',
        [plane.position.x, plane.position.y, plane.position.z].map((n) => n.toFixed(2)).join(', '),
        '| taille', (size.x * WIDTH).toFixed(2), 'x', (size.y * HEIGHT).toFixed(2))

    const ab = await new GLTFExporter().parseAsync(scene, { binary: true })
    writeFileSync(output, Buffer.from(ab))
    console.log('Écrit             :', output, `(${(ab.byteLength / 1024).toFixed(0)} Ko)`)
}, (err) => {
    console.error('Lecture impossible :', String(err).slice(0, 200))
    process.exit(1)
})
