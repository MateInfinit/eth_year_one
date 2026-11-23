/* ---------------- maps ---------------- */
const MAPS={
  campus:{name:'ETH Zentrum · Polyterrasse',music:'campus',outdoor:true,pano:true,theme:{},
    rows:["FFFFFFFFFDFFFFFFFFFF","F,,T,,,,,=,,,,,,T,,F","D==================D","F,,,,,,,,=,,,,,,,,,F","F,T,,,,,,=,,,,,,,T,F","F,,,,,,,,=,,,,,,,,,F","F==================F","F===B========B=====F","^^^^^^^^^^^^^^^^^^^^","~~~~~~~~~~~~~~~~~~~~"],
    doors:{'9,0':['hg',9,8,'up'],'0,2':['cab',18,5,'left'],'19,2':['mensa',1,5,'right']},
    signs:[[9,0,'HG'],[0,1,'CAB'],[19,1,'MENSA']]},
  hg:{name:'HG · Hauptgebäude',music:'indoor',theme:{f1:'#e6dfd2',f2:'#d9d1c2',wall:'#a39276',trim:'#7d6f59',hi:'#b8a88c',table:'#8b5a2b'},
    rows:["####E####N####E#####","#L................L#","#..p............p..#","#..................#","#..................#","#..................#","#..................#","#p................p#","#..................#","#########D##########"],
    doors:{'9,9':['campus',9,1,'down']},signs:[[4,0,'HG F1'],[14,0,'EXAM']]},
  cab:{name:'CAB · Computer Science',music:'indoor',theme:{f1:'#cfd5dc',f2:'#c3cad2',wall:'#34465c',trim:'#243243',hi:'#46607d',table:'#eceff1'},
    rows:["#####E######E#######","#..................#","#.SS.........V.....#","#..................#","#..tt..........tt..#","#..................D","#..tt..........tt..#","#..................#","#p......L..L......p#","####################"],
    doors:{'19,5':['campus',1,2,'right']},signs:[[5,0,'ÜBUNG'],[12,0,'LECTURE']]},
  mensa:{name:'Polymensa',music:'indoor',theme:{f1:'#e0cba6',f2:'#d4bd96',wall:'#8a5a3c',trim:'#6b4430',hi:'#a06d4c',table:'#a0703f'},
    rows:["####################","#MMMMMMMM....C...J.#","#..................#","#..tttt....tttt....#","#..................#","D..................#","#..tttt....tttt....#","#..................#","#p................p#","####################"],
    doors:{'0,5':['campus',18,2,'left']},signs:[]}
};
const SOLID=new Set('#F^~TLpStVMCJNEB'.split(''));
const INTERACT=new Set('VCMJNBELTSp^~t'.split(''));
const NPCS=[
  {id:'exch',map:'campus',c:6,r:3,name:'Exchange student',pal:mkPal('#d9b13b','#2e8b57'),dir:'down',lines:[
    ["Grüezi! Three weeks here and I still can't find my lecture hall.","Is it in the basement? Everything here is in the basement."],
    ["My Swiss German so far: 'Merci vilmal' and 'Chuchichäschtli'.","I use the second one for everything. Nobody has corrected me yet."]]},
  {id:'senior',map:'campus',c:13,r:4,name:'Third-year student',pal:mkPal('#1c1c1c','#7a3b3b'),dir:'left',lines:[
    ["Basisprüfung? Oh, you'll be fine.","...","(They stare into the distance for ten full seconds.)"],
    ["Pro tip: Übungen in CAB give XP. Professors only respect levels.","And higher levels give you more HP in fights."],
    ["Never trust a TA who says 'this one is easy'.","That's how they got me in week 4."]]},
  {id:'tourist',map:'campus',c:11,r:7,name:'Tourist',pal:mkPal('#a0522d','#e67e22','#3b5b8a'),dir:'down',lines:[
    ["What a view! The whole city, the lake, the Alps...","This terrace is the only thing at ETH without a deadline."],
    ["When your week is done, sit on one of the benches here.","Sleeping is a valid strategy. Ask any student."]]},
  {id:'lost',map:'hg',c:6,r:5,name:'Lost freshman',pal:mkPal('#5a3b22','#16a085'),dir:'down',lines:[
    ["Which way is lecture hall F1? I've passed this staircase six times.","This building is a maze designed by someone who hated freshmen."],
    ["I asked a professor for directions.","He said: 'It is left as an exercise.'"]]},
  {id:'stress',map:'hg',c:13,r:3,name:'Stressed student',pal:mkPal('#2b2b2b','#8e44ad'),dir:'left',lines:[
    ["I just proved P = NP!","...wait. I proved 1 = 1.","That still counts for partial credit, right?"],
    ["The big door on the right is the exam room.","It only opens once all five professors are defeated.","Like a boss rush. Because it is one."]]},
  {id:'ta',map:'cab',c:7,r:1,name:'TA',pal:mkPal('#c0392b','#f39c12'),dir:'down',lines:[
    ["Hi! I'm your TA. The Übungsraum is the door on the left.","Today's exercise is easy. It says so on the sheet."],
    ["If you don't understand something, just ask!","(Nobody has ever asked.)"],
    ["The lecture hall door on the right: Prof. Null and Prof. Gate teach there.","The others are in HG."]]},
  {id:'sleeper',map:'cab',c:3,r:3,name:'Sleeping student',pal:mkPal('#6b4a2b','#95a5a6'),dir:'down',lines:[
    ["Zzz... the induction step... holds for n+1... zzz"],
    ["Zzz... five more minutes... then I'll start the exercise sheet... zzz"]]},
  {id:'debug',map:'cab',c:17,r:4,name:'Debugging student',pal:mkPal('#111111','#34495e'),dir:'left',lines:[
    ["It works on my machine.","My machine is the only machine that matters."],
    ["I've been staring at this NullPointerException since Tuesday.","I think it's staring back."]]},
  {id:'queue',map:'mensa',c:6,r:2,name:'Student in the queue',pal:mkPal('#8a5a2b','#c0392b'),dir:'up',lines:[
    ["I've been in this queue since the first lecture.","Time moves differently in the Mensa line."]]},
  {id:'mathguy',map:'mensa',c:13,r:4,name:'Math student',pal:mkPal('#e0c068','#2c3e50'),dir:'left',lines:[
    ["Mensa theorem: Menu 1 ∪ Menu 2 = pasta.","Proof: by observation, every single day."],
    ["The coffee machine eats coins with probability ¼.","I collected data. I have nothing else in my life."]]}
];
const npcAt=(m,c,r)=>NPCS.find(n=>n.map===m&&n.c===c&&n.r===r);
const tileAt=(m,c,r)=>{const rows=MAPS[m].rows;return r>=0&&r<rows.length&&c>=0&&c<rows[r].length?rows[r][c]:null;};
function solidAt(px,py){const c=Math.floor(px/TS),r=Math.floor(py/TS),ch=tileAt(G.map,c,r);if(ch===null)return true;return SOLID.has(ch)||!!npcAt(G.map,c,r);}
const blocked=(x,y)=>solidAt(x-7,y-8)||solidAt(x+7,y-8)||solidAt(x-7,y-1)||solidAt(x+7,y-1);

