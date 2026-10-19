(()=>{'use strict';
const $=id=>document.getElementById(id);
const toggle=$('settingsToggle'), dropdown=$('settingsDropdown');
const contents=$('settingsContents');
// Move the existing controls, preserving their IDs and event handlers.
contents.append(document.querySelector('.onlineBar'));
const options=document.createElement('button'); options.type='button';
options.textContent='💾 Spielstand & Spieloptionen';
options.onclick=()=>{setSettings(false);window.mysticNavigation.settings();};
contents.append(options);
const tests=document.createElement('details');tests.className='testOptions';
const summary=document.createElement('summary');summary.textContent='🧪 Testwerkzeuge';
tests.append(summary,document.querySelector('.testToolbar'));contents.append(tests);
const chat=$('chatOpen');$('headerChat').replaceWith(chat);chat.textContent='💬';chat.title='Globaler Chat';chat.setAttribute('aria-label','Globalen Chat öffnen');
$('left').append($('socialOpen'));
const guild=$('guildOpen');const guildNav=[...$('left').children].find(b=>b.textContent.includes('Gildenhaus'));guild.textContent='🏰 Gildenhaus';guildNav.replaceWith(guild);
function setSettings(open){dropdown.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open){$('left').classList.remove('mobileOpen');$('mobileNav').setAttribute('aria-expanded','false');}}
toggle.onclick=()=>setSettings(dropdown.hidden);
dropdown.addEventListener('click',e=>{if(e.target.closest('button'))setSettings(false);});
document.addEventListener('click',e=>{if(!e.target.closest('.settingsWrap'))setSettings(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!dropdown.hidden){setSettings(false);toggle.focus();}$('left').classList.remove('mobileOpen');$('mobileNav').setAttribute('aria-expanded','false');}});
$('mobileNav').onclick=()=>{const open=$('left').classList.toggle('mobileOpen');$('mobileNav').setAttribute('aria-expanded',String(open));setSettings(false);};
$('left').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#left button').forEach(x=>x.classList.toggle('active',x===b));$('left').classList.remove('mobileOpen');$('mobileNav').setAttribute('aria-expanded','false');});
document.querySelector('#left button')?.classList.add('active');
})();
