const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/product-image-display-v1.json')));
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const map={};
for(const r of manifest.records){
 if(digest(r.sourcePath)!==r.sourceSha256)throw new Error('Source image changed: '+r.sourcePath);
 for(const v of r.variants)if(digest(v.path)!==v.sha256)throw new Error('Display image changed: '+v.path);
 map[r.sourcePath]=r.variants.filter((v,i,a)=>a.findIndex(x=>x.width===v.width)===i).map(v=>({path:v.path,width:v.width}));
}
const file=path.join(root,'index.html'),html=fs.readFileSync(file,'utf8');
const marker=/^var responsiveProductImages = .*;$/m;
if(!marker.test(html))throw new Error('Missing display image marker');
const next=html.replace(marker,'var responsiveProductImages = '+JSON.stringify(map)+';');
if(process.argv.includes('--check')){if(next!==html)throw new Error('Display image data out of date');}
else fs.writeFileSync(file,next);
console.log('Checked '+manifest.records.length+' original/display image bindings.');
