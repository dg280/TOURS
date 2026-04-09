export type Language = "fr" | "en" | "es";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Tour {
  id: string | number;
  title: string;
  title_en?: string;
  title_es?: string;
  subtitle: string;
  subtitle_en?: string;
  subtitle_es?: string;
  description: string;
  description_en?: string;
  description_es?: string;
  duration: string;
  groupSize: string;
  maxCapacity?: number;
  price: number;
  image: string;
  images?: string[];
  category: string | string[];
  pricing_tiers?: Record<number, number>;
  highlights: string[];
  highlights_en?: string[];
  highlights_es?: string[];
  stripeLink?: string;
  itinerary?: string[];
  itinerary_en?: string[];
  itinerary_es?: string[];
  included?: string[];
  included_en?: string[];
  included_es?: string[];
  notIncluded?: string[];
  notIncluded_en?: string[];
  notIncluded_es?: string[];
  meetingPoint?: string;
  meetingPoint_en?: string;
  meetingPoint_es?: string;
  meetingPointMapUrl?: string;
  departureTime?: string;
  estimatedDuration?: string;
  goodToKnow?: string[];
  goodToKnow_en?: string[];
  goodToKnow_es?: string[];
  stops?: { name: string; description: string; image?: string }[];
  stripe_tip_link?: string;
  isActive?: boolean;
}
export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  tourId: string;
  tourName: string;
  date: string;
  participants: number;
  status: BookingStatus;
  message: string;
  createdAt: string;
  totalPrice: number;
  pickupTime?: string;
  pickupAddress?: string;
  billingAddress?: string;
  billingCity?: string;
  billingZip?: string;
  billingCountry?: string;
  paymentIntentId?: string;
}

// Mini-CRM: admin-editable per-customer overrides + free-form notes.
// Keyed by lowercased email. Stored in `customer_notes` table.
export interface CustomerNote {
  email: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Aggregated customer view (computed in admin from reservations + customer_notes)
export interface Customer {
  email: string;            // normalized lowercase
  name: string;             // most recent reservation's name
  phone: string;            // override OR most recent reservation's phone
  address: string;          // override OR most recent billing address (composed)
  notes: string;            // from customer_notes
  reservationCount: number;
  totalSpent: number;
  firstBooking: string;     // ISO date of first reservation
  lastBooking: string;      // ISO date of last reservation
  favoriteTour: string;     // most-booked tour name (by count)
  reservations: Reservation[];
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  tourId?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string | number;
  name: string;
  loc: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface LiveSession {
  id: string;
  session_code: string;
  tour_id: string;
  current_stop_index: number;
  is_active: boolean;
  urgent_message?: string | null;
  created_at: string;
  tours?: Tour;
}

export interface LiveEcho {
  id: string;
  session_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export interface LiveMedia {
  id: string;
  session_id: string;
  url: string;
  uploaded_by: string;
  created_at: string;
}
