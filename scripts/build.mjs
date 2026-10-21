import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import './assets.mjs';
import {generateGamePages} from './pages.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const playerPages=generateGamePages();
const assets={};
for(const name of fs.readdirSync(path.join(root,'assets'))){const mime=name.endsWith('.svg')?'image/svg+xml':'image/png';assets[name]=`data:${mime};base64,${fs.readFileSync(path.join(root,'assets',name)).toString('base64')}`;}
const sharedModules=['core.js','ui.js','state.js','breakout-core.js','breakout.js','games.js'];
function bundleHTML(html,entry,multipage=false){const js=[...sharedModules,entry].map(name=>read(name).replace(/^import .*?;\s*$/gm,'').replace(/^export /gm,'')).join('\n');let result=html.replace(/<link rel="manifest"[^>]*>/,'').replace(/<link rel="stylesheet"[^>]*>/,`<style>${read('styles.css')}</style>`).replace(/<script type="module" src="[^"]+"><\/script>/,`<script>globalThis.__SOLO_BUNDLE__=true;globalThis.__SOLO_MULTIPAGE__=${multipage};globalThis.__SOLO_ASSETS__=${JSON.stringify(assets)};</script><script type="module">${js.replace(/<\/script/gi,'<\\/script')}</script>`);result=result.replace(/(?:src|href)="(?:\.\/|\.\.\/\.\.\/)assets\/([^"]+)"/g,(all,name)=>assets[name]?`${all.slice(0,all.indexOf('='))}="${assets[name]}"`:all);if(multipage&&entry==='player.js'){result=result.replace(/href="\.\.\/\.\.\/(?:#library)?"/g,'href="../../首页.html#library"').replace(/href="\.\.\/([a-z0-9]+)\/"/g,'href="../$1/index.html"');}return result;}
const standalone=bundleHTML(read('index.html'),'app.js');
fs.writeFileSync(path.join(root,'offline.html'),standalone);
const crc32=buffer=>{let c=0xffffffff;for(const b of buffer){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;};
function zip(entries){const locals=[],central=[];let offset=0;for(const[name,content]of entries){const file=Buffer.from(name),raw=Buffer.from(content),compressed=zlib.deflateRawSync(raw),crc=crc32(raw),header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x0800,6);header.writeUInt16LE(8,8);header.writeUInt16LE(0x5d55,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(raw.length,22);header.writeUInt16LE(file.length,26);locals.push(header,file,compressed);const dir=Buffer.alloc(46);dir.writeUInt32LE(0x02014b50);dir.writeUInt16LE(20,4);dir.writeUInt16LE(20,6);dir.writeUInt16LE(0x0800,8);dir.writeUInt16LE(8,10);dir.writeUInt16LE(0x5d55,14);dir.writeUInt32LE(crc,16);dir.writeUInt32LE(compressed.length,20);dir.writeUInt32LE(raw.length,24);dir.writeUInt16LE(file.length,28);dir.writeUInt32LE(offset,42);central.push(dir,file);offset+=header.length+file.length+compressed.length;}const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...locals,directory,end]);}
fs.mkdirSync(path.join(root,'downloads'),{recursive:true});
const offlineEntries=[['首页.html',bundleHTML(read('index.html'),'app.js',true)],...playerPages.map(name=>[name,bundleHTML(read(name),'player.js',true)]),['使用说明.txt','独乐 SOLO ARCADE · 独立页面离线版\n\n完整解压后，双击「首页.html」。每款游戏都有独立页面；页面内已嵌入全部代码与图片，不需要服务器或网络。请保留 play 文件夹，首页与游戏页会互相跳转。\n\n打砖块现有 100 个关卡、8 种道具与自动进度保存。道具可以直接点击，也可以用挡板接住；空格发球，E 引爆。\n\n手机和 iPad 建议访问在线网站并添加到主屏幕，等待「离线已就绪」后断网。\n成绩与收藏保存在本机。文件模式的存储支持因浏览器而异，记录不一定跨页面共享；在线网站和已安装 PWA 不受此文件模式差异影响。\n\n项目源码：https://github.com/dns0129/Single_Player_Station\n']];
fs.writeFileSync(path.join(root,'downloads/solo-arcade-offline.zip'),zip(offlineEntries));
const version=crypto.createHash('sha256').update(['index.html','styles.css',...sharedModules,'app.js','player.js','manifest.webmanifest',...playerPages,...fs.readdirSync(path.join(root,'assets')).map(n=>`assets/${n}`)].map(n=>fs.readFileSync(path.join(root,n))).reduce((a,b)=>Buffer.concat([a,b]),Buffer.alloc(0))).digest('hex').slice(0,12);
fs.writeFileSync(path.join(root,'sw.js'),read('sw.js').replace(/const CACHE='solo-arcade-[^']+';/,`const CACHE='solo-arcade-${version}';`));
console.log(`Built homepage + ${playerPages.length} game pages, single-file fallback (${Math.round(Buffer.byteLength(standalone)/1024)} KB), independent-page offline ZIP and cache ${version}.`);
