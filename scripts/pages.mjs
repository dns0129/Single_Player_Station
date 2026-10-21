import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {GAMES,CATEGORIES} from '../core.js';
import {BREAKOUT_POWERUPS} from '../breakout-core.js';
const pagesRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function generateGamePages(){
  for(const game of GAMES){
    const breakoutPage=game.id==='breakout';
    const related=GAMES.filter(g=>g.id!==game.id).sort((a,b)=>Number(b.category===game.category)-Number(a.category===game.category)).slice(0,3);
    const html=`<!doctype html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#111715"><meta name="description" content="${game.name} · ${breakoutPage?'100 个关卡，8 种可点击拾取的道具，爆炸球、穿透球、多球与护盾。':game.description} 手机、iPad、电脑都能玩。"><meta name="apple-mobile-web-app-capable" content="yes"><title>${game.name}${breakoutPage?' · 100 关冒险':''} | 独乐 SOLO ARCADE</title><link rel="icon" type="image/svg+xml" href="../../assets/icon.svg"><link rel="apple-touch-icon" href="../../assets/icon-192.png"><link rel="manifest" href="../../manifest.webmanifest"><link rel="stylesheet" href="../../styles.css"></head>
<body class="player-page" data-game="${game.id}">
<a class="skip-link" href="#game-stage">跳到游戏区域</a>
<header class="player-site-header"><a class="player-brand" href="../../"><span data-icon="gamepad"></span><strong>独乐<span>.</span></strong><small>SOLO ARCADE</small></a><nav><span class="player-online" id="player-online"><i></i>单机 · 即点即玩</span><a href="../../#library" class="player-home-link"><span data-icon="grid"></span>返回首页</a></nav></header>
<main class="player-main"><div class="player-breadcrumb"><a href="../../">首页</a><span>/</span><a href="../../#library">${CATEGORIES[game.category]}</a><span>/</span><strong>${game.name}</strong></div>
<div class="player-heading"><div><div class="section-kicker">${breakoutPage?'100 LEVELS. A WHOLE NEW ADVENTURE.':game.en}</div><h1>${game.name}<span>${breakoutPage?'100 关冒险':CATEGORIES[game.category]}</span></h1><p>${game.description}</p></div><button class="secondary-button player-favorite" id="player-favorite"><span data-icon="heart"></span><span>收藏游戏</span></button></div>
<div class="player-layout ${breakoutPage?'is-breakout':''}">
<section class="player-panel" id="game-player" aria-label="${game.name}游戏区域"><div class="game-dialog-header"><div class="game-dialog-title"><span data-icon="gamepad"></span><div><span class="section-kicker">${CATEGORIES[game.category]}</span><h2 id="game-title">${game.name}</h2></div></div><div class="game-window-actions"><button class="icon-button" id="sound-button" aria-label="开启音效" title="开启音效"><span data-icon="volume-x"></span></button><button class="icon-button" id="pause-button" aria-label="暂停游戏" title="暂停游戏"><span data-icon="pause"></span></button><button class="icon-button" id="fullscreen-button" aria-label="全屏游戏" title="全屏游戏"><span data-icon="devices"></span></button><a class="icon-button" href="../../#library" id="close-game" aria-label="返回首页" title="返回首页"><span data-icon="close"></span></a></div></div>
<div class="game-scorebar"><div><small>本局得分</small><strong id="current-score">0</strong></div><div><small>个人最佳</small><strong id="best-score">0</strong></div><button class="secondary-button" id="restart-game"><span data-icon="restart"></span>${breakoutPage?'重开本关':'重新开始'}</button></div>
<div class="game-body"><div class="game-stage" id="game-stage" tabindex="0" aria-label="${game.name}操作区域"></div><div id="game-controls" class="game-controls"></div><div id="game-status" class="game-status" role="status" aria-live="polite"></div></div>
<div class="game-overlay" id="game-overlay" hidden><div class="result-symbol" id="result-symbol">Ⅱ</div><span class="section-kicker">SOLO TIME</span><h2 id="result-title">休息一下</h2><p id="result-description">准备好了，再接着玩。</p><button class="primary-button" id="overlay-action">继续游戏 <span data-icon="play"></span></button><a class="text-link" href="../../#library">回到首页</a></div></section>
<aside class="player-details"><div class="player-detail-cover"><img src="../../assets/${game.id}.svg" alt="${game.name}原创插画" width="400" height="260"><span>${breakoutPage?'THE BREAKOUT COLLECTION':'YOUR SOLO MOMENT'}</span></div>
${breakoutPage?'<div class="campaign-summary" id="campaign-summary"><div><strong>0<span>/100</span></strong><small>已通关</small></div><div><strong>0<span>/300</span></strong><small>星章收集</small></div></div>':''}
<div class="player-instructions"><div class="section-kicker">HOW TO PLAY</div><h2>这一局，怎么玩？</h2><p>${game.instructions}</p><div class="player-shortcuts"><span><kbd>P</kbd> 暂停 / 继续</span><span><kbd>Esc</kbd> 暂停</span></div></div>
${breakoutPage?`<section class="powerup-guide"><div class="section-kicker">CLICK IT. CATCH IT. COMBINE IT.</div><h2>八种道具，组合着玩。</h2><p>下落时直接点击，也能用挡板接住。限时效果可以叠加。</p>${Object.entries(BREAKOUT_POWERUPS).map(([id,p])=>`<div class="powerup-guide-item"><span style="--power-color:${p.color}">${p.symbol}</span><div><strong>${p.name}</strong><small>${p.description}</small></div></div>`).join('')}<div class="explosive-tip">✹ 爆破砖也会连锁爆炸。强化砖上的小圆点代表剩余耐久。</div></section>`:'<div class="player-local-note"><span data-icon="shield"></span><p>成绩、收藏和解谜进度保存在本设备。无需登录，也不打扰你的快乐。</p></div>'}
<a class="player-back-link" href="../../#library">← 回首页，发现更多游戏</a></aside></div>
<section class="player-related"><div class="section-kicker">KEEP THE GOOD TIMES GOING</div><h2>下一局，也有好心情。</h2><div>${related.map(g=>`<a href="../${g.id}/"><img src="../../assets/${g.id}.svg" alt="" width="400" height="260"><span><strong>${g.name}</strong><small>${g.description}</small></span><i>↗</i></a>`).join('')}</div></section>
<footer class="player-footer"><a href="../../">独乐. <small>SOLO ARCADE</small></a><p>一个人，也能玩得很尽兴。</p><span>免费 · 无广告 · 支持离线</span></footer></main>
<div class="toast" id="toast" role="status" aria-live="polite"></div><noscript><p class="noscript">请开启 JavaScript 来游玩。</p></noscript><script type="module" src="../../player.js"></script></body></html>`;
    const directory=path.join(pagesRoot,'play',game.id);fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'index.html'),html);
  }
  return GAMES.map(g=>`play/${g.id}/index.html`);
}
