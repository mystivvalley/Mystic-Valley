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
export function premiumProtocol({client, bridge, current, setRevision, backup, conflict, pause, say}) {
 const key=owner=>'mv_pending_premium_v1:'+owner;
 const pending=owner=>{const raw=localStorage.getItem(key(owner));return raw?JSON.parse(raw):null;};
 const clear=owner=>localStorage.removeItem(key(owner));
 async function call(name,args){let timer;try{return await Promise.race([client().rpc(name,args),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Die Verbindung antwortet nicht rechtzeitig.')),20000);})]);}finally{clearTimeout(timer);}}
 function apply(result,owner,token){const ctx=current();if(ctx.owner!==owner||ctx.epoch!==token)throw Error('Konto hat sich während der Splitterbuchung geändert.');if(!result?.save_data||!Number.isSafeInteger(result.revision)||!['accepted','cancelled'].includes(result.receipt?.status))throw Error('Ungültige Buchungsantwort.');bridge.apply(result.save_data);setRevision(result.revision,result.save_data);clear(owner);window.dispatchEvent(new CustomEvent('mv-premium-wallet',{detail:result.wallet}));return result.receipt;}
 async function recover(owner,token){const op=pending(owner);if(!op)return null;bridge.hold(true,'premium');backup();const {data,error}=await call('mv_premium_recover_v1',{p_operation_id:op.id});if(error)throw error;return apply(data,owner,token);}
 async function spend(kind,index,maxCost){
  const initial=current();if(!initial.ready||!initial.owner)throw Error('Bitte zuerst deinen Cloud-Spielstand prüfen.');
  if(!['speed','banner'].includes(kind)||!Number.isSafeInteger(maxCost)||maxCost<1)throw Error('Ungültige Splitterbuchung.');
  if(pending(initial.owner))throw Error('Eine frühere Splitterbuchung ist noch offen. Bitte unter Konto & Cloud erneut prüfen.');
  const op={id:operationUUID(),kind,index,maxCost};
  localStorage.setItem(key(initial.owner),JSON.stringify(op));
  const token=initial.epoch,owner=initial.owner;
  try{
   const snapshot=bridge.snapshot();backup(snapshot);bridge.hold(true,'premium');
   const saved=await call('mv_save_v1',{p_save:snapshot,p_expected_revision:initial.revision});
   if(saved.error)throw saved.error;
   if(saved.data?.conflict){clear(owner);conflict();throw Error('Ein anderes Gerät hat gespeichert. Bitte zuerst den Cloud-Stand übernehmen.');}
   if(current().owner!==owner||current().epoch!==token)throw Error('Konto hat sich geändert.');
   if(!Number.isSafeInteger(saved.data?.revision))throw Error('Ungültige Speicherantwort.');
   setRevision(saved.data.revision,snapshot);
   const {data,error}=await call('mv_premium_execute_v1',{p_kind:kind,p_building_index:index,p_expected_revision:saved.data.revision,p_operation_id:op.id,p_max_cost:maxCost});
   if(error)throw error;
   if(data?.conflict){clear(owner);conflict();throw Error('Neuerer Cloud-Spielstand vorhanden. Bitte zuerst laden.');}
   const receipt=apply(data,owner,token);
   if(receipt.status!=='accepted')throw Error('Die Splitterbuchung wurde abgebrochen; es wurden keine Sternensplitter abgebucht.');
   return receipt;
  }catch(e){
   if(current().owner!==owner||current().epoch!==token)throw e;
   if(!pending(owner))throw e;
   try{const receipt=await recover(owner,token);if(receipt?.status==='accepted')return receipt;}
   catch{conflict();say('Splitterbuchung noch nicht geklärt. Bitte Verbindung prüfen und „Erneut prüfen“ anklicken.',true);throw Error('Splitterbuchung noch offen. Dein Konto muss die Buchung zuerst prüfen.');}
   throw Error(e.message||String(e));
  }
 }
 return {pending,recover,spend};
}
