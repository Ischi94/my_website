import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const sitemap=fs.readFileSync(path.join(root,'research-sources/original-sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const groups={'content/resources.md':[], 'content/publication/_index.md':[], 'content/about.md':['/authors/admin/']};
for(const u of urls){if(/^\/(tags|categories)\//.test(u))groups['content/resources.md'].push(u);if(/^\/publication_types\//.test(u))groups['content/publication/_index.md'].push(u);if(/^\/authors\//.test(u)){groups[/^\/authors\/(admin|gregor-mathes)\/$/.test(u)?'content/about.md':'content/publication/_index.md'].push(u)}}
for(const [f,aliases]of Object.entries(groups)){let s=fs.readFileSync(path.join(root,f),'utf8').replace(/^aliases:.*\r?\n/m,'');s=s.replace(/^---\r?\n/,'---\naliases: '+JSON.stringify([...new Set(aliases)])+'\n');fs.writeFileSync(path.join(root,f),s)}
let redirects=fs.readFileSync(path.join(root,'static/_redirects'),'utf8');redirects+='\n# Preserve retired taxonomy routes as useful landing pages.\n';
for(const [f,aliases]of Object.entries(groups)){const target=f.includes('resources')?'/resources/':f.includes('publication')?'/publication/':'/about/';for(const u of new Set(aliases))if(!redirects.includes(u+' '))redirects+=`${u} ${target} 301!\n`;}
fs.writeFileSync(path.join(root,'static/_redirects'),redirects);
