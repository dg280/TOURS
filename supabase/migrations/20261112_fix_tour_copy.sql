-- Copy fixes for the live `tours` rows (the static catalogue in translations.ts
-- is already correct; the database overrides it, so the bad text lives here).
-- Idempotent: every statement matches on the wrong text only.

-- 1. "Pénédés" -> "Penedès" (card + footer) in every localized text column.
UPDATE tours SET
  title        = replace(title,        'Pénédés', 'Penedès'),
  title_en     = replace(title_en,     'Pénédés', 'Penedès'),
  title_es     = replace(title_es,     'Pénédés', 'Penedès'),
  subtitle     = replace(subtitle,     'Pénédés', 'Penedès'),
  subtitle_en  = replace(subtitle_en,  'Pénédés', 'Penedès'),
  subtitle_es  = replace(subtitle_es,  'Pénédés', 'Penedès'),
  description    = replace(description,    'Pénédés', 'Penedès'),
  description_en = replace(description_en, 'Pénédés', 'Penedès'),
  description_es = replace(description_es, 'Pénédés', 'Penedès')
WHERE concat_ws('|', title, title_en, title_es, subtitle, subtitle_en,
                subtitle_es, description, description_en, description_es)
      LIKE '%Pénédés%';

-- 2. Canonical names: one title per language, same as translations.ts, so the
--    cards and the contact dropdown cannot drift apart again.
UPDATE tours SET title_en = 'Kayak the Costa Brava — Sea Caves & Hidden Coves'
 WHERE title_en ILIKE '%Grottes Marines%';
UPDATE tours SET title_en = 'Montserrat & Wine Experience'
 WHERE title_en ILIKE 'Montserrat & wines%';
UPDATE tours SET title_en = 'Barcelona Walking Tour — Hidden Corners of the Old City'
 WHERE title_en ILIKE 'Barcelona Old Town Tour%';

-- 3. "Quartier Gotique" leaking into English text (walking tour).
UPDATE tours SET
  subtitle_en    = replace(subtitle_en,    'Quartier Gotique', 'Gothic Quarter'),
  description_en = replace(description_en, 'Quartier Gotique', 'Gothic Quarter')
 WHERE concat_ws('|', subtitle_en, description_en) LIKE '%Quartier Gotique%';

-- 4. Eighth tour (Costa Brava villages): needs a duration and short tags.
--    Set by hand once its id is known, e.g.:
--   UPDATE tours SET duration = 'Full Day', category = 'Excursion'
--    WHERE id = '<its id>';
