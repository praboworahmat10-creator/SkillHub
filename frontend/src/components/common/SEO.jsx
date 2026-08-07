import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'SkillHub Indonesia - Marketplace Jasa Digital & Freelancer Terpercaya',
  description = 'Temukan freelancer profesional Indonesia untuk pengembangan web, desain UI/UX, edit video, mobile app, & AI services dengan garansi escrow aman.',
  keywords = 'freelancer indonesia, jasa digital, jasa pembuatan website, desain logo figma, edit video tiktok, programmer laravel react, skillhub marketplace',
  image = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  url = typeof window !== 'undefined' ? window.location.href : 'https://skillhub.id',
  type = 'website'
}) => {
  const siteTitle = title.includes('SkillHub') ? title : `${title} | SkillHub Indonesia`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SkillHub Indonesia" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
