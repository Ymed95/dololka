import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Politique de confidentialité',
    description: 'Comment Dololka Agency collecte, utilise et protège vos données personnelles, conformément au RGPD.',
    alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Politique de Confidentialité</h1>
                <p className="text-gray-500 text-sm mb-8">Dernière mise à jour : 18 février 2026</p>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">

                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Dololka Agency (ci-après « nous », « notre » ou « l'Agence ») s'engage à protéger la vie privée des utilisateurs de son site internet. La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Responsable du traitement</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le responsable du traitement des données est Dololka Agency.<br />
                            Email : Dololka.agency@gmail.com<br />
                            Téléphone : 06 71 78 33 64
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Données collectées</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">Nous collectons les données suivantes :</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 ml-2">
                            <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
                            <li><strong>Données de connexion :</strong> mot de passe (chiffré), date de création du compte</li>
                            <li><strong>Données de commande :</strong> adresse de livraison, produits commandés, designs uploadés, montant</li>
                            <li><strong>Données de contact :</strong> nom, email, sujet et contenu des messages envoyés via le formulaire de contact</li>
                            <li><strong>Données de paiement :</strong> traitées directement par Stripe (nous ne stockons aucune donnée bancaire)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Finalités du traitement</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">Vos données sont utilisées pour :</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 ml-2">
                            <li>La création et la gestion de votre compte utilisateur</li>
                            <li>Le traitement et le suivi de vos commandes</li>
                            <li>La communication relative à vos commandes et demandes</li>
                            <li>L'amélioration de nos services et de l'expérience utilisateur</li>
                            <li>Le respect de nos obligations légales et réglementaires</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Base légale</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le traitement de vos données repose sur : l'exécution d'un contrat (traitement de commandes), votre consentement (inscription, formulaire de contact), et notre intérêt légitime (amélioration des services, sécurité).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">6. Durée de conservation</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 ml-2">
                            <li><strong>Données de compte :</strong> conservées tant que le compte est actif, puis 3 ans après la dernière activité</li>
                            <li><strong>Données de commande :</strong> conservées pendant 5 ans (obligations comptables)</li>
                            <li><strong>Messages :</strong> conservés pendant 2 ans</li>
                            <li><strong>Designs uploadés :</strong> conservés pendant la durée nécessaire au traitement de la commande</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">7. Partage des données</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 ml-2 mt-2">
                            <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements</li>
                            <li><strong>Vercel / Neon :</strong> hébergement du site et de la base de données</li>
                            <li><strong>Prestataires de livraison :</strong> pour l'expédition de vos commandes</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">8. Sécurité</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des mots de passe, connexions HTTPS, authentification sécurisée par JWT, hébergement sur des serveurs certifiés.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">9. Vos droits</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1.5 ml-2">
                            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                            <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-3">
                            Pour exercer ces droits, contactez-nous à : <strong>Dololka.agency@gmail.com</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">10. Cookies</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Notre site utilise uniquement des cookies essentiels au fonctionnement (session d'authentification). Aucun cookie publicitaire ou de traçage n'est utilisé.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">11. Modifications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">12. Contact</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Pour toute question relative à cette politique, contactez-nous :<br />
                            Email : Dololka.agency@gmail.com<br />
                            Téléphone : 06 71 78 33 64
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    )
}
