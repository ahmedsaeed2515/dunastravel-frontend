import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const SITE_URL = 'https://dunas-travel.com';
export const DEFAULT_OG_IMAGE = 'https://dunas-travel.com/dunas-travel-logo.webp';
export const DEFAULT_SITE_NAME = 'Dunas Travel | Luxury Egypt & Middle East Private Tours';
export const SUPPORTED_LOCALES = ['en', 'es', 'pt', 'it', 'ar'];

const LOCALE_OG_MAP = {
  en: 'en_US',
  es: 'es_ES',
  pt: 'pt_PT',
  it: 'it_IT',
  ar: 'ar_EG',
};

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schema,
  article,
  noindex = false,
}) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'en';
  const pageTitle = title ? `${title} | Dunas Travel` : DEFAULT_SITE_NAME;
  const pageDesc =
    description ||
    t(
      'site.defaultDescription',
      'Experience true luxury with Dunas Travel — award-winning curated journeys across Egypt, Jordan, Turkey, Morocco, and Dubai with private concierges.'
    );

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `${SITE_URL}${pathname}`;
  const canonicalUrl = canonical || `${SITE_URL}${pathname}`;

  const metaKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords ||
      'luxury travel egypt, private egypt tours, nile cruise luxury, bespoke travel middle east, jordan petra tours, morocco luxury holidays, dunas travel';

  // Format schema(s)
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Dunas Travel',
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    description: pageDesc,
    telephone: '+201000000000',
    email: 'booking.online@dunas-travel.com',
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'EG',
    },
  };

  const schemaList = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : [defaultSchema];

  const currentOgLocale = LOCALE_OG_MAP[currentLang] || 'en_US';
  const alternateLocales = SUPPORTED_LOCALES.filter((l) => l !== currentLang).map(
    (l) => LOCALE_OG_MAP[l] || l
  );

  return (
    <Helmet htmlAttributes={{ lang: currentLang, dir: currentLang === 'ar' || currentLang?.startsWith('ar') ? 'rtl' : 'ltr' }}>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={metaKeywords} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Multilingual Hreflang Tags */}
      {SUPPORTED_LOCALES.map((lang) => (
        <link
          key={`hreflang-${lang}`}
          rel="alternate"
          hrefLang={lang}
          href={`${canonicalUrl}?lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="Dunas Travel" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={currentOgLocale} />
      {alternateLocales.map((altLoc) => (
        <meta key={`og-alt-${altLoc}`} property="og:locale:alternate" content={altLoc} />
      ))}

      {/* Article Open Graph Metadata */}
      {ogType === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags &&
            article.tags.map((tag) => (
              <meta key={`article-tag-${tag}`} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data Schema */}
      {schemaList.map((item, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
