// Real browser UI checks with simulated camera lifecycle; no physical scan is claimed.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),results=[];
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,data)=>{if(e)res.writeHead(404).end();else{res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(data);}});});
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.route('https://**/*',r=>r.abort());
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/index.html');
 await page.evaluate(()=>document.getElementById('splashScreen')?.remove());
 async function check(name,fn){await fn();results.push(name);console.log('PASS '+name);}
 const open=()=>page.locator('#nav-scan').click();
 const manual=async code=>{await page.locator('#scannerBarcode').fill(code);await page.getByRole('button',{name:'Find product',exact:true}).click();};
 await check('Missing camera dependency offers working manual exact-product lookup',async()=>{
  await open();await page.waitForFunction(()=>document.getElementById('scanner-status-text').textContent.includes('could not load'));
  await manual('9 392596 027556');assert.equal(await page.evaluate(()=>currentProduct.id),976);assert.equal(await page.locator('#scanner').isVisible(),false);
 });
 await check('Invalid digits cannot open a product; valid unknown digits reach saved captures',async()=>{
  await open();await manual('9392596027557');assert.match(await page.locator('#scannerManualStatus').textContent(),/Check all/);assert(await page.locator('#scanner').isVisible());
  await manual('4006381333931');assert(await page.locator('#screen-notfound').isVisible());assert.equal(await page.locator('#notFoundBarcode').textContent(),'4006381333931');
 });
 await page.evaluate(()=>{
  window.starts=0;window.stops=0;window.nextFailure=null;window.pendingStarts=[];window.scanCallbacks=[];
  window.Html5QrcodeSupportedFormats={EAN_13:1,EAN_8:2,UPC_A:3,UPC_E:4,CODE_128:5,CODE_39:6};
  window.Html5Qrcode=class {start(a,b,cb){starts++;scanCallbacks.push(cb);return new Promise((resolve,reject)=>pendingStarts.push({resolve,reject}));}stop(){stops++;return Promise.resolve();}};
 });
 const settled=()=>page.waitForFunction(()=>!scannerTask);
 await check('Repeated opening starts only one camera; cancellation releases late startup',async()=>{
  await open();await page.waitForFunction(()=>starts===1);await page.evaluate(()=>openScanner());assert.equal(await page.evaluate(()=>starts),1);
  await page.locator('#scannerCancel').click();await page.evaluate(()=>pendingStarts.shift().resolve());await settled();assert.equal(await page.evaluate(()=>stops),1);assert.equal(await page.evaluate(()=>scannerRunning),false);
 });
 await check('Permission failure is recoverable and does not block manual input',async()=>{
  await open();await page.waitForFunction(()=>starts===2);await page.evaluate(()=>pendingStarts.shift().reject(new DOMException('Denied','NotAllowedError')));await settled();
  assert.match(await page.locator('#scanner-status-text').textContent(),/not allowed/);assert(await page.locator('#scannerRetry').isVisible());
  await page.locator('#scannerRetry').click();await page.waitForFunction(()=>starts===3);await page.evaluate(()=>pendingStarts.shift().resolve());await settled();assert.equal(await page.evaluate(()=>scannerRunning),true);
  await manual('09392596027556');await settled();assert.equal(await page.evaluate(()=>currentProduct.id),976);assert.equal(await page.evaluate(()=>stops),2);
 });
 await check('Fast close and reopen waits for the old camera and ignores old scan callbacks',async()=>{
  await open();await page.waitForFunction(()=>starts===4);await page.evaluate(()=>{closeScanner();openScanner();});assert.equal(await page.evaluate(()=>starts),4);
  await page.evaluate(()=>pendingStarts.shift().resolve());await page.waitForFunction(()=>starts===5);assert.equal(await page.evaluate(()=>stops),3);
  await page.evaluate(()=>scanCallbacks[3]('9392596027556'));assert(await page.locator('#scanner').isVisible());
  await page.evaluate(()=>pendingStarts.shift().resolve());await settled();
  await page.evaluate(()=>{scanCallbacks[4]('9392596027556');scanCallbacks[4]('9392596027556');});await settled();assert.equal(await page.evaluate(()=>stops),4);assert.equal(await page.evaluate(()=>currentProduct.id),976);
 });
 await check('The same packet can be scanned again immediately in a fresh session',async()=>{
  await open();await page.waitForFunction(()=>starts===6);await page.evaluate(()=>pendingStarts.shift().resolve());await settled();await page.evaluate(()=>scanCallbacks[5]('9392596027556'));await settled();assert.equal(await page.evaluate(()=>stops),5);assert.equal(await page.locator('#scanner').isVisible(),false);
 });
 await check('Escape restores focus and page exit stops a running camera',async()=>{
  await open();await page.waitForFunction(()=>starts===7);await page.evaluate(()=>pendingStarts.shift().resolve());await settled();await page.keyboard.press('Escape');await settled();assert.equal(await page.evaluate(()=>document.activeElement.id),'nav-scan');
  await open();await page.waitForFunction(()=>starts===8);await page.evaluate(()=>pendingStarts.shift().resolve());await settled();await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await settled();assert.equal(await page.evaluate(()=>stops),7);
 });
 await check('Camera fallback fits phone and tablet widths with keyboard focus contained',async()=>{
  await open();await page.waitForFunction(()=>starts===9);await page.evaluate(()=>pendingStarts.shift().reject(new DOMException('No camera','NotFoundError')));await settled();
  for(const width of [320,390,768]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.setViewportSize({width:390,height:844});await page.locator('#scannerCancel').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'scannerBarcode');
  await page.screenshot({path:'/tmp/mucka-main-scanner-fallback.png'});
 });
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:results.length,results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
