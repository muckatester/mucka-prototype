const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const {test} = require('node:test');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/collector/store.js'), 'utf8');
async function harness(existing) {
  let request, transaction, written;
  const c = vm.createContext({indexedDB:{open(){request = {}; return request;}}, Promise, Error});
  vm.runInContext(source, c);
  const opening = c.MuckaCaptureStore.open();
  const objectStore = {get(){return transaction.read = {};}, put(record){written = record;}, delete(){}};
  request.result = {close(){}, transaction(){transaction = {objectStore(){return objectStore;}, abort(){queueMicrotask(()=>transaction.onabort());}};return transaction;}};
  request.onsuccess();const store = await opening;
  return {store, get tx(){return transaction;}, get written(){return written;}, read(){transaction.read.result = existing;transaction.read.onsuccess();}};
}
test('Capture save is not acknowledged until the IndexedDB transaction commits', async()=>{
  const h=await harness();let resolved=false;
  const pending=h.store.put({id:'one'},0).then(x=>{resolved=true;return x;});
  h.read();await Promise.resolve();assert.equal(resolved,false);assert.equal(h.written.revision,1);
  h.tx.oncomplete();assert.equal((await pending).id,'one');assert.equal(resolved,true);
});
test('A quota failure rejects the capture save instead of reporting success', async()=>{
  const h=await harness();const pending=h.store.put({id:'one'},0);h.read();
  h.tx.error=Object.assign(new Error('Full'),{name:'QuotaExceededError'});h.tx.onabort();
  await assert.rejects(pending,{name:'QuotaExceededError'});
});
test('A stale tab cannot silently overwrite a newer capture', async()=>{
  const h=await harness({id:'one',revision:3});const pending=h.store.put({id:'one'},2);h.read();
  await assert.rejects(pending,{name:'CaptureConflictError'});assert.equal(h.written,undefined);
});
const backupContext=vm.createContext({Date,Error,Number,Array,Object});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../assets/collector/backup.js'),'utf8'),backupContext);
const valid={schemaVersion:1,captures:[{id:'record-1',barcode:'4006381333931',brand:'Brand',name:'Recipe',pack:'1 kg',notes:'',createdAt:'2026-10-13T00:00:00Z',updatedAt:'2026-10-13T00:00:00Z',status:'saved',photos:{front:'capture-001-record-1/front.jpg'}}]};
test('Backup restoration accepts only supported metadata and labelled local photo paths',()=>{
 const parse=backupContext.MuckaCaptureBackup.validateManifest;
 assert.equal(parse(valid)[0].photos.front,'capture-001-record-1/front.jpg');
 for(const path of ['../../outside.jpg','https://evil.test/a.jpg','capture-001-record-1/barcode.jpg']){
  const bad=structuredClone(valid);bad.captures[0].photos.front=path;assert.throws(()=>parse(bad),/photo path/);
 }
 const bad=structuredClone(valid);bad.captures[0].name='x'.repeat(181);assert.throws(()=>parse(bad),/invalid product details/);
});
