(async function() {
  'use strict';
  var $=id=>document.getElementById(id),config=window.MuckaBeta;
  if (!config || !config.origin) { $('moveStatus').textContent='The permanent beta address is being configured. Your saved records have not been changed.'; return; }
  var target;
  try { target=new URL(new URLSearchParams(location.search).get('next') || config.origin+'/',config.origin); }
  catch(e) { target=new URL(config.origin+'/'); }
  if (target.origin!==config.origin) target=new URL(config.origin+'/');
  $('continueBeta').href=target.href;
  function download(blob,name) { var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),60000); }
  if (location.origin===config.origin) {
    $('moveTitle').textContent='Restore data from an older Mucka link';$('moveIntro').textContent='You are at the single current beta address.';$('importNew').hidden=false;
    $('favouriteFile').onchange=async function() {
      var file=this.files[0];this.value='';if(!file)return;
      try {
        if(file.size>100000)throw new Error('Choose a small Mucka favourites backup.');
        var data=JSON.parse(await file.text());
        if(data.format!=='mucka-favourites-backup'||data.version!==1||!Array.isArray(data.ids)||data.ids.length>2000||data.ids.some(id=>!Number.isInteger(id)||!config.productIds.includes(id)))throw new Error('This is not a supported Mucka favourites backup.');
        var existing=JSON.parse(localStorage.getItem('mucka.favourites.v1')||'{"version":1,"ids":[]}');
        if(existing.version!==1||!Array.isArray(existing.ids))throw new Error('Existing favourites could not be read. Nothing was overwritten.');
        var ids=Array.from(new Set(existing.ids.concat(data.ids))).filter(id=>config.productIds.includes(id));
        localStorage.setItem('mucka.favourites.v1',JSON.stringify({version:1,ids:ids}));$('favouriteStatus').textContent='Favourites restored; existing favourites were kept.';
      } catch(e) { $('favouriteStatus').textContent=e.message; }
    };
    return;
  }
  function readDatabase(name,storeName,key) {
    return new Promise((resolve,reject)=>{
      if(!window.indexedDB)return resolve(null);
      var q=indexedDB.open(name),absent=false;
      q.onupgradeneeded=()=>{absent=true;q.transaction.abort();};
      q.onerror=()=>absent?resolve(null):reject(new Error('Saved records could not be checked. Use the backup options before moving.'));
      q.onblocked=()=>reject(new Error('Close other older Mucka tabs, then reload to check your saved records.'));
      q.onsuccess=()=>{var db=q.result;if(!db.objectStoreNames.contains(storeName)){db.close();return resolve(null);}var tx=db.transaction(storeName,'readonly'),r=key?tx.objectStore(storeName).get(key):tx.objectStore(storeName).getAll();tx.oncomplete=()=>{db.close();resolve(r.result);};tx.onerror=tx.onabort=()=>{db.close();reject(new Error('Saved records could not be read.'));};};
    });
  }
  try {
    var values=await Promise.all([readDatabase('mucka-pets','records','main'),readDatabase('mucka-captures','captures')]);
    var pets=values[0]&&values[0].records,captures=values[1]||[],favourites=JSON.parse(localStorage.getItem('mucka.favourites.v1')||'{"version":1,"ids":[]}');
    var hasPets=pets&&pets.pets&&pets.pets.length,hasFavs=favourites.version===1&&Array.isArray(favourites.ids)&&favourites.ids.length;
    if(!hasPets&&!captures.length&&!hasFavs){location.replace(target.href);return;}
    $('moveTitle').textContent='Mucka has one new beta address';$('moveIntro').textContent='There are saved records at this older address. Keep the ones you want before you move.';$('exportOld').hidden=false;$('restoreHelp').hidden=false;
    $('exportPets').hidden=!hasPets;$('exportCaptures').hidden=!captures.length;$('exportFavourites').hidden=!hasFavs;
    $('exportPets').onclick=()=>{try{download(new Blob([JSON.stringify(MuckaPetData.backup(pets))],{type:'application/json'}),'mucka-pet-backup.json');}catch(e){$('moveStatus').textContent=e.message;}};
    $('exportFavourites').onclick=()=>download(new Blob([JSON.stringify({format:'mucka-favourites-backup',version:1,ids:favourites.ids})],{type:'application/json'}),'mucka-favourites-backup.json');
    $('exportCaptures').onclick=async function(){this.disabled=true;try{
      var zip=new JSZip(),manifest=[];
      captures.forEach((record,i)=>{var folder='capture-'+String(i+1).padStart(3,'0')+'-'+record.id,m=Object.assign({},record,{photos:{}});['front','barcode','ingredients'].forEach(role=>{if(record.photos[role]){m.photos[role]=folder+'/'+role+'.jpg';zip.file(m.photos[role],record.photos[role]);}});manifest.push(m);});
      zip.file('mucka-captures.json',JSON.stringify({schemaVersion:1,appVersion:config.version,captures:manifest,exportedAt:new Date().toISOString()}));download(await zip.generateAsync({type:'blob',compression:'STORE'}),'mucka-captures-backup.zip');
    }catch(e){$('moveStatus').textContent='Backup could not be prepared: '+e.message;}finally{this.disabled=false;}};
  } catch(e) {$('moveTitle').textContent='Keep your saved Mucka records';$('moveStatus').textContent=e.message+' Nothing has been deleted. You can stay at this recovery page and try again.';}
})();
