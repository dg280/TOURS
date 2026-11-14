-- Stable, short public URL for each tour (/tours/<slug>).
-- Until now the slug was derived from the English title, so editing a title
-- silently changed the URL and the sitemap drifted from the real pages.
-- Once set, a slug never changes. Old URLs keep working: the app still
-- resolves legacy aliases and title-derived slugs, then redirects to this one.

ALTER TABLE tours ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE default_tours ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE tours SET slug = CASE id
    WHEN '1' THEN 'girona-costa-brava'
    WHEN '2' THEN 'barcelona-walking-tour'
    WHEN '3' THEN 'costa-brava-coastal-hike'
    WHEN '4' THEN 'pre-pyrenees-medieval-hike'
    WHEN '5' THEN 'kayak-costa-brava'
    WHEN '6' THEN 'montserrat-wine-experience'
    WHEN '7' THEN 'girona-collioure'
END
WHERE slug IS NULL AND id IN ('1','2','3','4','5','6','7');

-- NOTE: the eighth tour (Costa Brava villages) is not backfilled here: set it by hand,
--   UPDATE tours SET slug = 'costa-brava-villages' WHERE id = '<its id>';
-- A tour without a slug falls back to the title-derived one until then.

CREATE UNIQUE INDEX IF NOT EXISTS tours_slug_key ON tours (slug) WHERE slug IS NOT NULL;
ALTER TABLE tours ADD CONSTRAINT tours_slug_format
    CHECK (slug IS NULL OR slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
