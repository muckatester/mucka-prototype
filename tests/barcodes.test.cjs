const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');const {test}=require('node:test');
const {setup,html,fn,root}=require('./assessment-test-helpers.cjs');
function context(){const {c,...rest}=setup();vm.runInContext(fn('findProductByBarcode'),c);return {c,...rest}}
test('GTIN normalization validates digits and preserves package indicators',()=>{
 const {c}=context();for(const v of ['9310022360800','09310022360800',' 9310022360800 '])assert.equal(c.normalizeGtin(v),'09310022360800');
 for(const v of ['9310022360801','<img src=x>','9310 022360800','76344884132','',null,9310022360800])assert.equal(c.normalizeGtin(v),null);
 assert.equal(c.normalizeGtin('036000291452'),c.normalizeGtin('0036000291452'));
});
test('Every current usable barcode resolves consistently in app and Collector, including zero-padded scans',()=>{
 const {c}=context();const collector=fs.readFileSync(root+'/mucka-collector.html','utf8');
 const cc=vm.createContext({});vm.runInContext(collector.match(/var KNOWN_BARCODES = new Set\(\[[\s\S]*?\]\);/)[0]+collector.match(/^function normalizeGtin\([\s\S]*?^}/m)[0]+collector.match(/^function isKnownBarcode\([\s\S]*?^}/m)[0],cc);
 let matched=0,blocked=0;
 for(const p of c.products){
  if(!p.barcode)continue;const result=c.findProductByBarcode(p.barcode);assert.equal(cc.isKnownBarcode(p.barcode),!!result,'Collector '+p.id);
  if(result){matched++;assert.equal(result.id,p.id);assert.equal(c.findProductByBarcode(c.normalizeGtin(p.barcode)).id,p.id);assert.equal(cc.isKnownBarcode(c.normalizeGtin(p.barcode)),true)}else blocked++;
 }
 assert.equal(matched,557);assert.equal(blocked,68);
});
test('Ambiguous normalized identifiers, invalid codes and disputed codes cannot open a product',()=>{
 const {c}=context();const p=c.products.find(p=>p.id===960);c.products.push({...p,id:99999,barcode:'0'+p.barcode});assert.equal(c.findProductByBarcode(p.barcode),null);
 for(const r of c.barcodeEvidence.records.filter(r=>r.status==='conflict')){assert.equal(c.findProductByBarcode(r.barcode),null);c.products.find(p=>p.id===r.appId).name='changed';assert.equal(c.findProductByBarcode(r.barcode),null)}
 for(const v of ['122013000172','133014000030','9340621001002'])assert.equal(c.findProductByBarcode(v),null);
});
test('Manufacturer barcode evidence is identity-bound and never inferred from format validity',()=>{
 const {c,element}=context();for(const r of c.barcodeEvidence.records.filter(r=>r.status==='manufacturer_pack')){const p=c.products.find(p=>p.id===r.appId);assert.equal(c.findProductByBarcode(r.barcode).id,p.id);assert.equal(c.getBarcodeEvidence(p),r);c.showProduct(p.id);assert.match(element('catalogueFacts').innerHTML,/Manufacturer pack barcode checked online/);assert.match(element('catalogueFacts').innerHTML,/Physical scan not tested/);const old=p.type;p.type='different pack';assert.equal(c.getBarcodeEvidence(p),null);p.type=old}
 const unverified=c.products.find(p=>p.barcode&&c.normalizeGtin(p.barcode)&&!c.getBarcodeEvidence(p)&&!c.getProductEvidence(p));assert.match(c.getBarcodeStatusText(unverified),/association is not verified/);
 const invalid=c.products.find(p=>p.barcode&&!c.normalizeGtin(p.barcode));assert.match(c.getBarcodeStatusText(invalid),/withheld/);
});
test('Camera UPC-E expansion uses format metadata and never guesses from an eight-digit string',()=>{
 const {c}=context();vm.runInContext(fn('getScannedGtinText'),c);
 const result={result:{format:{formatName:'UPC_E'}}};assert.equal(c.getScannedGtinText('04252614',result),'042100005264');
 assert.equal(c.getScannedGtinText('04252614',{result:{format:{formatName:'EAN_8'}}}),'04252614');
 assert.equal(c.getScannedGtinText('04252615',result),'');assert.equal(c.getScannedGtinText('24252614',result),'');
});
