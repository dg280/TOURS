export type Language = 'fr' | 'en' | 'es';
export type Translations = typeof translations.fr;

export const translations = {
    fr: {
        nav: {
            tours: 'Nos Tours',
            about: 'À Propos',
            guide: 'Votre Guide',
            avis: 'Avis',
            contact: 'Contact',
            reserve: 'Réserver',
            live: 'Live Experience',
            no_live: 'Pas de tour en cours',
            enter_code: 'Entrez le code du tour',
            home: 'Accueil'
        },
        common: {
            back: 'Retour',
            next: 'Suivant',
            finish: 'Terminer',
            pay: 'Payer et Réserver',
            error_server: 'Erreur serveur'
        },
        about_hook: {
            title: 'Une approche humaine et authentique pour découvrir la vraie Catalogne.',
            cta: 'En savoir plus sur votre guide →'
        },
        about: {
            me: { label: 'À propos', badge: 'Votre Guide Local', title: 'Antoine, passionné par la Catalogne et ses secrets', exp: "Ans d'expérience" },
            philosophy: {
                label: 'Philosophie', tag: 'Notre Philosophie', title: "Plus qu'un tour, une immersion authentique", quote: "Ma vision est de vous faire découvrir la région comme si vous étiez avec un ami local.", items: [
                    { title: 'Authenticité', desc: 'Découvrez la vraie culture locale.' },
                    { title: 'Respect', desc: 'Un tourisme durable et respectueux.' },
                    { title: 'Proximité', desc: 'Des groupes réduits pour plus d’échange.' }
                ]
            },
            different: {
                label: 'Différences', tag: 'Ce qui nous rend différents', title: 'Pourquoi ne pas choisir une agence classique ?', items: [
                    { title: "Experts du terrain", desc: "Nous habitons ici, nous connaissons chaque chemin." },
                    { title: "Itinéraires secrets", desc: "Évitez les foules avec nos parcours exclusifs." },
                    { title: "Flexibilité totale", desc: "On s'adapte à votre rythme et vos envies." }
                ]
            },
            why: { label: 'Pourquoi nous ?', title: 'La confiance de nos voyageurs', stats: [{ val: '150+', label: 'Voyageurs' }, { val: '5.0', label: 'Note moyenne' }, { val: '100%', label: 'Local' }], quote: "Une expérience inoubliable ! Antoine connaît la région comme sa poche et nous a emmenés dans des endroits où aucun touriste ne va.", back: '← Retour à l\'accueil' }
        },
        hero: {
            tagline: 'Découvrez la Catalogne authentique',
            title: 'Tours et Expériences Uniques à Barcelone et ses Environs',
            subtitle: 'Petits groupes, guide local passionné',
            description: 'Des excursions personnalisées pour découvrir les secrets de la Catalogne, loin des foules touristiques — culture, nature et aventure',
            cta_discover: 'Voir Tous les Tours',
            cta_contact: 'Contactez-moi'
        },
        seo: {
            title: 'Tours & Detours - Tours et Expériences Uniques à Barcelone',
            description: 'Excursions personnalisées et tours guidés en Catalogne. Découvrez Girona, Costa Brava, Montserrat et plus encore avec un expert local.'
        },
        stats: {
            exp: "ans d'expérience",
            local: 'expert local',
            review: 'sur TripAdvisor',
            langs: 'langues',
            groups: 'Petits Groupes',
            guides: 'Guides 100% Locaux',
            authentic: 'Expériences Authentiques'
        },
        tours: {
            section_tag: 'NOS EXPÉRIENCES',
            section_title: 'Excursions Guidées en Catalogne',
            category_title: 'Trouvez votre prochaine aventure',
            selection_tag: 'Sélection du tour',
            top_tours_title: 'Nos tours incontournables',
            top_tours_desc: 'Excursions privées en petit groupe à Barcelone et en Catalogne. Chaque excursion est soigneusement conçue pour vous offrir une expérience authentique, loin des sentiers battus et s’adaptant à vos intérêts.',
            section_desc: 'Chaque excursion est soigneusement conçue pour vous offrir une expérience authentique, loin des sentiers battus.',
            learn_more: 'Plus d\'Informations',
            book_now: 'Réserver Maintenant',
            duration: 'Durée',
            group: 'Groupe',
            price: 'Prix',
            from_price: 'À partir de',
            per_person: 'par personne',
            tabs: {
                desc: 'Description',
                itin: 'Itinéraire',
                incl: 'Inclus / Non Inclus',
                meet: 'Bon à savoir'
            },
            duration_labels: {
                "Journée entière": "Journée entière",
                "Demi-journée": "Demi-journée",
                "Demi/Journée entière": "Demi/Journée entière"
            },
            categories: {
                nature: 'Nature',
                rando: 'Rando',
                walking: 'Tour à pied',
                gastro: 'Gastronomie',
                views: 'Vues spectaculaires',
                culture: 'Culturel',
                urban: 'Aventure urbaine',
                bcn: 'Barcelona city',
                outside: 'Outside of Barcelona'
            },
            no_tours_found: 'Aucun tour trouvé dans cette catégorie.'
        },
        guide: {
            section_tag: 'VOTRE GUIDE',
            title: 'Bonjour, je suis Antoine Pilard',
            bio: "Antoine Pilard & Tours and Detours\n\nJe conçois et mène personnellement des expériences privées à travers la Catalogne pour des voyageurs en quête de profondeur culturelle, de rythme calme et de connexions locales authentiques — loin de la foule et des clichés.\n\nLe voyage façonne ma vie depuis plus de 15 ans. De mes propres périples en Afrique, Asie et Amérique jusqu'à l'accompagnement de voyageurs dans les avenues historiques de Paris et du Nord de la France, ou en menant des aventures de randonnée, de vélo et de rafting dans les Alpes et les Pyrénées, j'ai toujours cru en une chose : les meilleures expériences se trouvent dans les détours — quand on ralentit, qu'on prête attention et qu'on se connecte vraiment au monde qui nous entoure.\n\nAvec plus de 15 ans d'expérience en tant que guide en France, en Andorre et en Espagne, et ancien tour-leader pour Intrepid Travel (2018–2022), je combine des standards opérationnels rigoureux avec une approche humaine et discrète. Basé à Barcelone depuis 2022, je travaille en étroite collaboration avec des partenaires locaux de confiance pour offrir des journées guidées privées et des expériences de plusieurs jours adaptées aux intérêts, au rythme et aux attentes de chaque client. Cette conviction pour le voyage porteur de sens est le cœur de Tours & Detours.\n\nNotre Philosophie\n\nIci en Catalogne — un endroit que je suis fier d'appeler ma maison — nous créons des expériences qui honorent la terre, les gens et les traditions qui la rendent unique. Nous pratiquons le voyage lent (slow travel), privilégiant la profondeur à la vitesse et le sens au kilométrage. Nous surveillons notre empreinte carbone, intégrons la marche et les activités non motorisées chaque fois que possible, et concevons des itinéraires qui respectent et profitent à la fois à l'environnement et aux communautés qui nous accueillent.\n\nNotre esprit est ancré dans l'aventure — non pas au sens de défis extrêmes, mais dans la joie de la découverte : un sentier côtier tranquille, une piste forestière que seuls les locaux connaissent, un artisan ouvrant son atelier, un vigneron engagé dans des pratiques durables partageant ses histoires autour d'un verre. Ces moments deviennent des souvenirs car ils sont réels, humains et naturels.\n\nNous travaillons en étroite collaboration avec les acteurs locaux — agriculteurs, familles, artisans, restaurateurs — pour garantir que les bénéfices du tourisme restent là où ils doivent être : au sein de la communauté elle-même. Chaque partenariat est intentionnel, respectueux et fondé sur la confiance.\n\nCe qui nous rend différents\n\nChaque groupe est unique. Je m'adapte au rythme de la journée, à votre énergie, à vos intérêts et à votre rythme. Parfois, le moment le plus inoubliable vient d'un détour, d'un ralentissement ou de l'écoute d'une histoire qui ne faisait pas partie du plan.\n\nChez Tours & Detours, nous ne nous contentons pas de vous montrer la Catalogne — nous vous aidons à en faire l'expérience de la manière la plus authentique, responsable et significative possible.\n\nJ'ai hâte de vous accueillir pour ce voyage. Embrassons les détours ensemble — c'est là que nous trouverons ce qui compte le plus.",
            cta_contact: 'Me contacter',
            cta_tours: 'Voir le portfolio',
            features: [
                'Sobre & Précis',
                'Ancré dans le Territoire',
                '15+ Ans d\'Expérience',
                'Privé & Sur Mesure',
                'Responsable par Nature',
                'Exécution Fluide'
            ]
        },
        features: {
            tag: 'POURQUOI NOUS CHOISIR',
            title: "Ce que j'apporte à chaque excursion",
            items: [
                { title: 'Expertise Locale', desc: 'Connaissance approfondie de la culture, la nature et la logistique.' },
                { title: 'Activités Riches', desc: 'Des tours qui connectent avec les histoires et les communautés locales.' },
                { title: 'Sécurité', desc: 'Formé à la gestion de groupe et au leadership outdoor.' },
                { title: 'Responsable', desc: 'Privilégie la durabilité et les routes à faible impact.' }
            ]
        },
        testimonials: {
            tag: 'TÉMOIGNAGES',
            title: 'Ce que disent nos voyageurs'
        },
        contact: {
            tag: 'RÉSERVATION',
            title: 'Prêt à découvrir la Catalogne ?',
            desc: 'Contactez-moi pour réserver votre excursion personnalisée. Je vous répondrai dans les 24 heures.',
            whatsapp: '+34 623 97 31 05',
            form_title: 'Envoyez un message',
            name: 'Nom',
            email: 'Email',
            tour: 'Tour souhaité',
            date: 'Date préférée',
            message: 'Message',
            cta: 'Envoyer ma demande',
            select_tour: 'Sélectionnez un tour'
        },
        booking: {
            selection: 'Votre sélection',
            traveler: 'voyageur',
            travelers: 'voyageurs',
            total: 'Total',
            step: 'Étape',
            step_of: 'sur',
            date_title: 'Quand souhaitez-vous partir ?',
            date_label: 'Date du tour',
            participants: 'Nombre de participants',
            info_title: 'Vos informations',
            payment_title: 'Paiement',
            success_title: 'Réservation confirmée !',
            date_error: 'Date requise',
            info_error: 'Nom et Email sont requis',
            next: 'Suivant',
            pay: 'Payer et Réserver',
            finish: 'Terminer',
            included_label: 'Inclus',
            not_included_label: 'Non inclus',
            comment_label: 'Commentaire (infos complémentaires, restrictions alimentaires)',
            comment_placeholder: 'Avez-vous des besoins spécifiques ?',
            subtotal: 'Prix du tour',
            processing_fees: 'Frais de traitement du paiement',
            per_person_incl_fees: 'par personne (frais inclus)',
            phone: 'Téléphone',
            payment_error: 'Erreur de paiement',
            initialization: 'Initialisation du paiement...',
            summary: 'Récapitulatif :',
            total_paid: 'Total payé :',
            participants_label: 'Voyageurs :',
            billing_address: 'Adresse de facturation',
            city: 'Ville',
            zip: 'Code postal',
            country: 'Pays',
            pickup_address: 'Adresse de pick-up (Barcelone)',
            summary_title: 'Récapitulatif de votre commande',
            personal_info: 'Informations personnelles',
            tour_details: 'Détails du tour',
            pickup_time: 'Heure de pick-up',
            return_time: 'Heure de retour',
            itinerary: 'Itinéraire'
        },
        tour_dialog: {
            highlights_label: 'Points forts :',
            itinerary_label: 'Itinéraire :',
            included_label: 'Inclus :',
            not_included_label: 'Non inclus :',
            good_to_know_label: 'Bon à savoir',
            quick_info: 'Infos rapides :',
            instant_confirmation: 'Confirmation instantanée',
            flexible_cancellation: 'Annulation flexible (24h)',
            open_maps: 'Ouvrir dans Google Maps',
            maps_description: 'Visualisez le point de rencontre directement sur Google Maps pour une meilleure expérience.',
            maps_button: "S'y rendre (Google Maps)",
            view_on_maps: 'Visualiser sur Google Maps'
        },
        footer: {
            made_with: 'Fait avec Passion.',
            legal: 'Mentions légales',
            privacy: 'Confidentialité',
            navigation: 'Navigation'
        },
        live: {
            title: 'Un tour est actuellement en cours !',
            no_session: 'Aucune session en cours.',
            join_button: 'Rejoindre'
        },
        whatsapp: {
            floating_text: 'Une question ? Discutez avec moi !',
            message_prefix: 'Bonjour Antoine ! Je suis intéressé par vos tours...'
        },
        cookies: {
            title: 'Respect de votre vie privée',
            desc: 'Nous utilisons des cookies pour améliorer votre expérience sur notre site.',
            accept: 'Accepter',
            decline: 'Refuser',
            manage: 'Paramètres',
            save: 'Enregistrer mes choix',
            essential: 'Essentiels (Toujours actifs)',
            analytics: 'Analytiques & Performance',
            marketing: 'Marketing & Publicité'
        },
        tour_data: [
            {
                id: 1,
                title: 'Costa Brava & Girona : sentiers médiévaux et beauté côtière',
                subtitle: 'Profondeur culturelle et paysages marquants',
                description: 'Un voyage d\'une journée entière, guidé privativement, combinant l\'héritage juif et médiéval de Gérone avec les villages côtiers raffinés de la Costa Brava.',
                highlights: ['Quartier Juif (El Call)', 'Village médiéval de Pals', 'Calella de Palafrugell & Llafranc', 'Randonnée Camí de Ronda optionnelle', 'Déjeuner méditerranéen'],
                itinerary: [
                    'Départ de votre hébergement à Barcelone',
                    'Visite guidée du vieux Gérone et du quartier juif',
                    'Exploration du village médiéval de Pals',
                    'Temps libre et déjeuner à Calella de Palafrugell',
                    'Petite marche sur le célèbre Camí de Ronda',
                    'Retour à Barcelone en fin d\'après-midi'
                ],
                included: ['Guide privé expert', 'Transport privé AR', 'Visite de Gérone', 'Village médiéval de Pals', 'Assurance voyage'],
                notIncluded: ['Déjeuner et boissons', 'Entrées aux monuments (optionnel)', 'Dépenses personnelles'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 145,
                image: '/tour-girona.jpg',
                images: ['/tour-girona.jpg', '/tour-girona-2.png', '/tour-girona-3.png'],
                meetingPoint: 'https://www.google.com/maps/place/Barcelone',
                meetingPointMapUrl: 'https://www.google.com/maps/place/Barcelone',
                category: 'Excursion'
            },
            {
                id: 4,
                title: 'Randonnée Villages Médiévaux — Pré-Pyrénées',
                subtitle: 'Marche, Nature & Patrimoine',
                description: 'Une randonnée immersive à faible impact (6km) commençant dans une ville médiévale, avec des chapelles romanes et des vallées forestières. Idéal pour le calme.',
                highlights: ['Départ village médiéval', 'Chapelles romanes', 'Vallées forestières', 'Paysages paisibles', 'Marche immersive 6km'],
                itinerary: [
                    'Transfert vers les Pré-Pyrénées',
                    'Orientation dans un village médiéval authentique',
                    'Randonnée guidée à travers les forêts et chapelles',
                    'Pause snack avec produits locaux',
                    'Retour à Barcelone'
                ],
                included: ['Guide spécialisé outdoor', 'Transport privé', 'Bâtons de marche', 'Snacks locaux', 'Assurance accident'],
                notIncluded: ['Déjeuner pique-nique', 'Dépenses personnelles'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 95,
                image: '/tour-prepirinees.jpg',
                images: ['/tour-prepirinees.jpg', '/tour-prepirinees-2.png'],
                category: 'Nature'
            },
            {
                id: 5,
                title: 'Kayak Costa Brava — Grottes Marines & Criques Cachées',
                subtitle: 'Aventure, Nature & Activités Nautiques',
                description: 'Une expérience guidée en kayak explorant grottes marines, vie marine et falaises escarpées. Opéré avec des partenaires locaux audités.',
                highlights: ['Exploration de grottes', 'Falaises escarpées', 'Vie marine', 'Sécurité auditée', 'Demi ou Journée entière'],
                itinerary: [
                    'Arrivée à la base nautique de la Costa Brava',
                    'Briefing de sécurité et préparation du matériel',
                    'Navigation le long des falaises et grottes',
                    'Séquence de snorkeling dans une crique isolée',
                    'Débriefing et retour'
                ],
                included: ['Guide de kayak certifié', 'Équipement complet (kayak, gilet, pagaie)', 'Sac étanche', 'Assurance spécifique'],
                notIncluded: ['Transport vers le site', 'Repas et boissons', 'Crème solaire'],
                duration: 'Demi/Journée entière',
                groupSize: '1-8',
                price: 75,
                image: '/tour-kayak.jpg',
                images: ['/tour-kayak.jpg', '/tour-kayak-2.png'],
                category: 'Aventure'
            },
            {
                id: 6,
                title: 'Expérience Montserrat & Vin',
                subtitle: 'Culture, Décors & Gastronomie',
                description: 'Une journée combinant le paysage majestueux et la spiritualité de Montserrat avec la visite d\'une bodega familiale et une dégustation.',
                highlights: ['Exploration du monastère', 'Vues panoramiques', 'Visite cave locale', 'Dégustation', 'Bodega familiale'],
                itinerary: [
                    'Départ de Barcelone vers la montagne sacrée',
                    'Visite guidée du Monastère de Montserrat',
                    'Transfert vers une bodega familiale du Penedès',
                    'Visite des vignes et de la cave',
                    'Dégustation de vins locaux et retour'
                ],
                included: ['Guide privé passionné', 'Transport privé AR', 'Visite de Montserrat', 'Visite de cave et dégustation', 'Assurance voyage'],
                notIncluded: ['Déjeuner', 'Funiculaire de Montserrat', 'Dépenses personnelles'],
                duration: 'Demi/Journée entière',
                groupSize: '1-8',
                price: 125,
                image: '/tour-montserrat.jpg',
                images: ['/tour-montserrat.jpg', '/tour-montserrat-2.png'],
                category: 'Culture'
            },
            {
                id: 7,
                title: 'Gérone et Collioure : un voyage méditerranéen transfrontalier',
                subtitle: 'Histoire, paysages, gastronomie et architecture',
                description: 'Une journée complète reliant la profondeur médiévale de la Catalogne au charme côtier du sud de la France.',
                highlights: ['Cathédrale de Gérone & El Call', 'Traversée des Pyrénées', 'Port & Forteresse de Collioure', 'Dégustation d\'anchois boutique', 'Déjeuner méditerranéen complet'],
                itinerary: [
                    'Départ matinal de Barcelone',
                    'Visite historique de Gérone',
                    'Route panoramique vers la France',
                    'Temps libre et déjeuner à Collioure',
                    'Dégustation d\'anchois traditionnelles',
                    'Trajet retour vers Barcelone'
                ],
                included: ['Guide privé AR', 'Transport confortable', 'Déjeuner complet inclus', 'Dégustation d\'anchois', 'Assurance voyage'],
                notIncluded: ['Dépenses personnelles', 'Entrées additionnelles'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 165,
                image: '/tour-collioure.jpg',
                images: ['/tour-collioure.jpg'],
                category: 'Excursion'
            },
            {
                id: 2,
                title: 'Tour à pied de Barcelone — Coins secrets de la vieille ville',
                subtitle: 'Culturel, Voyage Responsable',
                description: 'Une exploration slow-travel des quartiers Gothique et Born, dévoilant l\'histoire, les légendes et les histoires de quartier loin des circuits bondés.',
                highlights: ['Quartiers Gothique & Born', 'Histoire cachée', 'Légendes & récits locaux', 'Loin des foules'],
                itinerary: [
                    'Rendez-vous dans la Vieille Ville',
                    'Exploration du quartier Gothique et de ses secrets',
                    'Traversée vers le Born et son histoire marchande',
                    'Dégustation d\'un snack traditionnel local',
                    'Fin du tour avec recommandations personnalisées'
                ],
                included: ['Guide local licencié', 'Tour à pied personnalisé', 'Recommandations locales', 'Petit snack traditionnel'],
                notIncluded: ['Transport public', 'Entrées musées', 'Repas complets'],
                duration: 'Demi-journée',
                groupSize: '1-8',
                price: 55,
                image: '/tour-barcelona-hidden.jpg',
                images: ['/tour-barcelona-hidden.jpg'],
                category: 'Ville'
            },
            {
                id: 3,
                title: 'Randonnée sur le sentier côtier — Costa Brava “Camí de Ronda”',
                subtitle: 'Marche & Trekking',
                description: 'Une randonnée côtière spectaculaire (6km) sur l\'un des sentiers les plus emblématiques de Catalogne. Forêts de pins et criques turquoises.',
                highlights: ['Randonnée côtière 6km', 'Criques turquoises', 'Déjeuner de la mer', 'Possibilité de baignade'],
                itinerary: [
                    'Départ de Barcelone vers Calella de Palafrugell',
                    'Début de la marche guidée sur le sentier côtier',
                    'Arrêt dans une crique pour une pause baignade',
                    'Fin de la rando et déjeuner marin',
                    'Temps libre dans le village et retour'
                ],
                included: ['Guide de randonnée', 'Transport privé AR', 'Visite de Calella de Palafrugell', 'Assurance outdoor'],
                notIncluded: ['Déjeuner au restaurant', 'Équipement de snorkeling', 'Boissons'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 85,
                image: '/tour-camironda.jpg',
                images: ['/tour-camironda.jpg'],
                category: 'Randonnée'
            }
        ],
        testimonials_data: [
            { id: 1, text: 'Une expérience inoubliable ! Antoine connaît chaque recoin de la Catalogne.', name: 'Marie & Pierre', loc: 'Paris, France', avatar: 'MP', rating: 5 },
            { id: 2, text: 'La randonnée Costa Brava était magique. Les connaissances d\'Antoine sont impressionnantes.', name: 'Sarah Johnson', loc: 'Londres, UK', avatar: 'SJ', rating: 5 },
            { id: 3, text: 'Nous avons fait le tour Montserrat et c\'était fantastique ! Tout était parfait.', name: 'Hans & Lisa', loc: 'Berlin, Allemagne', avatar: 'HL', rating: 5 }
        ]
    },
    en: {
        nav: {
            tours: 'Our Tours',
            about: 'About',
            guide: 'Your Guide',
            avis: 'Reviews',
            contact: 'Contact',
            reserve: 'Book Now',
            live: 'Live Experience',
            no_live: 'No tour in progress',
            enter_code: 'Enter tour code',
            home: 'Home'
        },
        common: {
            back: 'Back',
            next: 'Next',
            finish: 'Finish',
            pay: 'Pay & Book',
            error_server: 'Server error'
        },
        about_hook: {
            title: 'A human and authentic approach to discover the real Catalonia.',
            cta: 'Learn more about your guide →'
        },
        about: {
            me: { label: 'About', badge: 'Your Local Guide', title: 'Antoine, passionate about Catalonia and its secrets', exp: "Years of Experience" },
            philosophy: {
                label: 'Philosophy', tag: 'Our Philosophy', title: "More than a tour, an authentic immersion", quote: "My vision is to show you the region as if you were with a local friend.", items: [
                    { title: 'Authenticity', desc: 'Discover the true local culture.' },
                    { title: 'Respect', desc: 'Sustainable and respectful tourism.' },
                    { title: 'Proximity', desc: 'Small groups for better interaction.' }
                ]
            },
            different: {
                label: 'Differences', tag: 'What makes us different', title: 'Why not choose a classic agency?', items: [
                    { title: "Local Experts", desc: "We live here, we know every path." },
                    { title: "Secret Itineraries", desc: "Avoid crowds with our exclusive routes." },
                    { title: "Total Flexibility", desc: "We adapt to your rhythm and wishes." }
                ]
            },
            why: { label: 'Why us?', title: 'The trust of our travelers', stats: [{ val: '150+', label: 'Travelers' }, { val: '5.0', label: 'Average rating' }, { val: '100%', label: 'Local' }], quote: "An unforgettable experience! Antoine knows the region like the back of his hand and took us to places where no tourist goes.", back: '← Back to Home' }
        },
        hero: {
            tagline: 'Discover authentic Catalonia',
            title: 'Unique Tours and Experiences in Barcelona and Environs',
            subtitle: 'Small groups, passionate local guide',
            description: 'Personalized excursions to discover the secrets of Catalonia, away from the tourist crowds — culture, nature, and adventure',
            cta_discover: 'See All Tours',
            cta_contact: 'Contact Me'
        },
        seo: {
            title: 'Tours & Detours - Unique Tours and Experiences in Barcelona',
            description: 'Personalized excursions and guided tours in Catalonia. Discover Girona, Costa Brava, Montserrat and more with a local expert.'
        },
        stats: {
            exp: 'years experience',
            local: 'local expert',
            review: 'on TripAdvisor',
            langs: 'languages',
            groups: 'Small Groups',
            guides: '100% Local Guides',
            authentic: 'Authentic Experiences'
        },
        tours: {
            section_tag: 'OUR EXPERIENCES',
            section_title: 'Guided Excursions in Catalonia',
            category_title: 'Find your next adventure',
            selection_tag: 'Tour Selection',
            top_tours_title: 'Our Must-See Tours',
            top_tours_desc: 'Private excursions in small groups in Barcelona and Catalonia. Each excursion is carefully designed to offer you an authentic experience, off the beaten path and tailored to your interests.',
            section_desc: 'Each excursion is carefully designed to offer you an authentic experience, off the beaten path.',
            learn_more: 'More Information',
            book_now: 'Book Now',
            duration: 'Duration',
            group: 'Group',
            price: 'Price',
            from_price: 'From',
            per_person: 'per person',
            tabs: {
                desc: 'Description',
                itin: 'Itinerary',
                incl: 'Included / Not Included',
                meet: 'Good to Know'
            },
            duration_labels: {
                "Journée entière": "Full Day",
                "Demi-journée": "Half Day",
                "Demi/Journée entière": "Half/Full Day"
            },
            categories: {
                nature: 'Nature',
                rando: 'Hiking',
                walking: 'Walking Tour',
                gastro: 'Gastronomy',
                views: 'Spectacular Views',
                culture: 'Cultural',
                urban: 'Urban Adventure',
                bcn: 'Barcelona City',
                outside: 'Outside of Barcelona'
            },
            no_tours_found: 'No tours found in this category.'
        },
        guide: {
            section_tag: 'YOUR GUIDE',
            title: 'Hello, I am Antoine Pilard',
            bio: "Antoine Pilard & Tours and Detours\n\nI design and personally lead private experiences across Catalonia for well-traveled guests seeking cultural depth, calm pacing, and meaningful local connections — away from crowds and clichés.\n\nTravel has shaped my life for more than 15 years. From my own journeys across Europe, Africa, Asia, and the Americas to guiding travelers through the historic avenues of Paris and Northern France, leading hiking, biking, and rafting adventures across the Alps and the Pyrenees, I've always believed one thing: the best experiences are found in detours — when we slow down, pay attention, and truly connect with the world around us.\n\nWith over 15 years of guiding experience across France, Andorra, and Spain, and as a former Intrepid Travel tour leader (2018–2022), I combine strong operational standards with a discreet, human approach to guiding. Based in Barcelona since 2022, I work closely with trusted local partners to deliver seamless, privately guided days and multi-day experiences tailored to each client's interests, pace, and expectations. This belief in meaningful travel is the heart of Tours & Detours.\n\nOur Philosophy\n\nHere in Catalonia — a place I proudly call home — we craft experiences that honor the land, its people, and the traditions that make it unique. We practice slow travel, choosing depth over speed and meaning over mileage. We monitor our carbon footprint, integrate walking and non-motorized activities whenever possible, and design itineraries that respect and benefit both the environment and the communities who welcome us.\n\nOur spirit is rooted in adventure — not in the sense of extreme challenges, but in the joy of discovery: a quiet coastal path, a forest track only locals know, a village artisan opening their workshop, a winemaker engaged in sustainable practices sharing stories over a glass. These moments become memories because they are real, human, and unforced.\n\nWe work closely with local stakeholders — farmers, families, artisans, restaurateurs — ensuring that the benefits of tourism stay where they belong: within the community itself. Every partnership is intentional, respectful, and built on trust.\n\nWhat Makes Us Different\n\nEvery group is unique. I read the rhythm of the day and adapt to your energy, your interests, and your pace. Sometimes the most unforgettable moment comes from taking a detour, slowing down, or listening to a story that wasn't part of the plan.\n\nAt Tours & Detours, we don't just show you Catalonia — we help you experience it in the most authentic, responsible, and meaningful way possible.\n\nI look forward to welcoming you on the journey. Let's embrace the detours together — this is where we'll find what matters most.",
            cta_contact: 'Contact Me',
            cta_tours: 'View Portfolio',
            features: [
                'Understated & Precise',
                'Deeply Rooted in Place',
                '15+ Years Experience',
                'Private & Customizable',
                'Responsible by Nature',
                'Seamless Execution'
            ]
        },
        features: {
            tag: 'WHY CHOOSE US',
            title: "What I bring to every excursion",
            items: [
                { title: 'Local Expertise', desc: 'In-depth knowledge of culture, nature, and on-the-ground logistics.' },
                { title: 'Rich Activities', desc: 'Tours that connect travelers with local stories and communities.' },
                { title: 'Safety', desc: 'Trained in group management and outdoor activity leadership.' },
                { title: 'Responsible', desc: 'Prioritizing sustainability and low-impact routes.' }
            ]
        },
        testimonials: {
            tag: 'TESTIMONIALS',
            title: 'What our travelers say'
        },
        contact: {
            tag: 'BOOKING',
            title: 'Ready to discover Catalonia?',
            desc: 'Contact me to book your personalized excursion. I will answer within 24 hours.',
            whatsapp: '+34 623 97 31 05',
            form_title: 'Send a message',
            name: 'Name',
            email: 'Email',
            tour: 'Desired Tour',
            date: 'Preferred Date',
            message: 'Message',
            cta: 'Send My Request',
            select_tour: 'Select a tour'
        },
        booking: {
            selection: 'Your selection',
            traveler: 'traveler',
            travelers: 'travelers',
            total: 'Total',
            step: 'Step',
            step_of: 'of',
            date_title: 'When do you want to go?',
            date_label: 'Tour date',
            participants: 'Number of participants',
            info_title: 'Your information',
            payment_title: 'Payment',
            success_title: 'Booking Confirmed!',
            date_error: 'Date required',
            info_error: 'Name and Email are required',
            next: 'Next',
            pay: 'Pay & Book',
            finish: 'Finish',
            included_label: 'Included',
            not_included_label: 'Not Included',
            comment_label: 'Comments (additional info, dietary restrictions)',
            comment_placeholder: 'Do you have any specific needs?',
            subtotal: 'Tour price',
            processing_fees: 'Payment processing fees',
            per_person_incl_fees: 'per person (fees included)',
            phone: 'Phone',
            payment_error: 'Payment Error',
            initialization: 'Initializing payment...',
            summary: 'Summary:',
            total_paid: 'Total paid:',
            participants_label: 'Travelers:',
            billing_address: 'Billing Address',
            city: 'City',
            zip: 'Zip Code',
            country: 'Country',
            pickup_address: 'Pickup Address (Barcelona)',
            summary_title: 'Order Summary',
            personal_info: 'Personal Information',
            tour_details: 'Tour Details',
            pickup_time: 'Pickup Time',
            return_time: 'Return Time',
            itinerary: 'Itinerary'
        },
        tour_dialog: {
            highlights_label: 'Highlights:',
            itinerary_label: 'Itinerary:',
            included_label: 'Included:',
            not_included_label: 'Not Included:',
            good_to_know_label: 'Good to know',
            quick_info: 'Quick info:',
            instant_confirmation: 'Instant confirmation',
            flexible_cancellation: 'Flexible cancellation (24h)',
            open_maps: 'Open in Google Maps',
            maps_description: 'View the meeting point directly on Google Maps for the best experience.',
            maps_button: 'Open in Google Maps',
            view_on_maps: 'View on Google Maps'
        },
        footer: {
            made_with: 'Made with Passion.',
            legal: 'Legal Notice',
            privacy: 'Privacy Policy',
            navigation: 'Navigation'
        },
        live: {
            title: 'A tour is currently in progress!',
            no_session: 'No session in progress.',
            join_button: 'Join'
        },
        whatsapp: {
            floating_text: 'Any questions? Chat with me!',
            message_prefix: 'Hello Antoine! I am interested in your tours...'
        },
        cookies: {
            title: 'Respecting your privacy',
            desc: 'We use cookies to improve your experience on our site.',
            accept: 'Accept',
            decline: 'Decline',
            manage: 'Manage settings',
            save: 'Save choices',
            essential: 'Essential (Always active)',
            analytics: 'Analytics & Performance',
            marketing: 'Marketing & Advertising'
        },
        tour_data: [
            {
                id: 1,
                title: 'Costa Brava & Girona: Medieval paths and coastal beauty',
                subtitle: 'Significant cultural depth and scenery',
                description: 'A privately guided, full-day journey combining Girona’s Jewish and medieval heritage with the refined coastal villages of the Costa Brava.',
                highlights: ["Girona's Jewish Quarter (El Call)", 'Medieval village of Pals', 'Calella de Palafrugell & Llafranc', 'Optional Camí de Ronda coastal walk', 'Mediterranean lunch'],
                included: ['Expert private guide', 'Round-trip private transport', 'Girona city tour', 'Pals medieval village visit', 'Travel insurance'],
                notIncluded: ['Lunch and drinks', 'Monument entry fees (optional)', 'Personal expenses'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 145,
                image: '/tour-girona.jpg',
                images: ['/tour-girona.jpg', '/tour-girona-2.png', '/tour-girona-3.png'],
                meetingPoint: 'https://www.google.com/maps/place/Barcelone',
                meetingPointMapUrl: 'https://www.google.com/maps/place/Barcelone',
                itinerary: [
                    'Departure from your accommodation in Barcelona',
                    'Guided tour of Old Girona and the Jewish Quarter',
                    'Exploration of the medieval village of Pals',
                    'Free time and lunch in Calella de Palafrugell',
                    'Short walk on the famous Camí de Ronda',
                    'Return to Barcelona in the late afternoon'
                ],
                category: 'Excursion'
            },
            {
                id: 4,
                title: 'Medieval Villages Hike — Pre-Pyrenees',
                subtitle: 'Walking, Nature & Heritage',
                description: 'A low-impact, immersive hike (6km) starting in a medieval town, featuring Romanesque chapels and forested valleys. Perfect for travellers seeking quiet landscapes.',
                highlights: ['Medieval town start', 'Romanesque chapels', 'Forested valleys', 'Quiet landscapes', '6km immersive walk'],
                included: ['Specialized outdoor guide', 'Private transport', 'Walking poles', 'Local snacks', 'Accident insurance'],
                notIncluded: ['Picnic lunch', 'Personal expenses'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 95,
                image: '/tour-prepirinees.jpg',
                images: ['/tour-prepirinees.jpg', '/tour-prepirinees-2.png'],
                itinerary: [
                    'Transfer to the Pre-Pyrenees',
                    'Orientation in an authentic medieval village',
                    'Guided hike through forests and chapels',
                    'Snack break with local products',
                    'Return to Barcelona'
                ],
                category: 'Nature'
            },
            {
                id: 5,
                title: 'Kayak the Costa Brava — Sea Caves & Hidden Coves',
                subtitle: 'Adventure, Nature & Water Activity',
                description: 'A guided kayaking experience exploring sea caves, marine life and rugged cliffs. Operated with audited local partners for safety standards.',
                highlights: ['Sea caves exploration', 'Rugged cliffs', 'Marine life', 'Safety-audited gear', 'Half or Full Day'],
                included: ['Certified kayak guide', 'Full equipment (kayak, vest, paddle)', 'Dry bag', 'Specific insurance'],
                notIncluded: ['Transport to site', 'Meals and drinks', 'Sunscreen'],
                duration: 'Half/Full Day',
                groupSize: '1-8',
                price: 75,
                image: '/tour-kayak.jpg',
                images: ['/tour-kayak.jpg', '/tour-kayak-2.png'],
                itinerary: [
                    'Arrival at the Costa Brava nautical base',
                    'Safety briefing and equipment preparation',
                    'Navigation along cliffs and sea caves',
                    'Snorkeling session in a hidden cove',
                    'Debriefing and return'
                ],
                category: 'Aventure'
            },
            {
                id: 6,
                title: 'Montserrat & Wine Experience',
                subtitle: 'Cultural, Scenic & Food & Wine',
                description: 'A day combining the majestic landscape and spirituality of Montserrat with a family-run bodega visit and tasting session.',
                highlights: ['Monastery exploration', 'Panoramic views', 'Local winery visit', 'Tasting session', 'Family-run bodega'],
                included: ['Passionate private guide', 'Round-trip private transport', 'Montserrat visit', 'Winery tour & tasting', 'Travel insurance'],
                notIncluded: ['Lunch', 'Montserrat funicular', 'Personal expenses'],
                duration: 'Half/Full Day',
                groupSize: '1-8',
                price: 125,
                image: '/tour-montserrat.jpg',
                images: ['/tour-montserrat.jpg', '/tour-montserrat-2.png'],
                itinerary: [
                    'Departure from Barcelona to the sacred mountain',
                    'Guided tour of Montserrat Monastery',
                    'Transfer to a family-run Penedès bodega',
                    'Vineyard and cellar tour',
                    'Local wine tasting and return'
                ],
                category: 'Culture'
            },
            {
                id: 7,
                title: 'Girona and Collioure: a crossborder Mediterranean journey',
                subtitle: 'History, scenery, gastronomy and architecture',
                description: 'A full-day journey connecting the medieval depth of Catalonia with the refined coastal charm of southern France.',
                highlights: ["Girona's Jewish Quarter & Gothic cathedral", 'Scenic Pyrenees crossing', 'Collioure harbor & fortress', 'Boutique anchovy tasting', '3-course Mediterranean lunch'],
                included: ['Private guide', 'Comfortable transport', 'Full 3-course lunch', 'Anchovy tasting', 'Travel insurance'],
                notIncluded: ['Personal expenses', 'Additional entry fees'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 165,
                image: '/tour-collioure.jpg',
                images: ['/tour-collioure.jpg'],
                itinerary: [
                    'Early morning departure from Barcelona',
                    'Historic visit of Girona',
                    'Scenic drive to France',
                    'Free time and lunch in Collioure',
                    'Traditional anchovy tasting',
                    'Return trip to Barcelona'
                ],
                category: 'Excursion'
            },
            {
                id: 2,
                title: 'Barcelona Walking Tour — Hidden Corners of the Old City',
                subtitle: 'Cultural, Responsible Travel',
                description: 'A slow-travel exploration of the Gothic and Born neighbourhoods, uncovering history, legends, community stories, and lesser-known locations.',
                highlights: ['Gothic & Born quarters', 'Hidden history', 'Legends & community stories', 'Away from crowds'],
                included: ['Licensed local guide', 'Personalized walking tour', 'Local recommendations', 'Traditional small snack'],
                notIncluded: ['Public transport', 'Museum entries', 'Full meals'],
                duration: 'Half Day',
                groupSize: '1-8',
                price: 55,
                image: '/tour-barcelona-hidden.jpg',
                images: ['/tour-barcelona-hidden.jpg'],
                itinerary: [
                    'Meeting in the Old City',
                    'Exploration of the Gothic Quarter and its secrets',
                    'Crossing into Born and its merchant history',
                    'Tasting of a traditional local snack',
                    'End of tour with personalized recommendations'
                ],
                category: 'Ville'
            },
            {
                id: 3,
                title: 'Hike the Coastal Path — Costa Brava “Camí de Ronda”',
                subtitle: 'Walking & Trekking',
                description: 'A spectacular coastal hike (6km) on one of Catalonia’s most iconic trails. Pine forests, turquoise coves, and panoramic viewpoints.',
                highlights: ['6km coastal hike', 'Turquoise coves', 'Seafood lunch', 'Swim opportunities'],
                included: ['Hiking guide', 'Round-trip private transport', 'Calella de Palafrugell visit', 'Outdoor insurance'],
                notIncluded: ['Restaurant lunch', 'Snorkeling gear', 'Drinks'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 85,
                image: '/tour-camironda.jpg',
                images: ['/tour-camironda.jpg'],
                itinerary: [
                    'Departure from Barcelona to Calella de Palafrugell',
                    'Start of the guided walk on the coastal path',
                    'Stop at a cove for a swim break',
                    'End of hike and seafood lunch',
                    'Free time in the village and return'
                ],
                category: 'Randonnée'
            }
        ],
        testimonials_data: [
            { id: 1, text: 'An unforgettable experience! Antoine knows every corner of Catalonia.', name: 'Marie & Pierre', loc: 'Paris, France', avatar: 'MP', rating: 5 },
            { id: 2, text: 'The Costa Brava hike was absolutely magical. Antoine\'s knowledge is impressive.', name: 'Sarah Johnson', loc: 'Londres, UK', avatar: 'SJ', rating: 5 },
            { id: 3, text: 'We did the Montserrat tour and it was fantastic! Everything was perfect.', name: 'Hans & Lisa', loc: 'Berlin, Germany', avatar: 'HL', rating: 5 }
        ]
    },
    es: {
        nav: {
            tours: 'Nuestros Tours',
            about: 'Sobre mí',
            guide: 'Tu Guía',
            avis: 'Opiniones',
            contact: 'Contacto',
            reserve: 'Reservar',
            live: 'Experiencia Live',
            no_live: 'No hay tour en curso',
            enter_code: 'Introduce el código del tour',
            home: 'Inicio'
        },
        common: {
            back: 'Volver',
            next: 'Siguiente',
            finish: 'Terminar',
            pay: 'Pagar y Reservar',
            error_server: 'Error del servidor'
        },
        about_hook: {
            title: 'Un enfoque humano y auténtico para descubrir la verdadera Cataluña.',
            cta: 'Saber más sobre su guía →'
        },
        about: {
            me: { label: 'Sobre mí', badge: 'Tu Guía Local', title: 'Antoine, apasionado por Cataluña y sus secretos', exp: "Años de experiencia" },
            philosophy: {
                label: 'Filosofía', tag: 'Nuestra Filosofía', title: "Más que un tour, una inmersión auténtica", quote: "Mi visión es hacerte descubrir la región como si estuvieras con un amigo local.", items: [
                    { title: 'Autenticidad', desc: 'Descubre la verdadera cultura local.' },
                    { title: 'Respeto', desc: 'Turismo sostenible y respetuoso.' },
                    { title: 'Proximidad', desc: 'Grupos reducidos para mayor intercambio.' }
                ]
            },
            different: {
                label: 'Diferencias', tag: 'Lo que nos hace diferentes', title: '¿Por qué no elegir una agencia clásica?', items: [
                    { title: "Expertos locales", desc: "Vivimos aquí, conocemos cada camino." },
                    { title: "Itinerarios secretos", desc: "Evita las multitudes con nuestras rutas exclusivas." },
                    { title: "Flexibilidad total", desc: "Nos adaptamos a tu ritmo y deseos." }
                ]
            },
            why: { label: '¿Por qué nosotros?', title: 'La confianza de nuestros viajeros', stats: [{ val: '150+', label: 'Viajeros' }, { val: '5.0', label: 'Nota media' }, { val: '100%', label: 'Local' }], quote: "¡Una experiencia inolvidable! Antoine conoce la región como la palma de su mano y nos llevó a lugares donde no va ningún turista.", back: '← Volver al inicio' }
        },
        hero: {
            tagline: 'Descubre la Cataluña auténtica',
            title: 'Tours y Experiencias Únicas en Barcelona y Alrededores',
            subtitle: 'Grupos pequeños, guía local apasionado',
            description: 'Excursiones personalizadas para descubrir los secretos de Cataluña, lejos de las multitudes — cultura, naturaleza y aventura',
            cta_discover: 'Ver Todos los Tours',
            cta_contact: 'Contáctame'
        },
        seo: {
            title: 'Tours & Detours - Tours y Experiencias Únicas en Barcelona',
            description: 'Excursiones personalizadas y tours guiados en Cataluña. Descubre Girona, Costa Brava, Montserrat y mucho más con un experto local.'
        },
        stats: {
            exp: 'años de experiencia',
            local: 'experto local',
            review: 'en TripAdvisor',
            langs: 'idiomas',
            groups: 'Grupos Pequeños',
            guides: 'Guías 100% Locales',
            authentic: 'Experiencias Auténticas'
        },
        tours: {
            section_tag: 'NUESTRAS EXPERIENCIAS',
            section_title: 'Excursions Guidées en Cataluña',
            category_title: 'Encuentra tu próxima aventura',
            selection_tag: 'Selección del tour',
            top_tours_title: 'Nuestros tours imprescindibles',
            top_tours_desc: 'Excursiones privadas en grupos pequeños en Barcelona y Cataluña. Cada excursión está cuidadosamente diseñada para ofrecerle una experiencia auténtica, fuera de las rutas habituales y adaptada a sus intereses.',
            section_desc: 'Cada excursión está cuidadosamente diseñada para ofrecerte una experiencia auténtica, fuera de las rutas comunes.',
            learn_more: 'Más Información',
            book_now: 'Reservar Ahora',
            duration: 'Duración',
            group: 'Grupo',
            price: 'Precio',
            from_price: 'Desde',
            per_person: 'por persona',
            tabs: {
                desc: 'Descripción',
                itin: 'Itinerario',
                incl: 'Incluido / No Incluido',
                meet: 'Información útil'
            },
            duration_labels: {
                "Journée entière": "Día completo",
                "Demi-journée": "Medio día",
                "Demi/Journée entière": "Medio/Día completo"
            },
            categories: {
                nature: 'Naturaleza',
                rando: 'Senderismo',
                walking: 'Tour a pie',
                gastro: 'Gastronomía',
                views: 'Vistas espectaculares',
                culture: 'Cultural',
                urban: 'Aventura urbana',
                bcn: 'Barcelona ciudad',
                outside: 'Fuera de Barcelona'
            },
            no_tours_found: 'No se han encontrado tours en esta categoría.'
        },
        guide: {
            section_tag: 'TU GUÍA',
            title: 'Hola, soy Antoine Pilard',
            bio: "Antoine Pilard & Tours and Detours\n\nDiseño y lidero personalmente experiencias privadas por Cataluña para viajeros que buscan profundidad cultural, un ritmo pausado y conexiones locales significativas, lejos de las multitudes y los clichés.\n\nViajar ha dado forma a mi vida durante más de 15 años. Desde mis propios viajes por África, Asie y América hasta guiar a viajeros por las avenidas históricas de París y el norte de Francia, o liderar aventuras de senderismo, ciclismo y rafting en los Alpes y los Pirineos, siempre he creído en una cosa: las mejores experiencias se encuentran en los desvíos, cuando reducimos la velocidad, prestamos atención y conectamos de verdad con el mundo que nos rodea.\n\nCon más de 15 años de experiencia como guía en Francia, Andorra y España, y como antiguo líder de viajes de Intrepid Travel (2018–2022), combino altos estándares operativos con un enfoque humano y discreto. Afincado en Barcelona desde 2022, trabajo en estrecha colaboración con socios locales de confianza para ofrecer días guiados privados y experiencias de varios días adaptadas a los intereses, el ritmo y las expectativas de cada cliente. Esta creencia en el viaje con propósito es el corazón de Tours & Detours.\n\nNuestra Filosofía\n\nAquí en Cataluña, un lugar que me enorgullece llamar mi hogar, creamos experiencias que honoran la tierra, a su gente y las tradiciones que la hacen única. Practicamos el \"slow travel\", eligiendo la profundidad sobre la velocidad y el significado sobre el kilometraje. Controlamos nuestra huella de carbono, integramos caminatas y actividades no motorizadas siempre que es posible, y diseñamos itinerarios que respetan y benefician tanto al medio ambiente como a las comunidades que nos acogen.\n\nNuestro espíritu está arraigado en la aventura, no en el sentido de desafíos extremos, sino en la alegría del descubrimiento: un sendero costero tranquilo, una pista forestal que solo los lugareños conocen, un artesano local abriendo su taller, un viticultor comprometido con prácticas sostenibles compartiendo historias con una copa. Estos momentos se convierten en recuerdos porque son reales, humanos y espontáneos.\n\nTrabajamos estrechamente con los actores locales —agricultores, familias, artesanos, restauradores—, asegurándonos de que los beneficios del turismo se queden donde pertenecen: dentro de la propia comunidad. Cada asociación es intencional, respetuosa y basada en la confianza.\n\nLo que nos hace diferentes\n\nCada grupo es único. Analizo el ritmo del día y me adapto a su energía, sus intereses y su ritmo. Parfois, el momento más inolvidable surge de tomar un desvío, reducir la velocidad o escuchar una historia que no formaba parte del plan.\n\nEn Tours & Detours, no solo le mostramos Cataluña: le ayudamos a experimentarla de la manera más auténtica, responsable y significativa posible.\n\nEspero tener el placer de darle la bienvenida. Abracemos los desvíos juntos: aquí es donde encontraremos lo que más importa.",
            cta_contact: 'Contactar',
            cta_tours: 'Ver portfolio',
            features: [
                'Sobrio y Preciso',
                'Arraigado en el Lugar',
                '15+ Años de Experiencia',
                'Privado y Personalizable',
                'Responsable por Naturaleza',
                'Ejecución Impecable'
            ]
        },
        features: {
            tag: '¿POR QUÉ ELEGIRNOS?',
            title: "Lo que aporto a cada excursión",
            items: [
                { title: 'Experiencia Local', desc: 'Conocimiento profundo de la cultura, la naturaleza y la logística.' },
                { title: 'Actividades Ricas', desc: 'Tours que conectan con las historias y las comunidades locales.' },
                { title: 'Seguridad', desc: 'Formado en gestión de grupos y liderazgo outdoor.' },
                { title: 'Responsable', desc: 'Prioriza la sostenibilidad y las rutas de bajo impacto.' }
            ]
        },
        testimonials: {
            tag: 'TESTIMONIOS',
            title: 'Lo que dicen nuestros viajeros'
        },
        contact: {
            tag: 'RESERVAS',
            title: '¿Listo para descubrir Cataluña?',
            desc: 'Contáctame para reservar tu excursión personalizada. Responderé en 24 horas.',
            whatsapp: '+34 623 97 31 05',
            form_title: 'Enviar un mensaje',
            name: 'Nombre',
            email: 'Email',
            tour: 'Tour deseado',
            date: 'Fecha preferida',
            message: 'Mensaje',
            cta: 'Enviar Solicitud',
            select_tour: 'Selecciona un tour'
        },
        booking: {
            selection: 'Tu selección',
            traveler: 'viajero',
            travelers: 'viajeros',
            total: 'Total',
            step: 'Paso',
            step_of: 'de',
            date_title: '¿Cuándo quieres ir?',
            date_label: 'Fecha del tour',
            participants: 'Número de participantes',
            info_title: 'Tus datos',
            payment_title: 'Pago',
            success_title: '¡Reserva Confirmada!',
            date_error: 'Fecha requerida',
            info_error: 'Nombre y correo electrónico son obligatorios',
            next: 'Siguiente',
            pay: 'Pagar y Reservar',
            finish: 'Terminar',
            included_label: 'Incluido',
            not_included_label: 'No incluido',
            comment_label: 'Comentarios (información adicional, restricciones alimentarias)',
            comment_placeholder: '¿Tiene alguna necesidad específica?',
            subtotal: 'Precio del tour',
            processing_fees: 'Gastos de gestión del pago',
            per_person_incl_fees: 'por persona (gastos incluidos)',
            phone: 'Teléfono',
            payment_error: 'Error de pago',
            initialization: 'Inicializando el pago...',
            summary: 'Resumen:',
            total_paid: 'Total pagado:',
            participants_label: 'Viajeros:',
            billing_address: 'Dirección de facturación',
            city: 'Ciudad',
            zip: 'Código postal',
            country: 'País',
            pickup_address: 'Dirección de recogida (Barcelona)',
            summary_title: 'Resumen del pedido',
            personal_info: 'Información personal',
            tour_details: 'Detalles del tour',
            pickup_time: 'Hora de recogida',
            return_time: 'Hora de regreso',
            itinerary: 'Itinerario'
        },
        tour_dialog: {
            highlights_label: 'Puntos destacados:',
            itinerary_label: 'Itinerario:',
            included_label: 'Incluido:',
            not_included_label: 'No incluido:',
            good_to_know_label: 'Información útil',
            quick_info: 'Información rápida:',
            instant_confirmation: 'Confirmación instantánea',
            flexible_cancellation: 'Cancelación flexible (24h)',
            open_maps: 'Abrir en Google Maps',
            maps_description: 'Visualiza el punto de encuentro directamente en Google Maps para una mejor experiencia.',
            maps_button: 'Ver en Google Maps',
            view_on_maps: 'Ver en Google Maps'
        },
        footer: {
            made_with: 'Hecho con Pasión.',
            legal: 'Aviso Legal',
            privacy: 'Privacidad',
            navigation: 'Navegación'
        },
        live: {
            title: '¡Un tour está en curso!',
            no_session: 'No hay sesión en curso.',
            join_button: 'Unirse'
        },
        whatsapp: {
            floating_text: '¿Una pregunta? ¡Chatea conmigo!',
            message_prefix: '¡Hola Antoine! Estoy interesado en tus tours...'
        },
        cookies: {
            title: 'Respeto a tu privacidad',
            desc: 'Utilizamos cookies para mejorar tu experiencia en nuestro sitio.',
            accept: 'Aceptar',
            decline: 'Rechazar',
            manage: 'Gestionar ajustes',
            save: 'Guardar selección',
            essential: 'Esenciales (Siempre activos)',
            analytics: 'Analítica y Rendimiento',
            marketing: 'Marketing y Publicidad'
        },
        tour_data: [
            {
                id: 1,
                title: 'Costa Brava y Girona: senderos medievales y bellezza costera',
                subtitle: 'Profundidad cultural y paisajes espectaculares',
                description: 'Un viaje de un día completo, guiado privadamente, que combina el legado judío y medieval de Girona con los refinados pueblos costeros de la Costa Brava.',
                highlights: ['Barrio Judío (El Call)', 'Pueblo medieval de Pals', 'Calella de Palafrugell y Llafranc', 'Caminata Camí de Ronda opcional', 'Almuerzo mediterráneo'],
                included: ['Guía privado experto', 'Transporte privado ida y vuelta', 'Tour por Girona', 'Visita al pueblo de Pals', 'Seguro de viaje'],
                notIncluded: ['Almuerzo y bebidas', 'Entradas a monumentos (opcional)', 'Gastos personales'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 145,
                image: '/tour-girona.jpg',
                images: ['/tour-girona.jpg', '/tour-girona-2.png', '/tour-girona-3.png'],
                meetingPoint: 'https://www.google.com/maps/place/Barcelone',
                meetingPointMapUrl: 'https://www.google.com/maps/place/Barcelone',
                itinerary: [
                    'Salida de su alojamiento en Barcelona',
                    'Visita guiada por la Girona vieja y el barrio judío',
                    'Exploración del pueblo medieval de Pals',
                    'Tiempo libre y almuerzo en Calella de Palafrugell',
                    'Pequeña caminata por el famoso Camí de Ronda',
                    'Regreso a Barcelona al final de la tarde'
                ],
                category: 'Excursion'
            },
            {
                id: 4,
                title: 'Senderismo por Pueblos Medievales — Prepirineo',
                subtitle: 'Caminata, Naturaleza y Patrimonio',
                description: 'Una caminata inmersiva de bajo impacto (6km) que comienza en un pueblo medieval, con capillas románicas y valles boscosos. Perfecto para viajeros que buscan paz.',
                highlights: ['Inicio en pueblo medieval', 'Capillas románicas', 'Valles boscosos', 'Paisajes tranquilos', 'Caminata de 6km'],
                included: ['Guía especializado en outdoor', 'Transporte privado', 'Bastones de marcha', 'Snacks locales', 'Seguro de accidentes'],
                notIncluded: ['Almuerzo picnic', 'Gastos personales'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 95,
                image: '/tour-prepirinees.jpg',
                images: ['/tour-prepirinees.jpg', '/tour-prepirinees-2.png'],
                itinerary: [
                    'Traslado hacia el Prepirineo',
                    'Orientación en un pueblo medieval auténtico',
                    'Senderismo guiado a través de bosques y capillas',
                    'Pausa para snack con productos locales',
                    'Regreso a Barcelona'
                ],
                category: 'Nature'
            },
            {
                id: 5,
                title: 'Kayak en la Costa Brava — Cuevas Marinas y Calas Ocultas',
                subtitle: 'Aventura, Naturaleza y Actividad Acuática',
                description: 'Una experiencia guiada en kayak explorando cuevas marinas, vida marina y acantilados escarpados. En colaboración con socios locales auditados.',
                highlights: ['Exploración de cuevas', 'Acantilados escarpados', 'Vida marina', 'Seguridad auditada', 'Medio día o completo'],
                included: ['Guía de kayak certificado', 'Equipo completo (kayak, chaleco, remo)', 'Bolsa estanca', 'Seguro específico'],
                notIncluded: ['Transporte al lugar', 'Comidas y bebidas', 'Protector solar'],
                duration: 'Medio/Día completo',
                groupSize: '1-8',
                price: 75,
                image: '/tour-kayak.jpg',
                images: ['/tour-kayak.jpg', '/tour-kayak-2.png'],
                itinerary: [
                    'Llegada a la base náutica de la Costa Brava',
                    'Briefing de seguridad y preparación del equipo',
                    'Navegación bordeando acantilados y cuevas marinas',
                    'Sesión de snorkel en una cala aislada',
                    'Debriefing y regreso'
                ],
                category: 'Aventure'
            },
            {
                id: 6,
                title: 'Experiencia Montserrat y Vino',
                subtitle: 'Cultura, Paisaje, Gastronomía y Vino',
                description: 'Un día que combina el majestuoso paisaje y la espiritualidad de Montserrat con la visita a una bodega familiar y sesión de degustación.',
                highlights: ['Monasterio de Montserrat', 'Vistas panorámicas', 'Bodega local familiar', 'Sesión de cata', 'Entorno auténtico'],
                included: ['Guía privado apasionado', 'Transporte privado ida y vuelta', 'Visita a Montserrat', 'Visita a bodega y cata', 'Seguro de viaje'],
                notIncluded: ['Almuerzo', 'Funicular de Montserrat', 'Gastos personales'],
                duration: 'Medio/Día completo',
                groupSize: '1-8',
                price: 125,
                image: '/tour-montserrat.jpg',
                images: ['/tour-montserrat.jpg', '/tour-montserrat-2.png'],
                itinerary: [
                    'Salida de Barcelona hacia la montaña sagrada',
                    'Visita guiada al Monasterio de Montserrat',
                    'Traslado a una bodega familiar del Penedès',
                    'Visita de los viñedos y la bodega',
                    'Degustación de vinos locales y regreso'
                ],
                category: 'Culture'
            },
            {
                id: 7,
                title: 'Girona y Collioure: un viaje mediterráneo transfronterizo',
                subtitle: 'Historia, paisajes, gastronomía y arquitectura',
                description: 'Un viaje de un día completo que conecta la profundidad medieval de Cataluña con el refinado encanto costero del sur de Francia.',
                highlights: ['Catedral de Girona y El Call', 'Cruce de los Pirineos', 'Puerto y fortaleza de Collioure', 'Degustación de anchoas boutique', 'Almuerzo mediterráneo de 3 platos'],
                included: ['Guía privado', 'Transporte cómodo', 'Almuerzo completo incluido', 'Degustación de anchoas', 'Seguro de viaje'],
                notIncluded: ['Gastos personales', 'Entradas adicionales'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 165,
                image: '/tour-collioure.jpg',
                images: ['/tour-collioure.jpg'],
                itinerary: [
                    'Salida temprana de Barcelona',
                    'Visita histórica de Girona',
                    'Ruta panorámica hacia Francia',
                    'Tiempo libre y almuerzo en Collioure',
                    'Degustación de anchoas tradicionales',
                    'Trayecto de regreso a Barcelona'
                ],
                category: 'Excursion'
            },
            {
                id: 2,
                title: 'Tour a pie por Barcelona — Rincones ocultos de la ciudad vieja',
                subtitle: 'Cultural, Viaje Responsable',
                description: 'Una exploración de slow-travel por los barrios Gótico y Born, descubriendo historia, leyendas e historias comunitarias lejos de las rutas concurridas.',
                highlights: ['Barrios Gótico y Born', 'Historia oculta', 'Leyendas y relatos locales', 'Lejos de las multitudes'],
                included: ['Guía local certificado', 'Tour a pie personalizado', 'Recomendaciones locales', 'Pequeño snack tradicional'],
                notIncluded: ['Transporte público', 'Entradas a museos', 'Comidas completas'],
                duration: 'Medio día',
                groupSize: '1-8',
                price: 55,
                image: '/tour-barcelona-hidden.jpg',
                images: ['/tour-barcelona-hidden.jpg'],
                itinerary: [
                    'Encuentro en el Casco Antiguo',
                    'Exploración del Barrio Gótico y sus secretos',
                    'Cruce hacia el Born y su historia comercial',
                    'Degustación de un snack tradicional local',
                    'Fin del tour con recomendaciones personalizadas'
                ],
                category: 'Ville'
            },
            {
                id: 3,
                title: 'Senderismo por el camino de ronda — Costa Brava “Camí de Ronda”',
                subtitle: 'Caminata y Trekking',
                description: 'Una caminata costera espectacular (6km) por uno de los senderos más emblemáticos de Cataluña. Bosques de pinos y calas turquesas.',
                highlights: ['Caminata costera 6km', 'Calas turquesas', 'Almuerzo marinero', 'Oportunidad de baño'],
                included: ['Guía de senderismo', 'Transporte privado ida y vuelta', 'Visita a Calella de Palafrugell', 'Seguro outdoor'],
                notIncluded: ['Almuerzo en restaurante', 'Equipo de snorkel', 'Bebidas'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 85,
                image: '/tour-camironda.jpg',
                images: ['/tour-camironda.jpg'],
                itinerary: [
                    'Salida de Barcelona hacia Calella de Palafrugell',
                    'Inicio de la caminata guiada por el sendero costero',
                    'Parada en una cala para bañarse',
                    'Fin de la caminata y almuerzo marinero',
                    'Tiempo libre en el pueblo y regreso'
                ],
                category: 'Randonnée'
            }
        ],
        testimonials_data: [
            { id: 1, text: '¡Una experiencia inolvidable! Antoine conoce cada rincón de Cataluña.', name: 'Marie & Pierre', loc: 'París, Francia', avatar: 'MP', rating: 5 },
            { id: 2, text: 'La caminata por la Costa Brava fue mágica. El conocimiento de Antoine es impresionante.', name: 'Sarah Johnson', loc: 'Londres, Reino Unido', avatar: 'SJ', rating: 5 },
            { id: 3, text: '¡Hicimos el tour de Montserrat y fue fantástico! Todo fue perfecto.', name: 'Hans & Lisa', loc: 'Berlín, Alemania', avatar: 'HL', rating: 5 }
        ]
    }
};
