/* ---------------- Polyterrasse view mode: find the professor in the city ---------------- */
// The panorama runs from south (left: university tower, lake, Alps) to north-west (right: HB, Prime Tower, Hönggerberg),
// laid out by the real compass bearings from the Polyterrasse. 1 world px = 2 screen px through the binocular.
const PW=1200,PH=270,LC=[[238,190],[402,190]],LR=140;
const VIEW_SPOTS=[
  {x:318,y:126,name:'on top of the Grossmünster tower',hint:'the twin towers on the left',n:1,sp:3},
  {x:534,y:160,name:'on the Lindenhof, playing giant chess',hint:'the little hill with the trees',n:3,sp:18},
  {dyn:'boat',name:'on the lake steamer',hint:'the lake',n:3,sp:10},
  {x:300,y:158,name:'on the Quaibrücke',hint:'the bridge at the end of the lake',n:2,sp:8},
  {x:566,y:94,name:'on top of the Uetliberg',hint:'the mountain with the TV tower',n:2,sp:8},
  {dyn:'polybahn',name:'in the Polybahn, on the way down to Central',hint:'the little red funicular',n:1,sp:2},
  {x:640,y:184,name:'walking along the Limmatquai',hint:'along the river',n:3,sp:40},
  {x:700,y:220,name:'on a rooftop terrace in the Niederdorf',hint:'the roofs right below you',n:1,sp:8},
  {x:892,y:165,name:'in front of the Hauptbahnhof',hint:'the big station on the right',n:3,sp:24},
  {x:940,y:94,name:'on the roof of the Prime Tower',hint:'the tallest building',n:0,sp:2},
  {x:860,y:192,name:'at Central, waiting for the tram',hint:'the square at the bottom of the Polybahn',n:3,sp:12},
  {x:58,y:94,name:'on the balcony of the university tower',hint:'the big tower on the far left',n:1,sp:16},
  {x:1170,y:110,name:'at ETH Hönggerberg. Wrong campus!',hint:'the far hill on the right',n:1,sp:12},
  {x:452,y:178,name:'swimming in the Limmat',hint:'the river',n:2,sp:40,swim:true},
  {x:263,y:150,name:'on a sailboat',hint:'the lake',n:0,sp:1},
  {x:486,y:251,name:'in front of the Predigerkirche',hint:'the slim spire right below you',n:2,sp:14}];
const LANDMARKS=[
  {id:'pt',x0:930,y0:90,x1:950,y1:158,fact:['* The Prime Tower: 126 metres. For a few years the tallest building in Switzerland.']},
  {id:'gm',x0:306,y0:100,x1:364,y1:198,fact:['* The Grossmünster and its twin towers. Huldrych Zwingli started the Zurich Reformation here in the 1520s.']},
  {id:'fm',x0:384,y0:80,x1:418,y1:174,fact:['* The Fraumünster, the one with the slim green spire.','* Inside: stained-glass windows by Marc Chagall.']},
  {id:'sp',x0:440,y0:86,x1:476,y1:174,fact:['* St. Peter. Its clock face is the largest of any church in Europe: almost 9 metres across.','* Very useful for checking how late you are for the Übung.']},
  {id:'pk',x0:490,y0:78,x1:514,y1:244,fact:['* The Predigerkirche, the slim spire right below the terrace.','* Next door is the Zentralbibliothek, where Lernphase goes to hide.']},
  {id:'lh',x0:506,y0:140,x1:566,y1:172,fact:['* The Lindenhof: a quiet hill in the old town where a Roman fort once stood.','* Today people play chess there on giant boards.']},
  {id:'pb',x0:838,y0:182,x1:944,y1:268,fact:['* The Polybahn: from Central up to the Polyterrasse since 1889.','* The cheapest roller coaster in Zurich. Also the slowest.']},
  {id:'hb',x0:844,y0:136,x1:942,y1:166,fact:['* Zürich HB, one of the busiest railway stations in the world.','* Also the fastest way home after Block 2.']},
  {id:'lm',x0:952,y0:124,x1:996,y1:172,fact:['* The Landesmuseum, the Swiss National Museum, right behind the station.','* It looks like a castle. That was the point.']},
  {id:'uzh',x0:0,y0:30,x1:134,y1:250,fact:['* The University of Zurich, right next door. Karl Moser\'s main building, opened in 1914.','* Its tower is the first thing you see from the Polyterrasse. ETH students pretend not to notice.']},
  {id:'hoe',x0:990,y0:96,x1:1200,y1:134,fact:['* Far away on the hill: ETH Hönggerberg, the other campus.','* If your lecture is there, you are already late.']},
  {id:'lake',x0:96,y0:126,x1:352,y1:164,fact:['* The Zürichsee. In summer, half of ETH "studies" on its shore.']},
  {id:'alps',x0:96,y0:70,x1:380,y1:126,fact:['* The Alps. On a clear day you can see them across the lake.','* Today is a clear day. Suspicious. Shouldn\'t you be studying?']},
  {id:'ub',x0:380,y0:52,x1:1010,y1:134,fact:['* The Uetliberg, Zurich\'s local mountain, about 870 metres high.','* The TV tower on top can be seen from all over the city.']}];
