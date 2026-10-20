/* Lumertal 2.21: home shell over existing game actions. No state writes. */
(()=>{'use strict';
const $=id=>document.getElementById(id),nav=window.mysticNavigation;
if(!nav?.homeData)return;
const game=document.querySelector('.game'),map=document.querySelector('.mainmap');
game.classList.add('villageHome');
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
const act=(text,fn,cls)=>{const b=el('button',cls,text);b.type='button';b.onclick=fn;return b;};
const shell=el('main','villageContent');shell.id='villageContent';shell.tabIndex=-1;
const intro=el('header','homeIntro');intro.append(el('small','','DEIN TAL. DEINE MAGIE.'),el('h1','','Willkommen in Lumertal'),el('p','','Dein Dorf wächst. Was möchtest du heute angehen?'));shell.append(intro);
const home=el('section','homePage');home.setAttribute('aria-label','Dorfzentrale');
const upper=el('div','homeUpper'),panorama=el('section','homePanorama');
panorama.setAttribute('aria-label','Dorfpanorama von Lumertal');
const heroImage=el('img');heroImage.src='assets/lumertal-dorfpanorama.png';heroImage.alt='Ein magisches Dorf zwischen Wäldern, Bergen und einem leuchtenden Bach';heroImage.width=1536;heroImage.height=1024;panorama.append(heroImage);
const heroCaption=el('div','homeHeroCaption');heroCaption.append(el('small','','DEIN ZUHAUSE IM TAL'),el('h2','','Ein Dorf voller Möglichkeiten'));
const villageStatus=el('p');villageStatus.id='homeVillageStatus';heroCaption.append(villageStatus);panorama.append(heroCaption);
upper.append(panorama,$('questSidebar'));home.append(upper);
const actions=el('div','homeActions');
function feature(title,description,cls,fn,id){const b=act('',fn,'homeFeature '+cls);const art=el('span','homeFeatureArt');art.setAttribute('aria-hidden','true');const info=el('span','homeFeatureInfo');info.append(el('strong','',title));const hint=el('span','',description);hint.id=id;info.append(hint,el('span','homeFeatureLink','Bereich öffnen →'));b.append(art,info);actions.append(b);}
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
item('Dorf','home',()=>view('home'),'home');item('Weltkarte','scroll',()=>view('map'),'map');item('Gebäude','hammer',()=>view('buildings'),'buildings');item('Lagerhaus','wood',nav.warehouse);item('Produktion','gear',nav.production);item('Forschung','flask',nav.research);item('Begleiter','paw',nav.expedition);item('Gilde','trophy',()=>$('guildOpen').click());
const footer=el('div','homeSidebarFooter');footer.append(act('📜 Aufgaben',nav.quests),act('⚖ Handel',nav.trade),act('🌿 Freunde',()=>$('socialOpen').click()));sidebar.append(footer);
let current='home',buildingStamp='',jobStamp='';
function view(which){current=which;home.hidden=which!=='home';buildings.hidden=which!=='buildings';world.hidden=which!=='map';for(const [key,b]of Object.entries(navItems)){b.classList.toggle('active',key===which);if(key===which)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');}sidebar.classList.remove('mobileOpen');$('mobileNav').setAttribute('aria-expanded','false');intro.querySelector('h1').textContent=which==='home'?'Willkommen in Lumertal':which==='buildings'?'Das Herz deines Dorfes':'Die Welt von Lumertal';intro.querySelector('p').textContent=which==='home'?'Dein Dorf wächst. Was möchtest du heute angehen?':which==='buildings'?'Alle Gebäude, Ausbaustufen und nächsten Schritte an einem Ort.':'Dein Tal und der Weg in den Nebelwald.';paint();shell.scrollTop=0;if(which==='map')requestAnimationFrame(()=>{map.scrollLeft=Math.max(0,(map.scrollWidth-map.clientWidth)/2);});}
// The quest journal lives on the home page; mobile uses the same readable panel.
$('questToggle').hidden=true;const help=act('Alle Aufgaben →',nav.quests,'homeAllQuests');$('questSidebar').append(help);
const skip=el('a','homeSkip','Zum Spielinhalt');skip.href='#villageContent';game.prepend(skip);
function clock(ms){const t=Math.max(0,Math.ceil(ms/1000));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
function statusText(b,d){if(d.level<b.need)return 'Ab Spielerlevel '+b.need;if(b.status==='repairing')return 'Reparatur · '+clock(b.end-Date.now());if(b.status==='ready')return 'Bereit zur Aktivierung';if(b.status==='ruined')return 'Wartet auf Reparatur';if(b.end>Date.now())return 'Ausbau · '+clock(b.end-Date.now());return b.canImprove?'Ausbau möglich':'In Betrieb · Stufe '+b.level;}
function paint(){if(document.hidden)return;const d=nav.homeData(),active=d.buildings.filter(b=>b.status==='active').length,improve=d.buildings.filter(b=>b.canImprove).length;
villageStatus.textContent=active+' von '+d.buildings.length+' Gebäuden in Betrieb · Spielerlevel '+d.level;
$('homeBuildingsHint').textContent=improve?improve+' Verbesserungen möglich':active+' Gebäude in Betrieb';
$('homeProductionHint').textContent=d.jobs.length?d.jobs.length+' Herstellungsaufträge aktiv':'Werkstatt & Alchemie entdecken';
$('homeExploreHint').textContent=d.journey?(d.journey.endsAt<=Date.now()?'Expeditionsbericht bereit':'Dein Team ist unterwegs'):'Team wählen und den Nebelwald erkunden';
const stamp=JSON.stringify(d.jobs.map(j=>[j.station,j.name,j.start,j.end,j.queued]));
if(stamp!==jobStamp){jobStamp=stamp;jobs.replaceChildren();if(!d.jobs.length){const empty=el('div','homeProductionEmpty');empty.append(el('span','','Deine Werkbänke warten'),el('p','','Wähle ein Rezept in der Produktionszentrale. Fertige Waren werden automatisch gutgeschrieben.'));jobs.append(empty);}for(const j of d.jobs){const card=act('',nav.production,'homeJob');card.append(el('small','',j.station==='workshop'?'WERKSTATT':'ALCHEMIE'),el('strong','',j.name));const progress=el('progress');progress.max=100;progress.setAttribute('aria-label',j.name+' · Herstellungsfortschritt');const timer=el('span','homeJobTime');card.append(progress,timer);jobs.append(card);}}
[...jobs.querySelectorAll('.homeJob')].forEach((card,i)=>{const j=d.jobs[i],value=j.queued?0:Math.max(0,Math.min(100,100*(Date.now()-j.start)/Math.max(1,j.end-j.start)));card.querySelector('progress').value=value;card.querySelector('.homeJobTime').textContent=j.queued?'In Warteschlange':clock(j.end-Date.now());});
const bs=JSON.stringify(d.buildings.map(b=>[b.status,b.level,b.canImprove,d.level>=b.need]));
if(bs!==buildingStamp){buildingStamp=bs;buildingGrid.replaceChildren();for(const b of d.buildings){const card=act('',()=>nav.building(b.index),'homeBuildingCard');card.classList.toggle('isLocked',d.level<b.need);const art=el('span','homeBuildingArt');art.style.backgroundPosition=b.x+'% '+b.y+'%';art.setAttribute('aria-hidden','true');card.append(art,el('strong','',b.name),el('span','homeBuildingRole',b.role),el('span','homeBuildingStatus',''));card.dataset.building=String(b.index);buildingGrid.append(card);}}
for(const card of buildingGrid.children){const b=d.buildings[Number(card.dataset.building)];card.querySelector('.homeBuildingStatus').textContent=statusText(b,d);}
}
view('home');setInterval(paint,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)paint();});
})();
