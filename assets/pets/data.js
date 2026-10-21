(function (root) {
  'use strict';
  const fields = {name:50, species:10, breed:70, birthday:10, weight:8, sex:20, chip:30, registration:50, vet:90, contact:90, notes:500};
  function empty() { return {version:2, selectedPet:null, pets:[], reminders:[], visits:[]}; }
  function date(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '') || s<'1900-01-01' || s>'2199-12-31') return false;
    const d = new Date(s+'T12:00:00Z');
    return !isNaN(d) && d.toISOString().slice(0,10)===s;
  }
  function text(value, max) { if(typeof value!=='string' || value.length>max) throw new Error('A record contains an invalid or oversized field.');return value; }
  function id(value) { if(typeof value!=='string'||!/^[a-zA-Z0-9-]{1,100}$/.test(value)) throw new Error('A record has an invalid identifier.');return value; }
  function photo(value) {
    if(value===undefined)value='';
    if(typeof value!=='string')throw new Error('A pet photo is not a supported local JPEG.');
    if(value && (typeof value!=='string' || value.length>500000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value))) throw new Error('A pet photo is not a supported local JPEG.');
    return value;
  }
  function unique(list) { const ids=new Set();for(const r of list){if(ids.has(r.id))throw new Error('Duplicate records were found.');ids.add(r.id);}return ids; }
  function validate(input) {
    if(!input || input.version!==2 || !Array.isArray(input.pets) || input.pets.length>30 || !Array.isArray(input.reminders) || input.reminders.length>500 || !Array.isArray(input.visits) || input.visits.length>500) throw new Error('This is not a supported Mucka pet-record file.');
    const result=empty();
    result.pets=input.pets.map(p=>{
      if(!p || typeof p!=='object')throw new Error('Invalid pet record.');
      const pet={id:id(p.id)};
      for(const [key,max] of Object.entries(fields))pet[key]=text(p[key],max);
      if(!pet.name.trim() || !['Dog','Cat','Other'].includes(pet.species) || !['Male','Female','Not recorded'].includes(pet.sex) || (pet.birthday&&!date(pet.birthday)) || (pet.weight&&(!/^\d{1,3}(\.\d)?$/.test(pet.weight)||Number(pet.weight)<.1||Number(pet.weight)>300)))throw new Error('A pet profile contains invalid details.');
      pet.photo=photo(p.photo);return pet;
    });
    const pets=unique(result.pets);
    result.reminders=input.reminders.map(r=>{
      if(!r||typeof r!=='object')throw new Error('Invalid reminder record.');
      const value={id:id(r.id),petId:id(r.petId),title:text(r.title,80),date:text(r.date,10),time:text(r.time || '09:00',5),category:text(r.category,40),notes:text(r.notes,400),done:r.done,repeat:r.repeat || 'none',parentId:r.parentId || '',edited:!!r.edited,anchorDay:r.anchorDay ?? Number(r.date.slice(-2))};
      if(!pets.has(value.petId)||!value.title.trim()||!date(value.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(value.time)||!['none','monthly','yearly'].includes(value.repeat)||typeof value.done!=='boolean')throw new Error('A reminder has invalid details or no matching pet.');
      if(!Number.isInteger(value.anchorDay)||value.anchorDay<1||value.anchorDay>31)throw new Error('A repeat date is invalid.');if(value.parentId)id(value.parentId);return value;
    });unique(result.reminders);
    const reminders=new Map(result.reminders.map(r=>[r.id,r]));
    for(const r of result.reminders){if(r.parentId){const parent=reminders.get(r.parentId);if(!parent||parent.id===r.id||parent.petId!==r.petId||!parent.done||parent.date>=r.date)throw new Error('A repeating reminder has an invalid parent.');}}
    result.visits=input.visits.map(v=>{const value={id:id(v.id),petId:id(v.petId),title:text(v.title,80),date:text(v.date,10),notes:text(v.notes,500)};if(!pets.has(value.petId)||!value.title.trim()||!date(value.date))throw new Error('A visit has invalid details or no matching pet.');return value;});unique(result.visits);
    result.selectedPet=pets.has(input.selectedPet)?input.selectedPet:(result.pets[0]?.id || null);
    return result;
  }
  function nextDate(value, repeat, anchorDay) {
    if(!date(value))throw new Error('Invalid date.');
    const [y,m,d]=value.split('-').map(Number);let year=y,month=m;
    if(repeat==='monthly'){month++;if(month===13){month=1;year++;}}
    else if(repeat==='yearly')year++;else return null;
    const last=new Date(Date.UTC(year,month,0)).getUTCDate();
    const result=[year,String(month).padStart(2,'0'),String(Math.min(anchorDay || d,last)).padStart(2,'0')].join('-');if(!date(result))throw new Error('The next due date is outside the supported range.');return result;
  }
  function complete(records, reminderId, newId) {
    const next=validate(records),r=next.reminders.find(x=>x.id===reminderId);if(!r)throw new Error('Reminder not found.');
    if(r.done){const children=next.reminders.filter(x=>x.parentId===r.id);if(children.some(x=>x.done||x.edited))throw new Error('The next reminder has already been changed. Keep this completed entry and edit the next reminder separately.');next.reminders=next.reminders.filter(x=>x.parentId!==r.id);r.done=false;}
    else {r.done=true;const due=nextDate(r.date,r.repeat,r.anchorDay);if(due){if(next.reminders.length>=500)throw new Error('Export and remove older reminders before creating another repeat.');next.reminders.push({...r,id:id(newId),date:due,done:false,parentId:r.id,edited:false});}}
    return validate(next);
  }
  function backup(records) { return {format:'mucka-pet-backup',backupVersion:1,exportedAt:new Date().toISOString(),records:validate(records)}; }
  function parseBackup(input) { if(!input||input.format!=='mucka-pet-backup'||input.backupVersion!==1)throw new Error('Choose a Mucka pet backup. Demo records and product-capture backups use different formats.');return validate(input.records); }
  function escapeICS(s) { return s.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,'); }
  function fold(line){let part='',n=0;const result=[];for(const c of line){const size=new TextEncoder().encode(c).length;if(n+size>73){result.push(part);part=' '+c;n=1+size;}else{part+=c;n+=size;}}result.push(part);return result.join('\r\n');}
  function calendar(records, petId) {
    const data=validate(records),stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Mucka//Pet care//EN','CALSCALE:GREGORIAN'];
    const pending=data.reminders.filter(r=>!r.done&&(!petId||petId==='all'||r.petId===petId));
    for(const r of pending){
      const pet=data.pets.find(p=>p.id===r.petId),start=new Date(r.date+'T'+r.time+':00'),end=new Date(start.getTime()+30*60000),utc=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
      if(String(start.getHours()).padStart(2,'0')+':'+String(start.getMinutes()).padStart(2,'0')!==r.time)throw new Error('That reminder time falls in a daylight-saving clock change. Choose another time before exporting.');
      lines.push('BEGIN:VEVENT','UID:'+r.id+'@mucka-pets','DTSTAMP:'+stamp,'DTSTART:'+utc(start),'DTEND:'+utc(end),'SUMMARY:'+escapeICS(pet.name+': '+r.title),'DESCRIPTION:'+escapeICS(r.notes));
      lines.push('BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:'+escapeICS(pet.name+': '+r.title),'END:VALARM','END:VEVENT');
    }
    lines.push('END:VCALENDAR');return {text:lines.map(fold).join('\r\n')+'\r\n',count:pending.length};
  }
  const api={empty,validate,fields,photo,date,nextDate,complete,backup,parseBackup,calendar};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MuckaPetData=api;
})(typeof window!=='undefined'?window:globalThis);
