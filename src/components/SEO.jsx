import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ seoData }) => {
  if (!seoData) return null;

  const { title, description, keywords, schema } = seoData;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Social Media Meta Tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />

      {/* Structured Data (JSON-LD) for Generative Engine Optimization */}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </Helmet>
  );
};

export default SEO;
