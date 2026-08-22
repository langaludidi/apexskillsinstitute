import { readFile, writeFile } from 'node:fs/promises';

const site = 'https://apexskillsinstitute.co.za';
const image = `${site}/assets/apex-social-card-v3.jpg`;
const pages = [
  ['faculty-network/index.html', '/faculty-network'],
  ['privacy-policy/index.html', '/privacy-policy'],
  ['terms-and-conditions/index.html', '/terms-and-conditions'],
  ['disclaimer/index.html', '/disclaimer'],
];

for (const [file, route] of pages) {
  let html = await readFile(file, 'utf8');
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = (html.match(/<meta\b[^>]*name=(['"])description\1[^>]*content=(['"])([^'"]*)\2[^>]*>/i)?.[3]
    || html.match(/<meta\b[^>]*content=(['"])([^'"]*)\1[^>]*name=(['"])description\3[^>]*>/i)?.[2])?.trim();
  if (!title || !description) throw new Error(`${file}: missing title or description`);

  const canonical = `${site}${route}`;
  const tags = `<link rel="canonical" href="${canonical}"><meta property="og:locale" content="en_ZA"><meta property="og:site_name" content="Apex Skills Institute"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta property="og:image:secure_url" content="${image}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Apex Skills Institute — Practical Learning for Real Capability"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="Apex Skills Institute — Practical Learning for Real Capability">`;

  html = html
    .replace(/<link\b[^>]*rel=(['"])canonical\1[^>]*>/gi, '')
    .replace(/<meta\b[^>]*(?:property|name)=(['"])(?:og:[^'"]+|twitter:[^'"]+)\1[^>]*>/gi, '')
    .replace('</head>', `${tags}</head>`);
  await writeFile(file, html);
  console.log(`Updated ${file}`);
}
