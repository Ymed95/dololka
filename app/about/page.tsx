import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold mb-8">À Propos de Dololka Agency</h1>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
                    <p className="text-gray-700 mb-4">
                        Dololka Agency est spécialisée dans la personnalisation de produits sur mesure. Notre plateforme vous permet de créer des articles uniques à votre image, que ce soit pour votre entreprise, votre association ou vos événements.
                    </p>
                    <p className="text-gray-700">
                        Des t-shirts aux casquettes, en passant par les mugs et les tote bags, nous donnons vie à vos idées avec un service de qualité et un accompagnement personnalisé.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Nos Valeurs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Qualité Premium</h3>
                            <p className="text-gray-700">Nous utilisons uniquement des matériaux de haute qualité pour garantir la durabilité et le rendu de vos produits personnalisés.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Rapidité</h3>
                            <p className="text-gray-700">Production et livraison rapides pour que vous receviez vos commandes dans les meilleurs délais.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Accompagnement</h3>
                            <p className="text-gray-700">Notre équipe vous accompagne à chaque étape, de la conception à la livraison de vos produits.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Sur Mesure</h3>
                            <p className="text-gray-700">Chaque commande est unique. Nous nous adaptons à vos besoins pour un résultat qui vous ressemble.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Comment ça marche ?</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <div>
                                <h3 className="font-semibold">Choisissez votre produit</h3>
                                <p className="text-gray-600">Parcourez notre catalogue de produits personnalisables.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <div>
                                <h3 className="font-semibold">Personnalisez-le</h3>
                                <p className="text-gray-600">Importez votre design, choisissez la couleur et la taille, et positionnez votre visuel.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <div>
                                <h3 className="font-semibold">Commandez</h3>
                                <p className="text-gray-600">Validez votre panier et renseignez vos informations de livraison.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                            <div>
                                <h3 className="font-semibold">Recevez votre produit</h3>
                                <p className="text-gray-600">Nous produisons et livrons votre commande dans les meilleurs délais.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/contact" className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                        Contactez-nous
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
