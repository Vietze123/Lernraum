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
function backup(raw){if(raw?.version===1)return {format:'lernraum',version:2,base:empty(),data:validateData(raw),notices:[],cycles:[]};
 if(!raw||raw.format!=='lernraum'||raw.version!==2)throw Error('Unbekanntes Sicherungsformat.');
 const base=template(raw.base),data=validateData(raw.data);const notices=Array.isArray(raw.notices)?raw.notices.filter(n=>n&&typeof n.id==='string'&&typeof n.text==='string'&&(!n.remote||(typeof n.remote.question==='string'&&typeof n.remote.answer==='string'))).map(n=>({id:n.id,text:n.text,remote:n.remote?{question:n.remote.question,answer:n.remote.answer}:null})):[];
 return {format:'lernraum',version:2,base,data,notices,cycles:validateCycles(raw.cycles,data)};
}
function validateCycles(raw,data){
 if(raw===undefined)return [];if(!Array.isArray(raw)||raw.length>50000)throw Error('Ungültige Lernzyklen.');
 const topics=new Map(data.subjects.flatMap(s=>s.topics.map(t=>[t.id,t]))),seen=new Set(),result=[];
 for(const c of raw){if(!c||typeof c.topicId!=='string'||seen.has(c.topicId)||!Number.isInteger(c.round)||c.round<1||c.round>1000000||!Array.isArray(c.order)||!Array.isArray(c.scores)||!Number.isInteger(c.cursor)||c.cursor<0||c.cursor>c.order.length)throw Error('Ungültiger Lernzyklus.');seen.add(c.topicId);
  if(new Set(c.order).size!==c.order.length||c.order.some(id=>typeof id!=='string'))throw Error('Ungültige Kartenreihenfolge.');
  const scores=new Map();for(const score of c.scores){if(!score||typeof score.id!=='string'||scores.has(score.id)||!Number.isInteger(score.known)||score.known<0||score.known>3)throw Error('Ungültiger Lernfortschritt.');scores.set(score.id,score.known);}
  const t=topics.get(c.topicId);if(!t)continue;const ids=new Set(t.cards.map(x=>x.id));
  const order=c.order.filter((id,i)=>ids.has(id)&&(i<c.cursor||(scores.get(id)||0)<3));const cursor=c.order.slice(0,c.cursor).filter(id=>ids.has(id)).length;
  for(const card of t.cards)if(!order.includes(card.id)&&(scores.get(card.id)||0)<3)order.push(card.id);
  result.push({topicId:c.topicId,round:c.round,order,cursor,scores:t.cards.map(card=>({id:card.id,known:scores.get(card.id)||0}))});
 }return result;
}
function parents(subjects){const m=new Map();for(const s of subjects){m.set(s.id,'subjects');for(const t of s.topics){m.set(t.id,s.id);for(const c of t.cards)m.set(c.id,t.id);}}return m;}
function merge(snapshot,incoming){
 const old=backup(snapshot),remote=template(incoming),notes=new Map(old.notices.map(n=>[n.id,n]));
 const bp=parents(old.base.subjects),rp=parents(remote.subjects);for(const [id,p] of rp)if(bp.has(id)&&bp.get(id)!==p)throw Error('Vorlagen-IDs dürfen nicht zwischen Fächern oder Themen verschoben werden.');
 if(remote.revision===old.base.revision&&!equal(remote.subjects,old.base.subjects))throw Error('Inhalte geändert, aber Vorlagenrevision nicht erhöht.');
 // Adopt an existing same-name subject once; retain all of its topics/cards and local spelling.
 const normalize=name=>name.normalize('NFKC').trim().toLocaleLowerCase('de').replace(/\s+/g,' ').replace(/\s*&\s*/g,'&');
 const remoteIds=new Set(remote.subjects.map(s=>s.id));
 for(const s of remote.subjects){if(old.base.subjects.some(x=>x.id===s.id)||old.data.subjects.some(x=>x.id===s.id))continue;
  const local=old.data.subjects.find(x=>!remoteIds.has(x.id)&&normalize(x.name)===normalize(s.name));if(!local)continue;
  const previousId=local.id;local.colorKey=typeof local.colorKey==='string'?local.colorKey:previousId;local.id=s.id;old.base.subjects=old.base.subjects.filter(x=>x.id!==previousId);
  old.base.subjects.push({id:s.id,name:s.name,topics:[]});
  if(notes.has(previousId)){const n=notes.get(previousId);notes.delete(previousId);notes.set(s.id,{...n,id:s.id});}
 }
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
  result.push({id,name,...(level==='subjects'&&typeof local.colorKey==='string'?{colorKey:local.colorKey}:{}),[child]:list(before[child],local[child],next[child],child)});
 }
 }return result;}
 const data=validateData({version:1,subjects:list(old.base.subjects,old.data.subjects,remote.subjects,'subjects')});
 return {format:'lernraum',version:2,base:remote,data,notices:[...notes.values()],cycles:validateCycles(old.cycles,data)};
}
const api={validateData,template,backup,merge,empty,validateCycles};if(typeof module!=='undefined')module.exports=api;else root.LernraumModel=api;
})(typeof window==='undefined'?globalThis:window);
