const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {setup,fn,root}=require('./assessment-test-helpers.cjs');
const resolution=JSON.parse(fs.readFileSync(root+'/data/catalogue-resolution-2026-10-20.json'));
test('Confirmed duplicates leave one active product and old detail links open the canonical entry',()=>{
 const {c,element}=setup();assert.equal(c.products.length,1080);assert.equal(c.archivedProducts.length,2);
 for(const r of resolution.merges){assert(!c.products.some(p=>p.id===r.fromId));assert(c.archivedProducts.some(p=>p.id===r.fromId));c.showProduct(r.fromId);assert.equal(c.currentProduct.id,r.toId);}
 c.handleCategoryClick('all-products');assert.equal(c.currentCategoryProducts.length,1080);
});
test('Saved favourites migrate duplicate IDs without losing their canonical product or creating repeats',()=>{
 const state={version:1,ids:[189,188,1013,33,976]};const {c}=setup({storage:{getItem:()=>JSON.stringify(state),setItem(){}}});
 assert.deepEqual(Array.from(c.favourites),[188,33,976]);c.showProduct(189);assert.equal(c.currentProduct.id,188);assert(c.favourites.includes(188));
});
test('Corrections and photographs remain bound to exact identities without inventing pack barcodes',()=>{
 const {c}=setup();vm.runInContext(fn('findProductByBarcode'),c);
 for(const r of resolution.catalogueCorrections){const p=c.products.find(p=>p.id===r.appId);for(const [k,v]of Object.entries(r.after))assert.equal(p[k],v);}
 for(const id of resolution.newSourcedPhotoIds){const p=c.products.find(p=>p.id===id),e=c.getSourcedProductImage(p);assert(e);assert.equal(e.matchStatus,'recipe_match_pack_unverified');assert(c.productHasImage(p));assert.equal(c.getSourcedProductImage({...p,type:'another pack'}),null);}
 assert.equal(c.products.find(p=>p.id===244).barcode,null);assert.notEqual(c.findProductByBarcode('9334214066516')?.id,244);
 assert.equal(c.products.filter(p=>p.barcode&&c.findProductByBarcode(p.barcode)?.id===p.id).length,474);
});
test('All initial photo gaps reconcile to new photos, one merged row or an explicit remaining case',()=>{
 const {c}=setup(),work=JSON.parse(fs.readFileSync(root+'/docs/image-gaps-2026-10-20.json'));
 const missing=c.products.filter(p=>!c.productHasImage(p)).map(p=>p.id).sort((a,b)=>a-b);
 assert.deepEqual(work.products.map(p=>p.id).sort((a,b)=>a-b),Array.from(missing));
 assert.equal(work.missingPhotos,105);assert.equal(work.displayedPhotos,975);
 assert.equal(work.initialPhotoGaps,115);assert.equal(work.resolvedByPhoto.length,9);assert.deepEqual(work.resolvedByMerge,[189]);
});
