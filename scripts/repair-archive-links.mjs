import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../content/post');
const replacements=[
 ['https://github.com/rmcelreath/stat_rethinking_2020%3E','https://github.com/rmcelreath/stat_rethinking_2020'],
 ['https://www.evolv-ed.net/post/introduction-to-ggplot2-part-i/','/2020/06/29/introduction-to-ggplot2-part-1/'],
 ['evolvED homepage','first tutorial page'],
 ['https://ggplot2-book.org/polishing.html#introduction-5','https://ggplot2-book.org/themes.html'],
 ['chapter 15.4','the themes chapter'],
];
for(const f of fs.readdirSync(root).filter(f=>/\.(Rmd|html)$/.test(f))){let s=fs.readFileSync(path.join(root,f),'utf8');for(const [a,b]of replacements)s=s.replaceAll(a,b);fs.writeFileSync(path.join(root,f),s)}
