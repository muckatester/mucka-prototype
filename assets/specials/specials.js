(()=>{
 'use strict';
 const D=window.MuckaSpecials,KEY='mucka.specials.preview.v1',$=id=>document.getElementById(id),money=n=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(n/100);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let state=D.defaults(),drop=false,editing=null,storageBlocked=false,toastTimer;
 function warning(text){$('storageWarning').textContent=text;$('storageWarning').hidden=false;}
 try{const raw=localStorage.getItem(KEY);if(raw!==null)state=D.validate(JSON.parse(raw));}catch(e){storageBlocked=true;warning('Saved specials settings could not be opened. This is a temporary preview; existing data has not been replaced. Use Reset specials demo to start again.');}
 function save(next){
   state=D.validate(next);let saved=false;
   if(!storageBlocked)try{localStorage.setItem(KEY,JSON.stringify(state));saved=true;}catch(e){warning('This browser could not save your specials settings. Changes work for this visit only.');}
   $('saveStatus').textContent=saved?'Saved on this device only. No emails are scheduled.':'Temporary settings for this visit only. No emails are scheduled.';
   render();return saved;
 }
 function toast(text){clearTimeout(toastTimer);$('feedback').textContent=text;toastTimer=setTimeout(()=>$('feedback').textContent='',3500);}
 function show(id){$(id).showModal();}
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
 function foodFor(id){return D.foods.find(f=>f.id===id);}
 function render(){
   $('postcode').value=state.postcode;$('frequency').value=state.frequency;$('members').checked=state.members;
   $('watchCount').textContent=state.watches.length+' watched';$('addWatch').disabled=state.watches.length===D.foods.length;
   $('watchlist').innerHTML=state.watches.length?state.watches.map(w=>{
     const f=foodFor(w.id),offers=D.compare(f,w,state,drop),best=offers.find(o=>o.eligible),label=!w.enabled?'Paused':best?'Sample alert ready':'Waiting for your price';
     return `<article class="watch-card" data-food="${f.id}" aria-label="${esc(f.brand+' '+f.name)}"><div class="watch-top"><div class="food-icon" aria-hidden="true">✦</div><div class="watch-name"><span class="status-pill ${best?'ready':''}">${label}</span><h3>${esc(f.brand)}</h3><p>${esc(f.name)} · <strong>${esc(f.size)}</strong> · ${f.species}</p></div></div><div class="watch-target"><span>Delivered target <strong>${money(w.target)}</strong></span><button class="text-button" data-action="edit" data-id="${f.id}">Edit target</button></div><div class="offers">${offers.map(o=>`<div class="offer ${o.eligible?'eligible':'excluded'}"><div><div class="offer-name">${o.store}</div><p class="offer-note">${money(o.price)} bag + ${o.delivery===null?'unknown delivery':money(o.delivery)+' delivery'}</p><p class="offer-note">${o.reason}${o.member&&state.members?' · Free membership price':''}</p></div><div class="offer-price"><strong>${o.total===null?money(o.price):money(o.total)}</strong><small>${o.total===null?'before delivery':'delivered · sample'}</small></div></div>`).join('')}</div><p class="watch-explanation">${!w.enabled?'Resume this watch to see eligible sample alerts.':best?money(w.target-best.total)+' below your target. This is not a saving against a verified previous price.':'No eligible offer at your target. Unknown delivery and unavailable stock never trigger an alert.'}</p><div class="watch-actions">${best?`<button class="button primary" data-action="email" data-id="${f.id}">Preview email alert ↗</button>`:''}<button class="text-button" data-action="pause" data-id="${f.id}">${w.enabled?'Pause watch':'Resume watch'}</button><button class="text-button" data-action="remove" data-id="${f.id}">Remove watch</button></div></article>`;
   }).join(''):'<div class="empty-watch"><h3>No foods watched yet.</h3><p>Choose a food and set your delivered price.</p><button class="button primary" data-action="add">Watch your first food</button></div>';
 }
 function editWatch(id){
   editing=id??null;const available=D.foods.filter(f=>f.id===editing||!state.watches.some(w=>w.id===f.id));if(!available.length)return;
   $('food').innerHTML=available.map(f=>`<option value="${f.id}">${esc(f.brand+' · '+f.name+' · '+f.size)}</option>`).join('');$('food').disabled=editing!==null;
   const watch=state.watches.find(w=>w.id===editing);$('target').value=((watch?watch.target:available[0].target)/100).toFixed(2);$('watchError').textContent='';$('watchDialogTitle').textContent=watch?'Edit food watch':'Watch a food';show('watchDialog');
 }
 $('food').addEventListener('change',()=>$('target').value=(foodFor(Number($('food').value)).target/100).toFixed(2));
 $('watchForm').addEventListener('submit',e=>{
   e.preventDefault();const target=Math.round(Number($('target').value)*100),id=Number($('food').value);const next=structuredClone(state),existing=next.watches.find(w=>w.id===id);
   if(existing)existing.target=target;else next.watches.push({id,target,enabled:true});
   try{const saved=save(next);$('watchDialog').close();toast(saved?'Food watch saved on this device.':'Food watch changed for this visit only.');}catch(err){$('watchError').textContent='Enter a delivered target from A$1 to A$5,000.';}
 });
 function previewEmail(id){
   const watch=state.watches.find(w=>w.id===id),food=foodFor(id),offer=D.compare(food,watch,state,drop).find(o=>o.eligible);if(!offer)return;
   $('emailContent').innerHTML=`<div class="email-brand">MUCKA</div><p class="email-caption">ILLUSTRATIVE EMAIL · FICTIONAL OFFER · NOT SENT</p><p><strong>Subject:</strong> Your ${esc(food.brand)} ${food.size} watch has a match</p><h3>Their usual food.<br>Within your price.</h3><p>${esc(food.brand+' '+food.name)}<br><strong>${food.size} · ${food.species} food</strong></p><div class="email-total">${money(offer.total)}</div><p>Delivered to ${state.postcode} · ${offer.store}</p><p>${money(offer.price)} for one bag + ${money(offer.delivery)} delivery.<br>${offer.member?'Requires a free store membership.':'One-off purchase; no membership required.'}</p><p>Your delivered target: <strong>${money(watch.target)}</strong>.<br>This sample is ${money(watch.target-offer.total)} below your target.</p><p class="email-caption">Example only. Stock and delivery are simulated; there is no live retailer offer to open.</p><hr><p class="email-caption">You would receive this because you chose this exact bag. A real alert would let you pause this watch or unsubscribe.</p>`;
   show('emailDialog');
 }
 $('watchlist').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const id=Number(b.dataset.id),action=b.dataset.action;
   if(action==='add')return editWatch();if(action==='edit')return editWatch(id);if(action==='email')return previewEmail(id);
   const next=structuredClone(state);if(action==='pause'){const w=next.watches.find(w=>w.id===id);w.enabled=!w.enabled;}else if(action==='remove')next.watches=next.watches.filter(w=>w.id!==id);else return;
   const saved=save(next);toast(saved?'Watchlist saved on this device.':'Watchlist changed for this visit only.');
 });
 $('preferencesForm').addEventListener('submit',e=>{e.preventDefault();const next={...state,postcode:$('postcode').value,frequency:$('frequency').value,members:$('members').checked};try{const saved=save(next);toast(saved?'Preview preferences saved.':'Preferences changed for this visit only.');}catch(err){toast('Enter a four-digit postcode.');}});
 $('addWatch').addEventListener('click',()=>editWatch());$('howButton').addEventListener('click',()=>show('howDialog'));
 $('simulateButton').addEventListener('click',()=>{drop=!drop;$('simulateButton').setAttribute('aria-pressed',String(drop));$('simulateButton').textContent=drop?'Undo sample price drop':'Simulate a price drop';render();toast(drop?'Example store A bag prices reduced by A$15.':'Original sample prices restored.');});
 $('resetButton').addEventListener('click',()=>show('resetDialog'));
 $('confirmReset').addEventListener('click',()=>{storageBlocked=false;drop=false;$('simulateButton').setAttribute('aria-pressed','false');$('simulateButton').textContent='Simulate a price drop';$('storageWarning').hidden=true;const saved=save(D.defaults());$('resetDialog').close();toast(saved?'Specials demo reset.':'Temporary specials demo reset.');});
 window.addEventListener('storage',e=>{if(e.key===KEY){try{state=e.newValue===null?D.defaults():D.validate(JSON.parse(e.newValue));storageBlocked=false;$('storageWarning').hidden=true;document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();toast('Specials settings updated from another tab.');}catch(err){storageBlocked=true;warning('Another tab saved settings this preview cannot read. Changes here are temporary until you reset the demo.');}}});
 render();
})();
