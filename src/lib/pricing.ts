/** Stripe processing fee multiplier: charge = (subtotal + STRIPE_FIXED_FEE) / STRIPE_FEE_FACTOR */
export const STRIPE_FEE_FACTOR = 0.956;

/** Stripe fixed fee per transaction in EUR */
export const STRIPE_FIXED_FEE = 0.3;

/** Fraction of capacity at which a tour shows a "filling up" warning */
export const CAPACITY_WARNING_THRESHOLD = 0.75;

/** Number of weeks to display in the availability calendar grid */
export const CALENDAR_WEEKS = 6;
