'use strict';
(() => {
  const KEY = 'mucka.plus.preview.v1';
  const $ = id => document.getElementById(id);
  const icons = {
    paw:'<path d="M8 15c-2 1-3 3-2 5 1 2 4 0 6 0s5 2 6 0c1-2 0-4-2-5-2-2-6-2-8 0Z"/><ellipse cx="5" cy="10" rx="2" ry="3"/><ellipse cx="10" cy="6" rx="2" ry="3"/><ellipse cx="16" cy="6" rx="2" ry="3"/><ellipse cx="21" cy="11" rx="2" ry="3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    camera:'<path d="m8 6 2-3h4l2 3h4v14H4V6Z"/><circle cx="12" cy="12" r="4"/>',
    sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-2v4m-2-2h4M4 18v4m-2-2h4"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    bell:'<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    undo:'<path d="m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12"/>'
  };
  function icon(name) { const span=document.createElement('span');span.setAttribute('aria-hidden','true');span.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';return span; }
  document.querySelectorAll('[data-icon]').forEach(e => e.replaceChildren(icon(e.dataset.icon)));
  function el(tag,cls,text) { const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e; }
  const iso = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const today = () => iso(new Date());
  function offset(days) { const d=new Date();d.setDate(d.getDate()+days);return iso(d); }
  function validDate(s) { if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;const d=new Date(s+'T12:00:00');return !isNaN(d)&&iso(d)===s; }
  function dateLabel(s,opts={day:'numeric',month:'short',year:'numeric'}) { return validDate(s)?new Date(s+'T12:00:00').toLocaleDateString('en-AU',opts):'Not recorded'; }
  const uid = () => typeof crypto.randomUUID==='function'?crypto.randomUUID():'demo-'+Date.now()+'-'+Math.random().toString(36).slice(2);
  function seed() { return {version:1,selectedPet:'mucka',pets:[
    {id:'mucka',name:'Mucka',species:'Dog',breed:'Border Collie',birthday:'2019-04-12',weight:'18.4',sex:'Male',chip:'DEMO-000000000001',registration:'DEMO-2042',vet:'Example Valley Vet',contact:'Sam · sample family contact',notes:'Loves a good run. Bring his favourite toy to appointments.'},
    {id:'pip',name:'Pip',species:'Dog',breed:'Kelpie cross',birthday:'2023-08-16',weight:'14.2',sex:'Female',chip:'DEMO-000000000002',registration:'DEMO-2043',vet:'Example Valley Vet',contact:'Sam · sample family contact',notes:'A little shy with new people. Give her time to settle.'}
  ],reminders:[
    {id:'r1',petId:'mucka',title:'Annual vet check-up',date:offset(3),category:'Vet visit',notes:'Example Valley Vet · bring vaccination booklet',done:false},
    {id:'r2',petId:'pip',title:'Council registration renewal',date:offset(12),category:'Registration',notes:'Check the renewal notice for the actual due date.',done:false},
    {id:'r3',petId:'mucka',title:'Vaccination reminder',date:offset(24),category:'Vaccination',notes:'Confirm the schedule with your vet.',done:false}
  ],visits:[
    {id:'v1',petId:'mucka',date:offset(-26),title:'Routine check-up',notes:'Sample owner note: weight recorded at 18.4 kg. Next routine visit discussed.'},
    {id:'v2',petId:'mucka',date:offset(-110),title:'Dental check',notes:'Sample owner note: discussed our home dental-care routine.'},
    {id:'v3',petId:'pip',date:offset(-15),title:'First visit with our vet',notes:'Sample owner note: brought adoption paperwork and vaccination history.'}
  ]}; }
  let storageOkay=true,feedbackTimer,state;
  const petFields=['name','species','breed','birthday','weight','sex','chip','registration','vet','contact','notes'];
  const string = (v,n) => typeof v==='string'&&v.length<=n;
  function validate(s) {
    if(!s||s.version!==1||!Array.isArray(s.pets)||!s.pets.length||s.pets.length>30||!Array.isArray(s.reminders)||s.reminders.length>500||!Array.isArray(s.visits)||s.visits.length>500)throw Error('Invalid demo');
    const ids=new Set();
    for(const p of s.pets){if(!string(p.id,100)||!/^[a-z0-9-]+$/i.test(p.id)||ids.has(p.id)||!petFields.every(k=>string(p[k],500))||!p.name.trim()||!['Dog','Cat','Other'].includes(p.species)||(p.birthday&&!validDate(p.birthday)))throw Error('Invalid pet');ids.add(p.id);}
    for(const r of s.reminders)if(!string(r.id,100)||!/^[a-z0-9-]+$/i.test(r.id)||!ids.has(r.petId)||!string(r.title,80)||!r.title.trim()||!validDate(r.date)||!string(r.category,40)||!string(r.notes,400)||typeof r.done!=='boolean')throw Error('Invalid reminder');
    for(const v of s.visits)if(!string(v.id,100)||!/^[a-z0-9-]+$/i.test(v.id)||!ids.has(v.petId)||!validDate(v.date)||!string(v.title,80)||!v.title.trim()||!string(v.notes,500))throw Error('Invalid visit');
    if(!ids.has(s.selectedPet))s.selectedPet=s.pets[0].id;return s;
  }
  function warn(text) { $('storageWarning').textContent=text;$('storageWarning').hidden=false; }
  try { const saved=localStorage.getItem(KEY);state=saved?validate(JSON.parse(saved)):seed(); }
  catch(e){state=seed();storageOkay=false;warn('Saved demo records could not be opened. Sample data is shown. Your existing saved value has not been overwritten. You can export this session or reset the demo.');}
  function save() {
    if(!storageOkay)return false;
    try{localStorage.setItem(KEY,JSON.stringify(state));$('storageWarning').hidden=true;return true;}
    catch(e){storageOkay=false;warn('This browser could not save your changes. They are available for this session only. Export demo records before leaving.');return false;}
  }
  function feedback(text){clearTimeout(feedbackTimer);$('feedback').textContent=text;feedbackTimer=setTimeout(()=>$('feedback').textContent='',6500);}
  function changed(text){const saved=save();render();feedback(text+(saved?' Saved in this browser.':' Available in this session only; export to keep it.'));}
  function selected(){return state.pets.find(p=>p.id===state.selectedPet)||state.pets[0];}
  function petName(id){return state.pets.find(p=>p.id===id)?.name||'Pet';}
  function setTab(name,focus=false){document.querySelectorAll('[role=tab]').forEach(t=>{const active=t.id==='tab-'+name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;$(t.getAttribute('aria-controls')).hidden=!active;});if(focus)$('tab-'+name).focus();}
  const tabs=[...document.querySelectorAll('[role=tab]')];
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setTab(tab.id.slice(4)));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();setTab(tabs[n].id.slice(4),true);}});});
  function openDialog(id){$(id).showModal();}
  document.querySelectorAll('.dialog-close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $('planButton').onclick=()=>openDialog('planDialog');
  $('seeReminders').onclick=()=>{setTab('care');$('carePet').value=state.selectedPet;renderReminders();$('tab-care').focus();};
  $('studioInvite').onclick=()=>{setTab('studio');$('tab-studio').focus();};
  function age(p){if(!p.birthday)return p.species;const birth=new Date(p.birthday+'T12:00:00'),now=new Date();let years=now.getFullYear()-birth.getFullYear();if(now.getMonth()<birth.getMonth()||(now.getMonth()===birth.getMonth()&&now.getDate()<birth.getDate()))years--;return years>=1?years+' '+(years===1?'year':'years')+' old':'Under 1 year';}
  function renderPets(){
    const p=selected();$('petSelector').replaceChildren();
    for(const pet of state.pets){const b=el('button','pet-chip');b.type='button';b.setAttribute('aria-pressed',pet.id===p.id);b.setAttribute('aria-label','View '+pet.name);const avatar=el('span','pet-avatar'+(pet.id==='mucka'?' illustrated':''),pet.id==='mucka'?'':pet.name.slice(0,1).toUpperCase());avatar.setAttribute('aria-hidden','true');const text=el('span');text.append(el('strong','',pet.name),el('small','',pet.breed||pet.species));b.append(avatar,text);b.onclick=()=>{state.selectedPet=pet.id;save();renderPets();};$('petSelector').append(b);}
    $('petName').textContent=p.name;$('petDescription').textContent=(p.breed||p.species)+' · '+age(p);$('petTags').replaceChildren(...[p.sex,p.weight?p.weight+' kg':null].filter(Boolean).map(t=>el('span','',t)));
    $('petHeroArt').hidden=p.id!=='mucka';$('petDetails').replaceChildren();
    const chipRow=el('div'),dt=el('dt','','Microchip'),dd=el('dd');const chipValue=el('span','',p.chip?'•••• '+p.chip.slice(-4):'Not recorded');dd.append(chipValue);
    if(p.chip){const b=el('button','text-button','Show sample number');b.setAttribute('aria-expanded','false');b.onclick=()=>{const show=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',show);b.textContent=show?'Hide number':'Show sample number';chipValue.textContent=show?p.chip:'•••• '+p.chip.slice(-4);};dd.append(b);}chipRow.append(dt,dd);$('petDetails').append(chipRow);
    for(const [label,value]of [['Council registration',p.registration],['Usual vet',p.vet],['Emergency contact',p.contact],['Birthday',p.birthday?dateLabel(p.birthday):''],['Care notes',p.notes]]){const row=el('div');row.append(el('dt','',label),el('dd','',value||'Not recorded'));$('petDetails').append(row);}
    const visits=state.visits.filter(v=>v.petId===p.id).sort((a,b)=>b.date.localeCompare(a.date));$('careTimeline').replaceChildren();
    for(const v of visits){const item=el('div','timeline-item'),time=el('time','',dateLabel(v.date));time.dateTime=v.date;item.append(time,el('strong','',v.title),el('p','',v.notes));$('careTimeline').append(item);}
    if(!visits.length)$('careTimeline').append(el('p','empty','No visits yet. Add a sample visit to try the timeline.'));
    const next=state.reminders.filter(r=>r.petId===p.id&&!r.done).sort((a,b)=>a.date.localeCompare(b.date))[0];
    $('nextMonth').textContent=next?dateLabel(next.date,{month:'short'}):'All';$('nextDay').textContent=next?dateLabel(next.date,{day:'numeric'}):'✓';$('nextTitle').textContent=next?next.title:'All caught up';$('nextSubtitle').textContent=next?dateLabel(next.date,{weekday:'long',day:'numeric',month:'short'})+' · '+p.name:'Add a reminder whenever you need one.';
  }
  function fillPetSelect(select,all=false){const old=select.value;select.replaceChildren();if(all)select.append(new Option('All pets','all'));for(const p of state.pets)select.append(new Option(p.name,p.id));select.value=[...select.options].some(o=>o.value===old)?old:(all?'all':state.selectedPet);}
  function renderReminders(){
    const filter=$('carePet').value,items=state.reminders.filter(r=>filter==='all'||r.petId===filter).sort((a,b)=>a.date.localeCompare(b.date));$('reminderList').replaceChildren();$('completedList').replaceChildren();
    for(const r of items){const card=el('article','reminder'),date=el('div','reminder-date');date.append(el('strong','',dateLabel(r.date,{day:'numeric'})),el('span','',dateLabel(r.date,{month:'short',year:'numeric'})));const copy=el('div','reminder-copy'),status=r.done?'Completed':r.date<today()?'Overdue':r.date===today()?'Today':dateLabel(r.date,{weekday:'short'});copy.append(el('span','due-label'+(!r.done&&r.date<today()?' overdue':''),status),el('h3','',r.title),el('p','',petName(r.petId)+' · '+r.category));if(r.notes)copy.append(el('p','',r.notes));const b=el('button','complete-button');b.append(icon(r.done?'undo':'check'));b.setAttribute('aria-label',(r.done?'Undo completion: ':'Complete: ')+r.title+' for '+petName(r.petId));b.onclick=()=>{const parent=r.done?'completedList':'reminderList',index=[...$(parent).children].indexOf(card);r.done=!r.done;changed(r.done?'Reminder completed.':'Reminder restored.');const list=$(parent);(list.querySelectorAll('button')[Math.max(0,index-1)]||$('addReminderButton')).focus();};card.append(date,copy,b);$(r.done?'completedList':'reminderList').append(card);}
    const pending=items.filter(r=>!r.done).length,done=items.length-pending;if(!pending)$('reminderList').append(el('p','empty','All caught up. Add a sample reminder to see how it works.'));$('completedSummary').textContent='Completed reminders ('+done+')';
  }
  function render(){renderPets();fillPetSelect($('carePet'),true);renderReminders();}
  $('carePet').onchange=renderReminders;
  let editingPet=null;
  function petForm(add){editingPet=add?null:selected().id;const f=$('petForm');f.reset();const p=add?{}:selected();for(const k of petFields)if(p[k]!==undefined)f.elements.namedItem(k).value=p[k];$('petDialogTitle').textContent=add?'Add a pet':'Edit pet profile';f.elements.birthday.max=today();openDialog('petDialog');}
  $('addPetButton').onclick=()=>petForm(true);$('editPetButton').onclick=()=>petForm(false);
  $('petForm').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const data={};for(const k of petFields)data[k]=f.elements.namedItem(k).value.trim();if(!data.name){f.elements.name.setCustomValidity('Please enter a name.');f.reportValidity();return;}if(state.pets.length>=30&&!editingPet){feedback('This preview supports up to 30 pets.');return;}if(editingPet)Object.assign(selected(),data);else{const p={id:uid(),...data};state.pets.push(p);state.selectedPet=p.id;}$('petDialog').close();changed(editingPet?'Profile updated.':'Pet added.');};
  $('petForm').elements.name.addEventListener('input',e=>e.target.setCustomValidity(''));
  $('addReminderButton').onclick=()=>{const f=$('reminderForm');f.reset();fillPetSelect(f.elements.petId);f.elements.date.value=offset(1);openDialog('reminderDialog');};
  $('reminderForm').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const title=f.elements.title.value.trim();if(!title){f.elements.title.setCustomValidity('Please enter a reminder.');f.reportValidity();return;}if(state.reminders.length>=500){feedback('This preview supports up to 500 reminders.');return;}state.reminders.push({id:uid(),petId:f.elements.petId.value,title,date:f.elements.date.value,category:f.elements.category.value,notes:f.elements.notes.value.trim(),done:false});$('reminderDialog').close();changed('Reminder added. No phone alert is scheduled.');};
  $('reminderForm').elements.title.addEventListener('input',e=>e.target.setCustomValidity(''));
  $('addVisitButton').onclick=()=>{const f=$('visitForm');f.reset();f.elements.date.value=today();f.elements.date.max=today();openDialog('visitDialog');};
  $('visitForm').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const title=f.elements.title.value.trim();if(!title){f.elements.title.setCustomValidity('Please enter a visit title.');f.reportValidity();return;}if(state.visits.length>=500){feedback('This preview supports up to 500 visit notes.');return;}state.visits.push({id:uid(),petId:state.selectedPet,title,date:f.elements.date.value,notes:f.elements.notes.value.trim()});$('visitDialog').close();changed('Visit note added.');};
  $('visitForm').elements.title.addEventListener('input',e=>e.target.setCustomValidity(''));
  function download(blob,name){const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}
  $('exportButton').onclick=()=>{download(new Blob([JSON.stringify({kind:'Mucka Plus prototype records',exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'}),'mucka-plus-demo-records.json');feedback('Demo export prepared. Keep the downloaded file as your copy.');};
  function escapeICS(s){return s.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');}
  function foldICS(line){const chunks=[];let part='',bytes=0;for(const c of line){const size=new TextEncoder().encode(c).length;if(bytes+size>73){chunks.push(part);part=' '+c;bytes=1+size;}else{part+=c;bytes+=size;}}chunks.push(part);return chunks.join('\r\n');}
  $('calendarButton').onclick=()=>{const items=state.reminders.filter(r=>!r.done&&($('carePet').value==='all'||r.petId===$('carePet').value));if(!items.length){feedback('There are no pending reminders to export.');return;}const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Mucka//Plus prototype//EN','CALSCALE:GREGORIAN'];for(const r of items){const end=new Date(r.date+'T12:00:00');end.setDate(end.getDate()+1);lines.push('BEGIN:VEVENT','UID:'+r.id+'@mucka-preview','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+r.date.replace(/-/g,''),'DTEND;VALUE=DATE:'+iso(end).replace(/-/g,''),'SUMMARY:'+escapeICS(petName(r.petId)+': '+r.title),'DESCRIPTION:'+escapeICS('Mucka concept preview. '+r.notes),'END:VEVENT');}lines.push('END:VCALENDAR');download(new Blob([lines.map(foldICS).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}),'mucka-demo-reminders.ics');feedback('Calendar file prepared. Import it into your calendar; Mucka has not scheduled phone alerts.');};
  $('resetButton').onclick=()=>openDialog('resetDialog');
  $('confirmReset').onclick=()=>{state=seed();storageOkay=true;$('resetDialog').close();clearPhoto();$('carePet').value='all';changed('Original sample records restored.');};
  const styles=[{id:'astronaut',name:'Astronaut',title:'One small step for dog.',description:'A cosmic adventure for your best friend.',x:0,y:0},{id:'royal',name:'Royal',title:'Born to rule the sofa.',description:'A regal portrait, with a little extra attitude.',x:1,y:0},{id:'watercolour',name:'Watercolour',title:'A softer kind of masterpiece.',description:'Gentle washes and a familiar little face.',x:0,y:1},{id:'cartoon',name:'Cartoon',title:'The hero of every adventure.',description:'Bright colours, big personality, happy paws.',x:1,y:1}];
  let chosenStyle=styles[0],shownStyle=styles[0],photoURL=null,photoTicket=0;
  for(const style of styles){const b=el('button','style-choice');b.setAttribute('aria-pressed',style===chosenStyle);b.dataset.style=style.id;const thumb=el('span','style-thumb art-'+style.id);thumb.setAttribute('aria-hidden','true');b.append(thumb,el('strong','',style.name));b.onclick=()=>{chosenStyle=style;document.querySelectorAll('.style-choice').forEach(e=>e.setAttribute('aria-pressed',e.dataset.style===style.id));$('previewStyleButton').textContent='Preview '+style.name+' style ✦';};$('stylePicker').append(b);}
  $('previewStyleButton').onclick=()=>{shownStyle=chosenStyle;$('portraitArt').className='portrait-art art-'+shownStyle.id;$('portraitArt').setAttribute('aria-label','Sample '+shownStyle.name.toLowerCase()+' border collie portrait');$('portraitTitle').textContent=shownStyle.title;$('portraitDescription').textContent=shownStyle.name+' · sample border collie';feedback(shownStyle.description+' Sample artwork shown; your photo has not been transformed.');if(innerWidth<701)$('portraitArt').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});};
  function clearPhoto(){photoTicket++;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;$('uploadedPhoto').hidden=true;$('uploadedPhoto').removeAttribute('src');$('uploadIcon').hidden=false;$('uploadTitle').textContent="Add your pet's photo";$('uploadHelp').textContent='JPG, PNG or WebP · up to 8 MB';$('removePhoto').hidden=true;$('studioPhoto').value='';$('photoError').textContent='';}
  $('removePhoto').onclick=()=>{clearPhoto();feedback('Photo removed from this tab.');};
  $('studioPhoto').onchange=async e=>{const f=e.target.files[0];if(!f)return;const ticket=++photoTicket;$('photoError').textContent='';if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024){$('photoError').textContent='Choose a JPG, PNG or WebP smaller than 8 MB. For HEIC photos, export a JPEG first.';e.target.value='';return;}const url=URL.createObjectURL(f),image=new Image();try{image.src=url;await image.decode();if(ticket!==photoTicket){URL.revokeObjectURL(url);return;}if(image.width>16000||image.height>16000)throw Error('too large');if(photoURL)URL.revokeObjectURL(photoURL);photoURL=url;$('uploadedPhoto').src=url;$('uploadedPhoto').hidden=false;$('uploadIcon').hidden=true;$('uploadTitle').textContent='Your photo · '+f.name.slice(0,45);$('uploadHelp').textContent='Kept in this tab · not uploaded';$('removePhoto').hidden=false;feedback('Photo selected locally. Style previews still show the sample border collie.');}catch(err){URL.revokeObjectURL(url);if(ticket===photoTicket){$('photoError').textContent='That image could not be opened. Try another JPG, PNG or WebP.';e.target.value='';}}};
  $('downloadPortrait').onclick=async()=>{const style=shownStyle,b=$('downloadPortrait');b.disabled=true;try{const image=new Image();image.src='assets/premium-preview/portrait-styles.webp';await image.decode();const canvas=document.createElement('canvas');canvas.width=Math.floor(image.width/2);canvas.height=Math.floor(image.height/2);canvas.getContext('2d').drawImage(image,style.x*canvas.width,style.y*canvas.height,canvas.width,canvas.height,0,0,canvas.width,canvas.height);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('No image');download(blob,'mucka-sample-'+style.id+'.png');feedback('Sample portrait download prepared. This is the example border collie, not your uploaded photo.');}catch(e){feedback('The sample image could not be downloaded. Check your connection and try again.');}finally{b.disabled=false;}};
  window.addEventListener('pagehide',()=>{if(photoURL)URL.revokeObjectURL(photoURL);});
  render();
})();