const V_HAIR=['#3b2a1e','#1c1c1c','#d9b13b','#8a5a2b','#c0392b','#e0c068','#6b4a2b','#9a9a9a','#ececec'];
const V_COAT=['#c0392b','#2980b9','#27ae60','#f39c12','#8e44ad','#16a085','#d35400','#2c3e50','#e84393','#7f8c8d','#f1c40f','#ecf0f1','#5a3f7a','#2e7d4f','#2c5d8f','#a0522d','#8f5a2c','#555c66','#2f6b5a','#6b2d5c'];
const V_SKIN=['#f2c7a5','#e8b48f','#c98e62','#8d5a3b','#f5d5bd'];
const TINY=["hhh","sss","ccc","ccc","ccc","p.p","p.p"];
const PT={m:[".hhh.","hsssh",".gsg.","ccccc","cctcc","cctcc",".ccc.",".p.p.",".p.p."],
  f:[".hhh.","hsssh","hgsgh","ccccc","cctcc","cctcc",".ccc.",".p.p.",".p.p."],
  b:[".sss.","hsssh",".gsg.","ccccc","cctcc","cctcc",".ccc.",".p.p.",".p.p."]};
function pbPos(t){const u=(Math.sin(t*0.3)+1)/2;return [Math.round(937-u*76),Math.round(266-u*76)];}
function tinyPerson(x,y,p,swim){const pal={h:p.hair,s:p.skin,c:p.coat,p:'#2b2b38'};if(swim)spr(["hhh","sss"],pal,x-1,y-2,1);else spr(TINY,pal,x-1,y-7,1);}
function tinyProf(x,y,B,swim,wave){const pal={h:B.pal.h,s:'#f2c7a5',g:'#8a939b',c:B.pal.c,t:B.pal.t,p:'#2b2b38'},rows=PT[B.sprite||'m'];
  if(swim){spr(rows.slice(0,3),pal,x-2,y-3,1);if(wave)rect(x+(wave===1?-3:3),y-6,1,3,'#f2c7a5');return;}
  spr(rows,pal,x-2,y-9,1);if(wave)rect(x+(wave===1?-3:3),y-12,1,4,'#f2c7a5');}

