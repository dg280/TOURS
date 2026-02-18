import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Database features will be unavailable.');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Database = {
    public: {
        Tables: {
            reservations: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    email: string;
                    phone: string;
                    tour_id: string;
                    tour_name: string;
                    date: string;
                    participants: number;
                    total_price: number;
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
                    message: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    email: string;
                    phone: string;
                    tour_id: string;
                    tour_name: string;
                    date: string;
                    participants: number;
                    total_price: number;
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
                    message?: string;
                };
            };
            reviews: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    location: string;
                    rating: number;
                    text: string;
                    tour_id: string | null;
                    is_published: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    location: string;
                    rating: number;
                    text: string;
                    tour_id?: string | null;
                    is_published?: boolean;
                };
            };
            tours: {
                Row: {
                    id: string;
                    created_at: string;
                    title: string;
                    title_en: string | null;
                    title_es: string | null;
                    subtitle: string;
                    subtitle_en: string | null;
                    subtitle_es: string | null;
                    description: string;
                    description_en: string | null;
                    description_es: string | null;
                    duration: string;
                    group_size: string;
                    price: number;
                    image: string;
                    images: string[] | null;
                    category: string;
                    highlights: string[];
                    highlights_en: string[] | null;
                    highlights_es: string[] | null;
                    is_active: boolean;
                    stripe_link: string | null;
                    itinerary: string[] | null;
                    itinerary_en: string[] | null;
                    itinerary_es: string[] | null;
                    included: string[] | null;
                    included_en: string[] | null;
                    included_es: string[] | null;
                    not_included: string[] | null;
                    not_included_en: string[] | null;
                    not_included_es: string[] | null;
                    meeting_point: string | null;
                    meeting_point_en: string | null;
                    meeting_point_es: string | null;
                    meeting_point_map_url: string | null;
                    stops: any[] | null;
                    stripe_tip_link: string | null;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    title: string;
                    title_en?: string | null;
                    title_es?: string | null;
                    subtitle: string;
                    subtitle_en?: string | null;
                    subtitle_es?: string | null;
                    description: string;
                    description_en?: string | null;
                    description_es?: string | null;
                    duration: string;
                    group_size: string;
                    price: number;
                    image: string;
                    images?: string[] | null;
                    category: string;
                    highlights: string[];
                    highlights_en?: string[] | null;
                    highlights_es?: string[] | null;
                    is_active?: boolean;
                    stripe_link?: string | null;
                    itinerary?: string[] | null;
                    itinerary_en?: string[] | null;
                    itinerary_es?: string[] | null;
                    included?: string[] | null;
                    included_en?: string[] | null;
                    included_es?: string[] | null;
                    not_included?: string[] | null;
                    not_included_en?: string[] | null;
                    not_included_es?: string[] | null;
                    meeting_point?: string | null;
                    meeting_point_en?: string | null;
                    meeting_point_es?: string | null;
                    meeting_point_map_url?: string | null;
                    stops?: any[] | null;
                    stripe_tip_link?: string | null;
                };
            };
            site_config: {
                Row: {
                    key: string;
                    value: any;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: any;
                    updated_at?: string;
                };
            };
        };
    };
};
