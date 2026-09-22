const test=require('node:test'),assert=require('node:assert/strict');
const path=require('node:path'),{execFileSync}=require('node:child_process');
const {root,setup}=require('./assessment-test-helpers.cjs');
test('display copies preserve verified originals and cannot bypass identity or withholding checks',()=>{
 execFileSync(process.execPath,[path.join(root,'scripts/sync-responsive-images.cjs'),'--check']);
 const {c}=setup();
 for(const p of c.products){
  const source=c.getSourcedProductImage(p),legacy=c.getLegacyProductImage(p);
  const original=source?.localPath||legacy?.imagePath;
  const markup=c.getProductImage(p,52);
  if(original){
   assert.match(markup,/<source type="image\/webp"/,'Display copy for '+p.id);
   assert.ok(markup.includes(c.escapeHtml(original)),'Original fallback for '+p.id);
   assert.match(markup,/loading="lazy" decoding="async"/);
  }else assert.doesNotMatch(markup,/<source |<img /,'Withheld '+p.id);
  assert.doesNotMatch(c.getProductImage({...p,name:'Different recipe'},52),/<source /,'Changed identity '+p.id);
 }
});

test('failed display copy retries the original once and hides only when both fail',()=>{
 const {c}=setup();let source={remove(){source=null;}},assigned=[];
 const img={parentElement:{querySelector(){return source;}},style:{},getAttribute(){return 'verified-original.jpg';},set src(value){assigned.push(value);}};
 c.handleProductImageError(img);
 assert.deepEqual(assigned,['verified-original.jpg']);assert.equal(img.style.display,undefined);
 c.handleProductImageError(img);assert.equal(img.style.display,'none');assert.equal(assigned.length,1);
});
