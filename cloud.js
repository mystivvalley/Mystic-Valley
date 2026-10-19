const URL='https://jsczrhflonkqvbhctcwk.supabase.co';
const KEY='sb_publishable_76tCxCjmtKvTUZTEKO1LjA_Pc9PGTWN';
const $=id=>document.getElementById(id), bridge=window.mysticValleySaveBridge;
const META='mv_sync_meta_v1', BACKUPS='mv_cloud_backups_v1';
let client,user,active=null,revision=null,ready=false,busy=false,epoch=0,pending=false,account=null,authTab='login';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const say=(text,error=false)=>{$('sbFeedback').textContent=text;$('sbFeedback').className=error?'danger':'muted';$('cloudStatus').textContent=text};
function pause(value){document.querySelector('.game').inert=value;$('sbClose').disabled=value;if(value)$('cloudPopup').hidden=false;authUI();window.dispatchEvent?.(new Event('mv-cloud-state'));}
function backup(){const entries=read(BACKUPS)||[];entries.unshift({at:new Date().toISOString(),owner:read(META)?.owner||null,save:bridge.snapshot()});localStorage.setItem(BACKUPS,JSON.stringify(entries.slice(0,5)));}
function exportBackup(){const b=read(BACKUPS)?.[0];if(!b)throw Error('Noch keine Sicherung vorhanden.');const a=document.createElement('a'),u=window.URL.createObjectURL(new Blob([JSON.stringify(b.save,null,2)],{type:'application/json'}));a.href=u;a.download='mystic-valley-sicherung.json';a.click();setTimeout(()=>window.URL.revokeObjectURL(u),1000);}
function mark(snapshot){localStorage.setItem(META,JSON.stringify({owner:active,revision,lastTick:snapshot.lastTick}));}
async function fetchSave(){const {data,error}=await client.from('player_saves').select('save_data,revision,updated_at').eq('user_id',user.id).maybeSingle();if(error)throw error;return data;}
function conflict(){ready=false;pause(true);say('Ein anderes Gerät hat inzwischen gespeichert. Dein lokaler Stand bleibt erhalten. Bitte „Cloud-Stand übernehmen“ wählen; vorher wird er automatisch gesichert.',true);}
async function saveCloud(){
 if(!ready||!user||busy)return false;
 busy=true;const token=epoch,owner=user.id,snapshot=bridge.snapshot();
 try{
  const {data,error}=await client.rpc('mv_save_v1',{p_save:snapshot,p_expected_revision:revision});
  if(token!==epoch||user?.id!==owner)return false;
  if(error)throw error;
  if(data?.conflict){conflict();return false;}
  if(!Number.isSafeInteger(data?.revision))throw Error('Ungültige Cloud-Antwort.');
  revision=data.revision;mark(snapshot);say('☁️ Automatisch gesichert · '+new Date(data.updated_at).toLocaleTimeString('de-DE'));return true;
 }catch(e){say('Lokal gespeichert · Cloud noch offen: '+e.message+' — Verbindung prüfen; erneuter Versuch in 30 Sekunden.',true);return false;}
 finally{busy=false;if(pending){pending=false;queueMicrotask(()=>guard(()=>initialize()));}}
}
async function initialize(forceCloud=false){
 if(busy){pending=true;return;}
 ready=false;pause(true);busy=true;const token=epoch,owner=user?.id;if(!owner){busy=false;return;}
 try{
  say('☁️ Konto wird geprüft …');const profile=await client.rpc('mv_account_v1');if(token!==epoch||user?.id!==owner)return;if(profile.error)throw profile.error;account=profile.data;authUI();if(!account?.username){say('Bitte zuerst einen eindeutigen Benutzernamen festlegen.');return;}say('☁️ Spielstand wird geprüft …');const row=await fetchSave();if(token!==epoch||user?.id!==owner)return;
  const local=bridge.snapshot(),meta=read(META);
  if(row){
   if(!Number.isSafeInteger(row.revision))throw Error('Bitte zuerst supabase_update_2_1.sql im SQL Editor ausführen.');
   const sameBase=meta?.owner===owner&&meta.revision===row.revision;
   if(forceCloud||!sameBase){backup();bridge.apply(row.save_data);}
   revision=row.revision;
  }else{
   if(meta?.owner!==owner){
    const useLocal=!meta?.owner&&confirm('Für dieses Konto gibt es noch keinen Cloud-Stand. Deinen aktuellen lokalen Fortschritt übernehmen? Abbrechen startet für dieses Konto ein neues Dorf; der bisherige Stand wird gesichert.');
    backup();if(!useLocal)bridge.reset();
   }
   revision=null;
  }
  active=owner;mark(sameSnapshot());ready=true;pause(false);say('🟢 Angemeldet · automatische Speicherung aktiv');
 }catch(e){say('Cloud konnte nicht geladen werden: '+e.message+' · „Erneut prüfen“ anklicken.',true);}
 finally{busy=false;if(pending){pending=false;queueMicrotask(()=>guard(()=>initialize()));}}
 if(ready)await saveCloud();
}
function sameSnapshot(){return bridge.snapshot();}
async function guard(fn){try{await fn()}catch(e){say(e.message||String(e),true);}}
function sessionChanged(next){
 const id=next?.id||null;if(id===user?.id&&id===active)return;
 user=next;account=null;epoch++;ready=false;pause(true);
 if(user){active=null;guard(()=>initialize());}else{active=null;say('Bitte anmelden oder als Gast lokal spielen.');}
}
$('cloudOpen').onclick=()=>{$('cloudPopup').hidden=false};$('sbClose').onclick=()=>{$('cloudPopup').hidden=true};
$('sbGuest').onclick=()=>{if(user){say('Zum lokalen Gastmodus bitte erst abmelden.',true);return;}pause(false);$('cloudPopup').hidden=true;say('Lokaler Gastmodus · keine Cloud-Sicherung');};
function authUI(){
 $('authSignedOut').hidden=!!user;$('authProfilePanel').hidden=!user;
 $('authLoginPanel').hidden=authTab!=='login';$('authRegisterPanel').hidden=authTab!=='register';
 $('authLoginTab').setAttribute('aria-pressed',String(authTab==='login'));$('authRegisterTab').setAttribute('aria-pressed',String(authTab==='register'));
 $('authChoosePanel').hidden=!user||!!account?.username;
 $('sbAccountName').textContent=account?.display_name?'Angemeldet als '+account.display_name:'Dein Konto · Benutzername erforderlich';
 $('sbUpload').disabled=!ready;$('sbDownload').disabled=!user;$('sbGuest').hidden=!!user;
}
function validName(name){if(!/^[A-Za-z0-9_]{3,24}$/.test(name))throw Error('Benutzername: 3–24 Zeichen, nur A–Z, Zahlen und Unterstrich.');}
const redirectURL=()=>{const u=new window.URL(window.location.href);u.search='';u.hash='';return u.href;};
$('authLoginTab').onclick=()=>{authTab='login';authUI();};$('authRegisterTab').onclick=()=>{authTab='register';authUI();};
let authBusy=false;
async function authAction(fn){if(authBusy)return;authBusy=true;for(const id of ['sbLogin','sbRegister','sbGoogle','sbSaveUsername'])$(id).disabled=true;try{await guard(fn)}finally{authBusy=false;for(const id of ['sbLogin','sbRegister','sbGoogle','sbSaveUsername'])$(id).disabled=false;}}
$('sbLogin').onclick=()=>authAction(async()=>{
 if(!client)throw Error('Verbindung wird noch aufgebaut. Bitte „Erneut prüfen“ anklicken.');
 const identifier=$('sbLoginName').value.trim(),password=$('sbPassword').value;
 if(!identifier||!password)throw Error('Bitte Benutzername und Passwort eingeben.');
 if(identifier.includes('@')){
  const {data,error}=await client.auth.signInWithPassword({email:identifier,password});if(error)throw Error('E-Mail oder Passwort ist falsch. Prüfe auch die E-Mail-Bestätigung.');sessionChanged(data.user);
 }else{
  validName(identifier);
  let response;try{response=await fetch(URL+'/functions/v1/mv-username-login',{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY},body:JSON.stringify({username:identifier,password})});}catch{throw Error('Benutzernamen-Login nicht erreichbar. Bitte Verbindung und Edge-Function-Einrichtung prüfen.');}
  let result;try{result=await response.json();}catch{throw Error('Benutzernamen-Login ist noch nicht eingerichtet.');}
  if(!response.ok)throw Error(result.error||'Benutzernamen-Login ist noch nicht eingerichtet.');
  if(!result.access_token||!result.refresh_token)throw Error('Ungültige Anmeldeantwort.');
  const {data,error}=await client.auth.setSession({access_token:result.access_token,refresh_token:result.refresh_token});if(error)throw error;sessionChanged(data.user);
 }
 $('sbPassword').value='';
});
$('sbRegister').onclick=()=>authAction(async()=>{
 if(!client)throw Error('Verbindung wird noch aufgebaut.');const username=$('sbRegUsername').value.trim(),email=$('sbRegEmail').value.trim(),password=$('sbRegPassword').value;validName(username);
 if(!email||!$('sbRegEmail').checkValidity())throw Error('Bitte eine gültige E-Mail-Adresse eingeben.');if(password.length<8)throw Error('Passwort: mindestens 8 Zeichen.');
 const {data,error}=await client.auth.signUp({email,password,options:{data:{username},emailRedirectTo:redirectURL()}});
 if(error){if(error.message?.includes('Database error'))throw Error('Registrierung fehlgeschlagen. Der Benutzername ist möglicherweise schon vergeben. Bitte anderen Namen versuchen oder Supabase-Einrichtung prüfen.');throw error;}
 $('sbRegPassword').value='';if(data.session)sessionChanged(data.user);else{authTab='login';$('sbLoginName').value=username;authUI();say('Bitte E-Mail bestätigen und danach mit Benutzername und Passwort anmelden. Falls bereits ein Konto besteht, nutze die Anmeldung.');}
});
$('sbGoogle').onclick=()=>authAction(async()=>{if(!client)throw Error('Verbindung wird noch aufgebaut.');const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:redirectURL(),queryParams:{prompt:'select_account'}}});if(error)throw Error('Google-Anmeldung fehlgeschlagen: '+error.message);});
$('sbSaveUsername').onclick=()=>authAction(async()=>{if(!user)throw Error('Bitte anmelden.');if(busy)throw Error('Bitte die laufende Konto-Prüfung abwarten.');const name=$('sbChooseUsername').value.trim();validName(name);const token=epoch;const {data,error}=await client.rpc('mv_choose_username_v1',{p_username:name});if(token!==epoch)return;if(error)throw error;account=data;authUI();await initialize();});
$('sbPassword').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('sbLogin').click();}};
$('sbRegPassword').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('sbRegister').click();}};
$('sbLogout').onclick=()=>guard(async()=>{if(busy)throw Error('Bitte warten, die Cloud-Anfrage läuft noch.');if(ready&&!await saveCloud()&&!confirm('Cloud-Sicherung noch offen. Trotzdem abmelden? Der lokale Stand bleibt auf diesem Gerät erhalten.'))return;const {error}=await client.auth.signOut();if(error)throw error;sessionChanged(null);});
$('sbUpload').onclick=()=>guard(async()=>{if(!ready)throw Error('Bitte zuerst den Cloud-Stand prüfen oder übernehmen.');await saveCloud();});
$('sbDownload').onclick=()=>guard(async()=>{if(!user)throw Error('Bitte anmelden.');if(busy)throw Error('Bitte laufende Anfrage abwarten.');if(!confirm('Cloud-Stand übernehmen? Dein lokaler Stand wird vorher intern gesichert.'))return;await initialize(true);});
$('sbBackup').onclick=()=>guard(async()=>exportBackup());
async function connect(){if(client){if(user)await initialize();return;}pause(true);say('Verbindung wird aufgebaut …');if(!window.supabase)await new Promise((resolve,reject)=>{const tag=document.createElement('script');tag.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';tag.onload=resolve;tag.onerror=()=>{tag.remove();reject(Error('Verbindung fehlgeschlagen. Internet prüfen.'))};document.head.append(tag)});client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});client.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>sessionChanged(session?.user||null),0)});const {data,error}=await client.auth.getSession();if(error)throw error;sessionChanged(data.session?.user||null);}
$('sbRetry').onclick=()=>guard(connect);
setInterval(()=>guard(saveCloud),30000);
window.addEventListener('online',()=>guard(()=>ready?saveCloud():user?initialize():connect()));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')guard(saveCloud)});
window.addEventListener('beforeunload',e=>{const meta=read(META),local=bridge.snapshot();if(user&&(!ready||busy||meta?.owner!==user.id||local.lastTick>(meta.lastTick||0)+2000)){e.preventDefault();e.returnValue='';}});
authUI();guard(connect);

export function chatContext(){return {client,user,ready};}