function paintPanorama(c){
  let seed=11;const rr=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;},rp=a=>a[Math.floor(rr()*a.length)];
  const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const P=(pts,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fill();};
  const C=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();};
  const roof=(x,y,w,h,col)=>P([[x-1,y],[x+w/2,y-h],[x+w+1,y]],col);
  // sky and clouds
  const g=c.createLinearGradient(0,0,0,135);g.addColorStop(0,'#74a9d8');g.addColorStop(1,'#dcebf6');c.fillStyle=g;c.fillRect(0,0,PW,PH);
  for(const [x,y,s] of [[150,24,1],[420,14,1.3],[690,32,0.9],[980,16,1.2],[1140,44,0.8]]){C(x,y,9*s,'#f6f9fc');C(x+11*s,y-4*s,11*s,'#fbfdff');C(x+23*s,y,8*s,'#eef4fa');R(x-6*s,y,36*s,6*s,'#f6f9fc');}
  // the Alps behind the lake
  const alps=[[96,128],[116,108],[132,114],[150,92],[166,102],[184,82],[202,98],[218,88],[238,106],[256,86],[276,100],[296,90],[318,110],[338,102],[372,128]];
  P(alps,'#a8b8cb');for(const [px,py] of alps)if(py<100)P([[px,py],[px-7,py+7],[px-3,py+5],[px+1,py+8],[px+7,py+7]],'#f6f9fc');
  P([[90,130],[150,120],[230,124],[330,119],[350,132],[90,134]],'#86a294');
  // the lake
  R(96,128,256,34,'#6b9bc5');for(let i=0;i<18;i++)R(104+rr()*236,131+rr()*28,8+rr()*14,1,'#a5c7e3');
  // the Uetliberg ridge with its TV tower
  const ridge=[[330,134],[360,126],[420,117],[480,107],[528,97],[556,92],[582,97],[640,105],[720,111],[800,115],[880,119],[960,122],[1010,127]];
  P(ridge.concat([[1010,142],[330,142]]),'#4b6a4c');
  for(let i=0;i<ridge.length-1;i++){const [x0,y0]=ridge[i],[x1,y1]=ridge[i+1];for(let x=x0;x<x1;x+=2)R(x,y0+(y1-y0)*(x-x0)/(x1-x0),2,2,'#62835e');}
  R(557,58,2,35,'#8d969c');R(554,70,8,2,'#b8c0c5');R(555,78,6,2,'#b8c0c5');
  // Hönggerberg with ETH Science City
  P([[990,132],[1040,117],[1100,107],[1160,109],[1200,114],[1200,142],[990,142]],'#58795a');
  for(const [x,w,h] of [[1082,16,8],[1100,24,10],[1126,14,7],[1142,10,6]])R(x,108-h,w,h,'#b9bec4');
  // the far city across the river
  for(let row=0;row<5;row++){const yb=134+row*9;for(let x=345+rr()*6;x<PW;x+=7+rr()*7){const h=4+rr()*6+row*1.4,w=6+rr()*6;
    R(x,yb-h,w,h+10,rp(['#d7d0c1','#cfc6b4','#e1dacb','#c9c2b5']));roof(x,yb-h,w,3+rr()*2,rp(['#8d5a48','#7f6a60','#94604c','#6f6a66']));}}
  // Prime Tower, Hauptbahnhof, Landesmuseum
  R(934,96,12,62,'#7c9e9c');for(let y=100;y<158;y+=6)R(934,y,12,1,'#5d7e7c');R(933,94,14,3,'#9ab8b6');
  R(848,146,92,16,'#c8bfae');for(let i=0;i<5;i++){const hx=849+i*18;P([[hx,146],[hx+9,139],[hx+18,146]],'#7f8a93');}R(848,145,92,2,'#6c767e');for(let i=0;i<8;i++)R(852+i*11,151,5,8,'#5d6670');
  R(956,146,36,24,'#d8cfba');P([[954,146],[974,134],[994,146]],'#55606a');R(958,136,8,12,'#d8cfba');P([[957,136],[962,127],[967,136]],'#55606a');
  R(982,139,7,9,'#d8cfba');P([[981,139],[985.5,131],[990,139]],'#55606a');for(let i=0;i<5;i++)R(960+i*6,152,3,6,'#5a6168');
  // Fraumünster and St. Peter on the other bank
  R(386,158,30,16,'#d9d0bd');roof(386,158,30,7,'#8b5a45');R(398,110,8,64,'#e3dac6');P([[397,110],[402,86],[407,110]],'#4f8f7b');R(401,82,2,5,'#d4a017');
  R(442,160,32,14,'#dcd3c0');roof(442,160,32,7,'#8b5a45');R(455,106,16,68,'#e4dcc9');C(463,121,6,'#1c1c1c');
  c.strokeStyle='#d4a017';c.lineWidth=1;c.beginPath();c.arc(463,121,5.5,0,Math.PI*2);c.stroke();R(462,116,1,5,'#d4a017');R(463,120,4,1,'#d4a017');
  P([[454,106],[463,90],[472,106]],'#3f7f6a');C(463,89,1.5,'#d4a017');
  // Lindenhof
  R(510,160,52,12,'#cfc2a5');for(const [tx,ty,r] of [[516,154,7],[528,151,8],[542,153,7],[555,156,6]])C(tx,ty,r,rp(['#4f8a45','#3f7a3a']));
  // the Limmat, the Limmatquai, the Quaibrücke, Central
  R(330,172,600,9,'#5f90b8');for(let i=0;i<30;i++)R(335+rr()*585,173+rr()*6,6+rr()*10,1,'#9cc3e0');R(330,181,600,4,'#b9b4aa');R(330,160,18,14,'#5f90b8');
  R(290,158,60,4,'#c9c3b5');R(290,162,60,2,'#a59f92');
  R(842,185,38,8,'#bdb8ae');
  // Grossmünster on this side of the river
  R(308,170,54,28,'#e8ddc2');roof(308,170,54,10,'#8b4f3a');
  for(const tx of [316,340]){R(tx,126,13,72,'#efe6cf');for(let y=134;y<190;y+=12)R(tx+4,y,5,7,'#6b6355');R(tx+1,119,11,8,'#e3d8bf');P([[tx+1,119],[tx+6.5,109],[tx+12,119]],'#3b3f45');R(tx+6,105,1,5,'#3b3f45');}
  // houses along the Limmatquai
  for(let x=362+rr()*4;x<930;x+=11+rr()*8){if(x>488&&x<514)continue;const h=12+rr()*14,w=10+rr()*8,yb=212;
    R(x,yb-h,w,h+6,rp(['#e8d9b5','#d9b98f','#c9d6c2','#e2c6b0','#bfcbd6','#efe4cc']));
    for(let wy=yb-h+4;wy<yb-2;wy+=6)for(let wx=x+2;wx<x+w-2;wx+=4)R(wx,wy,2,3,'#5b5146');roof(x,yb-h,w,5+rr()*3,rp(['#a4523b','#b0603f','#934634']));}
  // Predigerkirche, very close
  R(464,212,56,32,'#e6dccb');roof(464,212,56,12,'#8b4f3a');R(496,118,12,126,'#ece4d2');for(let y=128;y<232;y+=16)R(500,y,4,9,'#6b6355');
  P([[495,118],[502,86],[509,118]],'#3f5a52');R(501,81,2,6,'#d4a017');R(456,244,70,8,'#cdc6b8');
  // the Niederdorf right below the terrace
  for(let x=118+rr()*6;x<944;x+=20+rr()*12){if((x>448&&x<526)||(x>676&&x<722))continue;const h=18+rr()*16,w=18+rr()*12,yb=252;
    R(x,yb-h,w,h,rp(['#efe4cc','#e6d3b3','#dbc8a8','#d2dccb','#e8cfc0']));for(let wy=yb-h+5;wy<yb-4;wy+=8)for(let wx=x+3;wx<x+w-3;wx+=6)R(wx,wy,3,4,'#4f463c');
    roof(x,yb-h,w,9+rr()*4,rp(['#a4523b','#b0603f','#934634','#8b4a36']));if(rr()<0.5)R(x+w*0.7,yb-h-8,3,6,'#7a6a5a');}
  R(684,220,34,32,'#e9dcc4');R(684,218,34,3,'#9a8f80');R(690,214,2,5,'#555');R(712,214,2,5,'#555');R(690,214,24,1,'#555');C(706,212,5,'#c0392b');R(706,212,1,8,'#555');
  for(let i=0;i<12;i++){const tx=124+rr()*812;if(tx>448&&tx<526)continue;C(tx,244+rr()*6,6+rr()*4,rp(['#3f7a3a','#4f8a45','#2f6a32']));}
  // Polybahn track down to Central
  c.strokeStyle='#4d4d4d';c.lineWidth=1;c.beginPath();c.moveTo(858,190);c.lineTo(934,268);c.moveTo(864,190);c.lineTo(940,268);c.stroke();
  // University of Zurich, right next door
  R(0,150,134,100,'#d6ccb2');for(let y=160;y<245;y+=14)for(let x=6;x<130;x+=12)if(x<38||x>98)R(x,y,6,8,'#5a5246');
  R(40,70,56,180,'#d9cfb6');R(40,70,56,4,'#e7dfc9');for(let y=106;y<240;y+=18)for(const x of [50,64,78])R(x,y,6,11,'#5a5246');
  P([[36,70],[68,42],[100,70]],'#4f6f63');R(66,34,4,9,'#4f6f63');R(36,94,64,3,'#c9bea2');for(let x=38;x<98;x+=5)R(x,90,2,4,'#c9bea2');
  // the Polyterrasse balustrade in front of you
  R(0,252,PW,5,'#ddd3bd');R(0,252,PW,1,'#f2ead8');for(let x=2;x<PW;x+=8)R(x,257,4,10,'#cbbf9f');R(0,267,PW,3,'#bdb190');}

