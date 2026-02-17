import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h3 className="text-white font-heading font-bold text-lg mb-4">Dololka Agency</h3>
                        <p className="text-sm mb-4">Votre agence de personnalisation de produits en ligne. Donnez vie à vos idées créatives avec des produits de qualité premium.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">A propos</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Email: Dololka.agency@gmail.com</li>
                            <li>Tél: 06 71 78 33 64</li>
                            <li className="pt-2">
                                <Link href="/delivery" className="hover:text-white transition-colors">Livraison</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Dololka Agency. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
