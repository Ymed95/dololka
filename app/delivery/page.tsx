import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
    title: 'Livraison et expédition',
    description: 'Délais, tarifs et options de livraison pour vos commandes de produits personnalisés : suivez votre commande en toute sérénité.',
    alternates: { canonical: '/delivery' },
}

export default function DeliveryPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold mb-8">Informations de Livraison</h1>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6">📦 Options de Livraison</h2>

                    <div className="space-y-6">
                        <div className="border-l-4 border-primary-500 pl-6">
                            <h3 className="font-semibold text-lg mb-2">Livraison Standard</h3>
                            <p className="text-gray-700 mb-2">Délai: 4-6 jours ouvrables</p>
                            <p className="text-primary-600 font-semibold">5,90€ (Gratuit dès 50€)</p>
                        </div>

                        <div className="border-l-4 border-secondary-500 pl-6">
                            <h3 className="font-semibold text-lg mb-2">Livraison Express</h3>
                            <p className="text-gray-700 mb-2">Délai: 2-3 jours ouvrables</p>
                            <p className="text-secondary-600 font-semibold">12,90€</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6">🕒 Délais de Production</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">1️⃣</span>
                            <div>
                                <h4 className="font-semibold">Validation de la commande</h4>
                                <p className="text-gray-600">Immédiate après le paiement</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">2️⃣</span>
                            <div>
                                <h4 className="font-semibold">Production</h4>
                                <p className="text-gray-600">3-5 jours ouvrables</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">3️⃣</span>
                            <div>
                                <h4 className="font-semibold">Expédition</h4>
                                <p className="text-gray-600">Selon l'option choisie</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold mb-6">🌍 Zones de Livraison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-primary-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">France Métropolitaine</h4>
                            <p className="text-sm text-gray-700">Livraison disponible partout</p>
                        </div>
                        <div className="bg-secondary-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Europe</h4>
                            <p className="text-sm text-gray-700">+3 jours, frais supplémentaires</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
