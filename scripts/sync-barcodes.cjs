const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),file=path.join(root,'index.html');let html=fs.readFileSync(file,'utf8');
const products=vm.runInNewContext(html.match(/const products = (\[[\s\S]*?\n\]);/)[1]);
const evidence=JSON.parse(fs.readFileSync(path.join(root,'data/barcode-evidence-v1.json')));
const c=vm.createContext({});vm.runInContext(html.match(/^function normalizeGtin\([\s\S]*?^}/m)[0],c);
const ids=new Set();for(const r of evidence.records){
 if(ids.has(r.appId))throw Error('Duplicate barcode evidence ID');ids.add(r.appId);
 const p=products.find(p=>p.id===r.appId);if(!p||!['brand','name','petType','foodType','type','barcode'].every(k=>(p[k]??null)===r.identity[k]))throw Error('Stale barcode evidence '+r.appId);
 if(!['manufacturer_pack','retailer_pack','conflict'].includes(r.status)||!r.sourcePage.startsWith('https://')||!r.observation)throw Error('Missing evidence');
 if(r.status!=='conflict'&&(!c.normalizeGtin(r.barcode)||!r.pack||!r.sourceSha256))throw Error('Invalid verified barcode');
}
const conflicts=new Set(evidence.records.filter(r=>r.status==='conflict').map(r=>c.normalizeGtin(r.barcode)).filter(Boolean));
const byGtin=new Map();for(const p of products){const g=c.normalizeGtin(p.barcode);if(g&&!conflicts.has(g)){const v=byGtin.get(g)||[];v.push(p);byGtin.set(g,v)}}
const starter=JSON.parse(fs.readFileSync(path.join(root,'data/starter-catalogue-v1.json')));
const usable=[...byGtin.values()].filter(v=>v.length===1).map(v=>v[0]).filter(p=>{
 const r=evidence.records.find(r=>r.appId===p.id);if(r&&['manufacturer_pack','retailer_pack'].includes(r.status))return true;
 const e=starter.records.find(r=>r.appId===p.id);
 return e&&['brand','name','barcode','petType','foodType','type'].every(k=>e.catalogueIdentity[k]===p[k])&&e.fields.barcode.status==='source_checked';
});
const map='var BARCODE_MAP = {\n'+usable.map(p=>'  '+JSON.stringify(p.barcode)+': '+p.id).join(',\n')+'\n};';
const next=html.replace(/var barcodeEvidence = .*;/,'var barcodeEvidence = '+JSON.stringify(evidence)+';').replace(/var BARCODE_MAP = \{[\s\S]*?\n};/,map);
const collector=path.join(root,'mucka-collector.html'),old=fs.readFileSync(collector,'utf8');const updated=old.replace(/var KNOWN_BARCODES = new Set\(\[[\s\S]*?\]\);/,'var KNOWN_BARCODES = new Set('+JSON.stringify(usable.map(p=>p.barcode).sort())+');');
if(process.argv.includes('--check')){if(next!==html||updated!==old)throw Error('Barcode embeds stale')}else{fs.writeFileSync(file,next);fs.writeFileSync(collector,updated)}
console.log('Barcode lookup/Collector synchronized: '+usable.length+' source-supported associations; physical scan testing remains separate.');
