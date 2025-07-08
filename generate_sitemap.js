const fs = require('fs');
const path = require('path');

const domain = process.env.SITE_DOMAIN || 'https://metrics.manifest.network';
const routes = [
  '/',
  '/blockchain-details',
  '/decentralized-network-details',
  '/decentralized-website-details',
  '/gpu-details',
  '/kube-details',
  '/network-details',
  '/object-storage-details',
  '/tokenomic-details',
  '/web-services-details'
];

const urls = routes.map(route => `
  <url>
    <loc>${domain}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
`).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'static', 'sitemap.xml'), sitemap.trim());
console.log(`Sitemap generated for ${domain}!`);