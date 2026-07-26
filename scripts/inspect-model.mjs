// Analyse un modèle 3D (GLB) : maillages, dimensions, matériaux, textures.
// Sert à évaluer un modèle acheté avant de l'intégrer, et à repérer le
// maillage du vêtement ainsi que l'emplacement de la zone d'impression.
//
// Usage : node scripts/inspect-model.mjs public/models/tshirt.glb

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { readFileSync } from 'fs'

const file = process.argv[2]
if (!file) {
    console.error('Usage : node scripts/inspect-model.mjs <fichier.glb>')
    process.exit(1)
}

const buf = readFileSync(file)
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

function fmt(n) {
    return Number(n.toFixed(3))
}

new GLTFLoader().parse(
    arrayBuffer,
    '',
    (gltf) => {
        const scene = gltf.scene
        scene.updateMatrixWorld(true)

        const meshes = []
        let totalTriangles = 0
        const textures = new Set()

        scene.traverse((obj) => {
            if (!obj.isMesh) return
            const geo = obj.geometry
            geo.computeBoundingBox()
            const size = new THREE.Vector3()
            geo.boundingBox.getSize(size)

            const tri = geo.index
                ? geo.index.count / 3
                : (geo.attributes.position?.count ?? 0) / 3
            totalTriangles += tri

            const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
            const maps = []
            for (const m of mats) {
                if (!m) continue
                for (const slot of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap']) {
                    if (m[slot]) { maps.push(slot); textures.add(slot) }
                }
            }

            meshes.push({
                name: obj.name || '(sans nom)',
                triangles: Math.round(tri),
                size: [fmt(size.x), fmt(size.y), fmt(size.z)],
                volume: size.x * size.y * size.z,
                maps: Array.from(new Set(maps)),
                hasUV: Boolean(geo.attributes.uv),
            })
        })

        const box = new THREE.Box3().setFromObject(scene)
        const size = new THREE.Vector3()
        const center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)

        console.log('\n=== MODÈLE :', file, '===')
        console.log('Dimensions globales :', [fmt(size.x), fmt(size.y), fmt(size.z)].join(' x '))
        console.log('Centre              :', [fmt(center.x), fmt(center.y), fmt(center.z)].join(', '))
        console.log('Hauteur (Y)         :', fmt(size.y), size.y > size.x ? '(orientation verticale, attendue)' : '(⚠ plus large que haut)')
        console.log('Triangles au total  :', Math.round(totalTriangles))
        console.log('Types de textures   :', textures.size ? Array.from(textures).join(', ') : '⚠ AUCUNE')

        console.log('\n--- Maillages (' + meshes.length + ') ---')
        meshes
            .sort((a, b) => b.volume - a.volume)
            .forEach((m, i) => {
                const flag = i === 0 ? '  <= candidat "corps"' : ''
                console.log(
                    `  ${m.name.padEnd(24)} ${String(m.triangles).padStart(7)} tri  ` +
                    `taille ${m.size.join('x').padEnd(20)} ` +
                    `UV:${m.hasUV ? 'oui' : 'NON'}  ` +
                    `textures:${m.maps.length ? m.maps.join('+') : 'aucune'}${flag}`
                )
            })

        const printArea = meshes.find((m) => m.name === 'PrintArea')
        console.log('\nRepère PrintArea    :', printArea ? '✓ présent' : '✗ absent (à ajouter)')

        console.log('\n--- Verdict ---')
        const issues = []
        if (totalTriangles < 5000) issues.push('trop peu de triangles (< 5 000) : le rendu paraîtra lisse et artificiel')
        if (totalTriangles > 150000) issues.push('très lourd (> 150 000 triangles) : risque de lenteur sur mobile')
        if (textures.size === 0) issues.push('aucune texture PBR : le tissu ne sera pas crédible')
        if (!meshes.some((m) => m.hasUV)) issues.push('pas de coordonnées UV : les textures ne peuvent pas s\'appliquer')
        if (issues.length === 0) {
            console.log('  ✓ Modèle exploitable en l\'état.')
        } else {
            issues.forEach((i) => console.log('  ⚠', i))
        }
        console.log('')
    },
    (err) => {
        console.error('Lecture impossible :', String(err).slice(0, 200))
        process.exit(1)
    }
)
