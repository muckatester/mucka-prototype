const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {test}=require('node:test');
const html=fs.readFileSync(require('node:path').join(__dirname,'../mucka-collector.html'),'utf8');
function extract(name){const start=html.indexOf('function '+name+'('),end=html.indexOf('\n}',start);return html.slice(start,end+2);}
test('Collector renders hostile manual/query barcode input as text in results and queue',()=>{
 const elements={};const document={getElementById:id=>elements[id]||(elements[id]={classList:{add(){}},value:''})};
 const c=vm.createContext({document,navigator:{},flashGreen(){},KNOWN_BARCODES:new Set(),queue:[],Date});
 vm.runInContext(['normalizeGtin','isKnownBarcode','collectorEscapeHtml','barcodeScanned','renderQueueList'].map(extract).join('\n'),c);
 const value='<img src=x onerror="alert(1)">&\'test';
 for(const known of [false,true]){
  if(known)c.KNOWN_BARCODES.add(value);
  c.barcodeScanned(value);
  assert.equal(c.currentBarcode,value);
  assert.doesNotMatch(elements.resultSheet.innerHTML,/<img src=x/);
  assert.match(elements.resultSheet.innerHTML,/&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;&amp;&#39;test/);
 }
 c.queue.push({barcode:value,timestamp:Date.now(),photo:null});c.renderQueueList();
 assert.doesNotMatch(elements.queueList.innerHTML,/<img src=x/);
 assert.match(elements.queueList.innerHTML,/&lt;img/);
});
