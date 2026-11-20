import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const out=path.resolve(root,process.argv[2]||'public');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(out).filter(f=>f.endsWith('.html'));
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"');
const attr=(s,key)=>{const m=s.match(new RegExp('\\b'+key+'\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'));return m?decode(m[1]??m[2]??m[3]):null;};
const issues=[],legacyIssues=[],external=new Set();let checked=0;
const resolve=u=>{let p=path.join(out,decodeURIComponent(u.pathname));if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');if(!fs.existsSync(p)&&!path.extname(p)&&fs.existsSync(p+'.html'))p+='.html';return p;};
const ids=new Map();
for(const f of files){const h=fs.readFileSync(f,'utf8');const rel=path.relative(out,f).replaceAll('\\','/');const legacy=/^(courses|quizes|slides|post|rmarkdown-libs)\//.test(rel);const base=new URL(rel.replace(/index\.html$/,''),'https://gregor-mathes.netlify.app/');
 for(const tag of h.matchAll(/<(?:a|img|script|link|iframe|source)\b[^>]*>/gi)){
  const ref=attr(tag[0],'href')??attr(tag[0],'src');if(!ref||/^(mailto:|tel:|javascript:|data:)/i.test(ref))continue;
  let u;try{u=new URL(ref,base)}catch{(legacy?legacyIssues:issues).push({page:rel,link:ref,reason:'invalid URL'});continue}
  if(!['gregor-mathes.netlify.app','localhost','127.0.0.1','preview.example.org'].includes(u.hostname)){external.add(u.href.split('#')[0]);continue}
  checked++;const p=resolve(u);let reason='';if(!fs.existsSync(p))reason='missing target';else if(u.hash&&p.endsWith('.html')){if(!ids.has(p)){const t=fs.readFileSync(p,'utf8');ids.set(p,new Set([...t.matchAll(/<[^>]+>/g)].map(m=>attr(m[0],'id')).filter(Boolean)))}if(!ids.get(p).has(decodeURIComponent(u.hash.slice(1))))reason='missing anchor';}
  if(reason)(legacy?legacyIssues:issues).push({page:rel,link:ref,reason});
 }
}
const pubs=JSON.parse(fs.readFileSync(path.join(root,'data/publications.json'),'utf8'));
if(pubs.length!==new Set(pubs.map(p=>p.doi.toLowerCase())).size)issues.push({reason:'duplicate DOI'});
for(const p of pubs)if(!p.authors.some(a=>a.self)||!fs.existsSync(resolve(new URL(p.url,'https://gregor-mathes.netlify.app'))))issues.push({reason:'publication metadata or page missing',doi:p.doi});
for(const old of ['files/cv.pdf','files/cv.html'])if(fs.existsSync(path.join(out,old)))issues.push({reason:'retired CV deployed',file:old});
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');
for(const forbidden of ['Publications in review','View resume','UA-185894975-1','google-analytics.com'])if(home.includes(forbidden))issues.push({reason:'obsolete homepage content',text:forbidden});
const report={checkedAt:new Date().toISOString(),htmlFiles:files.length,internalReferences:checked,publicationCount:pubs.length,issues,legacyIssues,externalURLs:[...external].sort()};
fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports/link-check.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,externalURLs:report.externalURLs.length},null,2));
process.exitCode=issues.length?1:0;