/* ---------------- tiles ---------------- */
function drawTile(m,ch,c,r){const x=c*TS,y=HUD+r*TS,T=m.theme;
  const floor=()=>{if(m.outdoor){rect(x,y,TS,TS,'#5b8f3a');rect(x+((c*11+r*5)%26)+2,y+((c*3+r*17)%26)+2,2,2,'#79b24f');rect(x+((c*5+r*13)%26)+3,y+((c*13+r*7)%26)+3,2,2,'#4b7a2f');}else rect(x,y,TS,TS,(c+r)%2?T.f1:T.f2);};
  const cobble=()=>{rect(x,y,TS,TS,'#bdb5a6');rect(x,y+15,TS,2,'#a8a091');rect(x+(r%2?6:22),y,2,15,'#a8a091');rect(x+(r%2?22:6),y+17,2,15,'#a8a091');};
  switch(ch){
    case ',':case '.':floor();break;
    case '=':cobble();break;
    case 'T':floor();rect(x+13,y+18,6,13,'#6b4a2b');rect(x+4,y+3,24,17,'#2f6b2a');rect(x+8,y-1,16,24,'#2f6b2a');rect(x+9,y+3,8,6,'#3f8a35');break;
    case 'F':rect(x,y,TS,TS,'#d9d0bf');rect(x,y+TS-3,TS,3,'#b3a994');rect(x+8,y+6,16,18,'#3e5770');rect(x+8,y+6,16,3,'#2b3e52');rect(x+15,y+6,2,18,'#cfc6b4');break;
    case 'D':rect(x,y,TS,TS,m.outdoor?'#d9d0bf':T.wall);rect(x+4,y+2,24,30,'#3b2616');rect(x+6,y+4,20,28,'#7a5032');rect(x+15,y+4,2,28,'#5a3a22');rect(x+20,y+18,3,3,'#e0c068');break;
    case 'E':rect(x,y,TS,TS,T.wall);rect(x+2,y+2,28,30,'#2e1d10');rect(x+4,y+4,11,28,'#5e3b22');rect(x+17,y+4,11,28,'#5e3b22');rect(x+6,y+10,7,8,'#9fc3e0');rect(x+19,y+10,7,8,'#9fc3e0');break;
    case '#':rect(x,y,TS,TS,T.wall);rect(x,y,TS,3,T.hi);rect(x,y+TS-5,TS,5,T.trim);break;
    case '^':cobble();rect(x,y+8,TS,3,'#2c2c34');for(let i=2;i<TS;i+=8)rect(x+i,y+8,2,20,'#2c2c34');rect(x,y+26,TS,3,'#2c2c34');break;
    case '~':break;
    case 'L':floor();rect(x+2,y+1,28,30,'#5a3b22');for(let i=0;i<3;i++){rect(x+4,y+4+i*9,24,7,'#2e1d10');for(let j=0;j<5;j++)rect(x+5+j*5,y+5+i*9,4,6,['#c0392b','#2980b9','#27ae60','#f1c40f','#8e44ad'][(j+i+c)%5]);}break;
    case 'p':floor();rect(x+10,y+20,12,10,'#a0522d');rect(x+8,y+6,16,15,'#3f8a35');rect(x+12,y+2,8,8,'#4fa043');break;
    case 'S':floor();rect(x,y+8,TS,20,'#8e3434');rect(x,y+4,TS,10,'#a84444');rect(x+2,y+14,TS-4,8,'#b85454');break;
    case 't':floor();rect(x+2,y+8,30,18,'rgba(0,0,0,.18)');rect(x,y+4,TS,18,T.table);rect(x+2,y+22,3,8,'#555');rect(x+27,y+22,3,8,'#555');break;
    case 'V':floor();rect(x+3,y-10,26,40,'#7a1f1f');rect(x+4,y-9,24,38,'#c0392b');rect(x+7,y-6,13,24,'#1d2b38');
      for(let i=0;i<3;i++)for(let j=0;j<2;j++)rect(x+9+j*6,y-4+i*8,3,6,'#f1c40f');rect(x+22,y-4,4,10,'#ecf0f1');rect(x+7,y+21,18,5,'#111');
      rect(x+4,y-9,24,2,(Math.floor(performance.now()/500)%2)?'#ff8a8a':'#c0392b');break;
    case 'M':floor();rect(x,y+4,TS,24,'#7f8a93');rect(x,y+2,TS,6,'#c8d0d6');if(c%2)rect(x+6,y+10,20,10,'#e6e1d3');break;
    case 'C':floor();rect(x+6,y-4,20,32,'#2d2d33');rect(x+9,y,14,8,'#5d6d7e');rect(x+20,y+12,3,3,(Math.floor(performance.now()/400)%2)?'#ff4d4d':'#5a1a1a');rect(x+12,y+18,8,8,'#ecf0f1');break;
    case 'J':floor();rect(x+14,y+16,4,14,'#5a3b22');rect(x+2,y,28,20,'#b07b46');rect(x+5,y+3,9,7,'#fff');rect(x+17,y+5,9,9,'#ffe08a');rect(x+7,y+12,8,6,'#cde');break;
    case 'N':rect(x,y,TS,TS,T.wall);rect(x+2,y+4,28,22,'#7a5232');rect(x+4,y+6,24,18,'#b07b46');rect(x+6,y+8,8,7,'#fff');rect(x+16,y+9,9,10,'#ffe08a');rect(x+8,y+16,7,6,'#f8b4c4');break;
    case 'B':cobble();rect(x+2,y+12,28,6,'#8b5a2b');rect(x+2,y+6,28,4,'#a0703f');rect(x+4,y+18,3,8,'#333');rect(x+25,y+18,3,8,'#333');break;
    default:floor();
  }}
