import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    lang?: string;
}

export const SEO = ({
    title = "Tours & Detours | Découvrez la Catalogne Authentique",
    description = "Expériences uniques et tours privés à Barcelone et en Catalogne. Guide local passionné pour petits groupes.",
    keywords = "barcelone, tours, espagne, catalogne, guide privatif, randonnée, voyage responsable",
    image = "/og-image.jpg",
    url = "https://tours-five-olive.vercel.app",
    type = "website",
    lang = "fr"
}: SEOProps) => {
    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <html lang={lang} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) for Local Business */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "TravelAgency",
                    "name": "Tours & Detours",
                    "image": image,
                    "@id": url,
                    "url": url,
                    "telephone": "+34...",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Barcelona",
                        "addressRegion": "Catalonia",
                        "addressCountry": "ES"
                    }
                })}
            </script>
        </Helmet>
    );
};
