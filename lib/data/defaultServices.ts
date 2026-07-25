// Contenu par défaut des 12 services historiques (extraits des anciennes pages statiques).
// Sert à l'import initial dans la base via l'admin ou le seed.
//
// Notes :
// - Les 12 pages statiques (app/services/*/page.tsx) fournissent toutes l'intégralité des champs
//   (icon, title, subtitle, description, features, process, pricing, faq) : aucun champ manquant.
// - sortOrder = position (0-based) du service dans la liste de app/services/page.tsx ;
//   les 12 slugs y figurent tous (hrefs /services/<slug>).
// - Le texte est recopié à l'identique, y compris les apostrophes typographiques (’) et la
//   coquille « à la vitrophanie » présente dans la page enseignes.

export interface DefaultServiceData {
    slug: string          // le nom du dossier, ex. "branding", "creation-site"
    icon: string          // le NOM de l'icône lucide utilisée dans la page statique, ex. "Palette", "Globe", "Building2"
    title: string
    subtitle: string
    description: string
    features: string[]
    process: { title: string; description: string }[]
    pricing: string
    faq: { q: string; a: string }[]
    sortOrder: number     // ordre = celui de la liste dans app/services/page.tsx (0-based) ; si absent de cette liste, mets à la fin
}

export const defaultServices: DefaultServiceData[] = [
    {
        slug: "creation-site",
        icon: "Globe",
        title: "Création de Site Internet",
        subtitle: "Sites web professionnels, e-commerce et landing pages optimisés pour convertir",
        description: "Chez Dololka Agency, nous concevons des sites internet sur mesure qui incarnent votre marque et génèrent des résultats. Que vous ayez besoin d'un site vitrine, d'une boutique en ligne ou d'une landing page dédiée, notre équipe assure un design moderne, responsive et une optimisation SEO intégrée dès le départ.",
        features: [
            "Web design sur mesure et interfaces utilisateur optimisées",
            "Sites e-commerce avec tunnel de vente optimisé",
            "Landing pages à forte conversion pour vos campagnes",
            "Optimisation SEO technique et éditoriale",
            "Design responsive (mobile, tablette, desktop)",
            "Intégration de formulaires et outils marketing",
            "Hébergement sécurisé et maintenance continue",
            "Analytics et suivi des performances",
        ],
        process: [
            {
                title: "Brief & stratégie",
                description: "Échange approfondi sur vos objectifs, cibles et contraintes. Définition de l’arborescence et du cahier des charges.",
            },
            {
                title: "Maquettes & UX",
                description: "Création de maquettes wireframes puis designs au plus près de votre identité de marque. Validation étape par étape.",
            },
            {
                title: "Développement",
                description: "Intégration des maquettes, développement des fonctionnalités et tests qualité sur tous les navigateurs et appareils.",
            },
            {
                title: "Mise en ligne & formation",
                description: "Mise en production, paramétrage SEO et formation à l’utilisation de votre nouvel outil.",
            },
        ],
        pricing: "Devis personnalisé selon la nature du projet (vitrine, e-commerce, landing page). Tarifs transparents dès le premier échange.",
        faq: [
            {
                q: "Combien de temps prend la création d’un site ?",
                a: "La durée varie selon le périmètre : 4 à 8 semaines pour un site vitrine, 8 à 16 semaines pour un site e-commerce complet. Un planning détaillé vous est remis dès la validation du projet.",
            },
            {
                q: "Proposez-vous l’hébergement et la maintenance ?",
                a: "Oui. Nous pouvons gérer l’hébergement sur des serveurs performants et sécurisés, ainsi que des formules de maintenance (mises à jour, sauvegardes, corrections) adaptées à vos besoins.",
            },
            {
                q: "Mon site sera-t-il optimisé pour le référencement ?",
                a: "Tous nos sites intègrent les bonnes pratiques SEO dès la conception : structure sémantique, balises, meta, performances et contenu pensé pour les moteurs de recherche.",
            },
            {
                q: "Quelles technologies utilisez-vous ?",
                a: "Nous travaillons avec des technologies modernes et pérennes (Next.js, React, CMS headless) pour des sites rapides, sécurisés et évolutifs.",
            },
        ],
        sortOrder: 0,
    },
    {
        slug: "graphisme",
        icon: "Palette",
        title: "Création Digitale & Graphisme",
        subtitle: "Identité visuelle, logos et supports print & digital qui distinguent votre marque",
        description: "Dololka Agency crée des identités visuelles percutantes qui marquent les esprits. Du logo à la charte graphique complète, en passant par vos supports print et digital, nous assurons une cohérence visuelle forte sur tous les points de contact avec vos clients.",
        features: [
            "Création de logos et déclinaisons",
            "Charte graphique complète (couleurs, typographies, visuels)",
            "Supports print : flyers, brochures, affiches, cartes de visite",
            "Supports digital : bannières, visuels réseaux sociaux, emailings",
            "Packaging et habillages produits",
            "Templates et outils éditoriaux",
            "Conformité aux standards d’impression (CMJN, traits de coupe)",
            "Livraison de fichiers sources et guides d’utilisation",
        ],
        process: [
            {
                title: "Découverte",
                description: "Analyse de votre secteur, de vos concurrents et de votre positionnement. Définition du brief créatif.",
            },
            {
                title: "Direction artistique",
                description: "Esquisses et propositions de concepts visuels. Choix des axes graphiques validés avec vous.",
            },
            {
                title: "Production",
                description: "Finalisation des visuels, création de la charte et déclinaisons sur tous les supports retenus.",
            },
            {
                title: "Livraison",
                description: "Remise des fichiers (print & web), des guides de style et du matériel clé en main.",
            },
        ],
        pricing: "Projet à la carte ou pack complet (logo + charte + supports). Nous adaptons nos tarifs à vos besoins et à la quantité de supports.",
        faq: [
            {
                q: "Combien de propositions de logo recevrai-je ?",
                a: "En fonction du pack choisi, nous vous présentons 2 à 4 propositions de concepts différents, avec des variantes autour de vos favoris jusqu’à validation finale.",
            },
            {
                q: "Puis-je utiliser mes visuels sur tous mes supports ?",
                a: "Oui. La charte graphique et les fichiers livrés vous permettent une utilisation cohérente sur supports print et digital, avec des règles claires pour préserver votre identité.",
            },
            {
                q: "Faites-vous l’impression des supports print ?",
                a: "Nous préparons les fichiers imprimables (prêt à l’impression). Nous pouvons aussi vous orienter vers des imprimeurs partenaires ou gérer l’impression pour vous.",
            },
            {
                q: "Quels formats de fichiers sont livrés ?",
                a: "Nous livrons les formats adaptés à chaque usage : vecteurs (AI, SVG) pour le logo, PDF haute résolution pour l’impression, PNG/JPG pour le digital et la charte au format PDF.",
            },
        ],
        sortOrder: 1,
    },
    {
        slug: "reseaux-sociaux",
        icon: "BarChart3",
        title: "Gestion des Réseaux Sociaux",
        subtitle: "Une présence professionnelle et engageante sur toutes les plateformes",
        description: "Les réseaux sociaux sont le premier point de contact avec vos clients. Nous prenons en charge la stratégie, la création de contenu et la gestion quotidienne de vos comptes pour développer votre audience et convertir vos abonnés en clients.",
        features: [
            "Audit et stratégie social media personnalisée",
            "Création de contenu visuel et rédactionnel",
            "Planning éditorial mensuel",
            "Publication et programmation des posts",
            "Community management et modération",
            "Stories, Reels et contenus courts",
            "Reporting mensuel avec KPIs détaillés",
            "Veille concurrentielle et tendances",
        ],
        process: [
            { title: "Audit", description: "Analyse de vos comptes actuels, votre audience et vos concurrents." },
            { title: "Stratégie", description: "Définition de la ligne éditoriale, du ton et des objectifs." },
            { title: "Création", description: "Production du contenu, validation et publication selon le planning." },
            { title: "Reporting", description: "Analyse des performances mensuelles et recommandations d'optimisation." },
        ],
        pricing: "À partir de 400€/mois par plateforme",
        faq: [
            { q: "Sur quelles plateformes intervenez-vous ?", a: "Instagram, TikTok, Facebook, LinkedIn, X (Twitter), YouTube et Pinterest." },
            { q: "Combien de posts par mois ?", a: "En général entre 12 et 20 posts par mois par plateforme, selon la formule choisie." },
            { q: "Est-ce que je garde le contrôle ?", a: "Bien sûr. Vous validez chaque contenu avant publication et avez accès au planning en temps réel." },
        ],
        sortOrder: 2,
    },
    {
        slug: "publicite",
        icon: "Megaphone",
        title: "Publicité & Acquisition",
        subtitle: "Meta Ads, Google Ads, TikTok Ads : des campagnes performantes et un ROI optimisé",
        description: "Dololka Agency conçoit et pilote vos campagnes publicitaires sur les principales plateformes (Meta, Google, TikTok) pour maximiser vos résultats. Nous mettons en place des stratégies d’acquisition ciblées et mesurables, avec une optimisation continue axée sur le ROI.",
        features: [
            "Gestion de campagnes Meta Ads (Facebook, Instagram)",
            "Campagnes Google Ads (Search, Display, YouTube)",
            "Publicité TikTok et plateformes vidéo",
            "Audiences ciblées et lookalike",
            "Retargeting et funnel d’acquisition",
            "Tests A/B et optimisation des créatifs",
            "Suivi des conversions et attribution",
            "Reporting détaillé et recommandations",
        ],
        process: [
            {
                title: "Objectifs & budget",
                description: "Définition de vos objectifs (trafic, leads, ventes), de votre budget et des KPIs de succès.",
            },
            {
                title: "Stratégie & ciblage",
                description: "Choix des canaux, définition des audiences, création des campagnes et des créatifs publicitaires.",
            },
            {
                title: "Lancement & tests",
                description: "Mise en ligne des campagnes, tests de variantes et réglages selon les premiers résultats.",
            },
            {
                title: "Optimisation continue",
                description: "Analyse des performances, ajustement des enchères, des audiences et des créatifs pour maximiser le ROI.",
            },
        ],
        pricing: "Gestion de campagnes à partir de votre budget publicitaire. Honoraires de gestion adaptés au volume et à la complexité de vos campagnes.",
        faq: [
            {
                q: "Quel budget minimum pour démarrer ?",
                a: "Nous recommandons un budget publicitaire d’au moins 500 €/mois par plateforme pour obtenir des résultats significatifs. Les honoraires de gestion sont définis en fonction du volume.",
            },
            {
                q: "Comment mesurez-vous le ROI ?",
                a: "Nous configurons le suivi des conversions (formulaires, achats, appels) et utilisons les outils d’attribution (Meta Pixel, Google Analytics, etc.) pour mesurer l’impact réel de vos campagnes.",
            },
            {
                q: "Gérez-vous les créatifs publicitaires ?",
                a: "Oui. Notre équipe créative conçoit les visuels, vidéos et textes nécessaires. Nous pouvons aussi adapter vos contenus existants au format publicitaire.",
            },
            {
                q: "Combien de temps avant de voir des résultats ?",
                a: "Les premières données significatives arrivent généralement sous 2 à 4 semaines. L’optimisation continue permet d’améliorer les performances au fil des mois.",
            },
        ],
        sortOrder: 3,
    },
    {
        slug: "branding",
        icon: "PenTool",
        title: "Branding & Positionnement",
        subtitle: "Identité de marque, storytelling et guidelines pour une présence mémorable",
        description: "Dololka Agency vous accompagne pour définir et incarner une identité de marque forte. Du positionnement stratégique au storytelling en passant par les brand guidelines, nous créons les fondations qui permettent à votre marque de rayonner de manière cohérente et durable.",
        features: [
            "Définition du positionnement et de la proposition de valeur",
            "Identité de marque (nom, tagline, promesse)",
            "Storytelling et narrative de marque",
            "Charte de marque et brand guidelines",
            "Ton de voix et personnalité de la marque",
            "Étude de concurrence et différentiation",
            "Architecture de marque (marque-mère, sous-marques)",
            "Support de déploiement (présentations, formations)",
        ],
        process: [
            {
                title: "Immersion",
                description: "Ateliers de découverte : vision, valeurs, cibles, concurrence. Cartographie de votre écosystème et de vos forces.",
            },
            {
                title: "Stratégie",
                description: "Définition du positionnement, de la proposition de valeur et du storytelling. Validation des axes stratégiques.",
            },
            {
                title: "Identité",
                description: "Création ou consolidation de l’identité visuelle et verbale. Charte de marque et guidelines d’utilisation.",
            },
            {
                title: "Déploiement",
                description: "Livraison des livrables et accompagnement pour déployer l’identité sur tous vos outils et supports.",
            },
        ],
        pricing: "Projet sur mesure selon le périmètre : positionnement seul, identité complète ou accompagnement global. Devis établi après brief détaillé.",
        faq: [
            {
                q: "Quelle est la différence avec la création graphique ?",
                a: "Le branding couvre la stratégie (positionnement, storytelling, ton de voix) et les fondations de la marque. La création graphique en est l’expression visuelle concrète (logo, charte, supports). Les deux sont complémentaires.",
            },
            {
                q: "Faut-il avoir une marque existante pour faire du branding ?",
                a: "Non. Nous accompagnons autant les nouvelles marques (création from scratch) que les marques existantes qui souhaitent se repositionner ou consolider leur identité.",
            },
            {
                q: "Combien de temps dure un projet de branding ?",
                a: "Un projet complet (positionnement + identité + guidelines) prend généralement 6 à 12 semaines, selon la complexité et le nombre d’ateliers et de validations.",
            },
            {
                q: "Incluez-vous l’identité visuelle (logo, couleurs) ?",
                a: "Oui. Les projets de branding peuvent inclure l’identité visuelle complète (logo, palette, typographies, déclinaisons). Nous proposons aussi un pack branding + graphisme pour un accompagnement 360°.",
            },
        ],
        sortOrder: 4,
    },
    {
        slug: "enseignes",
        icon: "Building2",
        title: "Enseignes Sur Mesure",
        subtitle: "Signalétique, enseignes lumineuses, vitrophanie et covering personnalisé",
        description: "Dololka Agency conçoit et réalise des enseignes et de la signalétique sur mesure pour valoriser votre commerce ou votre entreprise. De l’enseigne lumineuse à la vitrophanie en passant par le covering véhicule, nous créons des solutions durables et impactantes qui renforcent votre visibilité.",
        features: [
            "Enseignes lumineuses (néon, LED, lettres 3D)",
            "Signalétique intérieure et extérieure",
            "Habillage vitrine et devanture",
            "Covering véhicule et flotte",
            "Lettres et logos en relief",
            "Panneaux et totems",
            "Conception sur mesure et devis détaillé",
            "Installation et mise en place",
        ],
        process: [
            {
                title: "Consultation",
                description: "Visite ou échange pour comprendre vos besoins, vos contraintes (règlementation, façade) et vos objectifs visuels.",
            },
            {
                title: "Conception",
                description: "Proposition de designs, matériaux et techniques adaptés. Devis personnalisé et plan de pose.",
            },
            {
                title: "Fabrication",
                description: "Réalisation des enseignes et supports dans nos ateliers ou avec nos partenaires qualifiés.",
            },
            {
                title: "Installation",
                description: "Pose sur site, raccordements si nécessaire et vérification du bon fonctionnement.",
            },
        ],
        pricing: "Devis gratuit selon vos dimensions, matériaux et techniques. Les prix varient selon le type d’enseigne (lumineuse, lettres, covering) et la surface.",
        faq: [
            {
                q: "Quels types d’enseignes proposez-vous ?",
                a: "Enseignes lumineuses (LED, néon), lettres en relief (alu, acrylique, bois), panneaux, totems, vitrophanie (adhésifs, stores) et covering véhicule.",
            },
            {
                q: "Faut-il une autorisation pour une enseigne ?",
                a: "Selon la commune et le type d’enseigne, une déclaration préalable ou un permis peut être requis. Nous vous guidons dans les démarches administratives.",
            },
            {
                q: "Proposez-vous l’installation ?",
                a: "Oui. Nous assurons la pose sur site pour les enseignes et signalétiques. Pour les travaux en hauteur, nous faisons appel à des installateurs agréés.",
            },
            {
                q: "Quelle est la durée de vie d’une enseigne ?",
                a: "Une enseigne LED bien entretenue dure généralement 8 à 15 ans. Les lettres et supports en matériaux durables (alu, acrylique) restent en bon état pendant de nombreuses années.",
            },
        ],
        sortOrder: 5,
    },
    {
        slug: "photo-video",
        icon: "Camera",
        title: "Photo & Vidéo",
        subtitle: "Shootings professionnels, vidéos corporate, Reels et contenu UGC pour une marque qui marque",
        description: "Dololka Agency met son expertise photo et vidéo au service de votre communication visuelle. Nous réalisons des shootings photo professionnels, des vidéos corporate, des Reels engageants et du contenu UGC authentique. Notre équipe combine créativité et maîtrise technique pour produire des visuels qui renforcent votre identité et boostent votre présence digitale.",
        features: [
            "Shootings photo produits et lifestyle pour e-commerce",
            "Vidéos corporate et institutionnelles",
            "Reels et contenus courts optimisés pour les réseaux sociaux",
            "Contenu UGC (User Generated Content) authentique et engageant",
            "Direction artistique et mise en scène sur mesure",
            "Post-production : retouche photo et montage vidéo",
            "Conseil en stratégie de contenu visuel",
            "Packages photo + vidéo pour campagnes 360°",
        ],
        process: [
            {
                title: "Brief créatif",
                description: "Échange sur votre univers de marque, vos objectifs et les supports envisagés. Définition du concept visuel et du ton.",
            },
            {
                title: "Préproduction",
                description: "Scénario ou storyboard, repérage, casting si nécessaire, planification du tournage et sélection des équipements.",
            },
            {
                title: "Tournage",
                description: "Journée(s) de shooting en studio ou en extérieur, avec notre équipe technique et créative dédiée.",
            },
            {
                title: "Post-production & livraison",
                description: "Retouches, montage, étalonnage et livraison des fichiers optimisés selon vos supports de diffusion.",
            },
        ],
        pricing: "Devis sur mesure selon le type de prestation (shooting, vidéo, Reels, pack complet). Tarifs dégressifs pour les commandes récurrentes.",
        faq: [
            {
                q: "Fournissez-vous les modèles ou doit-on les trouver nous-mêmes ?",
                a: "Nous pouvons organiser le casting et sélectionner des modèles adaptés à votre marque, ou travailler avec vos propres équipes et ambassadeurs.",
            },
            {
                q: "Livrez-vous du contenu brut ou retravaillé ?",
                a: "Nous livrons des visuels retouchés et montés, prêts à l’emploi. Le brut peut être fourni sur demande pour archivage ou exploitation ultérieure.",
            },
            {
                q: "Pouvez-vous adapter les formats pour Instagram, TikTok, LinkedIn ?",
                a: "Oui. Tous nos contenus sont livrés en plusieurs formats (9:16, 1:1, 16:9) pour une diffusion optimale sur chaque plateforme.",
            },
            {
                q: "Combien de temps pour une vidéo corporate de 2 minutes ?",
                a: "Comptez généralement 3 à 4 semaines entre le brief et la livraison finale, selon la complexité du tournage et des interventions en post-production.",
            },
        ],
        sortOrder: 6,
    },
    {
        slug: "textile",
        icon: "Shirt",
        title: "Accompagnement Marque Textile",
        subtitle: "De l'idée à la production : création de collections, sourcing, prototypage et lancement",
        description: "Dololka Agency accompagne les marques et entrepreneurs dans le développement de leur marque textile. De la création de collections à la production, nous gérons le sourcing de matières et fournisseurs, le patronage, le prototypage et le lancement. Notre expertise vous permet de concrétiser votre vision avec des produits de qualité et une chaîne d'approvisionnement fiable.",
        features: [
            "Création de collections cohérentes et tendances",
            "Sourcing de matières premières et fournisseurs qualifiés",
            "Patronage et prototypage sur mesure",
            "Coordination de la production (petite et grande série)",
            "Développement de l'identité visuelle de la marque",
            "Stratégie de lancement et communication",
            "Accompagnement sur les normes et certifications",
            "Suivi qualité à chaque étape de production",
        ],
        process: [
            {
                title: "Définition & concept",
                description: "Workshop créatif pour poser l’ADN de la marque, le positionnement, la gamme et les objectifs de la première collection.",
            },
            {
                title: "Sourcing & prototypage",
                description: "Recherche de fournisseurs, sélection des matières, création des patrons et réalisation des prototypes.",
            },
            {
                title: "Validation & pré-série",
                description: "Ajustements sur les prototypes, validation qualité, lancement de la pré-série et tests avant production.",
            },
            {
                title: "Production & lancement",
                description: "Suivi de la production en série, contrôle qualité, préparation du lancement et accompagnement marketing.",
            },
        ],
        pricing: "Accompagnement au forfait ou à la mission. Devis personnalisé selon le périmètre (collection, nombre de modèles, volume de production).",
        faq: [
            {
                q: "Travaillez-vous avec des fournisseurs en France ou à l'étranger ?",
                a: "Nous travaillons avec un réseau de fournisseurs en France, Europe et Asie, selon vos critères de qualité, délais et budget.",
            },
            {
                q: "Quel est le volume minimum pour lancer une production ?",
                a: "Nous accompagnons des projets à partir de petites séries (dizaines de pièces). Les quantités minimales varient selon les techniques de fabrication.",
            },
            {
                q: "Pouvez-vous créer une marque textile de A à Z ?",
                a: "Oui. Nous offrons un accompagnement complet : identité, collections, sourcing, production et lancement, en partenariat avec nos experts métier.",
            },
            {
                q: "Comment gérez-vous les délais de production ?",
                a: "Nous établissons un planning réaliste dès le début et assurons un suivi régulier avec les ateliers pour respecter les échéances convenues.",
            },
        ],
        sortOrder: 7,
    },
    {
        slug: "conseil",
        icon: "Lightbulb",
        title: "Conseil & Stratégie",
        subtitle: "Audit de communication, plan d'action stratégique, coaching et accompagnement business",
        description: "Dololka Agency vous accompagne dans la définition et la mise en œuvre de votre stratégie de communication et de développement. Nous réalisons des audits approfondis, élaborons des plans d'action sur mesure et proposons du coaching personnalisé pour structurer votre projet et atteindre vos objectifs business. Notre approche pragmatique allie vision stratégique et opérationnelle.",
        features: [
            "Audit complet de votre communication (online et offline)",
            "Plan d'action stratégique personnalisé et priorisé",
            "Coaching dirigeants et équipes sur la stratégie",
            "Accompagnement business et structuration de projet",
            "Analyse de positionnement et recommandations",
            "Définition d'indicateurs de performance (KPIs)",
            "Workshops et formations sur-mesure",
            "Suivi et ajustement continu de la stratégie",
        ],
        process: [
            {
                title: "Audit & diagnostic",
                description: "Analyse de votre écosystème actuel : marque, communication, concurrence, forces et axes d’amélioration.",
            },
            {
                title: "Stratégie & recommandations",
                description: "Restitution du diagnostic et proposition d’un plan d’action priorisé avec objectifs mesurables et planning.",
            },
            {
                title: "Coaching & mise en œuvre",
                description: "Accompagnement dans la mise en œuvre : ateliers, formations, suivi opérationnel et ajustements.",
            },
            {
                title: "Suivi & optimisation",
                description: "Points réguliers pour mesurer les progrès, adapter la stratégie et pérenniser les bonnes pratiques.",
            },
        ],
        pricing: "Tarifs au forfait pour missions ponctuelles (audit, stratégie) ou accompagnement mensuel (coaching). Devis détaillé après un premier échange découverte.",
        faq: [
            {
                q: "En quoi consiste l'audit de communication ?",
                a: "Nous analysons votre identité, vos supports, votre présence digitale, votre positionnement face à la concurrence et l’efficacité de vos actions. Un rapport détaillé avec recommandations vous est remis.",
            },
            {
                q: "Le coaching est-il individuel ou en équipe ?",
                a: "Les deux. Nous proposons du coaching dirigeant, des sessions en équipe et des ateliers collectifs selon vos besoins.",
            },
            {
                q: "Combien de temps dure un accompagnement stratégique ?",
                a: "La durée varie : 1 à 2 mois pour un audit et une stratégie, plusieurs mois pour un accompagnement coaching avec suivi régulier.",
            },
            {
                q: "Proposez-vous des formations ?",
                a: "Oui. Nous concevons des formations sur mesure (stratégie, communication, réseaux sociaux, etc.) adaptées à vos équipes et objectifs.",
            },
        ],
        sortOrder: 8,
    },
    {
        slug: "ecommerce",
        icon: "ShoppingBag",
        title: "E-commerce & Business en Ligne",
        subtitle: "Création de boutiques en ligne, tunnels de vente et automatisation pour booster vos ventes",
        description: "Dololka Agency conçoit et déploie votre stratégie e-commerce de A à Z. Que vous choisissiez Shopify, WooCommerce ou une solution sur mesure, nous créons des boutiques en ligne performantes, des tunnels de vente optimisés et des automatisations qui convertissent. Notre objectif : transformer vos visiteurs en clients fidèles et maximiser votre chiffre d'affaires en ligne.",
        features: [
            "Création de boutiques Shopify, WooCommerce ou sur mesure",
            "Design e-commerce optimisé pour la conversion",
            "Tunnels de vente (funnels) et pages de capture",
            "Automatisation des processus (emails, relances, stocks)",
            "Intégration des moyens de paiement et livraison",
            "Optimisation SEO et stratégie de contenu produit",
            "Analytics et suivi des performances de vente",
            "Formation et accompagnement à l'exploitation",
        ],
        process: [
            {
                title: "Stratégie & conception",
                description: "Analyse de votre marché, définition de l’architecture, choix de la solution technique et conception de l’expérience utilisateur.",
            },
            {
                title: "Développement & intégration",
                description: "Création de la boutique, intégration des produits, paiements, livraisons et connexion des outils marketing.",
            },
            {
                title: "Tunnels & automatisation",
                description: "Mise en place des funnels, séquences email, relances panier abandonné et autres automatisations de conversion.",
            },
            {
                title: "Lancement & optimisation",
                description: "Tests, mise en ligne, formation à l’usage et suivi continu pour améliorer les performances de vente.",
            },
        ],
        pricing: "Devis personnalisé selon la solution (Shopify, WooCommerce, sur mesure), le nombre de produits et les fonctionnalités demandées. Paiement possible en plusieurs fois.",
        faq: [
            {
                q: "Shopify ou WooCommerce : que recommandez-vous ?",
                a: "Shopify convient aux débutants et aux projets nécessitant une mise en ligne rapide. WooCommerce offre plus de flexibilité et est idéal si vous avez déjà un site WordPress.",
            },
            {
                q: "Prenez-vous en charge la gestion des stocks et des commandes ?",
                a: "Nous configurons tous les outils (stock, commandes, livraison). L’exploitation au quotidien reste à votre charge, avec possibilité de formation et support.",
            },
            {
                q: "Combien coûte une boutique e-commerce ?",
                a: "Les tarifs varient selon la complexité : à partir de quelques milliers d’euros pour une boutique standard, davantage pour des solutions sur mesure ou des volumétries importantes.",
            },
            {
                q: "Pouvez-vous créer des tunnels de vente sans boutique complète ?",
                a: "Oui. Nous réalisons des pages de vente, formulaires de capture et séquences email pour vendre des produits ou services sans site e-commerce complet.",
            },
        ],
        sortOrder: 9,
    },
    {
        slug: "production-textile",
        icon: "Sparkles",
        title: "Production & Fabrication Textile",
        subtitle: "Sérigraphie, broderie, DTF, flocage — production en petite et grande série",
        description: "Dololka Agency assure la production et la fabrication textile de vos produits personnalisés. Sérigraphie, broderie, DTF (Direct to Film), flocage : nous maîtrisons les principales techniques d’impression et proposons des solutions adaptées à la petite comme à la grande série. Qualité premium, délais maîtrisés et accompagnement de A à Z pour des produits qui incarnent votre marque.",
        features: [
            "Sérigraphie pour tirages en série (tee-shirts, sweats, accessoires)",
            "Broderie sur vêtements, sacs et objets textiles",
            "Impression DTF pour petits volumes et tests",
            "Flocage et transferts personnalisés",
            "Production en petite série (à partir de 10 pièces)",
            "Production en grande série avec tarifs dégressifs",
            "Sélection de matières premium (coton, polyester, mélange)",
            "Contrôle qualité et livraison soignée",
        ],
        process: [
            {
                title: "Brief & fichiers",
                description: "Réception de vos visuels (vectoriels pour la sérigraphie), validation des couleurs et des positions d’impression.",
            },
            {
                title: "Devis & validation",
                description: "Devis détaillé selon la technique, les quantités et les supports. Validation et confirmation de la commande.",
            },
            {
                title: "Production",
                description: "Mise en production dans nos ateliers partenaires : préparation des écrans, broderie, impression DTF ou flocage.",
            },
            {
                title: "Contrôle & livraison",
                description: "Contrôle qualité avant expédition, conditionnement soigné et livraison à l’adresse de votre choix.",
            },
        ],
        pricing: "Tarifs selon la technique (sérigraphie, broderie, DTF, flocage), les quantités et les couleurs. Devis gratuit sous 48h.",
        faq: [
            {
                q: "Quelle est la quantité minimum pour la sérigraphie ?",
                a: "Généralement à partir de 10 à 20 pièces selon le modèle et le nombre de couleurs. Pour des quantités plus faibles, le DTF est plus adapté.",
            },
            {
                q: "Fournissez-vous les textiles ou apportez-vous les vôtres ?",
                a: "Les deux. Nous pouvons sourcer des supports de qualité ou travailler sur vos propres pièces fournies (BYOG - Bring Your Own Garment).",
            },
            {
                q: "Combien de temps pour une commande ?",
                a: "Délai standard de 7 à 15 jours selon la technique et le volume. Urgences possibles sous réserve de disponibilité.",
            },
            {
                q: "Quel format de fichier pour les visuels ?",
                a: "Pour la sérigraphie : fichiers vectoriels (AI, EPS, PDF). Pour le DTF et le flocage : haute résolution (300 dpi minimum).",
            },
        ],
        sortOrder: 10,
    },
    {
        slug: "community",
        icon: "Users",
        title: "Community Building & Influence",
        subtitle: "Créez une communauté engagée autour de votre marque et exploitez le pouvoir de l'influence",
        description: "Dans un monde où l'authenticité est reine, construire une communauté fidèle et engagée est un levier de croissance puissant. Nous vous accompagnons dans la création et l'animation de votre communauté, ainsi que dans la mise en place de stratégies d'influence marketing pour amplifier votre message.",
        features: [
            "Stratégie de community building sur mesure",
            "Identification et partenariats avec des influenceurs",
            "Campagnes UGC (User Generated Content)",
            "Animation de groupes et communautés en ligne",
            "Organisation d'événements et meetups",
            "Programmes ambassadeurs de marque",
            "Analyse des KPIs d'engagement",
            "Gestion des micro et macro influenceurs",
        ],
        process: [
            { title: "Audit & Stratégie", description: "Analyse de votre audience cible et définition de la stratégie communautaire." },
            { title: "Identification", description: "Recherche et sélection des influenceurs et créateurs pertinents." },
            { title: "Activation", description: "Lancement des campagnes, partenariats et actions communautaires." },
            { title: "Optimisation", description: "Mesure des résultats et ajustement continu pour maximiser l'impact." },
        ],
        pricing: "À partir de 500€/mois pour la gestion communautaire",
        faq: [
            { q: "Combien de followers faut-il pour commencer ?", a: "Aucun minimum requis. On peut démarrer une communauté de zéro et la construire stratégiquement." },
            { q: "Travaillez-vous avec des micro-influenceurs ?", a: "Absolument ! Les micro-influenceurs ont souvent un meilleur taux d'engagement et sont plus authentiques." },
            { q: "Comment mesurez-vous les résultats ?", a: "Nous suivons les KPIs clés : engagement, croissance, portée, conversions et retour sur investissement." },
        ],
        sortOrder: 11,
    },
]
