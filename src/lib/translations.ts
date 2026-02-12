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
            title: 'Tours & Detours avec Antoine Pilard',
            description: 'Des excursions personnalisées pour découvrir les secrets de la Catalogne, loin des foules touristiques — culture, nature et aventure',
            cta_discover: 'Découvrir les Tours',
            cta_contact: 'Contactez-moi'
        },
        seo: {
            title: 'Tours & Detours - Découvrez la Catalogne Authentique avec Antoine Pilard',
            description: 'Excursions personnalisées et tours guidés en Catalogne. Découvrez Girona, Costa Brava, Montserrat et plus encore avec un expert local.'
        },
        stats: {
            exp: "ans d'expérience",
            local: 'expert local',
            review: 'sur TripAdvisor',
            langs: 'langues'
        },
        tours: {
            section_tag: 'NOS EXPÉRIENCES',
            section_title: 'Excursions Guidées en Catalogne',
            section_desc: 'Chaque excursion est soigneusement conçue pour vous offrir une expérience authentique, loin des sentiers battus.',
            learn_more: 'En savoir plus',
            book_now: 'Réserver ce tour',
            duration: 'Durée',
            group: 'Groupe',
            price: 'Prix',
            per_person: 'par personne'
        },
        guide: {
            section_tag: 'VOTRE GUIDE',
            title: 'Bonjour, je suis Antoine Pilard',
            desc1: "Guide expert local en Catalogne avec plus de 15 ans d'expérience en France et Andorre.",
            desc2: "Je conçois et opère des expériences d'une journée et multi-jours à travers la Catalogne, en privilégiant le voyage responsable.",
            cta_contact: 'Me contacter',
            cta_tours: 'Voir les tours',
            features: [
                'Expert local Catalogne',
                'Guide certifié Intrepid',
                'Passionné d\'histoire',
                'Spécialiste randonnée',
                'Voyage responsable',
                '4 langues parlées'
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
                title: 'Girona & Costa Brava',
                subtitle: 'Sur les traces médiévales',
                description: 'Un voyage immersif du Quartier Juif médiéval de Girona aux villages pittoresques de la Costa Brava.',
                highlights: ['Quartier Juif', 'Peratallada & Pals', 'Camí de Ronda', 'Dégustation turrón'],
                duration: '9.5h',
                groupSize: '2-16',
                price: 145
            },
            {
                id: 2,
                title: 'Coins Secrets de Barcelone',
                subtitle: 'Tour à pied de la vieille ville',
                description: 'Une exploration slow-travel des quartiers Gothique et Born, dévoilant l\'histoire et les lieux secrets.',
                highlights: ['Quartier Gothique', 'El Born', 'Histoires locales', 'Routes authentiques'],
                duration: '3h',
                groupSize: '2-12',
                price: 55
            },
            {
                id: 3,
                title: 'Randonnée Camí de Ronda',
                subtitle: 'Sentier côtier de la Costa Brava',
                description: 'Une randonnée spectaculaire sur l\'un des sentiers les plus emblématiques de Catalogne.',
                highlights: ['Criques cachées', 'Observation faune', 'Déjeuner marin', 'Vues panoramiques'],
                duration: '6h',
                groupSize: '4-12',
                price: 85
            },
            {
                id: 4,
                title: 'Villages Médiévaux',
                subtitle: 'Découverte des Pré-Pyrénées',
                description: 'Une randonnée immersive dans les villages médiévaux et chapelles romanes.',
                highlights: ['Villages médiévaux', 'Chapelles romanes', 'Vallées forestières', 'Faune locale'],
                duration: '7h',
                groupSize: '4-10',
                price: 95
            },
            {
                id: 5,
                title: 'Kayak Costa Brava',
                subtitle: 'Grottes et criques cachées',
                description: 'Une expérience en kayak guidée explorant grottes marines et falaises escarpées.',
                highlights: ['Grottes marines', 'Criques secrètes', 'Vie marine', 'Falaises escarpées'],
                duration: '4h',
                groupSize: '4-12',
                price: 75
            },
            {
                id: 6,
                title: 'Montserrat & Vin',
                subtitle: 'Spiritualité et Vins Catalans',
                description: 'Une journée combinant le paysage de Montserrat avec une visite de vignoble local.',
                highlights: ['Monastère', 'Randonnée panoramique', 'Vignoble familial', 'Dégustation'],
                duration: '8h',
                groupSize: '4-14',
                price: 125
            },
            {
                id: 7,
                title: 'Girona & Collioure',
                subtitle: 'Expérience transfrontalière',
                description: 'Deux pays en une journée ! Explorez la culture catalane des deux côtés de la frontière.',
                highlights: ['Girona', 'Collioure France', 'Culture transfrontalière', 'Gastronomie'],
                duration: '10h',
                groupSize: '4-12',
                price: 165
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
            title: 'Tours & Detours with Antoine Pilard',
            description: 'Personalized excursions to discover the secrets of Catalonia, away from the tourist crowds — culture, nature, and adventure',
            cta_discover: 'Discover Tours',
            cta_contact: 'Contact Me'
        },
        seo: {
            title: 'Tours & Detours - Discover Authentic Catalonia with Antoine Pilard',
            description: 'Personalized excursions and guided tours in Catalonia. Discover Girona, Costa Brava, Montserrat and more with a local expert.'
        },
        stats: {
            exp: 'years experience',
            local: 'local expert',
            review: 'on TripAdvisor',
            langs: 'languages'
        },
        tours: {
            section_tag: 'OUR EXPERIENCES',
            section_title: 'Guided Excursions in Catalonia',
            section_desc: 'Each excursion is carefully designed to offer you an authentic experience, off the beaten path.',
            learn_more: 'Learn More',
            book_now: 'Book this tour',
            duration: 'Duration',
            group: 'Group',
            price: 'Price',
            per_person: 'per person'
        },
        guide: {
            section_tag: 'YOUR GUIDE',
            title: 'Hello, I am Antoine Pilard',
            desc1: "Local expert guide in Catalonia with over 15 years of experience in France and Andorra.",
            desc2: "I design and operate day and multi-day experiences across Catalonia, prioritizing responsible travel.",
            cta_contact: 'Contact Me',
            cta_tours: 'View Tours',
            features: [
                'Catalonia local expert',
                'Intrepid certified guide',
                'History enthusiast',
                'Hiking specialist',
                'Responsible travel',
                '4 languages spoken'
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
                title: 'Girona & Costa Brava',
                subtitle: 'In Medieval Footsteps',
                description: 'An immersive journey from the medieval Jewish Quarter of Girona to the picturesque villages of Costa Brava.',
                highlights: ['Jewish Quarter', 'Peratallada & Pals', 'Camí de Ronda', 'Turrón tasting'],
                duration: '9.5h',
                groupSize: '2-16',
                price: 145
            },
            {
                id: 2,
                title: 'Barcelona Hidden Corners',
                subtitle: 'Old City Walking Tour',
                description: 'A slow-travel exploration of the Gothic and Born quarters, revealing history and secret places.',
                highlights: ['Gothic Quarter', 'El Born', 'Local stories', 'Authentic routes'],
                duration: '3h',
                groupSize: '2-12',
                price: 55
            },
            {
                id: 3,
                title: 'Hike the Camí de Ronda',
                subtitle: 'Costa Brava Coastal Trail',
                description: 'A spectacular hike on one of the most emblematic trails in Catalonia.',
                highlights: ['Hidden coves', 'Wildlife watching', 'Seafood lunch', 'Panoramic views'],
                duration: '6h',
                groupSize: '4-12',
                price: 85
            },
            {
                id: 4,
                title: 'Medieval Villages Hike',
                subtitle: 'Pre-Pyrenees Discovery',
                description: 'An immersive hike through medieval villages and Romanesque chapels.',
                highlights: ['Medieval villages', 'Romanesque chapels', 'Forest valleys', 'Local wildlife'],
                duration: '7h',
                groupSize: '4-10',
                price: 95
            },
            {
                id: 5,
                title: 'Kayak Costa Brava',
                subtitle: 'Sea Caves & Hidden Coves',
                description: 'A guided kayak experience exploring sea caves and steep cliffs.',
                highlights: ['Sea caves', 'Secret coves', 'Marine life', 'Steep cliffs'],
                duration: '4h',
                groupSize: '4-12',
                price: 75
            },
            {
                id: 6,
                title: 'Montserrat & Wine',
                subtitle: 'Spirituality & Catalan Wines',
                description: 'A day combining the landscape of Montserrat with a local vineyard visit.',
                highlights: ['Monastery', 'Panoramic hike', 'Family vineyard', 'Wine tasting'],
                duration: '8h',
                groupSize: '4-14',
                price: 125
            },
            {
                id: 7,
                title: 'Girona & Collioure',
                subtitle: 'Cross-Border Experience',
                description: 'Two countries in one day! Explore Catalan culture on both sides of the border.',
                highlights: ['Girona', 'Collioure France', 'Cross-border culture', 'Gastronomy'],
                duration: '10h',
                groupSize: '4-12',
                price: 165
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
            title: 'Tours & Detours con Antoine Pilard',
            description: 'Excursiones personalizadas para descubrir los secretos de Cataluña, lejos de las multitudes — cultura, naturaleza y aventura',
            cta_discover: 'Descubrir Tours',
            cta_contact: 'Contáctame'
        },
        seo: {
            title: 'Tours & Detours - Descubre la Cataluña Auténtica con Antoine Pilard',
            description: 'Excursiones personalizadas y tours guiados en Cataluña. Descubre Girona, Costa Brava, Montserrat y mucho más con un experto local.'
        },
        stats: {
            exp: 'años de experiencia',
            local: 'experto local',
            review: 'en TripAdvisor',
            langs: 'idiomas'
        },
        tours: {
            section_tag: 'NUESTRAS EXPERIENCIAS',
            section_title: 'Excursions Guidées en Cataluña',
            section_desc: 'Cada excursión está cuidadosamente diseñada para ofrecerte una experiencia auténtica, fuera de las rutas comunes.',
            learn_more: 'Saber más',
            book_now: 'Reservar este tour',
            duration: 'Duración',
            group: 'Grupo',
            price: 'Precio',
            per_person: 'por persona'
        },
        guide: {
            section_tag: 'TU GUÍA',
            title: 'Hola, soy Antoine Pilard',
            desc1: "Guía experto local en Cataluña con más de 15 años de experiencia en Francia y Andorra.",
            desc2: "Diseño y opero experiencias de uno o varios días en Cataluña, priorizando el viaje responsable.",
            cta_contact: 'Contactar',
            cta_tours: 'Ver tours',
            features: [
                'Experto local Cataluña',
                'Guía certificado Intrepid',
                'Apasionado de la historia',
                'Especialista en senderismo',
                'Viaje responsable',
                'Hablo 4 idiomas'
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
                title: 'Girona y Costa Brava',
                subtitle: 'Huellas Medievales',
                description: 'Un viaje inmersivo por el barrio judío medieval de Girona y los pintorescos pueblos de la Costa Brava.',
                highlights: ['Barrio Judío', 'Peratallada y Pals', 'Camí de Ronda', 'Degustación de turrón'],
                duration: '9.5h',
                groupSize: '2-16',
                price: 145
            },
            {
                id: 2,
                title: 'Rincones Ocultos de Barcelona',
                subtitle: 'Tour a pie por el casco antiguo',
                description: 'Una exploración slow-travel por los barrios Gótico y Born, descubriendo historia y lugares secretos.',
                highlights: ['Barrio Gótico', 'El Born', 'Historias locales', 'Rutas auténticas'],
                duration: '3h',
                groupSize: '2-12',
                price: 55
            },
            {
                id: 3,
                title: 'Senderismo Camí de Ronda',
                subtitle: 'Sendero costero de la Costa Brava',
                description: 'Una caminata espectacular por uno de los senderos más emblemáticos de Cataluña.',
                highlights: ['Calas escondidas', 'Observación de fauna', 'Comida marinera', 'Vistas panorámicas'],
                duration: '6h',
                groupSize: '4-12',
                price: 85
            },
            {
                id: 4,
                title: 'Pueblos Medievales',
                subtitle: 'Descubrimiento del Prepirineo',
                description: 'Una caminata inmersiva por pueblos medievales y capillas románicas.',
                highlights: ['Pueblos medievales', 'Capillas románicas', 'Valles forestales', 'Fauna local'],
                duration: '7h',
                groupSize: '4-10',
                price: 95
            },
            {
                id: 5,
                title: 'Kayak Costa Brava',
                subtitle: 'Cuevas y calas escondidas',
                description: 'Una experiencia guiada en kayak explorando cuevas marinas y acantilados escarpados.',
                highlights: ['Cuevas marinas', 'Calas secretas', 'Vida marina', 'Acantilados escarpados'],
                duration: '4h',
                groupSize: '4-12',
                price: 75
            },
            {
                id: 6,
                title: 'Montserrat y Vino',
                subtitle: 'Espiritualidad y Vinos Catalans',
                description: 'Un día combinando el paisaje de Montserrat con una visita a un viñedo local.',
                highlights: ['Monasterio', 'Caminata panorámica', 'Viñedo familiar', 'Degustación'],
                duration: '8h',
                groupSize: '4-14',
                price: 125
            },
            {
                id: 7,
                title: 'Girona y Collioure',
                subtitle: 'Experiencia Transfronteriza',
                description: '¡Dos países en un día! Explore la cultura catalana a ambos lados de la frontera.',
                highlights: ['Girona', 'Collioure Francia', 'Cultura transfronteriza', 'Gastronomía'],
                duration: '10h',
                groupSize: '4-12',
                price: 165
            }
        ],
        testimonials_data: [
            { id: 1, text: '¡Una experiencia inolvidable! Antoine conoce cada rincón de Cataluña.', name: 'Marie & Pierre', loc: 'París, Francia', avatar: 'MP', rating: 5 },
            { id: 2, text: 'La caminata por la Costa Brava fue mágica. El conocimiento de Antoine es impresionante.', name: 'Sarah Johnson', loc: 'Londres, Reino Unido', avatar: 'SJ', rating: 5 },
            { id: 3, text: '¡Hicimos el tour de Montserrat y fue fantástico! Todo fue perfecto.', name: 'Hans & Lisa', loc: 'Berlín, Alemania', avatar: 'HL', rating: 5 }
        ]
    }
};
