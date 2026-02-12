import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        };
    };
};
