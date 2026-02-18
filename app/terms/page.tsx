import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
                <p className="text-gray-500 text-sm mb-8">Dernière mise à jour : 18 février 2026</p>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 1 — Objet</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Dololka Agency (ci-après « le Vendeur ») et toute personne physique ou morale effectuant un achat sur le site (ci-après « le Client »). Toute commande implique l'acceptation sans réserve des présentes CGV.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 2 — Identité du Vendeur</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Dololka Agency<br />
                            Email : Dololka.agency@gmail.com<br />
                            Téléphone : 06 71 78 33 64
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 3 — Produits et Services</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le Vendeur propose à la vente des produits textiles personnalisables, du textile vierge, du matériel de personnalisation, ainsi que des services de communication et de création. Les produits sont décrits et présentés avec la plus grande exactitude possible. Toutefois, les photos des produits ne sont pas contractuelles et peuvent varier légèrement du produit réel (couleurs, rendu).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 4 — Prix</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la validation de la commande. Les frais de livraison sont indiqués avant la validation de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 5 — Commande</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">Le processus de commande se déroule comme suit :</p>
                        <ol className="list-decimal list-inside text-gray-700 space-y-1.5 ml-2">
                            <li>Sélection du produit et personnalisation (le cas échéant)</li>
                            <li>Ajout au panier</li>
                            <li>Saisie des informations de livraison</li>
                            <li>Paiement sécurisé via Stripe</li>
                            <li>Confirmation de commande</li>
                        </ol>
                        <p className="text-gray-700 leading-relaxed mt-3">
                            La commande est considérée comme définitive après le paiement complet. Un email de confirmation est envoyé au Client.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 6 — Paiement</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard) via la plateforme sécurisée Stripe. Le Vendeur ne stocke aucune donnée bancaire. Le paiement est débité au moment de la validation de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 7 — Personnalisation</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le Client est seul responsable des designs, logos et visuels qu'il uploade pour la personnalisation de ses produits. Le Client garantit détenir les droits de propriété intellectuelle sur les éléments fournis. Le Vendeur ne saurait être tenu responsable en cas de violation de droits de tiers par le Client. Les produits personnalisés ne sont ni repris ni échangés sauf défaut de fabrication.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 8 — Livraison</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Les délais de livraison sont donnés à titre indicatif et peuvent varier selon la nature du produit et la destination. Le Vendeur s'engage à livrer dans un délai raisonnable, généralement compris entre 7 et 21 jours ouvrables pour les produits personnalisés, et entre 3 et 10 jours ouvrables pour les produits non personnalisés. Les frais de livraison sont à la charge du Client et sont indiqués avant la validation de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 9 — Droit de rétractation</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux produits personnalisés (confectionnés selon les spécifications du Client). Pour les produits non personnalisés, le Client dispose d'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation. Le produit doit être retourné dans son état d'origine, non porté et non lavé.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 10 — Garantie et réclamations</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le Vendeur garantit la conformité des produits livrés. En cas de défaut de fabrication ou de non-conformité, le Client doit contacter le service client dans un délai de 7 jours suivant la réception, en fournissant des photos du produit. Le Vendeur s'engage à proposer un remplacement ou un remboursement selon l'évaluation du cas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 11 — Propriété intellectuelle</h2>
                        <p className="text-gray-700 leading-relaxed">
                            L'ensemble des éléments du site (textes, images, logos, design, code) sont la propriété exclusive de Dololka Agency et sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction, représentation ou diffusion, en tout ou partie, sans autorisation préalable est interdite.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 12 — Responsabilité</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le Vendeur s'engage à fournir un service de qualité. Toutefois, sa responsabilité ne saurait être engagée en cas de force majeure, de dysfonctionnement technique indépendant de sa volonté, ou d'utilisation non conforme des produits par le Client. Le Vendeur ne pourra être tenu responsable des dommages indirects résultant de l'utilisation du site ou des produits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 13 — Protection des données</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Les données personnelles collectées sont traitées conformément à notre <a href="/privacy" className="text-primary-600 hover:underline">Politique de Confidentialité</a>. Le Client dispose de droits d'accès, de rectification, de suppression et de portabilité de ses données.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 14 — Litiges</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents seront ceux du lieu du siège social du Vendeur. Conformément à l'article L612-1 du Code de la consommation, le Client peut recourir gratuitement au service de médiation de la consommation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 15 — Modifications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Le Vendeur se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">Article 16 — Contact</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Pour toute question relative aux présentes CGV :<br />
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
