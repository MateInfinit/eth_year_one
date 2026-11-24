'use strict';
const W=640,H=360,TS=32,HUD=40,FLOOR=322;
const cv=document.getElementById('game'),ctx=cv.getContext('2d');
const VT="'VT323','Courier New',monospace",PX="'Press Start 2P','Courier New',monospace";
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const chf=c=>(c/100).toFixed(2);

/* ---------------- input ---------------- */
const keys={},pressed={};
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',
  KeyZ:'ok',Space:'ok',Enter:'ok',KeyX:'x',KeyJ:'x',KeyC:'c',ShiftLeft:'c',ShiftRight:'c',KeyK:'c',KeyV:'v',KeyL:'v',
  Escape:'esc',Backspace:'esc',KeyP:'esc',KeyM:'m',KeyQ:'q'};
addEventListener('keydown',e=>{const k=KEYMAP[e.code];if(!k)return;e.preventDefault();if(!keys[k])pressed[k]=true;keys[k]=true;audioInit();if(k==='m'&&!e.repeat)toggleMute();});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)keys[k]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
cv.addEventListener('pointerdown',()=>{cv.focus();audioInit();});
const hit=k=>!!pressed[k],back=()=>!!(pressed.x||pressed.esc);

/* ---------------- audio ---------------- */
let AC=null,master=null,muted=false;
function audioInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:0.9;master.connect(AC.destination);music.next=AC.currentTime+0.1;}catch(e){AC=null;}}
function toggleMute(){muted=!muted;if(master)master.gain.value=muted?0:0.9;}
function osc(f,t,d,type,vol,slide){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.03);}
const tone=(f,d,type='square',vol=0.05,slide=0,delay=0)=>{if(AC)osc(f,AC.currentTime+delay,d,type,vol,slide);};
const SFX={
  blip:()=>tone(560+Math.random()*60,0.035,'square',0.025),
  select:()=>tone(880,0.05,'square',0.03),
  confirm:()=>{tone(660,0.06,'square',0.04);tone(990,0.08,'square',0.04,0,0.06);},
  coin:()=>{tone(988,0.06,'square',0.04);tone(1319,0.14,'square',0.04,0,0.06);},
  bad:()=>tone(180,0.28,'square',0.05,-90),
  door:()=>tone(260,0.14,'triangle',0.08,220),
  hit:()=>tone(150,0.22,'sawtooth',0.08,-90),
  shoot:()=>tone(1400,0.03,'square',0.012,-700),
  jump:()=>tone(420,0.1,'square',0.03,300),
  dash:()=>tone(300,0.12,'sawtooth',0.03,-150),
  parry:()=>{tone(1320,0.08,'triangle',0.09);tone(1760,0.14,'triangle',0.09,0,0.07);},
  charge:()=>tone(200,0.35,'sawtooth',0.025,260),
  boom:()=>tone(90,0.4,'sawtooth',0.07,-60),
  level:()=>[523,659,784,1047].forEach((f,i)=>tone(f,0.14,'square',0.045,0,i*0.09)),
  win:()=>[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,0.16,'square',0.05,0,i*0.11)),
  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,0.25,'triangle',0.07,0,i*0.18)),
  super:()=>tone(200,0.6,'sawtooth',0.07,900),
  bosshit:()=>tone(240,0.03,'square',0.015)
};
const NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function nf(s){const m=/^([A-G])(#|b)?(\d)$/.exec(s||'');if(!m)return 0;const midi=(+m[3]+1)*12+NOTE[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);return 440*Math.pow(2,(midi-69)/12);}
const song=(bpm,lead,bass)=>({bpm,lead:lead.trim().split(/\s+/).map(nf),bass:bass.trim().split(/\s+/).map(nf)});
const SONGS={
  title:song(84,'E5 . G5 . A5 . . G5 E5 . D5 . C5 . . . D5 . E5 . G5 . . E5 D5 . C5 . A4 . . .','C3 . . . G2 . . . A2 . . . F2 . . .'),
  campus:song(116,'C5 E5 G5 E5 A5 G5 E5 . F5 A5 C6 A5 G5 . E5 . D5 F5 A5 F5 E5 G5 C6 G5 F5 E5 D5 . C5 . . .','C3 . G2 . A2 . E2 . F2 . C3 . G2 . G2 .'),
  indoor:song(96,'A4 . C5 E5 D5 . C5 . B4 . G4 . A4 . . . F4 . A4 C5 B4 . A4 . G4 . E4 . A4 . . .','A2 . E3 . F2 . C3 . D3 . A2 . E2 . E2 .'),
  uebung:song(132,'E5 . E5 . G5 . E5 . D5 . C5 . D5 . . . E5 . E5 . G5 . A5 . G5 . E5 . D5 . . .','C3 C3 G2 G2 A2 A2 F2 F2'),
  boss:song(152,'A4 A4 C5 A4 D5 A4 E5 D5 C5 C5 E5 C5 G5 E5 D5 C5 F5 F5 A5 F5 E5 E5 G5 E5 D5 D5 C5 B4 A4 . E5 .','A2 A3 A2 A3 F2 F3 F2 F3 C3 C4 C3 C4 G2 G3 E2 E3'),
  final:song(168,'D5 F5 A5 D6 C6 A5 F5 A5 Bb5 A5 G5 F5 E5 F5 G5 E5 D5 F5 A5 D6 C6 A5 C6 E6 D6 . A5 . D5 . . .','D3 D2 D3 D2 Bb2 Bb1 Bb2 Bb1 C3 C2 C3 C2 A2 A1 A2 A1'),
  ending:song(100,'C5 E5 G5 C6 . G5 . . A5 F5 C6 . G5 . . . F5 D5 B4 G5 . F5 . E5 . D5 . C5 . . . .','C3 . G2 . F2 . C3 . F2 . G2 . C3 . . .')
};
const music={cur:null,name:'',step:0,next:0};
function playSong(n){if(music.name===n)return;music.name=n;music.cur=SONGS[n]||null;music.step=0;if(AC)music.next=AC.currentTime+0.08;}
function musicTick(){if(!AC||!music.cur)return;const s=music.cur,dt=60/s.bpm/2;if(music.next<AC.currentTime-0.3)music.next=AC.currentTime+0.05;
  while(music.next<AC.currentTime+0.15){const i=music.step,L=s.lead[i%s.lead.length],B=s.bass[i%s.bass.length];if(L)osc(L,music.next,dt*0.85,'square',0.02,0);if(B)osc(B,music.next,dt*0.9,'triangle',0.06,0);music.step++;music.next+=dt;}}

/* ---------------- drawing ---------------- */
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function txt(s,x,y,o={}){const{size=20,color='#fff',align='left',font=VT,base='top',shadow=null}=o;ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline=base;
  if(shadow){ctx.fillStyle=shadow;ctx.fillText(s,Math.round(x)+2,Math.round(y)+2);}ctx.fillStyle=color;ctx.fillText(s,Math.round(x),Math.round(y));}
function tw(s,size=20,font=VT){ctx.font=`${size}px ${font}`;return ctx.measureText(s).width;}
function wrap(s,maxW,size=20,font=VT){ctx.font=`${size}px ${font}`;const out=[];for(const para of String(s).split('\n')){let line='';for(const w of para.split(' ')){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=w;}else line=t;}out.push(line);}return out;}
function ubox(x,y,w,h,border='#fff'){rect(x,y,w,h,border);rect(x+3,y+3,w-6,h-6,'#000');}
function spr(rows,pal,x,y,s=2,flip=false,tint=null){for(let r=0;r<rows.length;r++){const row=rows[r];for(let c=0;c<row.length;c++){const ch=row[c];if(ch==='.')continue;const col=tint||pal[ch];if(!col)continue;ctx.fillStyle=col;const cx=flip?row.length-1-c:c;ctx.fillRect(Math.round(x+cx*s),Math.round(y+r*s),s,s);}}}

/* ---------------- sprites ---------------- */
const P_FRONT=["....hhhh....","..hhhhhhhh..",".hhhhhhhhhh.",".hhsssssshh.","..ssksskss..","..ssssssss..","...ssmmss...","..bbbbbbbb..",".bbbwbbwbbb.",".sbbwbbwbbs.",".sbbbbbbbbs.","..bbbbbbbb..","..pppppppp.."];
const P_BACK=["....hhhh....","..hhhhhhhh..",".hhhhhhhhhh.",".hhhhhhhhhh.","..hhhhhhhh..","..hhhhhhhh..","...ssssss...","..bbbbbbbb..",".bbbbbbbbbb.",".sbbbbbbbbs.",".sbbbbbbbbs.","..bbbbbbbb..","..pppppppp.."];
const P_SIDE=["....hhhh....","...hhhhhhh..","..hhhhhhhhh.","..hhhssssss.","..hhssssks..","..hsssssss..","...sssssm...","...bbbbbb...","..bbbbbbbb..","..bbbsbbbb..","..bbbbbbbb..","...bbbbbb...","...pppppp..."];
const LEGS_F=[["..ppp..ppp..","..ppp..ppp..","..ooo..ooo.."],["..ppp..ppp..","..ooo..ppp..","........ooo."],["..ppp..ppp..","..ppp..ooo..","..ooo......."]];
const LEGS_S=[["...ppp.pp...","...ppp.pp...","...ooo.oo..."],["..pp...pp...","..pp...pp...",".ooo...ooo.."]];
const PROF=["..hhhhhhhh..",".hhhhhhhhhh.","hhhhhhhhhhhh",".hhsssssshh.",".hgggssgggh.","..gkgssgkg..","..ssssssss..","...shhhhs...","..cccttccc..",".ccccttcccc.",".scccttcccs.",".sccccccccs.","..cccccccc..","..pppppppp..","..ppp..ppp..","..ooo..ooo.."];
const PROF_F=["...hhhhhh...","..hhhhhhhh..",".hhhhhhhhhh.",".hhsssssshh.",".hgggssgggh.",".hgkgssgkgh.",".hhssmmsshh.",".hh.ssss.hh.",".hcccttccch.",".ccccttcccc.",".scccttcccs.",".sccccccccs.","..cccccccc..","..cccccccc..","..ppp..ppp..","..ooo..ooo.."];
const PROF_B=["............","...ssssss...","..ssssssss..",".hssssssssh.",".hgggssgggh.","..gkgssgkg..","..sshhhhss..","...ssmmss...","..cccttccc..",".ccccttcccc.",".scccttcccs.",".sccccccccs.","..cccccccc..","..pppppppp..","..ppp..ppp..","..ooo..ooo.."];
const PROF_SPR={m:PROF,f:PROF_F,b:PROF_B};
const HEART=[".rr.rr.","rrrrrrr","rrrrrrr",".rrrrr.","..rrr..","...r..."];
const mkPal=(h,b,p='#2b2b38',s='#f2c7a5')=>({h,s,k:'#1a1a1a',m:'#c96a6a',b,w:'#e8e8e8',p,o:'#111'});
const profPal=(h,c,t,s='#f2c7a5')=>({h,s,g:'#8a939b',k:'#1a1a1a',m:'#b5574f',c,t,p:'#2b2b38',o:'#111'});
const PAL={player:mkPal('#3b2a1e','#1f407a')};
function drawChar(pal,dir,frame,x,y,s=2){const side=dir==='left'||dir==='right';const body=dir==='up'?P_BACK:dir==='down'?P_FRONT:P_SIDE;const legs=side?LEGS_S[frame%2]:LEGS_F[frame%3];
  const ox=x-6*s,oy=y-16*s,fl=dir==='left';rect(x-5*s,y-s,10*s,s+1,'rgba(0,0,0,.25)');spr(body,pal,ox,oy,s,fl);spr(legs,pal,ox,oy+13*s,s,fl);}
function drawHeart(x,y,s=2,c='#ff4d6d'){spr(HEART,{r:c},x,y,s);}

/* ---------------- save ---------------- */
const SKEY='ethYearOne.v1';
function saveGame(){try{localStorage.setItem(SKEY,JSON.stringify(G));return true;}catch(e){return false;}}
function loadSave(){try{const s=localStorage.getItem(SKEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SKEY);}catch(e){}}

/* ---------------- game state ---------------- */
function newGame(){return{week:1,ap:3,level:1,xp:0,ects:0,sanity:80,money:3000,beers:0,buff:false,beaten:{},passed:false,view:0,free:{day:-1,coffee:0,beer:false},freeBeerDay:-99,lm:{},
  map:'campus',x:9*TS+16,y:5*TS+28,dir:'down',talk:{},stats:{beers:0,coffees:0,ubungen:0,wins:0,losses:0,shifts:0,grades:[]}};}
let G=newGame(),scene=null,dlg=null,fade=null,lock=false,last=0;
const XP_T=[60,150,270,420,600,800,1050,1350];
const levelFor=xp=>{let l=1;for(const t of XP_T)if(xp>=t)l++;return l;};
const nextXP=()=>{for(const t of XP_T)if(G.xp<t)return t;return'MAX';};
const hpFor=l=>3+Math.floor((l-1)/2);
function setScene(s){scene=s;playSong(s.music||'');}
function fadeTo(fn){fade={a:fade?fade.a:0,dir:1,fn};}
function updFade(dt){fade.a+=dt*4.5*fade.dir;if(fade.dir>0&&fade.a>=1){fade.a=1;const f=fade.fn;fade.fn=null;fade.dir=-1;if(f)f();}else if(fade.dir<0&&fade.a<=0){fade=null;}}
function flow(fn){lock=true;Promise.resolve().then(fn).catch(e=>console.error(e)).finally(()=>{lock=false;});}

/* ---------------- dialogue ---------------- */
function setLine(d,s){d.lines=wrap(s,560,21);d.full=d.lines.join(' ');d.len=d.full.length;d.shown=0;}
function say(lines,speaker=null){if(!Array.isArray(lines))lines=[lines];lines=lines.filter(Boolean);if(!lines.length)return Promise.resolve();
  return new Promise(res=>{dlg={queue:lines.slice(1),speaker,res,choices:null,sel:0};setLine(dlg,lines[0]);});}
function ask(text,choices,speaker=null){return new Promise(res=>{dlg={queue:[],speaker,res,choices,sel:0};setLine(dlg,text);});}
function updDlg(dt){const d=dlg;
  if(d.shown<d.len){const before=Math.floor(d.shown);d.shown=Math.min(d.len,d.shown+dt*(keys.c?140:50));const now=Math.floor(d.shown);
    if(now!==before&&before%2===0&&d.full[before]!==' ')SFX.blip();if(hit('ok')||(back()&&!d.choices))d.shown=d.len;return;}
  if(d.choices){const n=d.choices.length;if(hit('up')){d.sel=(d.sel+n-1)%n;SFX.select();}if(hit('down')){d.sel=(d.sel+1)%n;SFX.select();}
    if(hit('ok')){SFX.confirm();const r=d.res,s=d.sel;dlg=null;r(s);}else if(back()){SFX.select();const r=d.res;dlg=null;r(n-1);}return;}
  if(hit('ok')||back()){if(d.queue.length)setLine(d,d.queue.shift());else{const r=d.res;dlg=null;r();}}}
function drawDlg(){const d=dlg,x=20,y=244,w=600,h=108;ubox(x,y,w,h);
  if(d.speaker){const sw=tw(d.speaker,20)+22;ubox(x+10,y-27,sw,29);txt(d.speaker,x+21,y-23,{size:20,color:'#ffd166'});}
  let left=Math.floor(d.shown);d.lines.forEach((ln,i)=>{if(left<=0)return;txt(ln.slice(0,left),x+18,y+12+i*23,{size:21});left-=ln.length+1;});
  if(d.shown>=d.len){if(d.choices){const cw=Math.max(...d.choices.map(c=>tw(c,20)))+56,chh=d.choices.length*26+18,cx=W-20-cw,cy=y-chh-4;
      ubox(cx,cy,cw,chh);d.choices.forEach((c,i)=>{txt(c,cx+36,cy+9+i*26,{size:20,color:i===d.sel?'#ffd166':'#fff'});if(i===d.sel)drawHeart(cx+13,cy+14+i*26,2);});}
    else if(Math.floor(performance.now()/300)%2)txt('▼',x+w-26,y+h-26,{size:18,color:'#ffd166'});}}
