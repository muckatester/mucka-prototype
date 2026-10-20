(function(root){
  'use strict';
  function open(){return new Promise((yes,no)=>{
    if(!root.indexedDB)return no(new Error('Local pet storage is unavailable in this browser.'));
    const request=root.indexedDB.open('mucka-pets',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('records');
    request.onerror=()=>no(request.error);
    request.onblocked=()=>no(new Error('Close other Mucka pet tabs and reload to open local storage.'));
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();yes({
      read(){return new Promise((resolve,reject)=>{const tx=db.transaction('records','readonly'),req=tx.objectStore('records').get('main');tx.oncomplete=()=>resolve(req.result || {revision:0,records:null});tx.onabort=tx.onerror=()=>reject(tx.error || req.error);});},
      write(records,expectedRevision){return new Promise((resolve,reject)=>{
        const tx=db.transaction('records','readwrite'),store=tx.objectStore('records'),req=store.get('main');let reason;
        req.onsuccess=()=>{const revision=req.result?.revision || 0;if(revision!==expectedRevision){reason=new Error('Pet records changed in another tab. Back up this session, then reload before saving again.');reason.name='PetConflictError';tx.abort();return;}store.put({revision:revision+1,records},'main');};
        tx.oncomplete=()=>resolve(expectedRevision+1);
        tx.onabort=tx.onerror=()=>reject(reason || tx.error || new Error('Pet records could not be saved.'));
      });}
    });};
  });}
  root.MuckaPetStore={open};
})(typeof window!=='undefined'?window:globalThis);
