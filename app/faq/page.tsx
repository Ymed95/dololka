import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
    title: 'Questions fréquentes',
    description: 'Délais, tarifs, personnalisation, livraison, commandes : retrouvez les réponses aux questions les plus posées sur nos services et notre boutique.',
    alternates: { canonical: '/faq' },
}

export default function FAQPage() {
    const faqs = [
        {
            question: "Comment personnaliser un produit ?",
            answer: "C'est simple ! Choisissez votre produit, cliquez sur 'Personnaliser', téléchargez votre design, ajustez la taille et la position, puis ajoutez au panier."
        },
        {
            question: "Quels formats de fichiers acceptez-vous ?",
            answer: "Nous acceptons les formats PNG, JPG, et SVG. Pour une meilleure qualité, nous recommandons des images haute résolution (minimum 300 DPI)."
        },
        {
            question: "Quel est le délai de production ?",
            answer: "La production prend généralement 3-5 jours ouvrables. La livraison prend ensuite 2-4 jours selon votre localisation."
        },
        {
            question: "Puis-je annuler ma commande ?",
            answer: "Oui, vous pouvez annuler votre commande dans les 2 heures suivant la passation. Après ce délai, la production commence et l'annulation n'est plus possible."
        },
        {
            question: "Quelles sont vos options de paiement ?",
            answer: "Nous acceptons les cartes de crédit/débit (Visa, Mastercard), PayPal, et les virements bancaires."
        },
        {
            question: "Les couleurs du produit final seront-elles identiques à celles affichées ?",
            answer: "Nous faisons de notre mieux pour reproduire fidèlement les couleurs, mais de légères variations peuvent survenir en raison des différences d'écrans et du processus d'impression."
        },
        {
            question: "Proposez-vous des remises pour les commandes en gros ?",
            answer: "Oui ! Contactez-nous pour obtenir un devis personnalisé pour les commandes de plus de 50 unités."
        },
        {
            question: "Puis-je retourner un produit personnalisé ?",
            answer: "Les produits personnalisés ne peuvent être retournés que s'ils présentent un défaut de fabrication. Veuillez nous contacter dans les 7 jours suivant la réception."
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold mb-4">Questions Fréquentes</h1>
                <p className="text-gray-600 mb-12">Trouvez rapidement des réponses à vos questions</p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-3 text-primary-700">
                                {faq.question}
                            </h3>
                            <p className="text-gray-700">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Vous n'avez pas trouvé la réponse ?</h2>
                    <p className="text-gray-700 mb-6">Notre équipe est là pour vous aider !</p>
                    <a href="/contact" className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                        Contactez-nous
                    </a>
                </div>
            </div>
        </div>
    )
}