function viewDyn(S){const t=S.t;
  const sb=Math.round(Math.sin(t*1.4));rect(255,150+sb,16,3,'#f4f4f4');rect(262,135+sb,1,15,'#555');
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(263,148+sb);ctx.lineTo(263,136+sb);ctx.lineTo(271,148+sb);ctx.closePath();ctx.fill();
  const bx=S.boatX(t);rect(bx-14,144,28,5,'#f4f4f4');rect(bx-14,148,28,1,'#2c4f6e');rect(bx-10,139,18,5,'#e6e6e6');for(let i=0;i<4;i++)rect(bx-8+i*4,140,2,2,'#5d7891');rect(bx-1,133,4,6,'#c0392b');
  const tx=Math.round(380+((t*22)%500));rect(tx,181,16,4,'#f4f6f8');rect(tx,183,16,1,'#1f5fa8');
  for(let i=0;i<4;i++){const x=Math.round(((t*16+i*330)%1300)-50),y=Math.round(30+i*9+Math.sin(t*3+i)*2);rect(x,y,2,1,'#333');rect(x+2,y+1,1,1,'#333');rect(x+3,y,2,1,'#333');}
  if(Math.floor(t*1.5)%2)rect(556,55,4,3,'#ff5a5a');
  for(const p of S.people){const [x,y]=S.pos(p.s,t);tinyPerson(x+p.dx,y,p,p.s.swim);}
  const [px,py]=S.pos(S.spot,t),wave=!S.found&&S.t>45?1+Math.floor(t*4)%2:0;tinyProf(px+S.pdx,py,S.B,S.spot.swim,wave);
  const [cx,cy]=pbPos(t);rect(cx-6,cy-3,12,4,'#c0392b');rect(cx-6,cy-10,12,2,'#c0392b');rect(cx-6,cy-10,1,8,'#c0392b');rect(cx+5,cy-10,1,8,'#c0392b');rect(cx-6,cy+1,12,1,'#7a1f17');}
