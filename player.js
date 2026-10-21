import { GAMES } from './core.js';
import { mountGame } from './games.js';
import { icon,hydrate } from './ui.js';
import { storage,readProfile,storageAvailable } from './state.js';
import { readBreakoutProgress } from './breakout-core.js';

hydrate();
const playerQuery=selector=>document.querySelector(selector),playerGame=GAMES.find(g=>g.id===document.body.dataset.game),playerPanel=playerQuery('#game-player');
let playerProfile=readProfile(),playerSession=null,playerPaused=false,playerFinished=false,playerScore=0,playerBest=0,playerAudio=null,playerToastTimer;
const playerSaveKey=`solo:save:${playerGame.id}:v1`;
const persistPlayer=()=>storage.set('solo:profile:v1',playerProfile);
function playerToast(message){const el=playerQuery('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(playerToastTimer);playerToastTimer=setTimeout(()=>el.classList.remove('visible'),2600);}
function playerBeep(frequency=400){if(!playerProfile.settings.sound)return;try{playerAudio??=new(window.AudioContext||window.webkitAudioContext)();playerAudio.resume().catch(()=>{});const oscillator=playerAudio.createOscillator(),gain=playerAudio.createGain();oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.025,playerAudio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,playerAudio.currentTime+.075);oscillator.connect(gain);gain.connect(playerAudio.destination);oscillator.start();oscillator.stop(playerAudio.currentTime+.08);}catch{/* Optional audio. */}}
function renderPlayerSound(){const button=playerQuery('#sound-button');button.innerHTML=icon(playerProfile.settings.sound?'volume-2':'volume-x');button.setAttribute('aria-label',playerProfile.settings.sound?'关闭音效':'开启音效');button.title=button.getAttribute('aria-label');}
function savePlayerRecord(){const record=playerProfile.records[playerGame.id];if(!record)return;record.best=Math.max(record.best,playerBest,playerScore);persistPlayer();}
function renderPlayerFavorite(){const saved=playerProfile.favorites.includes(playerGame.id),b=playerQuery('#player-favorite');b.innerHTML=`${icon('heart')}<span>${saved?'已收藏':'收藏游戏'}</span>`;b.classList.toggle('saved',saved);b.setAttribute('aria-pressed',saved);}
function updateCampaign(){const node=playerQuery('#campaign-summary');if(!node)return;const p=readBreakoutProgress(storage.get(playerSaveKey));node.innerHTML=`<div><strong>${p.completed.length}<span>/100</span></strong><small>已通关</small></div><div><strong>${Object.values(p.stars).reduce((a,b)=>a+b,0)}<span>/300</span></strong><small>星章收集</small></div>`;}
function setPlayerScore(value){playerScore=Math.max(0,Math.floor(value));playerQuery('#current-score').textContent=playerScore;playerBest=Math.max(playerBest,playerScore);playerQuery('#best-score').textContent=playerBest;}
function showPlayerOverlay(title,description,symbol,action){playerQuery('#result-title').textContent=title;playerQuery('#result-description').textContent=description;playerQuery('#result-symbol').textContent=symbol;playerQuery('#overlay-action').innerHTML=action;playerQuery('#game-overlay').hidden=false;playerQuery('#overlay-action').focus({preventScroll:true});}
function startPlayer(){
  playerSession?.destroy();playerPaused=false;playerFinished=false;playerScore=0;playerBest=playerProfile.records[playerGame.id].best;playerQuery('#game-overlay').hidden=true;playerQuery('#pause-button').disabled=false;playerQuery('#pause-button').innerHTML=icon('pause');playerQuery('#pause-button').setAttribute('aria-label','暂停游戏');setPlayerScore(0);
  playerSession=mountGame(playerGame.id,{name:playerGame.name,stage:playerQuery('#game-stage'),controls:playerQuery('#game-controls'),isPaused:()=>playerPaused,
    load:()=>storage.get(playerSaveKey),save(value){if(value===null)storage.remove(playerSaveKey);else storage.set(playerSaveKey,value);updateCampaign();},score:setPlayerScore,status(message){playerQuery('#game-status').textContent=message;},beep:playerBeep,
    achievement(score){playerProfile.records[playerGame.id].wins++;setPlayerScore(score);savePlayerRecord();updateCampaign();},
    finish(score,won,description){if(playerFinished)return;playerFinished=true;playerPaused=true;setPlayerScore(score);if(won)playerProfile.records[playerGame.id].wins++;savePlayerRecord();playerQuery('#pause-button').disabled=true;showPlayerOverlay(won?'漂亮，过关了！':'这一局，也很尽兴。',`${description} 本局 ${playerScore} 分。`,won?'✳':'↗',`再来一局 ${icon('restart')}`);if(won)playerBeep(800);}
  });
  playerQuery('#game-stage').focus({preventScroll:true});updateCampaign();
}
function pausePlayer(){if(playerFinished)return;playerPaused=!playerPaused;playerQuery('#pause-button').innerHTML=icon(playerPaused?'play':'pause');playerQuery('#pause-button').setAttribute('aria-label',playerPaused?'继续游戏':'暂停游戏');playerQuery('#pause-button').title=playerPaused?'继续游戏':'暂停游戏';if(playerPaused){showPlayerOverlay('休息一下','快乐不赶时间，准备好了再继续。','Ⅱ',`继续游戏 ${icon('play')}`);}else{playerQuery('#game-overlay').hidden=true;playerQuery('#game-stage').focus({preventScroll:true});}}
function restartPlayer(){savePlayerRecord();if(playerGame.id!=='breakout')storage.remove(playerSaveKey);playerProfile.records[playerGame.id].plays++;persistPlayer();if(playerSession?.restart){playerPaused=false;playerFinished=false;playerQuery('#game-overlay').hidden=true;playerQuery('#pause-button').innerHTML=icon('pause');playerQuery('#pause-button').setAttribute('aria-label','暂停游戏');playerSession.restart();return;}startPlayer();}
playerProfile.records[playerGame.id]??={best:0,plays:0,wins:0,lastPlayed:0};playerProfile.records[playerGame.id].plays++;playerProfile.records[playerGame.id].lastPlayed=Date.now();playerProfile.recent=[playerGame.id,...playerProfile.recent.filter(id=>id!==playerGame.id)].slice(0,10);persistPlayer();
playerQuery('#pause-button').addEventListener('click',pausePlayer);playerQuery('#restart-game').addEventListener('click',restartPlayer);playerQuery('#overlay-action').addEventListener('click',()=>playerFinished?restartPlayer():pausePlayer());playerQuery('#sound-button').addEventListener('click',()=>{playerProfile.settings.sound=!playerProfile.settings.sound;persistPlayer();renderPlayerSound();playerBeep(550);});
playerQuery('#player-favorite').addEventListener('click',()=>{const id=playerGame.id;playerProfile.favorites=playerProfile.favorites.includes(id)?playerProfile.favorites.filter(v=>v!==id):[...playerProfile.favorites,id];persistPlayer();renderPlayerFavorite();playerToast(playerProfile.favorites.includes(id)?'已收藏，把快乐留住。':'已取消收藏');});
playerQuery('#fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(playerPanel.requestFullscreen)await playerPanel.requestFullscreen();else playerToast('当前浏览器可通过添加到主屏幕获得独立应用体验。');}catch{playerToast('当前浏览器未允许全屏，游戏仍可正常进行。');}});
document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.target instanceof HTMLInputElement)return;if(['p','P','Escape'].includes(e.key)){e.preventDefault();pausePlayer();}});document.addEventListener('visibilitychange',()=>{if(document.hidden&&!playerPaused&&!playerFinished)pausePlayer();});window.addEventListener('pagehide',()=>{savePlayerRecord();playerSession?.destroy();});window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
renderPlayerFavorite();renderPlayerSound();startPlayer();if(!storageAvailable)playerToast('本设备未允许保存记录，游戏仍可继续。');
if('serviceWorker'in navigator&&!globalThis.__SOLO_BUNDLE__&&/^https?:$/.test(location.protocol)){
  const hadController=Boolean(navigator.serviceWorker.controller);let reloadingForUpdate=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!reloadingForUpdate){reloadingForUpdate=true;location.reload();}});
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='SOLO_OFFLINE_READY')playerQuery('#player-online').innerHTML='<i></i>全部游戏 · 离线已就绪';});
  navigator.serviceWorker.register(new URL('../../sw.js',location.href)).then(()=>navigator.serviceWorker.ready).then(reg=>reg.active?.postMessage({type:'SOLO_CHECK_CACHE'})).catch(()=>{});
}else if(globalThis.__SOLO_BUNDLE__)playerQuery('#player-online').innerHTML='<i></i>独立页面 · 离线版';
