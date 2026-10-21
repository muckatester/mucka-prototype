const {test}=require('node:test'),assert=require('node:assert/strict');
require('../assets/collector/submission.js');
const api=globalThis.MuckaCaptureSubmission;
const record=()=>({id:'2dfc7437-c00f-4c67-b586-07a6b52183c2',barcode:'9392596027556',brand:"Billie's Bowl",name:'Aussie Beef',pack:'20 kg',notes:'Packet report',reportType:'wrong',reportedProduct:{id:'976',brand:"Billie's Bowl",name:'Adult with Aussie Beef',pack:'Dry · 20kg'},photos:{front:new Blob(['front-photo'],{type:'image/jpeg'}),barcode:new Blob(['printed-barcode'],{type:'image/jpeg'})}});
test('Review uploads require both labelled JPEG photos and barcode digits',()=>{
 const r=record();delete r.photos.barcode;assert.throws(()=>api.validate(r),/both/);
 r.photos.barcode=new Blob(['x'],{type:'text/html'});assert.throws(()=>api.validate(r),/fresh packet/);
 r.photos.barcode=new Blob(['x'],{type:'image/jpeg'});r.barcode=' ';assert.throws(()=>api.validate(r),/digits/);
});
test('Oversized uploads are rejected before transmission',()=>{
 const r=record();r.photos.front=new Blob([new Uint8Array(7*1024*1024)],{type:'image/jpeg'});assert.throws(()=>api.validate(r),/too large/);
});
test('Identical retry payloads share a reference; changed photos or product details do not',async()=>{
 const a=record(),b=record();const x=await api.prepare(a),y=await api.prepare(b);assert.equal(x.reference,y.reference);
 b.notes+=' correction';assert.notEqual((await api.prepare(b)).reference,x.reference);
 b.notes=a.notes;b.photos.front=new Blob(['different-photo'],{type:'image/jpeg'});assert.notEqual((await api.prepare(b)).reference,x.reference);
});
test('Multipart report retains the exact scanned digits, expected product, version and two distinct photo fields',async()=>{
 const p=await api.prepare(record());assert.equal(p.body.get('barcode'),'9392596027556');assert.equal(p.body.get('report-type'),'wrong');assert.equal(JSON.parse(p.body.get('reported-product')).id,'976');assert.equal(p.body.get('app-version'),'2026.10.22.1');assert.equal(p.body.get('form-name'),'mucka-packet-review');assert.equal(p.body.get('front-photo').name,'front.jpg');assert.equal(p.body.get('barcode-photo').name,'barcode.jpg');assert.equal(p.body.get('bot-field'),'');assert.match(p.body.get('consent'),/catalogue review/);
});
test('Transport refuses non-success HTTP responses and connection failures',async()=>{
 const original=globalThis.fetch;
 try {globalThis.fetch=async()=>new Response('Rejected',{status:503});await assert.rejects(api.send(await api.prepare(record())),/not accepted/);globalThis.fetch=async()=>{throw new TypeError('offline')};await assert.rejects(api.send(await api.prepare(record())),/could not confirm/);}
 finally {globalThis.fetch=original;}
});
test('Receipt is returned only after successful server response',async()=>{
 const original=globalThis.fetch;
 try {let resolve;globalThis.fetch=()=>new Promise(r=>resolve=r);const p=await api.prepare(record());let complete=false;const pending=api.send(p).then(r=>{complete=true;return r;});await new Promise(r=>setImmediate(r));assert.equal(complete,false);resolve(new Response('<title>Mucka report submitted</title>',{status:200}));assert.equal((await pending).reference,p.reference);}
 finally{globalThis.fetch=original;}
});
test('A generic successful HTML page cannot masquerade as a submission receipt',async()=>{
 const original=globalThis.fetch;
 try{globalThis.fetch=async()=>new Response('<title>Sign in</title>',{status:200});await assert.rejects(api.send(await api.prepare(record())),/did not confirm/);}
 finally{globalThis.fetch=original;}
});
