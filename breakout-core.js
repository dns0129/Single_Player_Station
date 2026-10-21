export const BREAKOUT_WORLDS = [
  {name:'薄荷初航',color:'#bce59b',background:'#14251d',tip:'先熟悉反弹角度，用挡板边缘把球送向两侧。'},
  {name:'珊瑚海湾',color:'#efad96',background:'#2a2022',tip:'强化砖需要多次击中，试着绕到砖阵上方。'},
  {name:'暮紫回廊',color:'#c2a8e6',background:'#241f32',tip:'红色爆破砖会连锁炸开周围的砖块。'},
  {name:'霜蓝轨道',color:'#98cce5',background:'#172632',tip:'多球配合穿透球，能很快打开一条通路。'},
  {name:'流金沙丘',color:'#e8cc8e',background:'#2b281b',tip:'点击掉落道具即可拾取，不必追着它移动挡板。'},
  {name:'机械花园',color:'#98cbb5',background:'#192a29',tip:'留意强化砖的耐久点；爆炸可以同时削弱一大片。'},
  {name:'炽焰工坊',color:'#ee9a79',background:'#302019',tip:'拾到爆炸球后，按 E 或点击「引爆」主动制造爆炸。'},
  {name:'极光裂隙',color:'#a5d5d4',background:'#182a30',tip:'减速与底部护盾可以帮你守住快速反弹的球。'},
  {name:'星尘迷宫',color:'#c3b4e9',background:'#221d32',tip:'穿透、爆炸、多球能够叠加，抓住道具组合的时机。'},
  {name:'终焉星环',color:'#f0dca0',background:'#282719',tip:'每一关都能独立挑战；收集最后一枚通关星章吧。'},
];
export const BREAKOUT_POWERUPS = {
  wide:{name:'延长挡板',symbol:'↔',color:'#bce59b',description:'挡板变宽，持续 16 秒',duration:16},
  multi:{name:'三重球',symbol:'⋮',color:'#a7d5ed',description:'分裂出额外弹球，最多 7 颗'},
  blast:{name:'爆炸球',symbol:'✹',color:'#f1ad7c',description:'撞砖引发范围爆炸，并获得 3 次主动引爆',duration:15},
  pierce:{name:'穿透球',symbol:'↟',color:'#cfb3f1',description:'弹球直接穿过砖块，持续 12 秒',duration:12},
  slow:{name:'慢速时间',symbol:'◷',color:'#9cd8d1',description:'弹球减速，持续 14 秒',duration:14},
  shield:{name:'底部护盾',symbol:'⌑',color:'#9ebee9',description:'在底部增加一次救球护盾，最多 3 层'},
  life:{name:'额外生命',symbol:'♡',color:'#f3a6b0',description:'增加一次机会，最多 5 次'},
  double:{name:'双倍积分',symbol:'×2',color:'#ead38b',description:'击碎砖块获得双倍分数，持续 15 秒',duration:15},
};
const BK_FORMATIONS=['启程','双翼','拾级而上','菱形之心','回声走廊','连绵山峦','蜂巢','流星雨','箭头阵列','星环'];
const BK_PATTERN_TESTS = [
  (x,y,c,r,w)=>y<r-1&&((x+y+w)%5!==0||y<2),
  (x,y,c,r,w)=>Math.abs(x-(c-1)/2)>1+(y+w%2)%3||y===0,
  (x,y,c,r,w)=>(x+(w%3))%c<=Math.floor(y*c/r)||y===r-1,
  (x,y,c,r,w)=>Math.abs(x-4.5)/5+Math.abs(y-(r-1)/2)/(r/2)<1.15+w*.025,
  (x,y,c,r,w)=>y===0||y===r-1||x===w%3||x===c-1-w%3||y===Math.floor(r/2)&&x%3!==w%3,
  (x,y,c,r,w)=>y>=Math.abs((x+w)%6-2.5)*.8&&y<r-((x+w)%3===0?1:0),
  (x,y,c,r,w)=>(x+y+w)%3!==0&&!(x===0&&y%2===0)&&!(x===c-1&&y%2===1),
  (x,y,c,r,w)=>(x*3+y*2+w)%7<4||x===(y+w)%c,
  (x,y,c,r,w)=>Math.abs(x-4.5)<=y*.9+w%2&&Math.abs(x-4.5)>=Math.max(0,y*.9-2.3),
  (x,y,c,r,w)=>{const d=((x-4.5)/4.7)**2+((y-(r-1)/2)/(r/2))**2;return d<1.12&&d>.22+w*.015;},
];
export function createBreakoutLevel(number){
  if(!Number.isInteger(number)||number<1||number>100)throw new RangeError('关卡必须在 1–100 之间');
  const world=Math.floor((number-1)/10),formation=(number-1)%10,rows=5+Math.floor(world/2),cols=10;
  const bricks=[];const bw=51,bh=22,gap=5,x0=(600-cols*bw-(cols-1)*gap)/2;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const x=world%2?cols-1-col:col;
    if(!BK_PATTERN_TESTS[formation](x,row,cols,rows,world))continue;
    // A different small gap pattern in every chapter keeps repeated formations distinct.
    if(row>0&&(col*11+row*7+number*3)%23===0)continue;
    const explosive=number>=21&&(col*5+row*3+number)%13===0;
    const hp=explosive?1:number>=61&&(col+row+number)%5===0?3:number>=11&&(col*2+row+world)%4===0?2:1;
    bricks.push({id:`${row}:${col}`,x:x0+col*(bw+gap),y:94+row*(bh+gap),w:bw,h:bh,hp,maxHp:hp,kind:explosive?'explosive':hp>1?'armor':'normal',row,col});
  }
  return{number,world:world+1,chapter:BREAKOUT_WORLDS[world],name:`${BREAKOUT_WORLDS[world].name} · ${BK_FORMATIONS[formation]}`,formation:BK_FORMATIONS[formation],speed:265+(number-1)*1.35,bricks};
}
export const BREAKOUT_LEVELS=Array.from({length:100},(_,i)=>createBreakoutLevel(i+1));
export function readBreakoutProgress(value){
  const base={version:2,level:1,completed:[],stars:{},best:{}};
  if(!value||value.version!==2)return base;
  if(Number.isInteger(value.level)&&value.level>=1&&value.level<=100)base.level=value.level;
  if(Array.isArray(value.completed))base.completed=[...new Set(value.completed.filter(n=>Number.isInteger(n)&&n>=1&&n<=100))];
  for(const n of base.completed){const star=Number(value.stars?.[n]);base.stars[n]=Number.isInteger(star)?Math.max(1,Math.min(3,star)):1;const score=Number(value.best?.[n]);base.best[n]=Number.isFinite(score)?Math.max(0,Math.floor(score)):0;}
  return base;
}
export function completeBreakoutLevel(progress,number,score,lives){
  const next=readBreakoutProgress(progress),stars=lives>=3?3:lives===2?2:1;
  if(!next.completed.includes(number))next.completed.push(number);
  next.stars[number]=Math.max(next.stars[number]||0,stars);next.best[number]=Math.max(next.best[number]||0,Math.floor(score));next.level=Math.min(100,number+1);
  return next;
}
export class BreakoutEngine {
  constructor(number=1,rng=Math.random){this.rng=rng;this.width=600;this.height=700;this.reset(number);}
  reset(number){this.level=createBreakoutLevel(number);this.bricks=this.level.bricks.map(b=>({...b}));this.score=0;this.lives=3;this.shields=0;this.charges=0;this.paddle={x:300,y:646,width:100};this.balls=[this.newBall(300,635,Math.PI*-.35)];this.drops=[];this.effects={};this.events=[];this.mode='ready';this.time=0;this.dropped=0;this.dropId=0;this.lastHit=0;}
  newBall(x,y,angle=-Math.PI/2){return{x,y,vx:Math.cos(angle)*this.level.speed,vy:Math.sin(angle)*this.level.speed,r:7,contacts:new Map()};}
  emit(type,data={}){this.events.push({type,...data});}
  takeEvents(){const events=this.events;this.events=[];return events;}
  launch(){if(this.mode!=='ready')return false;this.mode='running';const b=this.balls[0];b.x=this.paddle.x;b.y=this.paddle.y-b.r-1;b.vx=this.level.speed*.38;b.vy=-this.level.speed*Math.sqrt(1-.38**2);this.emit('launch');return true;}
  setPaddle(x){this.paddle.x=Math.max(this.paddle.width/2+4,Math.min(596-this.paddle.width/2,x));if(this.mode==='ready'){this.balls[0].x=this.paddle.x;this.balls[0].y=this.paddle.y-this.balls[0].r-1;}}
  award(points){const awarded=points*(this.effects.double>0?2:1);this.score+=awarded;this.emit('score',{score:this.score});}
  damageBrick(brick,damage=1,allowChain=true){
    if(brick.hp<=0)return false;brick.hp-=damage;this.emit('hit',{x:brick.x+brick.w/2,y:brick.y+brick.h/2,color:brick.kind==='explosive'?'#f3a77c':this.level.chapter.color});
    if(brick.hp>0)return false;brick.hp=0;this.award(30*brick.maxHp);this.lastHit=this.time;
    const guaranteed=this.dropped===0;const chance=this.rng()<.22;
    if(guaranteed||chance){const kinds=Object.keys(BREAKOUT_POWERUPS),kind=guaranteed?kinds[(this.level.number-1)%kinds.length]:kinds[Math.floor(this.rng()*kinds.length)];this.spawnDrop(kind,brick.x+brick.w/2,brick.y+brick.h/2);this.dropped++;}
    if(brick.kind==='explosive'&&allowChain)this.explode(brick.x+brick.w/2,brick.y+brick.h/2,92,1,new Set([brick.id]));
    return true;
  }
  explode(x,y,radius=100,damage=1,visited=new Set()){
    this.emit('explode',{x,y,radius});
    for(const brick of this.bricks){if(brick.hp<=0||visited.has(brick.id)||Math.hypot(brick.x+brick.w/2-x,brick.y+brick.h/2-y)>radius)continue;visited.add(brick.id);const chain=brick.kind==='explosive';this.damageBrick(brick,damage,false);if(chain&&brick.hp===0)this.explode(brick.x+brick.w/2,brick.y+brick.h/2,92,1,visited);}
  }
  spawnDrop(kind,x,y){const drop={id:++this.dropId,kind,x,y,vy:64+this.level.number*.24};this.drops.push(drop);this.emit('drop',{drop:{...drop}});return drop;}
  collect(id){
    if(this.mode!=='running'&&this.mode!=='ready')return false;const index=this.drops.findIndex(d=>d.id===id);if(index<0)return false;
    const drop=this.drops.splice(index,1)[0],power=BREAKOUT_POWERUPS[drop.kind];if(!power)return false;
    if(power.duration)this.effects[drop.kind]=Math.min(30,(this.effects[drop.kind]||0)+power.duration);
    if(drop.kind==='wide'){this.paddle.width=164;this.setPaddle(this.paddle.x);}
    if(drop.kind==='blast')this.charges=Math.min(9,this.charges+3);
    if(drop.kind==='multi'){const source=this.balls[0];if(source)for(const angle of[-.48,.48]){if(this.balls.length>=7)break;const base=Math.atan2(source.vy,source.vx)+angle;this.balls.push(this.newBall(source.x,source.y,base));}}
    if(drop.kind==='shield')this.shields=Math.min(3,this.shields+1);
    if(drop.kind==='life')this.lives=Math.min(5,this.lives+1);
    this.award(15);this.emit('collect',{kind:drop.kind,name:power.name,x:drop.x,y:drop.y});return true;
  }
  detonate(){if(this.mode!=='running'||this.charges<=0)return false;this.charges--;for(const ball of this.balls)this.explode(ball.x,ball.y,115,2);this.checkWin();return true;}
  checkWin(){if(this.mode==='won'||this.mode==='lost'||this.bricks.some(b=>b.hp>0))return false;this.mode='won';this.award(this.lives*100);this.emit('win',{score:this.score,lives:this.lives,number:this.level.number});return true;}
  step(dt){
    if(this.mode!=='running')return;dt=Math.max(0,Math.min(.04,dt));this.time+=dt;
    for(const key of Object.keys(this.effects)){this.effects[key]=Math.max(0,this.effects[key]-dt);if(this.effects[key]===0)delete this.effects[key];}
    this.paddle.width=this.effects.wide?164:100;this.setPaddle(this.paddle.x);
    const scale=this.effects.slow ? .72 : 1;
    for(const ball of this.balls){
      const steps=Math.max(1,Math.ceil(Math.hypot(ball.vx,ball.vy)*dt*scale/5)),slice=dt/steps*scale;
      for(let s=0;s<steps;s++){
        const oldX=ball.x,oldY=ball.y;ball.x+=ball.vx*slice;ball.y+=ball.vy*slice;
        if(ball.x<ball.r){ball.x=ball.r;ball.vx=Math.abs(ball.vx);}if(ball.x>600-ball.r){ball.x=600-ball.r;ball.vx=-Math.abs(ball.vx);}
        if(ball.y<42+ball.r){ball.y=42+ball.r;ball.vy=Math.abs(ball.vy);}
        if(ball.vy>0&&oldY+ball.r<=this.paddle.y+4&&ball.y+ball.r>=this.paddle.y&&Math.abs(ball.x-this.paddle.x)<=this.paddle.width/2+ball.r){
          const offset=Math.max(-1,Math.min(1,(ball.x-this.paddle.x)/(this.paddle.width/2))),angle=offset*1.12,speed=this.level.speed;ball.y=this.paddle.y-ball.r;ball.vx=Math.sin(angle)*speed;ball.vy=-Math.cos(angle)*speed;this.emit('bounce',{x:ball.x,y:ball.y});
        }
        if(ball.vy>0&&this.shields>0&&ball.y+ball.r>=681){ball.y=681-ball.r;ball.vy=-Math.abs(ball.vy);this.shields--;this.emit('shield',{x:ball.x,y:681});}
        for(const brick of this.bricks){
          if(brick.hp<=0||ball.x+ball.r<brick.x||ball.x-ball.r>brick.x+brick.w||ball.y+ball.r<brick.y||ball.y-ball.r>brick.y+brick.h)continue;
          if((ball.contacts.get(brick.id)||-10)>this.time-.1)continue;ball.contacts.set(brick.id,this.time);
          this.damageBrick(brick);if(this.effects.blast)this.explode(ball.x,ball.y,91,1,new Set([brick.id]));
          if(!this.effects.pierce){if(oldY+ball.r<=brick.y){ball.y=brick.y-ball.r;ball.vy=-Math.abs(ball.vy);}else if(oldY-ball.r>=brick.y+brick.h){ball.y=brick.y+brick.h+ball.r;ball.vy=Math.abs(ball.vy);}else if(oldX<brick.x){ball.x=brick.x-ball.r;ball.vx=-Math.abs(ball.vx);}else{ball.x=brick.x+brick.w+ball.r;ball.vx=Math.abs(ball.vx);}break;}
        }
      }
      // Avoid an almost horizontal ball taking minutes to reach the next row.
      if(Math.abs(ball.vy)<this.level.speed*.22){const sy=ball.vy<0?-1:1;ball.vy=sy*this.level.speed*.22;ball.vx=Math.sign(ball.vx||1)*Math.sqrt(this.level.speed**2-ball.vy**2);}
    }
    for(const drop of [...this.drops]){drop.y+=drop.vy*dt;if(drop.y>=this.paddle.y-16&&drop.y<=this.paddle.y+22&&Math.abs(drop.x-this.paddle.x)<this.paddle.width/2+16)this.collect(drop.id);}
    this.drops=this.drops.filter(d=>d.y<724);this.balls=this.balls.filter(b=>b.y<724);
    // Clear wins before checking misses, including a final hit made by the last ball.
    if(this.checkWin())return;
    if(!this.balls.length){this.lives--;this.drops=[];this.effects={};this.paddle.width=100;this.charges=0;if(this.lives<=0){this.mode='lost';this.emit('gameover',{score:this.score});}else{this.mode='ready';this.balls=[this.newBall(this.paddle.x,this.paddle.y-8)];this.emit('life',{lives:this.lives});}}
  }
}
