/* Pure data model shared by browser and verification scripts. No network or storage. */
(function(root){
const clone=x=>JSON.parse(JSON.stringify(x));
function validateData(d){
 if(!d||d.version!==1||!Array.isArray(d.subjects)||d.subjects.length>1000)throw Error('Ungültiges Datenformat.');
 const ids=new Set();let count=0;
 function check(x){if(!x||typeof x.id!=='string'||!x.id.trim()||ids.has(x.id))throw Error('Leere oder doppelte ID.');ids.add(x.id);if(++count>50000)throw Error('Zu viele Einträge.');}
 for(const s of d.subjects){check(s);if(typeof s.name!=='string'||!s.name.trim()||!Array.isArray(s.topics))throw Error('Ungültiges Fach.');
 for(const t of s.topics){check(t);if(typeof t.name!=='string'||!t.name.trim()||!Array.isArray(t.cards))throw Error('Ungültiges Thema.');
 for(const c of t.cards){check(c);if(typeof c.question!=='string'||!c.question.trim()||typeof c.answer!=='string'||!c.answer.trim()||!['new','known','repeat'].includes(c.status))throw Error('Ungültige Karte.');}}}return clone(d);
}
function template(raw){if(!raw||raw.schemaVersion!==1||typeof raw.revision!=='string'||!raw.revision.trim())throw Error('Ungültige Vorlagenversion.');
 const d=clone(raw);if(!Array.isArray(d.subjects))throw Error('Fächer fehlen.');for(const s of d.subjects){if(!Array.isArray(s.topics))throw Error('Themen fehlen.');for(const t of s.topics){if(!Array.isArray(t.cards))throw Error('Karten fehlen.');for(const c of t.cards)c.status='new';}}
 return {schemaVersion:1,revision:d.revision,subjects:validateData({version:1,subjects:d.subjects}).subjects};
}
const empty=()=>({schemaVersion:1,revision:'0',subjects:[]});
function strip(x){if(Array.isArray(x))return x.map(strip);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).filter(k=>k!=='status').sort().map(k=>[k,strip(x[k])]));return x;}
const equal=(a,b)=>JSON.stringify(strip(a))===JSON.stringify(strip(b));
function backup(raw){if(raw?.version===1)return {format:'lernraum',version:2,base:empty(),data:validateData(raw),notices:[]};
 if(!raw||raw.format!=='lernraum'||raw.version!==2)throw Error('Unbekanntes Sicherungsformat.');
 const base=template(raw.base),data=validateData(raw.data);const notices=Array.isArray(raw.notices)?raw.notices.filter(n=>n&&typeof n.id==='string'&&typeof n.text==='string'&&(!n.remote||(typeof n.remote.question==='string'&&typeof n.remote.answer==='string'))).map(n=>({id:n.id,text:n.text,remote:n.remote?{question:n.remote.question,answer:n.remote.answer}:null})):[];
 return {format:'lernraum',version:2,base,data,notices};
}
function parents(subjects){const m=new Map();for(const s of subjects){m.set(s.id,'subjects');for(const t of s.topics){m.set(t.id,s.id);for(const c of t.cards)m.set(c.id,t.id);}}return m;}
function merge(snapshot,incoming){
 const old=backup(snapshot),remote=template(incoming),notes=new Map(old.notices.map(n=>[n.id,n]));
 const bp=parents(old.base.subjects),rp=parents(remote.subjects);for(const [id,p] of rp)if(bp.has(id)&&bp.get(id)!==p)throw Error('Vorlagen-IDs dürfen nicht zwischen Fächern oder Themen verschoben werden.');
 if(remote.revision===old.base.revision&&!equal(remote.subjects,old.base.subjects))throw Error('Inhalte geändert, aber Vorlagenrevision nicht erhöht.');
 const note=(x,text,r)=>notes.set(x.id,{id:x.id,text,remote:r?.question?{question:r.question,answer:r.answer}:null});
 function list(b,l,r,level){const bm=new Map(b.map(x=>[x.id,x])),lm=new Map(l.map(x=>[x.id,x])),rm=new Map(r.map(x=>[x.id,x]));const order=[...r.map(x=>x.id),...l.filter(x=>!rm.has(x.id)).map(x=>x.id)],result=[];
 for(const id of order){const before=bm.get(id),local=lm.get(id),next=rm.get(id);
 if(!local){if(!before&&next)result.push(clone(next));else if(before&&next&&!equal(before,next))note(before,'Lokal gelöscht; trotz Vorlagenänderung nicht wiederhergestellt.',next);continue;}
 if(!next){if(!before){result.push(clone(local));continue;}if(!equal(before,local)){result.push(clone(local));note(local,'Aus der Vorlage entfernt; persönliche Änderungen wurden behalten.',null);}continue;}
 if(!before){result.push(clone(local));if(!equal(local,next))note(local,'Gleiche neue ID auf beiden Seiten; persönliche Fassung behalten.',next);continue;}
 if(level==='cards'){
  const changedLocal=!equal(before,local),changedRemote=!equal(before,next);const chosen=clone(changedLocal?local:next);chosen.status=local.status;
  if(changedLocal&&changedRemote&&!equal(local,next))note(local,'Karte beidseitig geändert; persönliche Frage und Antwort behalten.',next);result.push(chosen);
 }else{
  const child=level==='subjects'?'topics':'cards',name=local.name!==before.name?local.name:next.name;
  if(local.name!==before.name&&next.name!==before.name&&local.name!==next.name)note(local,'Name beidseitig geändert; persönlicher Name behalten. Neue Vorlage: '+next.name,null);
  result.push({id,name,[child]:list(before[child],local[child],next[child],child)});
 }
 }return result;}
 const data=validateData({version:1,subjects:list(old.base.subjects,old.data.subjects,remote.subjects,'subjects')});
 return {format:'lernraum',version:2,base:remote,data,notices:[...notes.values()]};
}
const api={validateData,template,backup,merge,empty};if(typeof module!=='undefined')module.exports=api;else root.LernraumModel=api;
})(typeof window==='undefined'?globalThis:window);
