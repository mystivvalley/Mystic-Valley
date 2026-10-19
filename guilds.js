import { chatContext, donateToGuild } from './cloud.js';
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
let state=null,loading=false,changing=false,pending=false,generation=0,tab='overview',cooldown=0;
const stamps={};
function note(text,error=false){$('guildFeedback').textContent=text;$('guildFeedback').className=error?'danger':'muted';}
function context(){const c=chatContext();if(!c.client||!c.user||!c.ready)throw Error('Bitte anmelden und zuerst deinen Cloud-Spielstand prüfen.');return c;}
async function rpc(name,args={}){const c=context(),id=c.user.id;const {data,error}=await c.client.rpc(name,args);if(chatContext().user?.id!==id||!chatContext().ready)throw Error('Konto hat sich geändert. Gildenbereich erneut öffnen.');if(error)throw error;return data;}
async function run(fn){try{await fn()}catch(e){note(e.message||String(e),true);}}
const leader=()=>!!state?.guild&&state.guild.leader_id===state.me.id;
function button(label,fn,key){const b=el('button',label);b.type='button';if(key)b.dataset.guildKey=key;b.onclick=()=>run(fn);return b;}
function replaceList(id,data,paint){const stamp=JSON.stringify(data);if(stamps[id]===stamp)return;stamps[id]=stamp;const focused=document.activeElement?.dataset?.guildKey,box=$(id),top=box.scrollTop;box.replaceChildren();paint(box);box.scrollTop=top;if(focused)for(const b of box.querySelectorAll('button'))if(b.dataset.guildKey===focused)b.focus({preventScroll:true});}
function controls(){
 const muted=[state?.me?.muted_until,state?.me?.global_muted_until].some(t=>t&&new Date(t).getTime()>Date.now());
 $('guildInput').disabled=!state?.guild||muted||changing;
 $('guildSend').disabled=$('guildInput').disabled||Date.now()<cooldown;
 $('guildCounter').textContent=$('guildInput').value.length+' / 500';
 $('guildIdentity').textContent=muted?'Du bist vorübergehend im Chat stummgeschaltet.':'Nur Mitglieder deiner aktuellen Gilde können diesen Chat lesen.';
 for(const id of ['guildCreate','guildLeave'])$(id).disabled=changing;projectControls();
}
function showTab(value){tab=value;$('guildOverview').hidden=value!=='overview';$('guildChatPanel').hidden=value!=='chat';$('guildProjectsPanel').hidden=value!=='projects';$('guildProjectsTab').setAttribute('aria-pressed',String(value==='projects'));$('guildOverviewTab').setAttribute('aria-pressed',String(value==='overview'));$('guildChatTab').setAttribute('aria-pressed',String(value==='chat'));}
function renderMembers(){const rows=state.members||[];replaceList('guildMembers',[rows,state.guild.leader_id],box=>{for(const m of rows){const card=el('article',undefined,'guildCard');const title=el('div',undefined,'guildRow');title.append(profileButton(m.name,m.user_id),el('span',m.user_id===state.guild.leader_id?'👑 Gildenleitung':'Mitglied','muted'));card.append(title);if(m.muted_until&&new Date(m.muted_until).getTime()>Date.now())card.append(el('p','Im Gildenchat stummgeschaltet','muted'));if(leader()&&m.user_id!==state.me.id){const actions=el('div',undefined,'chatActions');actions.append(button('Leitung übergeben',()=>act('transfer',state.guild.id,m.user_id,'Gildenleitung an '+m.name+' übergeben? Du bleibst als Mitglied dabei.'),m.user_id+'transfer'),button('Entfernen',()=>act('kick',state.guild.id,m.user_id,m.name+' aus der Gilde entfernen?'),m.user_id+'kick'));card.append(actions);}box.append(card);}});}
function renderRequests(){const rows=state.requests||[];$('guildRequestPanel').hidden=!leader();if(!leader()){$('guildRequests').replaceChildren();return;}replaceList('guildRequests',rows,box=>{if(!rows.length)box.append(el('p','Keine offenen Beitrittsanfragen.','muted'));for(const r of rows){const card=el('article',undefined,'guildCard');card.append(el('strong',r.name));const actions=el('div',undefined,'chatActions');actions.append(button('Aufnehmen',()=>act('accept',state.guild.id,r.user_id),r.user_id+'accept'),button('Ablehnen',()=>act('reject',state.guild.id,r.user_id),r.user_id+'reject'));card.append(actions);box.append(card);}});}
function renderMessages(){const rows=state.messages||[],box=$('guildMessages'),bottom=box.scrollHeight-box.scrollTop-box.clientHeight<70;replaceList('guildMessages',[rows,leader(),state.guild.id],wrap=>{if(!rows.length)wrap.append(el('p','Willkommen im Gildenchat!','muted'));for(const r of rows){const card=el('article',undefined,'chatMessage'+(r.sender_id===state.me.id?' own':''));const head=el('div',undefined,'chatMessageHead');head.append(profileButton(r.sender_name,r.sender_id));const time=el('time',new Date(r.created_at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}));time.dateTime=r.created_at;head.append(time);card.append(head,el('p',r.hidden_at?'Nachricht entfernt.':r.body,r.hidden_at?'muted':'chatBody'));const actions=el('div',undefined,'chatActions');if(!r.hidden_at&&(leader()||r.sender_id===state.me.id))actions.append(button('Entfernen',()=>chatAction(r.id,'hide','Diese Nachricht entfernen?'),r.id+'hide'));if(leader()&&r.sender_id&&r.sender_id!==state.me.id&&state.members.some(m=>m.user_id===r.sender_id)){for(const [label,type]of [['10 Min. stumm','mute10'],['1 Std. stumm','mute60'],['Stumm aufheben','unmute']])actions.append(button(label,()=>chatAction(r.id,type,label+' für '+r.sender_name+'?'),r.id+type));}card.append(actions);wrap.append(card);}});if(bottom)box.scrollTop=box.scrollHeight;}
function renderState(data){
 if(!data?.me||!Array.isArray(data.members)||!Array.isArray(data.messages))throw Error('Ungültige Gildenantwort.');
 if(state?.guild?.id!==data.guild?.id){clearProjects();$('guildInput').value='';Object.keys(stamps).forEach(k=>delete stamps[k]);$('guildMessages').replaceChildren();}
 state=data;if(!data.guild)clearProjects();$('guildNoMembership').hidden=!!data.guild;$('guildMemberView').hidden=!data.guild;
 if(data.guild){$('guildName').textContent=data.guild.name;$('guildRole').textContent=leader()?'👑 Du leitest diese Gilde':'Du bist Mitglied';$('guildMemberCount').textContent=data.members.length+' / 20 Mitglieder';$('guildLeave').textContent=data.members.length===1?'Gilde auflösen':'Gilde verlassen';renderMembers();renderRequests();renderMessages();showTab(tab);renderProjects();}
 else{
  $('guildMembers').replaceChildren();$('guildRequests').replaceChildren();$('guildMessages').replaceChildren();
  replaceList('guildApplications',data.applications||[],box=>{for(const r of data.applications||[]){const card=el('div',undefined,'guildCard guildRow');card.append(el('span','Anfrage offen: '+r.name),button('Zurückziehen',()=>act('cancel',r.guild_id),r.guild_id+'cancel'));box.append(card);}});
 }
 controls();
}
function renderDirectory(rows){replaceList('guildDirectory',rows,box=>{if(!rows.length)box.append(el('p','Keine passende Gilde gefunden. Gründe deine eigene!','muted'));for(const g of rows){const card=el('article',undefined,'guildCard');card.append(el('strong',g.name),el('p',(g.leader_name||'Gildenleitung')+' · '+g.member_count+' / 20 Mitglieder','muted'));const b=button(g.requested?'Anfrage offen':g.member_count>=20?'Gilde voll':'Beitritt anfragen',()=>act('request',g.id),g.id+'request');b.disabled=g.requested||g.member_count>=20;card.append(b);box.append(card);}});}
async function refresh(){if($('guildPopup').hidden)return;if(loading){pending=true;return;}loading=true;const seq=generation;try{const data=await rpc('mv_guild_state_v1');if(seq!==generation)return;renderState(data);if(!data.guild){const directory=await rpc('mv_guild_directory_v1',{p_search:$('guildSearch').value.trim()});if(seq!==generation)return;renderDirectory(directory);}await refreshProjects();}finally{loading=false;if(pending){pending=false;queueMicrotask(()=>run(refresh));}}}
async function mutate(fn){if(changing)return;changing=true;controls();try{await fn();generation++;Object.keys(stamps).forEach(k=>delete stamps[k]);note('Gilde aktualisiert.');await refresh();}finally{changing=false;controls();}}
async function act(action,guildId=null,target=null,message=null,name=null){if(message&&!confirm(message))return;await mutate(async()=>{await rpc('mv_guild_action_v1',{p_action:action,p_guild_id:guildId,p_target:target,p_name:name});if(action==='leave')clearProjects();});}
async function chatAction(id,action,message){if(!confirm(message))return;await mutate(()=>rpc('mv_guild_chat_action_v1',{p_message_id:id,p_action:action}));}
async function open(){try{context();}catch{$('cloudPopup').hidden=false;return;}$('chatPopup').hidden=true;$('cloudPopup').hidden=true;$('popup').hidden=true;$('guildPopup').hidden=false;$('guildClose').focus();note('Gemeinsame Projekte findest du im Reiter „Projekte“. Wähle deine Einzahlungsmenge selbst.');const old=window.mysticValleySaveBridge.snapshot().guild?.name;if(!$('guildCreateName').value&&old)$('guildCreateName').value=old.slice(0,24);await refresh();}
function close(){$('guildPopup').hidden=true;$('guildOpen').focus();}
$('guildOpen').onclick=()=>run(open);$('guildClose').onclick=close;$('guildRefresh').onclick=()=>run(refresh);
$('guildProjectsTab').onclick=()=>{showTab('projects');run(refreshProjects);};
$('guildOverviewTab').onclick=()=>showTab('overview');$('guildChatTab').onclick=()=>{showTab('chat');$('guildMessages').scrollTop=$('guildMessages').scrollHeight;};
$('guildLocal').onclick=()=>{close();window.mysticValleyLocalGuild?.();};
$('guildPopup').onclick=e=>{if(e.target===$('guildPopup'))close();};
$('guildCreateForm').onsubmit=e=>{e.preventDefault();return run(async()=>{const name=$('guildCreateName').value.trim().replace(/\s+/g,' ');if(name.length<3||name.length>24)throw Error('Gildenname: 3–24 Zeichen.');await act('create',null,null,null,name);});};
$('guildSearchForm').onsubmit=e=>{e.preventDefault();return run(refresh);};
$('guildLeave').onclick=()=>run(()=>{if(!state?.guild)return;const text=state.members.length===1?'Gilde endgültig auflösen? Gildenchat und gemeinsame Projekte werden dabei gelöscht. Einzahlungen werden nicht erstattet. Dein Dorf und die lokalen Projekte bleiben erhalten.':'Gilde verlassen? Als Leitung musst du sie zuvor an ein anderes Mitglied übergeben.';return act('leave',state.guild.id,null,text);});
$('guildInput').oninput=controls;
$('guildInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('guildChatForm').requestSubmit();}};
$('guildChatForm').onsubmit=e=>{e.preventDefault();return run(async()=>{controls();if($('guildSend').disabled)return;const body=$('guildInput').value.trim();if(!body||body.length>500)throw Error('Nachricht: 1–500 Zeichen.');const gid=state.guild.id;await mutate(async()=>{await rpc('mv_guild_post_v1',{p_guild_id:gid,p_body:body});$('guildInput').value='';cooldown=Date.now()+3000;});});};
document.addEventListener('keydown',e=>{if($('guildPopup').hidden)return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const items=Array.from($('guildPopup').querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(n=>!n.closest('[hidden]'));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
window.addEventListener('mv-cloud-state',()=>{if(!chatContext().ready){generation++;state=null;clearProjects();$('guildPopup').hidden=true;$('guildInput').value='';$('guildCreateName').value='';$('guildSearch').value='';for(const id of ['guildMembers','guildRequests','guildMessages','guildDirectory','guildApplications'])$(id).replaceChildren();Object.keys(stamps).forEach(k=>delete stamps[k]);}else{refreshProjects();}});
setInterval(()=>{if(!$('guildPopup').hidden&&document.visibilityState!=='hidden')run(refresh);},5000);
setInterval(()=>{if(!$('guildPopup').hidden)controls();},500);
const resources={gold:'Gold',wood:'Holz',crystal:'Kristalle',mana:'Mana',stone:'Stein',food:'Nahrung',herbs:'Kräuter',planks:'Bauholz',potions:'Zaubertränke'};
const bridge=window.mysticValleySaveBridge;
let projectData=null,projectLoading=false,projectShape='',serverOffset=0,projectEpoch=0;
const projectCards=new Map();
const num=n=>Math.floor(Number(n)||0).toLocaleString('de-DE');
const bonusText=b=>Object.entries(b||{}).map(([k,v])=>'+'+Math.round(v*100)+' % '+resources[k]).join(' · ');
function clearProjects(){projectEpoch++;projectData=null;projectShape='';projectCards.clear();delete stamps.guildContributionList;$('guildProjectList').replaceChildren();$('guildContributionList').replaceChildren();$('guildProjectLevel').textContent='';$('guildOnlineBonuses').textContent='';bridge.setOnlineGuild(null,{});}
async function refreshProjects(){
 if(projectLoading||!chatContext().ready)return;projectLoading=true;const seq=projectEpoch;
 try{const data=await rpc('mv_guild_projects_v1');if(seq!==projectEpoch)return;if(!Array.isArray(data?.projects)||!data.bonuses)throw Error('Ungültige Projektantwort.');projectData=data;serverOffset=new Date(data.server_now).getTime()-Date.now();bridge.setOnlineGuild(data.guild_id,data.bonuses);renderProjects();}
 catch(e){if(seq!==projectEpoch)return;bridge.setOnlineGuild(null,{});if(!$('guildPopup').hidden&&tab==='projects')note('Projekte konnten nicht aktualisiert werden: '+(e.message||e),true);}
 finally{projectLoading=false;}
}
function projectControls(){
 const balances=bridge.snapshot();
 for(const p of projectData?.projects||[]){const card=projectCards.get(p.id);if(!card)continue;const can=!!p.unlocked&&p.status==='funding';
  for(const [r,refs]of card.rows){const left=Math.max(0,p.goal[r]-(p.paid[r]||0)),available=Math.max(0,Math.floor(balances[r]||0));refs.balance.textContent='Du hast '+num(available)+' · fehlt '+num(left);refs.input.max=String(Math.min(left,available,1000000000));refs.input.disabled=changing||!can||left===0||available<1;refs.submit.disabled=refs.max.disabled=refs.input.disabled;}
  card.start.hidden=!(p.status==='funded'&&p.unlocked&&leader());card.start.disabled=changing;
 }
}
function renderProjects(){
 if(!state?.guild||projectData?.guild_id!==state.guild.id){$('guildProjectList').replaceChildren();projectCards.clear();projectShape='';$('guildContributionList').replaceChildren();delete stamps.guildContributionList;$('guildProjectLevel').textContent='';$('guildOnlineBonuses').textContent='';return;}
 $('guildProjectLevel').textContent='Gildenstufe '+projectData.level+' · '+num(projectData.xp)+' Gilden-XP';
 $('guildOnlineBonuses').textContent=Object.keys(projectData.bonuses).length?'Aktive Produktionsboni: '+bonusText(projectData.bonuses)+' · für verbundene Mitglieder.':'Abgeschlossene Projekte geben allen verbundenen Mitgliedern Produktionsboni.';
 const shape=JSON.stringify([projectData.guild_id,projectData.projects.map(p=>[p.id,p.name,p.goal])]);
 if(shape!==projectShape){projectShape=shape;projectCards.clear();$('guildProjectList').replaceChildren();
  for(const p of projectData.projects){
   const gid=projectData.guild_id,card=el('article',undefined,'guildCard guildProject'),head=el('div',undefined,'guildRow'),status=el('span',undefined,'muted');head.append(el('h3',p.icon+' '+p.name),status);card.append(head,el('p','Bauzeit: '+(p.build_seconds/3600)+' Stunden · '+num(p.xp)+' Gilden-XP · '+bonusText(p.bonus),'muted'));
   const progress=el('progress');progress.max=100;progress.setAttribute('aria-label','Fortschritt '+p.name);card.append(progress);const rows=new Map();
   for(const [r,goal]of Object.entries(p.goal)){
    const form=el('form',undefined,'guildDonation'),label=el('label'),paid=el('strong'),balance=el('span',undefined,'muted'),input=el('input');input.type='number';input.min='1';input.step='1';input.required=true;input.placeholder='Deine Menge';input.inputMode='numeric';input.setAttribute('aria-label',resources[r]+' einzahlen');label.append(paid,balance,input);
    const submit=el('button','Einzahlen'),max=button('Max.',()=>{input.value=input.max;input.focus();});submit.type='submit';form.append(label,max,submit);
    form.onsubmit=e=>{e.preventDefault();return run(async()=>{const amount=Number(input.value),current=projectData?.projects.find(x=>x.id===p.id);if(projectData?.guild_id!==gid||!current)throw Error('Gilde hat sich geändert.');if(!Number.isSafeInteger(amount)||amount<1)throw Error('Bitte eine positive ganze Menge eingeben.');if(amount>Number(input.max))throw Error('Diese Menge übersteigt deinen Bestand oder den offenen Projektbedarf.');await mutate(async()=>{await donateToGuild(gid,p.id,r,amount);input.value='';});});};
    card.append(form);rows.set(r,{paid,balance,input,submit,max});
   }
   const start=button('🔨 Bau starten',()=>mutate(()=>rpc('mv_guild_start_project_v1',{p_guild_id:gid,p_project_id:p.id})));start.hidden=true;card.append(start);$('guildProjectList').append(card);projectCards.set(p.id,{status,progress,rows,start});
  }
 }
 for(const p of projectData.projects){const c=projectCards.get(p.id);c.progress.value=Object.entries(p.goal).reduce((sum,[r,v])=>sum+Math.min(1,(p.paid[r]||0)/v),0)/Object.keys(p.goal).length*100;for(const [r,refs]of c.rows)refs.paid.textContent=resources[r]+': '+num(p.paid[r]||0)+' / '+num(p.goal[r]);}
 replaceList('guildContributionList',projectData.recent||[],box=>{if(!projectData.recent?.length)box.append(el('p','Noch keine Einzahlungen.','muted'));for(const r of projectData.recent||[]){const name=projectData.projects.find(p=>p.id===r.project_id)?.name||r.project_id;box.append(el('p',r.name+' · '+num(r.amount)+' '+resources[r.resource]+' → '+name,'muted'));}});
 projectTimers();projectControls();
}
function projectTimers(){for(const p of projectData?.projects||[]){const c=projectCards.get(p.id);if(!c)continue;let text=!p.unlocked?'🔒 Vorheriges Projekt abschließen':({funding:'Ressourcen sammeln',funded:'Vollständig finanziert · Leitung kann starten',done:'✓ Abgeschlossen'})[p.status];if(p.status==='building'){const seconds=Math.max(0,Math.ceil((new Date(p.ends_at).getTime()-Date.now()-serverOffset)/1000));text=seconds?'🔨 '+Math.floor(seconds/3600)+' h '+Math.floor(seconds%3600/60)+' min '+seconds%60+' s':'Abschluss wird geprüft …';}c.status.textContent=text;}}
setInterval(()=>{if(chatContext().ready&&document.visibilityState!=='hidden')refreshProjects();},15000);
setInterval(()=>{if(!$('guildPopup').hidden&&tab==='projects'){projectTimers();projectControls();}},1000);

window.mysticGuilds={open:()=>run(open)};controls();

function profileButton(name,id){const b=document.createElement(id?'button':'strong');b.textContent=name;if(id){b.type='button';b.className='socialProfileLink';b.title='Spielerprofil öffnen';b.onclick=()=>window.mysticSocial?.profile(id);}return b;}
