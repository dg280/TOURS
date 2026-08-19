# SEO and Marketing Strategy - Tours & Detours Barcelona

## 1. Technical Baseline (On-Page SEO)
- **HTML semantics**: Rigorous use of `<h1>` through `<h3>` tags for content hierarchy.
- **Dynamic metadata**: The `SEO.tsx` component automatically manages titles and descriptions for the selected language.
- **Structured data**: JSON-LD (Schema.org) lets Google show tours as Events or Travel Packages in results.
- **Reduced JavaScript**: The Vite app is optimized to load in under one second on Vercel.

## 2. Content Strategy (SEO Content)
- **Target keywords**:
  - *Primary*: "Authentic Barcelona tours", "Private guide Catalonia", "Hidden gems Barcelona".
  - *Additional*: "Private Montserrat tour", "Costa Brava day trip from Barcelona".
- **Image optimization**: Every tour image needs descriptive `alt` text, for example "Medieval village of Pals at sunset".

## 3. Marketing and Conversion
- **Newsletter**: A footer form stores email addresses in Supabase and makes them available in the admin interface.
- **Social proof**: A dynamic Testimonials section builds trust.
- **Analytics (data-driven marketing)**:
  - Recommendation: Use **Umami Analytics** integrated in the admin interface for GDPR-friendly analytics.
  - Goal: Identify the tour that generates the most clicks and adjust campaigns accordingly.

## 4. Next Steps Checklist
1. [ ] **Google Search Console**: Register the `tours-five-olive.vercel.app` domain.
2. [ ] **Sitemap**: Generate a `sitemap.xml` file listing all tours.
3. [ ] **Backlinks**: Register in specialist directories such as TripAdvisor and Viator that link to the site.
