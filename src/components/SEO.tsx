import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '@/constants/seo';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO = ({
  title = SITE_CONFIG.title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.image,
  url = SITE_CONFIG.url,
  type = "website",
  keywords = SITE_CONFIG.keywords as unknown as string[],
  author = SITE_CONFIG.author,
  publishedTime,
  modifiedTime
}: SEOProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aman Awasthi",
    "url": url,
    "image": image,
    "sameAs": [
      "https://github.com/KonnichiwaAman",
      "https://www.linkedin.com/in/amankumarawasthi/",
      "https://www.instagram.com/konnichiwaaman/",
      "https://www.chess.com/member/elevencenturies"
    ],
    "jobTitle": "AI/ML Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dehradun",
      "addressRegion": "Uttarakhand",
      "addressCountry": "India"
    },
    "email": SITE_CONFIG.email,
    "knowsAbout": [
      "Python",
      "PyTorch",
      "Generative AI",
      "RAG",
      "Prompt Engineering",
      "Fine-tuning",
      "FastAPI",
      "Docker",
      "Vector Databases"
    ]
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Portfolio",
        "item": `${url}#projects`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Skills",
        "item": `${url}#skills`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contact",
        "item": `${url}#contact`
      }
    ]
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": title,
    "url": url,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      
      {/* Open Graph Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${author} - Full Stack Developer`} />
      <meta property="og:site_name" content="Aman Awasthi Portfolio" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${author} - Full Stack Developer`} />
      
      {/* LinkedIn Meta Tags */}
      <meta property="linkedin:owner" content="aman-awasthi-dev" />
      
      {/* Pinterest Meta Tags */}
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="application-name" content="Aman Awasthi Portfolio" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="es" href={`${url}?lang=es`} />
      <link rel="alternate" hrefLang="fr" href={`${url}?lang=fr`} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Indicate supported color schemes for user agents */}
      <meta name="color-scheme" content="dark light" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
      
      {/* Security Headers (as meta tags for static sites) */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};

export default SEO; 