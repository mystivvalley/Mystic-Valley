import { chatContext } from './cloud.js';
const $=id=>document.getElementById(id);
const avatars={leaf:'🌿',fox:'🦊',owl:'🦉',cat:'🐱',dragon:'🐉',mushroom:'🍄',moon:'🌙',star:'⭐'};
let epoch=0,sequence=0,profile=null,returnFocus=null,busy=false,listStamp='',listSequence=0;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const note=(message,bad=false)=>{$('socialFeedback').textContent=message;$('socialFeedback').className=bad?'danger':'muted';};
function context(){const c=chatContext();if(!c.ready||!c.user||!c.client)throw Error('Bitte zuerst anmelden und den Cloud-Spielstand prüfen.');return c;}
async function rpc(name,args={}){const c=context(),token=epoch;let timer;try{const {data,error}=await Promise.race([c.client.rpc(name,args),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Die Verbindung antwortet nicht rechtzeitig. Bitte aktualisieren.')),15000);})]);if(token!==epoch||!chatContext().ready||chatContext().user?.id!==c.user.id)throw Error('Konto hat sich geändert.');if(error)throw error;return data;}finally{clearTimeout(timer);}}
async function run(fn){const token=epoch;try{await fn();}catch(e){if(token===epoch)note(e.message||String(e),true);}}
function button(label,fn){const b=el('button',label);b.type='button';b.onclick=()=>run(fn);return b;}
function close(){sequence++;$('socialPopup').hidden=true;profile=null;returnFocus?.isConnected&&returnFocus.focus();}
function show(){context();if($('socialPopup').hidden)returnFocus=document.activeElement;$('socialPopup').hidden=false;$('socialClose').focus();}
function message(id){close();$('guildPopup').hidden=true;window.mysticPrivateChat.openPeer(id);}
async function action(id,type){if(busy)return;if(type==='remove'&&!confirm('Diese Freundschaft beenden?'))return;busy=true;const token=epoch;document.querySelectorAll('#socialActions button,#socialLists button').forEach(b=>b.disabled=true);try{await rpc('mv_social_action_v1',{p_peer:id,p_action:type});note('Freundschaftsstatus aktualisiert.');listStamp='';await refreshList();if(profile?.id===id)await loadProfile(id);}finally{if(token===epoch){busy=false;document.querySelectorAll('#socialActions button,#socialLists button').forEach(b=>b.disabled=false);}}}
function actions(p,box){if(p.relationship==='self')return;if(p.blocked){box.append(el('p','Für diesen Spieler sind neue Nachrichten und Freundschaftsanfragen gesperrt.','muted'));return;}
 box.append(button('✉️ Nachricht',()=>message(p.id)));
 const choices={none:[['Freundschaft anfragen','request']],outgoing:[['Anfrage zurückziehen','cancel']],incoming:[['Annehmen','accept'],['Ablehnen','reject']],accepted:[['Freundschaft beenden','remove']]};
 for(const [label,type] of choices[p.relationship]||[])box.append(button(label,()=>action(p.id,type)));
}
async function loadProfile(id){const seq=++sequence;profile=null;$('socialProfile').hidden=true;$('socialFeedback').textContent='Profil wird geladen …';const p=await rpc('mv_social_profile_v1',{p_peer:id});if(seq!==sequence||$('socialPopup').hidden)return;profile=p;
 $('socialProfile').hidden=false;$('socialAvatar').textContent=avatars[p.avatar]||avatars.leaf;$('socialName').textContent=p.name;$('socialUsername').textContent='@'+p.username;
 $('socialRole').textContent=p.role==='admin'?'🛡 Admin':p.role==='mod'?'🛡 Moderator':'Bewohner des Tals';$('socialGuild').textContent=p.guild?'🏰 '+p.guild:'Noch keiner Gilde angeschlossen';$('socialBio').textContent=p.bio||'Noch keine Beschreibung.';
 const own=p.relationship==='self';$('socialEditor').hidden=!own;$('socialBio').hidden=own;$('socialActions').replaceChildren();actions(p,$('socialActions'));
 if(own){$('socialBioInput').value=p.bio;$('socialAvatarInput').value=p.avatar;$('socialBioCount').textContent=p.bio.length+' / 240';}
 note('');
}
async function openProfile(id){show();await loadProfile(id);}
async function refreshList(){const seq=++listSequence;const rows=await rpc('mv_social_list_v1');if(seq!==listSequence||$('socialPopup').hidden)return;const stamp=JSON.stringify(rows);if(stamp===listStamp)return;listStamp=stamp;
 const groups=[['accepted','socialFriends','Noch keine Freunde.'],['incoming','socialIncoming','Keine eingehenden Anfragen.'],['outgoing','socialOutgoing','Keine gesendeten Anfragen.']];
 for(const [kind,target,empty]of groups){const box=$(target);box.replaceChildren();const selected=rows.filter(p=>p.relationship===kind);if(!selected.length)box.append(el('p',empty,'muted'));for(const p of selected){const card=el('article',undefined,'socialContact');card.append(button((avatars[p.avatar]||avatars.leaf)+' '+p.name+' (@'+p.username+')',()=>openProfile(p.id)));const controls=el('div',undefined,'socialActions');actions(p,controls);card.append(controls);box.append(card);}}
 $('socialIncomingCount').textContent=String(rows.filter(p=>p.relationship==='incoming').length);
}
async function open(){show();note('');listStamp='';$('socialProfile').hidden=true;profile=null;await refreshList();}
$('socialOpen').onclick=()=>run(open);$('socialClose').onclick=close;$('socialRefresh').onclick=()=>run(async()=>{listStamp='';await refreshList();if(profile)await loadProfile(profile.id);});$('socialOwn').onclick=()=>run(()=>openProfile(context().user.id));
$('socialSearchForm').onsubmit=e=>{e.preventDefault();return run(async()=>{const q=$('socialSearch').value.trim(),seq=++sequence;if(!/^[A-Za-z0-9_]{3,24}$/.test(q))throw Error('Bitte 3–24 Zeichen eines Benutzernamens eingeben.');const rows=await rpc('mv_dm_search_v1',{p_search:q});if(seq!==sequence||$('socialSearch').value.trim()!==q)return;const box=$('socialResults');box.replaceChildren();if(!rows.length)box.append(el('p','Keine passenden Spieler gefunden.','muted'));for(const p of rows)box.append(button(p.name+' (@'+p.username+')',()=>openProfile(p.id)));});};
$('socialSearch').oninput=()=>{sequence++;$('socialResults').replaceChildren();};$('socialBioInput').oninput=()=>{$('socialBioCount').textContent=$('socialBioInput').value.length+' / 240';};
$('socialEditor').onsubmit=e=>{e.preventDefault();return run(async()=>{if(busy)return;busy=true;const token=epoch;$('socialSave').disabled=true;try{await rpc('mv_social_save_v1',{p_bio:$('socialBioInput').value,p_avatar:$('socialAvatarInput').value});await loadProfile(context().user.id);note('Profil gespeichert.');}finally{if(token===epoch){busy=false;$('socialSave').disabled=false;}}});};
$('socialPopup').onclick=e=>{if(e.target===$('socialPopup'))close();};
document.addEventListener('keydown',e=>{if($('socialPopup').hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}if(e.key==='Tab'){e.stopImmediatePropagation();const items=[...$('socialPopup').querySelectorAll('button:not(:disabled),input,textarea,select')].filter(n=>!n.closest('[hidden]'));const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}},true);
window.addEventListener('mv-cloud-state',()=>{epoch++;sequence++;listSequence++;profile=null;busy=false;listStamp='';$('socialSave').disabled=false;$('socialPopup').hidden=true;for(const id of['socialFriends','socialIncoming','socialOutgoing','socialResults','socialActions'])$(id).replaceChildren();$('socialSearch').value='';$('socialBioInput').value='';$('socialFeedback').textContent='';for(const id of ['socialName','socialUsername','socialRole','socialGuild','socialBio','socialAvatar'])$(id).textContent='';$('socialProfile').hidden=true;});
setInterval(()=>{if(!$('socialPopup').hidden&&document.visibilityState!=='hidden')run(refreshList);},10000);
window.mysticSocial={profile:id=>run(()=>openProfile(id))};
