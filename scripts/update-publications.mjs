import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s);};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const clean=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').replace(/\s+—/g,'—').trim();
const sources=fs.readdirSync(path.join(root,'research-sources/crossref')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(read('research-sources/crossref/'+f).replace(/^\uFEFF/,'')));
const selected={
 '10.1038/s41559-020-01377-w':'How past climate shapes extinction risk',
 '10.1111/geb.13905':'Biodiversity responses vary across space',
 '10.1016/j.cub.2025.12.017':'Reconstructing diversity from an uneven fossil record',
 '10.1017/ext.2025.2':'Connecting climate legacies and extinction',
};
const existing=fs.readdirSync(path.join(root,'content/publication/journal-article')).filter(f=>f.endsWith('.md'));
const pubs=sources.filter(m=>!m['update-to']).map(m=>{
 const doi=m.DOI; const old=existing.find(f=>read('content/publication/journal-article/'+f).toLowerCase().includes(doi.toLowerCase()));
 const slug=old?.replace(/\.md$/,'') || clean(m.title[0]).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const parts=(m['published-print']||m['published-online']||m.issued)['date-parts'][0];
 const online=m['published-online']?.['date-parts'][0];
 const date=[parts[0],String(parts[1]||1).padStart(2,'0'),String(parts[2]||1).padStart(2,'0')].join('-');
 const p={title:clean(m.title[0]),doi,year:parts[0],date,authors:m.author.map(a=>({name:[a.given,a.family].filter(Boolean).join(' '),self:a.family==='Mathes'})),journal:clean(m['container-title'][0]),volume:m.volume||'',issue:m.issue||'',pages:m.page||m['article-number']||'',url:'/publication/journal-article/'+slug+'/',selected:!!selected[doi],focus:selected[doi]||'',source:'https://api.crossref.org/works/'+doi};
 if(online && online[0]!==parts[0])p.online_year=online[0];
 if(doi==='10.1111/geb.13905')p.correction='https://doi.org/10.1111/geb.70119';
 if(old){let s=read('content/publication/journal-article/'+old);s=s.replace(/^title:.*$/m,'title: '+JSON.stringify(p.title)).replace(/^date:.*$/m,'date: '+JSON.stringify(date)).replace(/^publishDate:.*$/m,'publishDate: '+JSON.stringify(date)).replace(/^doi:.*$/m,'doi: '+JSON.stringify(doi));write('content/publication/journal-article/'+old,s);}
 else write('content/publication/journal-article/'+slug+'.md',JSON.stringify({title:p.title,date,doi},null,2)+'\n');
 return p;
}).sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
write('data/publications.json',JSON.stringify(pubs,null,2)+'\n');
write('static/files/publications.bib',pubs.map(p=>`@article{${p.doi.replace(/[^a-z0-9]/gi,'')},\n  title = {{${p.title}}},\n  author = {${p.authors.map(a=>a.name).join(' and ')}},\n  journal = {${p.journal}},\n  year = {${p.year}},\n  volume = {${p.volume}},\n  number = {${p.issue}},\n  pages = {${p.pages}},\n  doi = {${p.doi}}\n}`).join('\n\n')+'\n');
console.log(`Updated ${pubs.length} journal publications.`);