function drawPano(){const y=HUD+9*TS;rect(0,y,W,TS,'#9cc3e4');ctx.fillStyle='#eef3f8';ctx.beginPath();ctx.moveTo(0,y+16);
  for(let i=0;i<=16;i++){ctx.lineTo(i*40+20,y+3+(i%3)*3);ctx.lineTo(i*40+40,y+16);}ctx.lineTo(W,y+32);ctx.lineTo(0,y+32);ctx.closePath();ctx.fill();
  rect(0,y+16,W,7,'#4f7fb0');for(let x=0;x<W;x+=18){const hh=4+(x*7)%9;rect(x,y+32-hh,14,hh,'#6b7c93');rect(x+3,y+32-hh-3,8,3,'#8a5a4a');}}
function drawSign(c,r,s){const w=tw(s,14)+8,cx=clamp(c*TS+16,w/2+2,W-w/2-2),y=HUD+r*TS+1;rect(cx-w/2,y,w,13,'#1d2633');txt(s,cx,y,{size:14,align:'center',color:'#fff'});}

/* ---------------- HUD ---------------- */
function drawHUD(){rect(0,0,W,HUD,'#0c0a16');rect(0,HUD-2,W,2,'#2a2445');
  let x=10;const item=(s,c,y)=>{txt(s,x,y,{size:18,color:c});x+=tw(s,18)+14;};
  item(`WEEK ${G.week}/14`,'#ffd166',3);item(`AP ${'●'.repeat(G.ap)}${'○'.repeat(3-G.ap)}`,'#7fdbff',3);item(`LV ${G.level}`,'#fff',3);item(`XP ${G.xp}/${nextXP()}`,'#fff',3);item(`ECTS ${G.ects}/60`,'#9be564',3);
  x=10;item(`SANITY ${G.sanity}`,G.sanity<25?'#ff5d5d':'#fff',20);item(`${chf(G.money)} CHF`,'#fff',20);item(`BEER ${G.beers}`,'#f1c40f',20);if(G.buff)item('(buzzed)','#ff6ad5',20);
  txt(MAPS[G.map].name,W-10,20,{size:18,align:'right',color:'#8f89b0'});}

