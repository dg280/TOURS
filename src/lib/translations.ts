export type Language = 'fr' | 'en' | 'es';

export const translations = {
    fr: {
        nav: {
            tours: 'Nos Tours',
            guide: 'Votre Guide',
            avis: 'Avis',
            contact: 'Contact',
            reserve: 'Réserver'
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
                meet: 'Point de Rencontre'
            }
        },
        guide: {
            section_tag: 'VOTRE GUIDE',
            title: 'Bonjour, je suis Antoine Pilard',
            desc1: "Antoine Pilard, Tours and detours. Je conçois et dirige personnellement des expériences privées à travers la Catalogne pour des voyageurs en quête de profondeur culturelle, de rythme calme et de connexions locales significatives — loin des foules et des clichés.",
            desc2: "Avec plus de 15 ans d'expérience en tant que guide en France, en Andorre et en Espagne, et ancien chef de tour Intrepid Travel (2018-2022), je combine des normes opérationnelles solides avec une approche humaine et discrète du guidage. Basé à Barcelone depuis 2022, je travaille en étroite collaboration avec des partenaires locaux de confiance pour proposer des journées guidées privées et des expériences de plusieurs jours adaptées aux intérêts, au rythme et aux attentes de chaque client.",
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
            next: 'Suivant',
            pay: 'Payer et Réserver',
            finish: 'Terminer'
        },
        cookies: {
            title: 'Respect de votre vie privée',
            desc: 'Nous utilisons des cookies pour améliorer votre expérience sur notre site.',
            accept: 'Accepter',
            decline: 'Refuser'
        },
        tour_data: [
            {
                id: 1,
                title: 'Costa Brava & Girona : sentiers médiévaux et beauté côtière',
                subtitle: 'Profondeur culturelle et paysages marquants',
                description: 'Un voyage d\'une journée entière, guidé privativement, combinant l\'héritage juif et médiéval de Gérone avec les villages côtiers raffinés de la Costa Brava.',
                highlights: ['Quartier Juif (El Call)', 'Village médiéval de Pals', 'Calella de Palafrugell & Llafranc', 'Randonnée Camí de Ronda optionnelle', 'Déjeuner méditerranéen'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 145
            },
            {
                id: 4,
                title: 'Randonnée Villages Médiévaux — Pré-Pyrénées',
                subtitle: 'Marche, Nature & Patrimoine',
                description: 'Une randonnée immersive à faible impact (6km) commençant dans une ville médiévale, avec des chapelles romanes et des vallées forestières. Idéal pour le calme.',
                highlights: ['Départ village médiéval', 'Chapelles romanes', 'Vallées forestières', 'Paysages paisibles', 'Marche immersive 6km'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 95
            },
            {
                id: 5,
                title: 'Kayak Costa Brava — Grottes Marines & Criques Cachées',
                subtitle: 'Aventure, Nature & Activités Nautiques',
                description: 'Une expérience guidée en kayak explorant grottes marines, vie marine et falaises escarpées. Opéré avec des partenaires locaux audités.',
                highlights: ['Exploration de grottes', 'Falaises escarpées', 'Vie marine', 'Sécurité auditée', 'Demi ou Journée entière'],
                duration: 'Demi/Journée entière',
                groupSize: '1-8',
                price: 75
            },
            {
                id: 6,
                title: 'Expérience Montserrat & Vin',
                subtitle: 'Culture, Décors & Gastronomie',
                description: 'Une journée combinant le paysage majestueux et la spiritualité de Montserrat avec la visite d\'une bodega familiale et une dégustation.',
                highlights: ['Exploration du monastère', 'Vues panoramiques', 'Visite cave locale', 'Dégustation', 'Bodega familiale'],
                duration: 'Demi/Journée entière',
                groupSize: '1-8',
                price: 125
            },
            {
                id: 7,
                title: 'Gérone et Collioure : un voyage méditerranéen transfrontalier',
                subtitle: 'Histoire, paysages, gastronomie et architecture',
                description: 'Une journée complète reliant la profondeur médiévale de la Catalogne au charme côtier du sud de la France.',
                highlights: ['Cathédrale de Gérone & El Call', 'Traversée des Pyrénées', 'Port & Forteresse de Collioure', 'Dégustation d\'anchois boutique', 'Déjeuner méditerranéen complet'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 165
            },
            {
                id: 2,
                title: 'Tour à pied de Barcelone — Coins secrets de la vieille ville',
                subtitle: 'Culturel, Voyage Responsable',
                description: 'Une exploration slow-travel des quartiers Gothique et Born, dévoilant l\'histoire, les légendes et les histoires de quartier loin des circuits bondés.',
                highlights: ['Quartiers Gothique & Born', 'Histoire cachée', 'Légendes & récits locaux', 'Loin des foules'],
                duration: 'Demi-journée',
                groupSize: '1-8',
                price: 55
            },
            {
                id: 3,
                title: 'Randonnée sur le sentier côtier — Costa Brava “Camí de Ronda”',
                subtitle: 'Marche & Trekking',
                description: 'Une randonnée côtière spectaculaire (6km) sur l\'un des sentiers les plus emblématiques de Catalogne. Forêts de pins et criques turquoises.',
                highlights: ['Randonnée côtière 6km', 'Criques turquoises', 'Déjeuner de la mer', 'Possibilité de baignade'],
                duration: 'Journée entière',
                groupSize: '1-8',
                price: 85
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
            guide: 'Your Guide',
            avis: 'Reviews',
            contact: 'Contact',
            reserve: 'Book Now'
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
                meet: 'Meeting Point'
            }
        },
        guide: {
            section_tag: 'YOUR GUIDE',
            title: 'Hello, I am Antoine Pilard',
            desc1: "Antoine Pilard, Tours and detours. I design and personally lead private experiences across Catalonia for well-traveled guests seeking cultural depth, calm pacing, and meaningful local connections — away from crowds and clichés.",
            desc2: "With over 15 years of guiding experience in France, Andorra, and Spain, and as a former Intrepid Travel tour leader (2018–2022), I combine strong operational standards with a discreet, human approach to guiding. Based in Barcelona since 2022, I work closely with trusted local partners to deliver seamless, privately guided days and multi-day experiences tailored to each client’s interests, pace, and expectations.",
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
            next: 'Next',
            pay: 'Pay & Book',
            finish: 'Finish'
        },
        cookies: {
            title: 'Respect for your privacy',
            desc: 'We use cookies to improve your experience on our site.',
            accept: 'Accept',
            decline: 'Decline'
        },
        tour_data: [
            {
                id: 1,
                title: 'Costa Brava & Girona: Medieval paths and coastal beauty',
                subtitle: 'Significant cultural depth and scenery',
                description: 'A privately guided, full-day journey combining Girona’s Jewish and medieval heritage with the refined coastal villages of the Costa Brava.',
                highlights: ["Girona's Jewish Quarter (El Call)", 'Medieval village of Pals', 'Calella de Palafrugell & Llafranc', 'Optional Camí de Ronda coastal walk', 'Mediterranean lunch'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 145
            },
            {
                id: 4,
                title: 'Medieval Villages Hike — Pre-Pyrenees',
                subtitle: 'Walking, Nature & Heritage',
                description: 'A low-impact, immersive hike (6km) starting in a medieval town, featuring Romanesque chapels and forested valleys. Perfect for travellers seeking quiet landscapes.',
                highlights: ['Medieval town start', 'Romanesque chapels', 'Forested valleys', 'Quiet landscapes', '6km immersive walk'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 95
            },
            {
                id: 5,
                title: 'Kayak the Costa Brava — Sea Caves & Hidden Coves',
                subtitle: 'Adventure, Nature & Water Activity',
                description: 'A guided kayaking experience exploring sea caves, marine life and rugged cliffs. Operated with audited local partners for safety standards.',
                highlights: ['Sea caves exploration', 'Rugged cliffs', 'Marine life', 'Safety-audited gear', 'Half or Full Day'],
                duration: 'Half/Full Day',
                groupSize: '1-8',
                price: 75
            },
            {
                id: 6,
                title: 'Montserrat & Wine Experience',
                subtitle: 'Cultural, Scenic & Food & Wine',
                description: 'A day combining the majestic landscape and spirituality of Montserrat with a family-run bodega visit and tasting session.',
                highlights: ['Monastery exploration', 'Panoramic views', 'Local winery visit', 'Tasting session', 'Family-run bodega'],
                duration: 'Half/Full Day',
                groupSize: '1-8',
                price: 125
            },
            {
                id: 7,
                title: 'Girona and Collioure: a crossborder Mediterranean journey',
                subtitle: 'History, scenery, gastronomy and architecture',
                description: 'A full-day journey connecting the medieval depth of Catalonia with the refined coastal charm of southern France.',
                highlights: ["Girona's Jewish Quarter & Gothic cathedral", 'Scenic Pyrenees crossing', 'Collioure harbor & fortress', 'Boutique anchovy tasting', '3-course Mediterranean lunch'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 165
            },
            {
                id: 2,
                title: 'Barcelona Walking Tour — Hidden Corners of the Old City',
                subtitle: 'Cultural, Responsible Travel',
                description: 'A slow-travel exploration of the Gothic and Born neighbourhoods, uncovering history, legends, community stories, and lesser-known locations.',
                highlights: ['Gothic & Born quarters', 'Hidden history', 'Legends & community stories', 'Away from crowds'],
                duration: 'Half Day',
                groupSize: '1-8',
                price: 55
            },
            {
                id: 3,
                title: 'Hike the Coastal Path — Costa Brava “Camí de Ronda”',
                subtitle: 'Walking & Trekking',
                description: 'A spectacular coastal hike (6km) on one of Catalonia’s most iconic trails. Pine forests, turquoise coves, and panoramic viewpoints.',
                highlights: ['6km coastal hike', 'Turquoise coves', 'Seafood lunch', 'Swim opportunities'],
                duration: 'Full Day',
                groupSize: '1-8',
                price: 85
            }
        ],
        testimonials_data: [
            { id: 1, text: 'An unforgettable experience! Antoine knows every corner of Catalonia.', name: 'Marie & Pierre', loc: 'Paris, France', avatar: 'MP', rating: 5 },
            { id: 2, text: 'The Costa Brava hike was absolutely magical. Antoine\'s knowledge is impressive.', name: 'Sarah Johnson', loc: 'London, UK', avatar: 'SJ', rating: 5 },
            { id: 3, text: 'We did the Montserrat tour and it was fantastic! Everything was perfect.', name: 'Hans & Lisa', loc: 'Berlin, Germany', avatar: 'HL', rating: 5 }
        ]
    },
    es: {
        nav: {
            tours: 'Nuestros Tours',
            guide: 'Tu Guía',
            avis: 'Opiniones',
            contact: 'Contacto',
            reserve: 'Reservar'
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
                meet: 'Punto de Encuentro'
            }
        },
        guide: {
            section_tag: 'TU GUÍA',
            title: 'Hola, soy Antoine Pilard',
            desc1: "Antoine Pilard, Tours and detours. Diseño y dirijo personalmente experiencias privadas en Cataluña para viajeros que buscan profundidad cultural, un ritmo pausado y conexiones locales significativas, lejos de las multitudes y los clichés.",
            desc2: "Con más de 15 años de experiencia como guía en Francia, Andorra y España, y ex jefe de tour de Intrepid Travel (2018-2022), combino estándares operativos sólidos con un enfoque humano y discreto del guía. Basado en Barcelona desde 2022, trabajo estrechamente con socios locales de confianza para ofrecer días guiados privados y experiencias de varios días adaptadas a los intereses, el ritmo y las expectativas de cada cliente.",
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
            next: 'Siguiente',
            pay: 'Pagar y Reservar',
            finish: 'Terminar'
        },
        cookies: {
            title: 'Respeto a tu privacidad',
            desc: 'Utilizamos cookies para mejorar tu experiencia en nuestro sitio.',
            accept: 'Aceptar',
            decline: 'Rechazar'
        },
        tour_data: [
            {
                id: 1,
                title: 'Costa Brava y Girona: senderos medievales y belleza costera',
                subtitle: 'Profundidad cultural y paisajes espectaculares',
                description: 'Un viaje de un día completo, guiado privadamente, que combina el legado judío y medieval de Girona con los refinados pueblos costeros de la Costa Brava.',
                highlights: ['Barrio Judío (El Call)', 'Pueblo medieval de Pals', 'Calella de Palafrugell y Llafranc', 'Caminata Camí de Ronda opcional', 'Almuerzo mediterráneo'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 145
            },
            {
                id: 4,
                title: 'Senderismo por Pueblos Medievales — Prepirineo',
                subtitle: 'Caminata, Naturaleza y Patrimonio',
                description: 'Una caminata inmersiva de bajo impacto (6km) que comienza en un pueblo medieval, con capillas románicas y valles boscosos. Perfecto para viajeros que buscan paz.',
                highlights: ['Inicio en pueblo medieval', 'Capillas románicas', 'Valles boscosos', 'Paisajes tranquilos', 'Caminata de 6km'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 95
            },
            {
                id: 5,
                title: 'Kayak en la Costa Brava — Cuevas Marinas y Calas Ocultas',
                subtitle: 'Aventura, Naturaleza y Actividad Acuática',
                description: 'Una experiencia guiada en kayak explorando cuevas marinas, vida marina y acantilados escarpados. En colaboración con socios locales auditados.',
                highlights: ['Exploración de cuevas', 'Acantilados escarpados', 'Vida marina', 'Seguridad auditada', 'Medio día o completo'],
                duration: 'Medio/Día completo',
                groupSize: '1-8',
                price: 75
            },
            {
                id: 6,
                title: 'Experiencia Montserrat y Vino',
                subtitle: 'Cultura, Paisaje, Gastronomía y Vino',
                description: 'Un día que combina el majestuoso paisaje y la espiritualidad de Montserrat con la visita a una bodega familiar y sesión de degustación.',
                highlights: ['Monasterio de Montserrat', 'Vistas panorámicas', 'Bodega local familiar', 'Sesión de cata', 'Entorno auténtico'],
                duration: 'Medio/Día completo',
                groupSize: '1-8',
                price: 125
            },
            {
                id: 7,
                title: 'Girona y Collioure: un viaje mediterráneo transfronterizo',
                subtitle: 'Historia, paisajes, gastronomía y arquitectura',
                description: 'Un viaje de un día completo que conecta la profundidad medieval de Cataluña con el refinado encanto costero del sur de Francia.',
                highlights: ['Catedral de Girona y El Call', 'Cruce de los Pirineos', 'Puerto y fortaleza de Collioure', 'Degustación de anchoas boutique', 'Almuerzo mediterráneo de 3 platos'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 165
            },
            {
                id: 2,
                title: 'Tour a pie por Barcelona — Rincones ocultos de la ciudad vieja',
                subtitle: 'Cultural, Viaje Responsable',
                description: 'Una exploración de slow-travel por los barrios Gótico y Born, descubriendo historia, leyendas e historias comunitarias lejos de las rutas concurridas.',
                highlights: ['Barrios Gótico y Born', 'Historia oculta', 'Leyendas y relatos locales', 'Lejos de las multitudes'],
                duration: 'Medio día',
                groupSize: '1-8',
                price: 55
            },
            {
                id: 3,
                title: 'Senderismo por el camino de ronda — Costa Brava “Camí de Ronda”',
                subtitle: 'Caminata y Trekking',
                description: 'Una caminata costera espectacular (6km) por uno de los senderos más emblemáticos de Cataluña. Bosques de pinos y calas turquesas.',
                highlights: ['Caminata costera 6km', 'Calas turquesas', 'Almuerzo marinero', 'Oportunidad de baño'],
                duration: 'Día completo',
                groupSize: '1-8',
                price: 85
            }
        ],
        testimonials_data: [
            { id: 1, text: '¡Una experiencia inolvidable! Antoine conoce cada rincón de Cataluña.', name: 'Marie & Pierre', loc: 'París, Francia', avatar: 'MP', rating: 5 },
            { id: 2, text: 'La caminata por la Costa Brava fue mágica. El conocimiento de Antoine es impresionante.', name: 'Sarah Johnson', loc: 'Londres, Reino Unido', avatar: 'SJ', rating: 5 },
            { id: 3, text: '¡Hicimos el tour de Montserrat y fue fantástico! Todo fue perfecto.', name: 'Hans & Lisa', loc: 'Berlín, Alemania', avatar: 'HL', rating: 5 }
        ]
    }
};
