import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="text-white font-heading font-bold text-lg mb-4">Dololka Agency</h3>
                        <p className="text-sm mb-4 leading-relaxed">
                            Agence de communication 360°. Branding, web, publicité, textile — on propulse votre marque.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link href="/agence" className="hover:text-white transition-colors">L'Agence</Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors">Nos Services</Link></li>
                            <li><Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link></li>
                            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/services/creation-site" className="hover:text-white transition-colors">Création de sites</Link></li>
                            <li><Link href="/services/graphisme" className="hover:text-white transition-colors">Design & Graphisme</Link></li>
                            <li><Link href="/services/reseaux-sociaux" className="hover:text-white transition-colors">Réseaux sociaux</Link></li>
                            <li><Link href="/services/publicite" className="hover:text-white transition-colors">Publicité</Link></li>
                            <li><Link href="/services/branding" className="hover:text-white transition-colors">Branding</Link></li>
                            <li><Link href="/services/textile" className="hover:text-white transition-colors">Textile</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>Email: Dololka.agency@gmail.com</li>
                            <li>Tél: 06 71 78 33 64</li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-800">
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                                <li><Link href="/delivery" className="hover:text-white transition-colors">Livraison</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">CGV</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Dololka Agency. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