function lensRing(){for(let i=0;i<2;i++){const [ax,ay]=LC[i],[bx,by]=LC[1-i];ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.moveTo(bx+LR,by);ctx.arc(bx,by,LR,0,Math.PI*2);ctx.clip('evenodd');
  for(const [w,a] of [[22,0.25],[10,0.45],[3,0.85]]){ctx.strokeStyle=`rgba(0,0,0,${a})`;ctx.lineWidth=w;ctx.beginPath();ctx.arc(ax,ay,LR-w/2,0,Math.PI*2);ctx.stroke();}ctx.restore();}}
async function viewCheck(S){const wx=S.cx,wy=S.cy,[px,py]=S.pos(S.spot,S.t),B=S.B;
  if(!S.found&&Math.abs(wx-(px+S.pdx))<=6&&Math.abs(wy-(py-4))<=7){S.found=true;S.banner=3;SFX.win();
    await say([`* GEFUNDEN! ${B.short} is ${S.spot.name}.`]);await say([pick(B.taunts||['...'])],B.short);
    if(G.viewWeek!==G.week){G.viewWeek=G.week;G.sanity=Math.min(100,G.sanity+10);await say(['* Spotting a professor in the wild: +10 Sanity.']);await gainXP(20);}
    else await say(['* You already found a professor this week. No extra reward, just pride.']);
    return say(['* Keep looking around if you like. X steps back from the binocular.']);}
  const p=S.people.find(q=>{const [x,y]=S.pos(q.s,S.t);return Math.abs(wx-(x+q.dx))<=4&&Math.abs(wy-(y-3))<=5;});
  if(p){SFX.select();return say([pick(['* Just a tourist taking a photo. Of course.','* Someone eating a Gipfeli. Far too relaxed to be a professor.','* A random person. Definitely not a professor: no chalk on the sleeves.','* A student. You can tell by the backpack and the tired eyes.'])]);}
  const L=LANDMARKS.find(l=>wx>=l.x0&&wx<=l.x1&&wy>=l.y0&&wy<=l.y1);
  if(L){SFX.confirm();await say(L.fact);if(!G.lm)G.lm={};if(!G.lm[L.id]){G.lm[L.id]=true;await gainXP(2);}return;}
  SFX.select();return say([pick(['* Roofs. Very Swiss roofs, all in the same shade of terracotta.','* Nothing here. Just Zurich, quietly being expensive.','* A pigeon. It does not care about the Basisprüfung.','* Sky. Lovely, but no professor.'])]);}
