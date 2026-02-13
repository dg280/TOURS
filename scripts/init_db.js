import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const mockTours = [
    {
        id: '1',
        title: 'Costa Brava & Girona : sentiers médiévaux et beauté côtière',
        subtitle: 'Profondeur culturelle et paysages marquants',
        description: "Un voyage d'une journée entière, guidé privativement, combinant l'héritage juif et médiéval de Gérone avec les villages côtiers raffinés de la Costa Brava.",
        duration: 'Journée entière',
        group_size: '1-8',
        price: 145,
        image: '/tour-girona.jpg',
        category: 'Culture & Nature',
        highlights: ['Quartier Juif (El Call)', 'Village médiéval de Pals', 'Calella de Palafrugell & Llafranc', 'Randonnée Camí de Ronda optionnelle', 'Déjeuner méditerranéen'],
        is_active: true
    },
    {
        id: '4',
        title: 'Randonnée Villages Médiévaux — Pré-Pyrénées',
        subtitle: 'Marche, Nature & Patrimoine',
        description: "Une randonnée immersive à faible impact (6km) commençant dans une ville médiévale, avec des chapelles romanes et des vallées forestières. Idéal pour le calme.",
        duration: 'Journée entière',
        group_size: '1-8',
        price: 95,
        image: '/tour-prepirinees.jpg',
        category: 'Randonnée & Patrimoine',
        highlights: ['Départ village médiéval', 'Chapelles romanes', 'Vallées forestières', 'Paysages paisibles', 'Marche immersive 6km'],
        is_active: true
    },
    {
        id: '5',
        title: 'Kayak Costa Brava — Grottes Marines & Criques Cachées',
        subtitle: 'Aventure, Nature & Activités Nautiques',
        description: 'Une expérience guidée en kayak explorant grottes marines, vie marine et falaises escarpées. Opéré avec des partenaires locaux audités.',
        duration: 'Demi/Journée entière',
        group_size: '1-8',
        price: 75,
        image: '/tour-kayak.jpg',
        category: 'Aventure',
        highlights: ['Exploration de grottes', 'Falaises escarpées', 'Vie marine', 'Sécurité auditée', 'Demi ou Journée entière'],
        is_active: true
    },
    {
        id: '6',
        title: 'Expérience Montserrat & Vin',
        subtitle: 'Culture, Décors & Gastronomie',
        description: "Une journée combinant le paysage majestueux et la spiritualité de Montserrat avec la visite d'une bodega familiale et une dégustation.",
        duration: 'Demi/Journée entière',
        group_size: '1-8',
        price: 125,
        image: '/tour-montserrat.jpg',
        category: 'Culture & Vin',
        highlights: ['Exploration du monastère', 'Vues panoramiques', 'Visite cave locale', 'Dégustation', 'Bodega familiale'],
        is_active: true
    },
    {
        id: '7',
        title: 'Gérone et Collioure : un voyage méditerranéen transfrontalier',
        subtitle: 'Histoire, paysages, gastronomie et architecture',
        description: 'Une journée complète reliant la profondeur médiévale de la Catalogne au charme côtier du sud de la France.',
        duration: 'Journée entière',
        group_size: '1-8',
        price: 165,
        image: '/tour-collioure.jpg',
        category: 'Culture & Gastronomie',
        highlights: ['Cathédrale de Gérone & El Call', 'Traversée des Pyrénées', 'Port & Forteresse de Collioure', 'Dégustation d\'anchois boutique', 'Déjeuner méditerranéen complet'],
        is_active: true
    },
    {
        id: '2',
        title: 'Tour à pied de Barcelone — Coins secrets de la vieille ville',
        subtitle: 'Culturel, Voyage Responsable',
        description: 'Une exploration slow-travel des quartiers Gothique et Born, dévoilant l\'histoire, les légendes et les histoires de quartier loin des circuits bondés.',
        duration: 'Demi-journée',
        group_size: '1-8',
        price: 55,
        image: '/tour-barcelona-hidden.jpg',
        category: 'Ville & Culture',
        highlights: ['Quartiers Gothique & Born', 'Histoire cachée', 'Légendes & récits locaux', 'Loin des foules'],
        is_active: true
    },
    {
        id: '3',
        title: 'Randonnée sur le sentier côtier — Costa Brava “Camí de Ronda”',
        subtitle: 'Marche & Trekking',
        description: "Une randonnée côtière spectaculaire (6km) sur l'un des sentiers les plus emblématiques de Catalogne. Forêts de pins et criques turquoises.",
        duration: 'Journée entière',
        group_size: '1-8',
        price: 85,
        image: '/tour-camironda.jpg',
        category: 'Nature & Marche',
        highlights: ['Randonnée côtière 6km', 'Criques turquoises', 'Déjeuner de la mer', 'Possibilité de baignade'],
        is_active: true
    }
]

async function init() {
    console.log('--- Initializing Database ---')

    // 1. Initialiser le profil
    console.log('Syncing site config...')
    const { error: configError } = await supabase.from('site_config').upsert({
        key: 'guide_profile',
        value: {
            photo: '/guide-antoine.jpg',
            instagram: 'https://www.instagram.com/tours_and_detours_bcn/'
        }
    })
    if (configError) {
        console.error('Error syncing config:', configError.message)
        console.log('(Note: This probably means the table site_config does not exist yet)')
    } else {
        console.log('✓ Site config synced.')
    }

    // 2. Initialiser les tours
    console.log('Syncing tours catalog...')
    for (const tour of mockTours) {
        const { error: tourError } = await supabase.from('tours').upsert(tour)
        if (tourError) {
            console.error(`Error syncing tour ${tour.id}:`, tourError.message)
        } else {
            console.log(`✓ Tour ${tour.id} synced.`)
        }
    }

    // 3. Initialiser les tours par défaut (Master Data)
    console.log('Syncing default_tours (Master Data)...')
    for (const tour of mockTours) {
        const { error: defaultTourError } = await supabase.from('default_tours').upsert(tour)
        if (defaultTourError) {
            console.error(`Error syncing default tour ${tour.id}:`, defaultTourError.message)
        } else {
            console.log(`✓ Default Tour ${tour.id} synced.`)
        }
    }

    console.log('--- Process finished ---')
}

init()
