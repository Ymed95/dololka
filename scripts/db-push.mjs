// Synchronise le schéma Prisma avec la base, avec plusieurs tentatives.
//
// Les bases Neon en offre gratuite se mettent en veille après inactivité :
// la première connexion doit les réveiller et dépasse parfois le délai
// d'attente, ce qui faisait échouer tout le déploiement (erreur P1001) alors
// que le code était valide.
//
// Usage : node scripts/db-push.mjs

import { spawn } from 'child_process'

const ATTEMPTS = 4
const DELAYS_MS = [3000, 8000, 15000] // attentes entre les tentatives

function runPush() {
    return new Promise((resolve) => {
        const child = spawn(
            'node_modules/.bin/prisma',
            ['db', 'push', '--skip-generate'],
            { stdio: ['ignore', 'inherit', 'pipe'] }
        )

        let stderr = ''
        child.stderr.on('data', (chunk) => {
            const text = chunk.toString()
            stderr += text
            process.stderr.write(text)
        })

        child.on('close', (code) => resolve({ code, stderr }))
        child.on('error', (err) => resolve({ code: 1, stderr: String(err) }))
    })
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Une base injoignable est probablement en veille : il vaut la peine de réessayer.
 *  Une erreur de schéma, elle, se reproduira à l'identique. */
function isTransient(stderr) {
    return /P1001|P1002|P1017|Can't reach database|Timed out/i.test(stderr)
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    if (attempt > 1) {
        console.log(`\nTentative ${attempt}/${ATTEMPTS} de synchronisation du schéma…`)
    }

    const { code, stderr } = await runPush()

    if (code === 0) {
        if (attempt > 1) console.log('Schéma synchronisé après une nouvelle tentative.')
        process.exit(0)
    }

    if (!isTransient(stderr)) {
        console.error('\nLa synchronisation du schéma a échoué pour une raison non transitoire.')
        console.error('Le déploiement est interrompu : déployer avec un schéma désynchronisé')
        console.error('provoquerait des erreurs à l\'exécution.')
        process.exit(code ?? 1)
    }

    if (attempt < ATTEMPTS) {
        const wait = DELAYS_MS[attempt - 1] ?? 15000
        console.log(`Base injoignable (probablement en veille). Nouvelle tentative dans ${wait / 1000} s…`)
        await sleep(wait)
    }
}

console.error('\nBase de données injoignable après plusieurs tentatives.')
console.error('Vérifiez que le projet Neon est actif et que DATABASE_URL est correcte.')
process.exit(1)
