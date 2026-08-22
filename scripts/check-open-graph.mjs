const base = process.env.APEX_SITE_URL || 'https://apexskillsinstitute.co.za';
const routes = ['/', '/programmes', '/faculty-network', '/schools/business-entrepreneurship', '/programmes/entrepreneurship-fundamentals', '/privacy-policy'];
const required = [
  'og:site_name', 'og:type', 'og:title', 'og:description', 'og:url', 'og:image',
  'og:image:secure_url', 'og:image:width', 'og:image:height', 'og:image:alt'
];

for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const html = await response.text();
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
  if (!canonical?.startsWith('https://apexskillsinstitute.co.za/')) throw new Error(`${route}: invalid canonical`);
  for (const property of required) {
    const pattern = new RegExp(`<meta\\b[^>]*property=["']${property.replace(':', '\\:')}["'][^>]*content=["'][^"']+`, 'i');
    if (!pattern.test(html)) throw new Error(`${route}: missing ${property}`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
    const pattern = new RegExp(`<meta\\b[^>]*name=["']${name.replace(':', '\\:')}["'][^>]*content=["'][^"']+`, 'i');
    if (!pattern.test(html)) throw new Error(`${route}: missing ${name}`);
  }
}

const image = await fetch(`${base}/assets/apex-social-card-v3.jpg`);
if (!image.ok || !image.headers.get('content-type')?.startsWith('image/jpeg')) throw new Error('Open Graph image is unavailable');
if (Number(image.headers.get('content-length') || 0) < 10_000) throw new Error('Open Graph image payload is unexpectedly small');
console.log(`Open Graph checks passed for ${routes.length} representative routes.`);
