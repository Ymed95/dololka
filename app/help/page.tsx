import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Centre d\'aide',
    description: 'Besoin d\'assistance ? Guides et réponses pour commander, personnaliser vos produits et suivre vos commandes chez Dololka Agency.',
    alternates: { canonical: '/help' },
}

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold mb-8">Centre d'Aide</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Link href="/faq" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">❓</div>
                        <h3 className="text-xl font-semibold mb-2">Questions Fréquentes</h3>
                        <p className="text-gray-600">Trouvez des réponses rapides aux questions courantes</p>
                    </Link>

                    <Link href="/contact" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">Contactez-nous</h3>
                        <p className="text-gray-600">Notre équipe est là pour vous aider</p>
                    </Link>

                    <Link href="/delivery" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">Livraison</h3>
                        <p className="text-gray-600">Informations sur les délais et tarifs</p>
                    </Link>

                    <Link href="/client/orders" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold mb-2">Mes Commandes</h3>
                        <p className="text-gray-600">Suivez vos commandes en cours</p>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold mb-6">Guides Rapides</h2>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">🎨 Comment personnaliser un produit</h4>
                            <ol className="list-decimal list-inside text-gray-700 space-y-1">
                                <li>Choisissez votre produit</li>
                                <li>Téléchargez votre design</li>
                                <li>Ajustez la taille et position</li>
                                <li>Sélectionnez la taille et couleur</li>
                                <li>Ajoutez au panier</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
