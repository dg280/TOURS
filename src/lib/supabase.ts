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
                    subtitle: string;
                    description: string;
                    duration: string;
                    group_size: string;
                    price: number;
                    image: string;
                    category: string;
                    highlights: string[];
                    is_active: boolean;
                    stripe_link: string | null;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    title: string;
                    subtitle: string;
                    description: string;
                    duration: string;
                    group_size: string;
                    price: number;
                    image: string;
                    category: string;
                    highlights: string[];
                    is_active?: boolean;
                    stripe_link?: string | null;
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
