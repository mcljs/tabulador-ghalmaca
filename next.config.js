/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  env: {
    NEXT_PUBLIC_SITE_TITLE: process.env.NEXT_PUBLIC_SITE_TITLE,
    NEXT_PUBLIC_PRODUCT_DESCRIPTION: process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION,
    NEXT_PUBLIC_PARTNER_FIRST_NAME: process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME,
    NEXT_PUBLIC_PARTNER_LAST_NAME: process.env.NEXT_PUBLIC_PARTNER_LAST_NAME,
      
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_SEO_KEYWORDS: process.env.NEXT_PUBLIC_SEO_KEYWORDS,
    NEXT_PUBLIC_PARTNER_TWITTER: process.env.NEXT_PUBLIC_PARTNER_TWITTER,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['minio-s3.caprover.snotrasys.com']
  },
};

module.exports = nextConfig;
