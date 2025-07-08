// generate_robots.js
const fs = require('fs');
const path = require('path');

const domain = process.env.SITE_DOMAIN || 'https://metrics.manifest.network';
const robotsContent = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, 'static', 'robots.txt'), robotsContent.trim() + '\n');
console.log(`robots.txt generated for ${domain}!`);