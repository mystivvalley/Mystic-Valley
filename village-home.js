/* Lumertal 2.21: home shell over existing game actions. No state writes. */
(()=>{'use strict';
const $=id=>document.getElementById(id),nav=window.mysticNavigation;
if(!nav?.homeData)return;
const ROUTE_KEY='lumertal_ui_route_v1';
const PAGES=['home','map','buildings'],PANELS=['warehouse','research','production','expedition','guild','social','messages','quests','orders','chapter','trade','building'];
function readRoute(){try{const r=JSON.parse(sessionStorage.getItem(ROUTE_KEY)||'null');if(r&&PAGES.includes(r.page))return {page:r.page,panel:PANELS.includes(r.panel)?r.panel:null,building:Number.isInteger(r.building)&&r.building>=0&&r.building<15?r.building:null,scroll:Number.isFinite(r.scroll)?Math.max(0,r.scroll):0,mapX:Number.isFinite(r.mapX)?Math.max(0,r.mapX):null,mapY:Number.isFinite(r.mapY)?Math.max(0,r.mapY):0};}catch{}return {page:'home',panel:null,building:null,scroll:0,mapX:null,mapY:0};}
let savedRoute=readRoute(),restoring=true,pendingPanel=savedRoute.panel,trackingPanels=!pendingPanel,bootStateSeen=false;
function rememberRoute(patch){savedRoute={...savedRoute,...patch};try{sessionStorage.setItem(ROUTE_KEY,JSON.stringify(savedRoute));}catch{}}

const game=document.querySelector('.game'),map=document.querySelector('.mainmap');
game.classList.add('villageHome');
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
const act=(text,fn,cls)=>{const b=el('button',cls,text);b.type='button';b.onclick=fn;return b;};
const shell=el('main','villageContent');shell.id='villageContent';shell.tabIndex=-1;
const intro=el('header','homeIntro');intro.append(el('small','','DEIN TAL. DEINE MAGIE.'),el('h1','','Willkommen in Lumertal'),el('p','','Dein Dorf wächst. Was möchtest du heute angehen?'));shell.append(intro);
const home=el('section','homePage');home.setAttribute('aria-label','Dorfzentrale');
const upper=el('div','homeUpper'),panorama=el('section','homePanorama');
panorama.setAttribute('aria-label','Dorfpanorama von Lumertal');
const heroImage=el('img');heroImage.src='assets/lumertal-dorfpanorama.png';heroImage.alt='Ein magisches Dorf zwischen Wäldern, Bergen und einem leuchtenden Bach';heroImage.width=2048;heroImage.height=683;panorama.append(heroImage);
const heroCaption=el('div','homeHeroCaption');heroCaption.append(el('small','','DEIN ZUHAUSE IM TAL'),el('h2','','Ein Dorf voller Möglichkeiten'));
const villageStatus=el('p');villageStatus.id='homeVillageStatus';heroCaption.append(villageStatus);panorama.title='Dorfpanorama · den tatsächlichen Gebäudefortschritt findest du unter Gebäude';panorama.append(heroCaption);
upper.append(panorama,$('questSidebar'));home.append(upper);
const actions=el('div','homeActions');
function feature(title,description,cls,fn,id){const b=act('',fn,'homeFeature '+cls);const art=el('span','homeFeatureArt');art.setAttribute('aria-hidden','true');const info=el('span','homeFeatureInfo');info.append(el('strong','',title));const hint=el('span','',description);hint.id=id;info.append(hint,el('span','homeFeatureLink','›'));b.append(art,info);actions.append(b);}
feature('Gebäude','Deine Gebäude im Überblick','featureBuildings',()=>view('buildings'),'homeBuildingsHint');
feature('Produktion','Werkstatt & Alchemie','featureProduction',nav.production,'homeProductionHint');
feature('Entdecken','Begleiter & Expeditionen','featureExplore',nav.expedition,'homeExploreHint');
home.append(actions);
const production=el('section','homeProduction');const prodHead=el('div','homeSectionHeading');prodHead.append(el('h2','','Deine Produktion'),act('Herstellung planen →',nav.production));production.append(prodHead);
const jobs=el('div','homeJobs');jobs.id='homeJobs';production.append(jobs);home.append(production);
const extras=el('div','homeQuickLinks');extras.append(act('📋 Auftragsbrett',nav.orders),act('✨ Dorfsiegel',nav.chapter),act('🌿 Freunde & Profile',()=>$('socialOpen').click()));home.append(extras);
const buildings=el('section','homeBuildingPage');buildings.hidden=true;buildings.setAttribute('aria-label','Alle Gebäude');const bHead=el('div','homeSectionHeading');bHead.append(el('h2','','Deine Gebäude'),act('Auf der Karte ansehen →',()=>view('map')));buildings.append(bHead,el('p','homeSectionNote','Wähle ein Gebäude, um zu reparieren, zu aktivieren oder auszubauen.'));
const buildingGrid=el('div','homeBuildingGrid');buildings.append(buildingGrid);
const world=el('section','homeMapPage');world.hidden=true;const wHead=el('div','homeSectionHeading');wHead.append(el('h2','','Dein Tal entdecken'),act('Zum Nebelwald →',nav.expedition));world.append(wHead,el('p','homeSectionNote','Hier erreichst du alle 15 Gebäude direkt auf der Karte. Begleiter und Expeditionen führen dich in den Nebelwald.'),map);shell.append(home,buildings,world);game.append(shell);
const sidebar=$('left');sidebar.setAttribute('aria-label','Hauptnavigation');
// Keep old commands accessible through settings before replacing the shell navigation.
const oldCommands=el('details','worldExtras');oldCommands.append(el('summary','','Weitere Aktionen'));
for(const b of [...sidebar.children,...$('bottom').children])oldCommands.append(b);
$('settingsContents').append(oldCommands);$('bottom').hidden=true;
const brand=document.querySelector('.brand');sidebar.prepend(brand);
const navItems={};
function item(label,icon,fn,key){const b=act(label,fn,'homeNavButton');b.dataset.icon=icon;if(key)navItems[key]=b;sidebar.append(b);return b;}
item('Dorf','home',()=>view('home'),'home');item('Weltkarte','scroll',()=>view('map'),'map');item('Gebäude','hammer',()=>view('buildings'),'buildings');item('Lagerhaus','wood',nav.warehouse);item('Forschung','flask',nav.research);item('Begleiter','paw',nav.expedition);item('Gilde','trophy',()=>$('guildOpen').click());
const footer=el('div','homeSidebarFooter');footer.append(act('📜 Aufgaben',nav.quests),act('⚖ Handel',nav.trade),act('🌿 Freunde',()=>$('socialOpen').click()));sidebar.append(footer);
let current='home',buildingStamp='',jobStamp='';
function view(which){current=which;home.hidden=which!=='home';buildings.hidden=which!=='buildings';world.hidden=which!=='map';for(const [key,b]of Object.entries(navItems)){b.classList.toggle('active',key===which);if(key===which)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');}sidebar.classList.remove('mobileOpen');$('mobileNav').setAttribute('aria-expanded','false');intro.querySelector('h1').textContent=which==='home'?greeting+' in Lumertal':which==='buildings'?'Das Herz deines Dorfes':'Die Welt von Lumertal';intro.querySelector('p').textContent=which==='home'?'Dein Dorf wächst. Was möchtest du heute angehen?':which==='buildings'?'Alle Gebäude, Ausbaustufen und nächsten Schritte an einem Ort.':'Dein Tal und der Weg in den Nebelwald.';paint();if(restoring){shell.scrollTop=savedRoute.scroll;}else{pendingPanel=null;trackingPanels=true;shell.scrollTop=0;rememberRoute({page:which,panel:null,building:null,scroll:0});}if(which==='map')requestAnimationFrame(()=>{map.scrollLeft=savedRoute.mapX??Math.max(0,(map.scrollWidth-map.clientWidth)/2);map.scrollTop=savedRoute.mapY||0;});}
// The quest journal lives on the home page; mobile uses the same readable panel.
$('questToggle').hidden=true;const help=act('Alle Aufgaben →',nav.quests,'homeAllQuests');$('questSidebar').append(help);
const hour=Number(new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',hour:'numeric',hourCycle:'h23'}).format(new Date()));const greeting=hour<11?'Guten Morgen':hour<18?'Willkommen':'Guten Abend';
const skip=el('a','homeSkip','Zum Spielinhalt');skip.href='#villageContent';game.prepend(skip);
function clock(ms){const t=Math.max(0,Math.ceil(ms/1000));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
function statusText(b,d){if(d.level<b.need)return 'Ab Spielerlevel '+b.need;if(b.status==='repairing')return 'Reparatur · '+clock(b.end-Date.now());if(b.status==='ready')return 'Bereit zur Aktivierung';if(b.status==='ruined')return 'Wartet auf Reparatur';if(b.end>Date.now())return 'Ausbau · '+clock(b.end-Date.now());return b.canImprove?'Ausbau möglich':'In Betrieb · Stufe '+b.level;}
const RECIPE_ID_BY_NAME={'Bauholz':'planks','Verstärktes Bauholz':'beams','Kristallschliff':'quartz','Zaubertrank':'potions','Großer Zaubertrank':'elixir','Runenplatten':'runeplates','Zauberessenz':'spellessence','Schutzzauber':'ward','Mana-Essenz':'essence'};
function groupedJobs(list){const groups=new Map();for(const input of list){const j={...input,recipe:input.recipe||RECIPE_ID_BY_NAME[input.name]||'unknown'};const key=j.station+':'+(j.recipe==='unknown'?j.name:j.recipe);const old=groups.get(key);if(old){old.count++;if(old.queued&&!j.queued)Object.assign(old,j,{count:old.count});}else groups.set(key,{...j,count:1});}return [...groups.values()];}
function paint(){if(document.hidden)return;const d=nav.homeData();const totalJobs=d.jobs.length;d.jobs=groupedJobs(d.jobs);const active=d.buildings.filter(b=>b.status==='active').length,improve=d.buildings.filter(b=>b.canImprove).length;
villageStatus.textContent=active+' von '+d.buildings.length+' Gebäuden in Betrieb · Spielerlevel '+d.level;
$('homeBuildingsHint').textContent=improve?improve+' Verbesserungen möglich':active+' Gebäude in Betrieb';
$('homeProductionHint').textContent=totalJobs?totalJobs+' Herstellungsaufträge aktiv':'Werkstatt & Alchemie entdecken';
$('homeExploreHint').textContent=d.journey?(d.journey.endsAt<=Date.now()?'Expeditionsbericht bereit':'Dein Team ist unterwegs'):'Team wählen und den Nebelwald erkunden';
const stamp=JSON.stringify(d.jobs.map(j=>[j.station,j.recipe,j.name,j.start,j.end,j.queued,j.count]));
if(stamp!==jobStamp){jobStamp=stamp;jobs.replaceChildren();if(!d.jobs.length){const empty=el('div','homeProductionEmpty');empty.append(el('span','','Deine Werkbänke warten'),el('p','','Wähle ein Rezept in der Produktionszentrale. Fertige Waren werden automatisch gutgeschrieben.'));jobs.append(empty);}for(const j of d.jobs){const card=act('',nav.production,'homeJob');card.dataset.recipe=j.recipe;const icon=el('span','craftArt homeJobIcon');icon.dataset.craftIcon=j.recipe;icon.setAttribute('aria-hidden','true');card.append(icon);card.append(el('small','',j.station==='workshop'?'WERKSTATT':'ALCHEMIE'),el('strong','',j.name+(j.count>1?' × '+j.count:'')));const progress=el('progress');progress.max=100;progress.setAttribute('aria-label',j.name+' · Herstellungsfortschritt');const timer=el('span','homeJobTime');card.append(progress,timer);jobs.append(card);}}
[...jobs.querySelectorAll('.homeJob')].forEach((card,i)=>{const j=d.jobs[i],value=j.queued?0:Math.max(0,Math.min(100,100*(Date.now()-j.start)/Math.max(1,j.end-j.start)));card.querySelector('progress').value=value;card.querySelector('.homeJobTime').textContent=j.queued?'In Warteschlange':clock(j.end-Date.now());});
const bs=JSON.stringify(d.buildings.map(b=>[b.status,b.level,b.canImprove,d.level>=b.need]));
if(bs!==buildingStamp){buildingStamp=bs;buildingGrid.replaceChildren();for(const b of d.buildings){const card=act('',()=>nav.building(b.index),'homeBuildingCard');card.classList.toggle('isLocked',d.level<b.need);const art=el('span','homeBuildingArt');art.dataset.buildingArt=String(b.index);art.setAttribute('aria-hidden','true');card.append(art,el('strong','',b.name),el('span','homeBuildingRole',b.role),el('span','homeBuildingStatus',''));card.dataset.building=String(b.index);buildingGrid.append(card);}}
for(const card of buildingGrid.children){const b=d.buildings[Number(card.dataset.building)];card.querySelector('.homeBuildingStatus').textContent=statusText(b,d);}
}
view(savedRoute.page);restoring=false;
function visiblePanel(){
 if(!$('guildPopup').hidden)return {panel:'guild'};
 if(!$('socialPopup').hidden)return {panel:'social'};
 if(!$('chatPopup').hidden)return {panel:'messages'};
 if(!$('popup').hidden){const dialog=$('popup').querySelector('.dialog'),classes=dialog.classList;
  if(classes.contains('buildingView'))return {panel:'building',building:Number(dialog.dataset.buildingIndex)};
  for(const [cls,panel]of [['warehouseView','warehouse'],['researchView','research'],['expeditionView','expedition'],['craftView','production'],['craftHubView','production'],['questbookView','quests']])if(classes.contains(cls))return {panel};
  const title=$('dialogTitle').textContent;
  if(/Auftragsbrett|Aufträge/.test(title))return {panel:'orders'};
  if(/Dorfsiegel/.test(title))return {panel:'chapter'};
  if(/Handel/.test(title))return {panel:'trade'};
 }
 return {panel:null,building:null};
}
function trackPanel(){if(trackingPanels)rememberRoute(visiblePanel());}
const routeObserver=new MutationObserver(trackPanel);
for(const id of ['popup','guildPopup','socialPopup','chatPopup'])routeObserver.observe($(id),{attributes:true,attributeFilter:['hidden']});
routeObserver.observe($('popup').querySelector('.dialog'),{attributes:true,attributeFilter:['class','data-building-index']});
routeObserver.observe($('dialogTitle'),{childList:true,subtree:true,characterData:true});
function restorePanel(){if(!pendingPanel||!bootStateSeen||game.inert||!$('cloudPopup').hidden)return;
 const panel=pendingPanel;pendingPanel=null;trackingPanels=true;
 if(['guild','social','messages'].includes(panel)&&$('authProfilePanel').hidden){rememberRoute({panel:null,building:null});return;}
 const openers={warehouse:nav.warehouse,research:nav.research,production:nav.production,expedition:nav.expedition,guild:()=>$('guildOpen').click(),social:()=>$('socialOpen').click(),messages:()=>$('chatOpen').click(),quests:nav.quests,orders:nav.orders,chapter:nav.chapter,trade:nav.trade,building:()=>{if(savedRoute.building!==null)nav.building(savedRoute.building);}};
 openers[panel]?.();
}
window.addEventListener('mv-cloud-state',()=>{bootStateSeen=true;setTimeout(restorePanel,0);});
let scrollQueued=false;shell.addEventListener('scroll',()=>{if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;rememberRoute({page:current,scroll:shell.scrollTop});});},{passive:true});
map.addEventListener('scroll',()=>rememberRoute({mapX:map.scrollLeft,mapY:map.scrollTop}),{passive:true});
window.addEventListener('pagehide',()=>{const panel=trackingPanels?visiblePanel():{panel:pendingPanel};rememberRoute({...panel,page:current,scroll:shell.scrollTop,mapX:map.scrollLeft,mapY:map.scrollTop});});
setInterval(paint,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)paint();});
})();
