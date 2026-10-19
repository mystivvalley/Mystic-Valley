function operationUUID() {
 const c = globalThis.crypto;
 if (typeof c?.randomUUID === 'function') return c.randomUUID();
 if (typeof c?.getRandomValues !== 'function') throw Error('Dieser Browser unterstützt keine sicheren Zufallszahlen. Bitte einen aktuellen Browser verwenden.');
 const bytes = c.getRandomValues(new Uint8Array(16));
 bytes[6] = (bytes[6] & 15) | 64;
 bytes[8] = (bytes[8] & 63) | 128;
 const h = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
 return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
// Der Aufrufer wird von cloud.js übergeben; der Mutex und die Cloud-Version bleiben dort.
export function paymentProtocol({client, bridge, current, setRevision, backup, conflict, pause, say}) {
 const key=owner=>'mv_pending_guild_payment_v1:'+owner;
 const pending=owner=>{const raw=localStorage.getItem(key(owner));return raw?JSON.parse(raw):null;};
 const clear=owner=>localStorage.removeItem(key(owner));
 async function call(name,args){let timer;try{return await Promise.race([client().rpc(name,args),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Die Verbindung antwortet nicht rechtzeitig.')),20000);})]);}finally{clearTimeout(timer);}}
 function apply(result,owner,token){const ctx=current();if(ctx.owner!==owner||ctx.epoch!==token)throw Error('Konto hat sich während der Einzahlung geändert.');if(!result?.save_data||!Number.isSafeInteger(result.revision)||!['accepted','cancelled'].includes(result.receipt?.status))throw Error('Ungültige Buchungsantwort.');bridge.apply(result.save_data);setRevision(result.revision,result.save_data);clear(owner);return result.receipt;}
 async function recover(owner,token){const op=pending(owner);if(!op)return null;bridge.hold(true);backup();const {data,error}=await call('mv_guild_recover_payment_v1',{p_operation_id:op.id});if(error)throw error;return apply(data,owner,token);}
 async function donate(guild,project,resource,amount){
  const initial=current();if(!initial.ready||!initial.owner)throw Error('Bitte zuerst deinen Cloud-Spielstand prüfen.');
  if(!Number.isSafeInteger(amount)||amount<1)throw Error('Bitte eine positive ganze Menge eingeben.');
  if(pending(initial.owner))throw Error('Eine frühere Einzahlung ist noch offen. Bitte unter Konto & Cloud erneut prüfen.');
  const op={id:operationUUID(),guild,project,resource,amount};
  localStorage.setItem(key(initial.owner),JSON.stringify(op));
  const token=initial.epoch,owner=initial.owner;
  try{
   const snapshot=bridge.snapshot();backup(snapshot);bridge.hold(true);
   const saved=await call('mv_save_v1',{p_save:snapshot,p_expected_revision:initial.revision});
   if(saved.error)throw saved.error;
   if(saved.data?.conflict){clear(owner);conflict();throw Error('Ein anderes Gerät hat gespeichert. Bitte zuerst den Cloud-Stand übernehmen.');}
   if(current().owner!==owner||current().epoch!==token)throw Error('Konto hat sich geändert.');
   if(!Number.isSafeInteger(saved.data?.revision))throw Error('Ungültige Speicherantwort.');
   setRevision(saved.data.revision,snapshot);
   const {data,error}=await call('mv_guild_donate_v1',{p_guild_id:guild,p_project_id:project,p_resource:resource,p_amount:amount,p_expected_revision:saved.data.revision,p_operation_id:op.id});
   if(error)throw error;
   if(data?.conflict){clear(owner);conflict();throw Error('Neuerer Cloud-Spielstand vorhanden. Bitte zuerst laden.');}
   const receipt=apply(data,owner,token);
   if(receipt.status!=='accepted')throw Error('Die Einzahlung wurde abgebrochen; es wurden keine Ressourcen abgebucht.');
   return receipt;
  }catch(e){
   if(current().owner!==owner||current().epoch!==token)throw e;
   if(!pending(owner))throw e;
   try{const receipt=await recover(owner,token);if(receipt?.status==='accepted')return receipt;}
   catch{conflict();say('Einzahlung noch nicht geklärt. Bitte Verbindung prüfen und „Erneut prüfen“ anklicken.',true);throw Error('Einzahlung noch offen. Dein Konto muss die Buchung zuerst prüfen.');}
   throw Error(e.message||String(e));
  }
 }
 return {pending,recover,donate};
}
