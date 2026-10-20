(()=>{'use strict';
const $=id=>document.getElementById(id), nav=window.mysticNavigation;
const contents=$('settingsContents');
const extras=document.createElement('details');extras.className='worldExtras';
const heading=document.createElement('summary');heading.textContent='Weitere Spielbereiche';extras.append(heading);
const keep=['Freunde','Übersicht','Forschung','Handel','Questbuch','Gildenhaus','Dorfsiegel'];
for(const b of [...$('left').children]){
 if(b.id==='expeditionNav'||keep.some(k=>b.textContent.includes(k)))continue;
 extras.append(b);
}
contents.append(extras);
// Restore direct map controls, retaining the original buttons and handlers.
const bottom=$('bottom');
for(const [oldName,newName,description] of [
 ['Ressourcen','Freischaltungen','Deine nächsten Meilensteine'],
 ['Forschung','Karte','Orte & Gebäude im Tal']
]){
 const oldButton=[...bottom.children].find(b=>b.textContent.includes(oldName));
 const existing=[...extras.children].find(b=>b.tagName==='BUTTON'&&b.textContent.includes(newName));
 if(oldButton&&existing){const hint=document.createElement('small');hint.textContent=description;existing.append(hint);oldButton.replaceWith(existing);}
}

// Production status remains available without another bar outside the map.
const status=document.createElement('details');status.className='worldExtras';
const label=document.createElement('summary');label.textContent='Laufende Produktion';status.append(label,$('craftOverview'));contents.append(status);
$('headerAchievements').onclick=nav.achievements;
$('chatOpen').textContent='✉';$('chatOpen').title='Nachrichten · Globaler Chat & Privatnachrichten';$('chatOpen').setAttribute('aria-label',$('chatOpen').title);
$('settingsToggle').title='Menü · Einstellungen & Konto';
// Raster icons remain consistent across Windows, phones and Linux.
const iconFor=text=>/Begleiter|Expedition/.test(text)?'paw':/Freischaltungen/.test(text)?'star':/Karte/.test(text)?'scroll':/Freunde/.test(text)?'trophy':/Forschung/.test(text)?'flask':/Handel/.test(text)?'scales':/Quest|Aufträge/.test(text)?'scroll':/Ressourcen/.test(text)?'gold':/Spezial|Dorfsiegel/.test(text)?'star':/Lager/.test(text)?'wood':/Gilden/.test(text)?'trophy':'gear';
for(const b of document.querySelectorAll('#left>button,#bottom>button')){
 b.dataset.icon=iconFor(b.textContent);
 const t=b.firstChild;if(t?.nodeType===3)t.textContent=t.textContent.replace(/^[^\p{L}\p{N}]+/u,'');
}
const navButtons=[...$('left').children];
for(const name of ['Übersicht','Forschung','Handel','Questbuch','Gildenhaus','Begleiter','Dorfsiegel']){
 const b=navButtons.find(b=>b.textContent.includes(name));if(b)$('left').append(b);
}
navButtons.forEach(b=>b.classList.toggle('active',b.textContent.includes('Übersicht')));
for(const [id,icon]of [['headerAchievements','trophy'],['chatOpen','envelope'],['settingsToggle','gear']]){$(id).dataset.icon=icon;$(id).textContent='';}
const questToggle=$('questToggle');
questToggle.onclick=()=>{const open=$('questSidebar').classList.toggle('questsOpen');questToggle.setAttribute('aria-expanded',String(open));};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('questSidebar').classList.remove('questsOpen');questToggle.setAttribute('aria-expanded','false');}});
const guide=$('elfGuide'), key='mv_elf_tutorial_212';let step=0;
const tips=[
 ['Willkommen in Lumertal!','Ich bin Mira. Repariere zuerst deine Forsthütte und bringe das Tal wieder zum Leben.','Zur Forsthütte',()=>nav.building(0)],
 ['Dein Dorf erwacht','Klicke nach der Reparatur erneut auf die Forsthütte und aktiviere sie. Danach produziert sie auch während deiner Abwesenheit Holz.','Forsthütte ansehen',()=>nav.building(0)],
 ['Vorräte im Blick','Oben siehst du Gold, Holz, Kristall, Mana und Sternensplitter. Im Lagerhaus findest du alle Rohstoffe und hergestellten Waren.','Lagerhaus öffnen',nav.warehouse],
 ['Kleine Ziele, große Fortschritte','Rechts stehen deine nächsten Aufgaben. Belohnungen und Tagesaufgaben findest du im Questbuch.','Zum Questbuch',nav.quests],
 ['Gemeinsam auf Entdeckungsreise','Deine Begleiter erkunden den Nebelwald. Wähle ein Team, packe Vorräte ein und hole nach der Rückkehr den Bericht ab.','Begleiter kennenlernen',nav.expedition]
 ];
function paintGuide(){const t=tips[step];$('elfStep').textContent='Miras Tipps · '+(step+1)+' / '+tips.length;$('elfTitle').textContent=t[0];$('elfText').textContent=t[1];$('elfAction').textContent=t[2];$('elfNext').textContent=step===tips.length-1?'Verstanden':'Weiter →';}
function showGuide(){step=0;paintGuide();guide.hidden=false;}
function hideGuide(){guide.hidden=true;try{localStorage.setItem(key,'done');}catch{}}
$('elfClose').onclick=hideGuide;
$('elfNext').onclick=()=>{if(step===tips.length-1)hideGuide();else{step++;paintGuide();}};
$('elfAction').onclick=()=>tips[step][3]();
const help=document.createElement('button');help.type='button';help.textContent='🌿 Miras Einstiegstipps';help.onclick=showGuide;contents.append(help);
try{if(!localStorage.getItem(key))showGuide();}catch{showGuide();}
// On small screens, the world scrolls independently beneath the HUD.
if(matchMedia('(max-width: 900px)').matches){const map=document.querySelector('.mainmap');requestAnimationFrame(()=>{map.scrollLeft=(map.scrollWidth-map.clientWidth)/2;map.scrollTop=Math.max(0,(map.scrollHeight-map.clientHeight)/2);});}
})();