/* ---------------- overworld scene ---------------- */
const DIRV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const OW={get music(){return MAPS[G.map].music;},anim:0,banner:0,moving:false,
  update(dt){this.banner-=dt;if(lock)return;
    if(back()){flow(menu);return;}
    if(hit('ok')){const v=DIRV[G.dir],c=Math.floor((G.x+v[0]*22)/TS),r=Math.floor((G.y-8+v[1]*24)/TS);
      const n=npcAt(G.map,c,r);if(n){flow(()=>talkNPC(n));return;}
      const ch=tileAt(G.map,c,r);if(ch&&INTERACT.has(ch)){flow(()=>interact(ch,c,r));return;}}
    const dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
    if(dx||dy){
      if(dy&&!dx)G.dir=dy<0?'up':'down';else if(dx&&!dy)G.dir=dx<0?'left':'right';
      else if(!((G.dir==='left'&&dx<0)||(G.dir==='right'&&dx>0)||(G.dir==='up'&&dy<0)||(G.dir==='down'&&dy>0)))G.dir=dx<0?'left':'right';
      const sp=(keys.c?175:115)*(dx&&dy?0.7071:1),nx=G.x+dx*sp*dt;if(!blocked(nx,G.y))G.x=nx;const ny=G.y+dy*sp*dt;if(!blocked(G.x,ny))G.y=ny;
      this.anim+=dt*(keys.c?12:8);this.moving=true;}else this.moving=false;
    const d=MAPS[G.map].doors[Math.floor(G.x/TS)+','+Math.floor((G.y-6)/TS)];
    if(d){lock=true;this.moving=false;SFX.door();fadeTo(()=>{G.map=d[0];G.x=d[1]*TS+16;G.y=d[2]*TS+28;G.dir=d[3];playSong(MAPS[G.map].music);this.banner=2.2;lock=false;});}},
  draw(){const m=MAPS[G.map];rect(0,0,W,H,'#000');
    m.rows.forEach((row,r)=>{for(let c=0;c<row.length;c++)drawTile(m,row[c],c,r);});
    if(m.pano)drawPano();m.signs.forEach(s=>drawSign(...s));
    const side=G.dir==='left'||G.dir==='right',f=this.moving?(side?Math.floor(this.anim)%2:1+Math.floor(this.anim)%2):0;
    const ents=NPCS.filter(n=>n.map===G.map).map(n=>({y:n.r*TS+30,d:()=>drawChar(n.pal,n.face||n.dir,0,n.c*TS+16,HUD+n.r*TS+30)}));
    ents.push({y:G.y,d:()=>drawChar(PAL.player,G.dir,f,G.x,HUD+G.y)});ents.sort((a,b)=>a.y-b.y).forEach(e=>e.d());
    drawHUD();
    if(this.banner>0){ctx.globalAlpha=clamp(this.banner,0,1);const s=m.name,w=tw(s,22)+30;rect(W/2-w/2,52,w,30,'rgba(0,0,0,.75)');txt(s,W/2,56,{size:22,align:'center',color:'#ffd166'});ctx.globalAlpha=1;}}
};