function makeView(done){
  const off=document.createElement('canvas');off.width=PW;off.height=PH;paintPanorama(off.getContext('2d'));
  const B=BOSSES[pick(BOSS_ORDER)],spot=pick(VIEW_SPOTS);
  const mk=s=>({s,dx:Math.round(rnd(-(s.sp||4),s.sp||4)),hair:pick(V_HAIR),coat:pick(V_COAT.filter(k=>k!==B.pal.c)),skin:pick(V_SKIN)});
  const people=[];for(const s of VIEW_SPOTS){const n=s===spot?Math.min(1,s.n):s.n;for(let i=0;i<n;i++)people.push(mk(s));}
  for(let i=0;i<10;i++)people.push(mk({x:Math.round(rnd(360,920)),y:184,sp:0}));
  const S={music:'campus',t:0,cx:520,cy:150,found:false,busy:false,banner:0,spot,B,people,pdx:Math.round(rnd(-(spot.sp||2)/2,(spot.sp||2)/2))};
  S.boatX=t=>Math.round(170+(Math.sin(t*0.15)+1)*65);
  S.pos=(s,t)=>s.dyn==='boat'?[S.boatX(t),144]:s.dyn==='polybahn'?pbPos(t):[s.x,s.y];
  S.update=dt=>{S.t+=dt;S.banner=Math.max(0,S.banner-dt);if(S.busy)return;
    if(back()){SFX.select();S.busy=true;fadeTo(()=>{setScene(OW);done({found:S.found});});return;}
    const sp=(keys.c?240:120)*dt;
    S.cx=clamp(S.cx+((keys.right?1:0)-(keys.left?1:0))*sp,120,PW-120);S.cy=clamp(S.cy+((keys.down?1:0)-(keys.up?1:0))*sp,75,PH-75);
    if(hit('ok')){S.busy=true;viewCheck(S).catch(e=>console.error(e)).finally(()=>{S.busy=false;});}};
  S.draw=()=>{rect(0,0,W,H,'#07080c');
    ctx.save();ctx.beginPath();for(const [x,y] of LC){ctx.moveTo(x+LR,y);ctx.arc(x,y,LR,0,Math.PI*2);}ctx.clip();
    ctx.translate(320,190);ctx.scale(2,2);ctx.translate(-Math.round(S.cx),-Math.round(S.cy));ctx.drawImage(off,0,0);viewDyn(S);ctx.restore();
    lensRing();
    ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(320.5,190.5,9,0,Math.PI*2);ctx.stroke();
    rect(303,190,8,1,'#fff');rect(330,190,8,1,'#fff');rect(320,173,1,8,'#fff');rect(320,200,1,8,'#fff');
    const l1=`FIND: ${B.short}`,l2=`${B.courseShort} · hiding somewhere in Zurich`;ubox(6,6,Math.min(496,Math.max(tw(l1,18),tw(l2,14))+58),42,'#ffd166');spr(PROF_SPR[B.sprite||'m'],B.pal,14,11,2);
    txt(l1,46,8,{size:18,color:'#ffd166'});txt(l2,46,27,{size:14,color:'#cfc9e8'});
    ubox(508,6,126,40,'#8f89b0');ctx.imageSmoothingEnabled=true;ctx.drawImage(off,0,0,PW,PH,511,9,120,27);ctx.imageSmoothingEnabled=false;
    ctx.strokeStyle='#ffd166';ctx.lineWidth=1;ctx.strokeRect(Math.round(511+(S.cx-120)/PW*120)+0.5,Math.round(9+(S.cy-75)/PH*27)+0.5,24,15);
    txt('Polyterrasse',571,48,{size:14,align:'center',color:'#8f89b0'});
    txt(`Landmarks ${Object.keys(G.lm||{}).length}/${LANDMARKS.length}`,10,306,{size:16,color:'#9be564'});
    if(S.banner>0)txt('GEFUNDEN!',320,58,{font:PX,size:18,align:'center',color:'#9be564',shadow:'#000'});
    const [bt,bc]=S.found?['Found! Keep looking around, or X to step back.','#9be564']:S.t>25?[`Hint: try ${S.spot.hint}.  (Z check · X back)`,'#ffd166']:['←→↑↓ look · hold C faster · Z check · X back','#8f89b0'];
    txt(bt,320,336,{size:16,align:'center',color:bc});};
  return S;}
