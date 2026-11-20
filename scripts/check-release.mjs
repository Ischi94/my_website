import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const production=read('public-check/index.html'),preview=read('public-preview-check/index.html');
assert(production.includes('https://gregor-mathes.netlify.app/'));
assert(!production.includes('noindex'));
assert(preview.includes('https://preview.example.org/'));
assert(preview.includes('noindex'));
assert(read('public-preview-check/robots.txt').includes('Disallow: /'));
assert(!read('public-check/robots.txt').includes('Disallow: /'));
const old=[...read('research-sources/original-sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const missing=old.filter(u=>!fs.existsSync(path.join(root,'public-check',decodeURIComponent(u),'index.html')));
assert.deepEqual(missing,[],'Every original sitemap URL must still resolve locally or through an alias');
const pubs=JSON.parse(read('data/publications.json'));
for(const p of pubs){const html=read('public-check'+p.url+'index.html');assert(html.includes('citation_doi'));for(const m of html.matchAll(/<script type=\"?application\/ld\+json\"?>([\s\S]*?)<\/script>/g))JSON.parse(m[1]);}
console.log(`Production/preview SEO checks passed. All ${old.length} original sitemap URLs retained. All ${pubs.length} publication pages have citation metadata and valid structured data.`);
