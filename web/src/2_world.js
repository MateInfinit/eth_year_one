/* ---------------- HG F 6 layout + big floor letters ---------------- */
function buildF6(){const rows=[];
  for(let r=0;r<10;r++){let s='';
    for(let c=0;c<20;c++){let ch;
      if(r===0)ch=c===1?'D':(c>=4&&c<=15)?'Q':c===17?'X':'#';
      else if(r===9||c===0||c===19)ch='#';
      else if(r<=2)ch=(r===2&&c>=3&&c<=5)?'w':'.';
      else ch=(c===1||c===18||c===9||c===10)?'.':'k';
      s+=ch;}
    rows.push(s);}
  return rows;}
const FONT5={G:[".###.","#...#","#....","#.###","#...#","#...#",".###."],O:[".###.","#...#","#...#","#...#","#...#","#...#",".###."],
  A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],T:["#####","..#..","..#..","..#..","..#..","..#..","..#.."],I:[".###.","..#..","..#..","..#..","..#..","..#..",".###."],
  S:[".####","#....","#....",".###.","....#","....#","####."],N:["#...#","#...#","##..#","#.#.#","#..##","#...#","#...#"],
  D:["####.","#...#","#...#","#...#","#...#","#...#","####."],E:["#####","#....","#....","####.","#....","#....","#####"],
  V:["#...#","#...#","#...#","#...#","#...#",".#.#.","..#.."],R:["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],
  B:["####.","#...#","#...#","####.","#...#","#...#","####."],"?":[".###.","#...#","....#","...#.","..#..",".....","..#.."]};
function hgPillar(x,y){rect(x+6,y+24,20,6,'#cdbf9f');rect(x+9,y-26,14,50,'#f1e9d6');rect(x+19,y-26,4,50,'#d8cbb0');rect(x+6,y-30,20,6,'#d9ccb0');rect(x+7,y-33,18,3,'#e6dbc2');}
function bigWord(word,cx,y,s,col,edge){let x=cx-(word.length*6*s-s)/2;
  for(const ch of word){const g=FONT5[ch];if(g){for(const [colr,dx] of [[edge,2],[col,0]])g.forEach((row,r)=>{for(let c=0;c<5;c++)if(row[c]==='#')rect(x+c*s+dx,y+r*s+dx,s,s,colr);});}x+=6*s;}}

/* ---------------- the HG goat and people taking photos ---------------- */
const GOAT=["....hh..........","...hh...........",".wwwwe..........","wwkwww..........","nwwwww..........",".bwwwwwwwwwwwww.",".b..wwwwwwwwwwwt","....wwwwwwwwwwwt","....wwwwwwwwwww.","....ggggggggggg.","....l.l....l.l..","....l.l....l.l..","....o.o....o.o.."];
const GOAT_PAL={h:'#8c7a5b',w:'#f4f1ea',e:'#e8b8a8',k:'#1a1a1a',n:'#d9a9a0',b:'#c9bfae',g:'#d8d0c0',t:'#f4f1ea',l:'#6b6257',o:'#2b2b2b'};
function drawGoat(x,y,right){const T=performance.now()/1000,talk=T%5<1.2,hop=T%5<0.25?2:0;
  rect(x-12,y-2,26,3,'rgba(0,0,0,.22)');spr(GOAT,GOAT_PAL,x-16,y-26-hop,2,right);
  if(talk){const bx=right?x+6:x-38;rect(bx,y-46,32,14,'#fff');rect(bx+(right?4:24),y-32,4,3,'#fff');txt('Mäh!',bx+16,y-47,{size:14,align:'center',color:'#222'});}}
function drawPhoto(n,x,y,dir){const big=n.cam==='camera',T=performance.now()/1000+(n.seed||0),fl=T%(n.per||3.3)<0.13;
  const [cx,cy]=dir==='up'?[x,y-38]:dir==='down'?[x,y-22]:dir==='left'?[x-12,y-24]:[x+12,y-24];
  if(big){rect(cx-5,cy-3,10,7,'#1b1b1f');rect(cx-2,cy-1,4,4,'#4a6b8a');}else{rect(cx-3,cy-4,6,8,'#1b1b1f');rect(cx-2,cy-3,4,5,'#3d5a80');}
  if(fl){ctx.globalAlpha=0.35;circ(cx,cy,18,'#fffbe0');ctx.globalAlpha=0.9;circ(cx,cy,8,'#ffffff');ctx.globalAlpha=1;rect(cx-14,cy,28,1,'#fff');rect(cx,cy-14,1,28,'#fff');}}

/* ---------------- maps ---------------- */
const DR=(m,c,r,dir)=>[m,c,r,dir];
const MAPS={
  campus:{name:'Polyterrasse · ETH Zentrum',music:'campus',
    rows:["SSSSSSSSSSSSSSSSSSSS","FFFFFFFFFFFFFFFFFFFF","FFFFFFFFFDDFFFFFFFFF","h__________________h","D..................D","h.T..............T.h","h..l...........l.PPh","h..B..o..B.....B.PPh","^^^^^^^^^^^^^^^^^^^^","~~~~~~~~~~~~~~~~~~~~"],
    doors:{'9,2':DR('hg',9,8,'up'),'10,2':DR('hg',10,8,'up'),'0,4':DR('uni',18,4,'left'),'19,4':DR('mensa',1,5,'right')},
    signs:[[0,3,'← CAB'],[19,3,'MENSA ↓']]},
  uni:{name:'Universitätstrasse · CAB',music:'campus',
    rows:["FFFFFFFFFFFFFFFFFFFF","FFFFFFFFFFFFFFFFFFFF","FFFFFFFFFDDFFFFFFFFF","h__________________h","hbb................D","h.....A.......B....h","sssZssssssssssssssss","RRRRRRRRRRRRRRRRRRRR","RRRRRRRRRRRRRRRRRRRR","gggggggggggggggggggg"],
    doors:{'9,2':DR('cab',9,8,'up'),'10,2':DR('cab',10,8,'up'),'19,4':DR('campus',1,4,'right')},
    signs:[[19,3,'POLYTERRASSE →']]},
  hg:{name:'HG · Haupthalle',music:'indoor',
    rows:["####E####N##L##E####","#..................#","#..................D","#...O...O..O...O...#","#p................p#","D..................D","#...O...O..O...O...#","#..................#","#B................B#","#########DD#########"],
    doors:{'9,9':DR('campus',9,3,'down'),'10,9':DR('campus',10,3,'down'),'0,5':DR('f6',1,1,'down'),'19,5':DR('f7',1,2,'right'),'19,2':DR('einstein',1,2,'right')},
    signs:[[4,0,'HG F 1'],[12,0,'BIBLIOTHEK'],[15,0,'PRÜFUNG'],[0,4,'HG F 6'],[19,4,'HG F 7'],[19,1,'EINSTEIN']]},
  f6:{name:'HG F 6',music:'indoor',rows:buildF6(),
    doors:{'1,0':DR('hg',1,5,'right')},signs:[[1,0,'EXIT']]},
  f7:{name:'HG F 7',music:'indoor',
    rows:["####QQQQQQQQQQQQ####","#..................#","D.......www........#","#.kkkkkkk..kkkkkkk.#","#.kkkkkkk..kkkkkkk.#","#.kkkkkkk..kkkkkkk.#","#.kkkkkkk..kkkkkkk.#","#.kkkkkkk..kkkkkkk.#","#.kkkkkkk..kkkkkkk.#","####################"],
    doors:{'0,2':DR('hg',18,5,'left')},signs:[[0,1,'EXIT']]},
  einstein:{name:"HG · Einstein's locker",music:'indoor',
    rows:["#UUUUUUUUYYUUUUUUUU#","#.......rrrr.......#","D..................#","#..................#","#..................#","#..................#","^^^^^^^^^^^^^^^^^^^^","~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~","~~~~~~~~~~~~~~~~~~~~"],
    doors:{'0,2':DR('hg',18,2,'left')},signs:[[0,1,'HAUPTHALLE']]},
  cab:{name:'CAB · Departement Informatik',music:'indoor',
    rows:["###E###v####G###KK##","#..................#","#V.................#","#..tt....YY....tt..#","#.......YYYY.......#","#..................D","#..tt..........tt..#","#..................#","#p..LL............p#","#########DD#########"],
    doors:{'9,9':DR('uni',9,3,'down'),'10,9':DR('uni',10,3,'down'),'19,5':DR('cabrec',1,5,'right')},
    signs:[[3,0,'ÜBUNG'],[7,0,'VIS'],[12,0,'CABinett'],[16.5,0,'food&lab'],[19,6,'AUFENTHALTSRAUM']]},
  cabrec:{name:'CAB · Aufenthaltsraum',music:'indoor',
    rows:["##KRRRRR#II##MM##V##","#..................#","#.SSS.......tt.....#","#...........tt.....#","#..................#","D...........GG.....#","#.SSS..............#","#..................#","#p................p#","####################"],
    doors:{'0,5':DR('cab',18,5,'left')},signs:[[0,4,'CAB']]},
  mensa:{name:'Mensa Polyterrasse',music:'indoor',
    rows:["#RRRRRRRWWWWWWWWWWW#","#MMMMMMM..........J#","#..................#","#..tttt....tttt....#","#..................#","D..tttt....tttt....#","#..................#","#..tttt....tttt....#","#p................p#","####################"],
    doors:{'0,5':DR('campus',18,4,'left')},signs:[]}
};
const SOLID=new Set('#FSh^~TlBPObEFNLVKvGYtpMRWJAZgQXwkoUIr'.split(''));
const INTERACT=new Set('BPT^~FShlZAbRgENLOpvGKVYtMWJQXwkoUIr'.split(''));
const NPCS=[
  {id:'anouk',map:'campus',c:6,r:5,name:'Anouk (exchange student)',pal:mkPal('#d9b13b','#2e8b57'),dir:'down',lines:[
    ["Salut! I came from Lyon for one semester.","Three weeks in and I still can't find my lecture hall. Is everything here in the basement?"],
    ["My Swiss German so far: 'Grüezi', 'Merci vilmal' and 'Chuchichäschtli'.","I use the last one for everything. Nobody has corrected me yet."]]},
  {id:'severin',map:'campus',c:12,r:4,name:'Severin (3rd semester)',pal:mkPal('#1c1c1c','#7a3b3b'),dir:'left',lines:[
    ["Basisprüfung? Oh, you'll be fine.","...","(He stares at the Alps for ten full seconds.)"],
    ["Pro tip: get the old exams from VIS in CAB.","Block 1 covers the HS courses, Block 2 the FS ones. Pass both and the Basisjahr is done."],
    ["Never trust a TA who says 'this one is easy'.","That's how they got me in week 4."]]},
  {id:'tourist',map:'campus',c:12,r:7,name:'Tourist',pal:mkPal('#a0522d','#e67e22','#3b5b8a'),dir:'down',lines:[
    ["What a view! Grossmünster, the lake, the Alps...","This terrace is the only place at ETH without a deadline."],
    ["I came up with the Polybahn. Two and a half minutes!","Students sleep on these benches, you know. Very relaxing city."],
    ["Have you tried the binocular? A sticker says a professor is hiding somewhere in the city.","I only found pigeons."]]},
  {id:'jonas',map:'uni',c:7,r:4,name:'Jonas (VIS)',pal:mkPal('#6b4a2b','#1f5fa8'),dir:'down',lines:[
    ["Hoi! I'm from VIS, the computer science student association.","Our office in CAB has the Prüfungssammlung: old exams. Pure gold before a Basisprüfung block."],
    ["Erstsemestrigenfest on Friday! Bring friends.","Or bring your Serie. We won't judge. Much."]]},
  {id:'velo',map:'uni',c:13,r:6,name:'Cyclist',pal:mkPal('#2b2b2b','#16a085'),dir:'left',lines:[
    ["Careful on Universitätstrasse. The tram always wins.","Tram 10 goes down to the main station. And to the airport, if the Basisprüfung goes badly."]]},
  {id:'mia',map:'hg',c:6,r:5,name:'Mia (lost first-year)',pal:mkPal('#5a3b22','#16a085'),dir:'down',lines:[
    ["Which way is HG F 1? I've passed this staircase six times.","This building was designed by someone who really hated freshmen."],
    ["I asked a professor for directions.","He said: 'This is left as an exercise.'"]]},
  {id:'luca',map:'hg',c:13,r:2,name:'Luca (stressed)',pal:mkPal('#2b2b2b','#8e44ad'),dir:'left',lines:[
    ["I just proved P = NP!","...wait. I proved 1 = 1.","That still counts for partial credit, right?"],
    ["The door on the right is the exam room.","Block 1 opens once all four HS professors are beaten. Block 2 needs the four FS ones."]]},
  {id:'brunner',map:'hg',c:2,r:7,name:'Herr Brunner (Hauswart)',pal:mkPal('#9a9a9a','#34495e','#34495e'),dir:'right',lines:[
    ["Grüezi. Please don't run in the Haupthalle.","Semper would be turning in his grave."],
    ["I've seen thousands of first-years come through here.","The ones who sleep and eat properly do best. Just saying."],
    ["There is a goat in the Haupthalle.","I have stopped asking questions."]]},
  {id:'nico',map:'f6',c:14,r:2,name:'Nico (TA)',pal:mkPal('#3b2a1e','#7f8c8d'),dir:'left',lines:[
    ["Welcome to HG F 6. Best seats in the whole HG.","Birch wood, fold-down desks, and a floor so shiny you can see your own panic."],
    ["The professors sometimes lecture in here.","Talk to them at the white desk, if you're brave."]]},
  {id:'laura',map:'cab',c:4,r:1,name:'Laura (TA)',pal:mkPal('#c0392b','#f39c12'),dir:'down',lines:[
    ["Hi! I'm your TA. The Übungsraum is right here.","This week's Serie is easy. It says so on the sheet."],
    ["If you don't understand something, just ask!","(Nobody has ever asked.)"],
    ["That yellow thing is a real Cray supercomputer from the 80s.","Now it's mostly a bench. Like most of us after Block 1."]]},
  {id:'tim',map:'cab',c:3,r:4,name:'Tim (asleep)',pal:mkPal('#6b4a2b','#95a5a6'),dir:'up',lines:[
    ["Zzz... the induction step... holds for n+1... zzz"],
    ["Zzz... five more minutes... then Code Expert... zzz"]]},
  {id:'elias',map:'cab',c:16,r:4,name:'Elias (debugging)',pal:mkPal('#111111','#34495e'),dir:'left',lines:[
    ["It works on my machine.","My machine is the only machine that matters."],
    ["I've been staring at this NullPointerException since Tuesday.","I think it's staring back."]]},
  {id:'ramon',map:'cab',c:12,r:4,name:'Ramon',pal:mkPal('#e0c068','#c0392b'),dir:'left',lines:[
    ["This Cray was a supercomputer once.","Now it's the comfiest bench in CAB. Same, honestly."]]},
  {id:'sara',map:'mensa',c:5,r:2,name:'Sara (in the queue)',pal:mkPal('#8a5a2b','#c0392b'),dir:'up',lines:[
    ["The LOCAL line is long again.","Time moves differently in the Mensa queue."],
    ["Natürlich vegi is cheaper and the queue is shorter.","Best algorithm I learned this semester."]]},
  {id:'noah',map:'mensa',c:13,r:4,name:'Noah (math student)',pal:mkPal('#e0c068','#2c3e50'),dir:'left',lines:[
    ["Mensa theorem: every menu converges to pasta.","Proof: by observation, every single day."],
    ["These windows have the best view at ETH.","Second best: the Polybahn. Third: the 'Bestanden' email."]]},
  {id:'goat',map:'hg',c:16,r:7,name:'The GOAT',goat:true,dir:'left',lines:[["Määäh."],["Mäh."],["Mäh. Mäh mäh."]],after:[()=>goatMeet()]},
  {id:'tour_hg1',map:'hg',c:14,r:7,name:'Tourist with a camera',pal:mkPal('#8a5a2b','#e67e22','#3b5b8a','#e8b48f'),dir:'right',photo:true,cam:'camera',seed:0.4,per:2.8,lines:[
    ["Is this goat part of the university?","*click* *click* It's even posing!"],["Excuse me, is the goat a professor?","...it looks like a professor."]]},
  {id:'tour_hg2',map:'hg',c:5,r:2,name:'Tourist with a phone',pal:mkPal('#1c1c1c','#16a085','#2b2b38','#c98e62'),dir:'up',photo:true,cam:'phone',seed:1.7,per:3.6,lines:[
    ["The Haupthalle! Semper! All these columns!","*click* Now one more with the ceiling..."],["Where is Einstein's locker? Everyone says it's on this floor.","The sign on the right says EINSTEIN? Thank you!"]]},
  {id:'sophie',map:'f6',c:7,r:1,name:'Sophie (photographing the board)',pal:mkPal('#d9b13b','#e84393','#2b2b38','#f5d5bd'),dir:'up',photo:true,cam:'phone',seed:0.9,per:3.1,lines:[
    ["Shh, don't move. I need the whole board in one shot.","The professor erases faster than I can write. So: photo."],["I have 2,300 photos of blackboards on my phone.","I have looked at none of them. Lernphase-me will be thrilled."]]},
  {id:'jan',map:'f6',c:12,r:1,name:'Jan (photographing the board)',pal:mkPal('#6b4a2b','#2980b9','#2b2b38','#8d5a3b'),dir:'up',photo:true,cam:'phone',seed:2.3,per:4.1,lines:[
    ["Can you step aside? You're in my Zusammenfassung."],["Pro tip: photograph the board BEFORE the professor erases it.","Learned that in week 3."]]},
  {id:'mira',map:'f7',c:14,r:1,name:'Mira (photographing the board)',pal:mkPal('#8a5a2b','#9b59b6','#2b2b38','#e8b48f'),dir:'up',photo:true,cam:'phone',seed:1.1,per:3.4,lines:[
    ["One photo per board, twelve boards per lecture.","My phone storage is a museum of chalk."],["Have you seen the front-row table? Someone scratched something into it.","Very small. You have to look closely."]]},
  {id:'tour_e1',map:'einstein',c:8,r:2,name:'Tourist with a selfie stick',pal:mkPal('#c0392b','#f1c40f','#3b5b8a','#f2c7a5'),dir:'up',photo:true,cam:'phone',seed:0.2,per:2.6,lines:[
    ["Schatz, noch eins! Mit dem Schrank!","...und jetzt alle: Einsteeein!"]],after:['* (German: "Honey, one more! With the locker! ...and now everyone: Einsteeein!")']},
  {id:'tour_e2',map:'einstein',c:11,r:2,name:'Tourist with a huge camera',pal:mkPal('#9a9a9a','#34495e','#2b2b38','#c98e62'),dir:'up',photo:true,cam:'camera',seed:1.3,per:3.0,lines:[
    ["The smallest Einstein museum in the world!","I flew nine hours for this locker. Worth it."],["Did you know he studied here? Right here! In this corridor! Probably!"]]},
  {id:'tour_e3',map:'einstein',c:6,r:3,name:'Turista',pal:mkPal('#1c1c1c','#27ae60','#2b2b38','#e8b48f'),dir:'right',photo:true,cam:'phone',seed:2.0,per:3.3,lines:[
    ["Ancora una foto, per favore!","Perfetto. Bellissimo. Un'altra?"]],after:['* (Italian: "One more photo, please! ...Perfect. Beautiful. Another one?")']},
  {id:'tour_e4',map:'einstein',c:13,r:3,name:'Tourist (needs a photographer)',pal:mkPal('#5a3b22','#e74c3c','#2b2b38','#8d5a3b'),dir:'left',photo:true,cam:'phone',seed:0.7,per:3.8,lines:[
    ["Excuse me! Could you take a photo of us with the locker?"]],after:[()=>photoFavor()]},
  {id:'emre',map:'cabrec',c:11,r:2,name:'Emre',pal:mkPal('#1c1c1c','#c0392b','#2b2b38','#d9a57b'),dir:'right',lines:[
    ["Kanka, bu haftaki Serie'yi yaptın mı?","Ben üçüncü soruda takıldım, iki saattir bakıyorum."],
    ["Kahve makinesi yine bozuk ya.","Sabahtan beri ENTKALKEN yazıyor, kimse bir şey yapmıyor."],
    ["Akşam Niederdorf'a gidiyoruz, sen de gel!","Yarın sabah Übung var ama olsun."]],
    after:['* You understood exactly one word: "Serie".','* You understood one word: "ENTKALKEN". That one was German.','* You caught "Niederdorf" and "Übung". The rest stays a mystery.']},
  {id:'elif',map:'cabrec',c:14,r:3,name:'Elif',pal:mkPal('#5a3b22','#8e44ad','#2b2b38','#e8b48f'),dir:'left',lines:[
    ["Lineer Cebir sınavı çok zor olacakmış, herkes öyle diyor.","Ben şimdiden stres oldum."],
    ["Çay ister misin? Termosta var, hâlâ sıcak."],
    ["Ne bakıyorsun öyle? Türkçe bilmiyor musun?","Tamam tamam, sonra Almanca anlatırım."]],
    after:['* You nod seriously. You have no idea what you just agreed to.',()=>teaGift(),'* You smile and say "Ja, genau." They both laugh. You still don\'t know why.']},
  {id:'lars',map:'cabrec',c:14,r:5,name:'Lars (Töggeli)',pal:mkPal('#e0c068','#27ae60','#2b2b38','#f2c7a5'),dir:'left',lines:[
    ["Töggeli? I'm undefeated since the Herbstsemester.","...I mostly play alone."],["Rule number one: no spinning the rods.","Spinning is for people who also skip the Übungen."]]},
  {id:'mert',map:'mensa',c:8,r:2,name:'Mert',pal:mkPal('#2b2b2b','#2980b9','#2b2b38','#c98e62'),dir:'up',lines:[
    ["Abi, bu kuyruk hiç ilerlemiyor.","Yarım saattir bekliyorum, makarna bitecek."],["Bugün de mi makarna? Her gün makarna!"]],
    after:['* One word sounded a bit like pasta. Everything else: a mystery.','* "Makarna" again. You are now 60% sure it means pasta.']}
];
const npcAt=(m,c,r)=>NPCS.find(n=>n.map===m&&n.c===c&&n.r===r);
const tileAt=(m,c,r)=>{const rows=MAPS[m].rows;return r>=0&&r<rows.length&&c>=0&&c<rows[r].length?rows[r][c]:null;};
function solidAt(px,py){const c=Math.floor(px/TS),r=Math.floor(py/TS),ch=tileAt(G.map,c,r);if(ch===null)return true;return SOLID.has(ch)||!!npcAt(G.map,c,r);}
const blocked=(x,y)=>solidAt(x-7,y-8)||solidAt(x+7,y-8)||solidAt(x-7,y-1)||solidAt(x+7,y-1);

/* ---------------- shared painting helpers ---------------- */
function speck(x,y,c,seed){for(let i=0;i<4;i++){const h=(seed*73+i*37)%997;rect(x+(h%27)+2,y+((h*7)%27)+2,2,2,c);}}
function drawBench(x,y){rect(x+2,y+10,28,5,'#8b5a2b');rect(x+2,y+16,28,5,'#a0703f');rect(x+4,y+21,3,8,'#333');rect(x+25,y+21,3,8,'#333');}
function plant(x,y){rect(x+10,y+20,12,10,'#a0522d');rect(x+8,y+6,16,15,'#3f8a35');rect(x+12,y+2,8,8,'#4fa043');}
function circ(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function skyline(x0,y0,w,h){ // Zurich old town as seen from the Polyterrasse
  const g=ctx.createLinearGradient(0,y0,0,y0+h);g.addColorStop(0,'#a9cdea');g.addColorStop(1,'#e3eef7');ctx.fillStyle=g;ctx.fillRect(x0,y0,w,h);
  const s=w/640,X=v=>x0+v*s;
  ctx.fillStyle='#4f6b4a';ctx.beginPath();ctx.moveTo(X(0),y0+h*0.5);ctx.quadraticCurveTo(X(120),y0+h*0.22,X(270),y0+h*0.56);ctx.lineTo(X(270),y0+h*0.7);ctx.lineTo(X(0),y0+h*0.7);ctx.closePath();ctx.fill();
  rect(X(118),y0+h*0.06,2,h*0.22,'#9aa3ab');rect(X(115),y0+h*0.1,8,3,'#cfd6dc');
  ctx.fillStyle='#e9eef5';ctx.beginPath();ctx.moveTo(X(280),y0+h*0.55);
  [[300,.42],[330,.48],[360,.3],[395,.44],[430,.26],[470,.42],[510,.32],[550,.46],[600,.3],[640,.44]].forEach(([px,py])=>ctx.lineTo(X(px),y0+h*py));
  ctx.lineTo(X(640),y0+h*0.6);ctx.lineTo(X(280),y0+h*0.6);ctx.closePath();ctx.fill();
  rect(X(280),y0+h*0.56,X(640)-X(280),h*0.08,'#5d8fbf');
  const roofY=y0+h*0.66;
  for(let x=0;x<640;x+=14){const hh=h*0.2+((x*13)%7),bx=X(x);rect(bx,y0+h-hh,12*s,hh,'#e7dcc4');ctx.fillStyle=(x/14)%3===0?'#9c4a33':'#b0583b';
    ctx.beginPath();ctx.moveTo(bx-1,y0+h-hh);ctx.lineTo(bx+6*s,y0+h-hh-6);ctx.lineTo(bx+13*s,y0+h-hh);ctx.fill();}
  rect(X(366),roofY-14,12*s,h,'#e6dcc6');ctx.fillStyle='#3f4a45';ctx.beginPath();ctx.moveTo(X(364),roofY-14);ctx.lineTo(X(372),roofY-24);ctx.lineTo(X(380),roofY-14);ctx.fill();circ(X(372),roofY-7,3,'#d4a017');
  rect(X(416),roofY-10,8*s,h,'#d8d2c4');ctx.fillStyle='#4f8f7b';ctx.beginPath();ctx.moveTo(X(414),roofY-10);ctx.lineTo(X(420),roofY-30);ctx.lineTo(X(426),roofY-10);ctx.fill();
  for(const tx of [466,484]){rect(X(tx),roofY-16,10*s,h,'#efe5cc');ctx.fillStyle='#3b3f45';ctx.beginPath();ctx.ellipse(X(tx)+5*s,roofY-16,5*s,7,0,Math.PI,0);ctx.fill();rect(X(tx)+4*s,roofY-26,2,4,'#3b3f45');}}
function drawTram(x,y){for(let s=0;s<2;s++){const sx=x+s*114;rect(sx,y,110,42,'#f4f6f8');rect(sx,y+28,110,10,'#1f5fa8');rect(sx,y,110,3,'#d9dee3');
    for(let i=0;i<5;i++)rect(sx+8+i*20,y+8,14,13,'#2c3e50');rect(sx,y+40,110,3,'#333');}
  rect(x+110,y+4,4,34,'#1f2a33');rect(x+44,y-7,26,2,'#444');rect(x+56,y-7,2,7,'#444');txt('10',x+8,y+27,{size:12,color:'#fff'});}

/* ---------------- tile painters per map ---------------- */
const TILE={
  campus(ch,c,r,x,y){
    const plaza=()=>{rect(x,y,TS,TS,(c+r)%2?'#cfcac1':'#c9c4ba');rect(x,y,TS,1,'#b9b3a8');rect(x,y,1,TS,'#b9b3a8');speck(x,y,'#bdb7ac',c*31+r*17);};
    switch(ch){
      case '.':case 'P':plaza();break;
      case 'D':if(r===4)plaza();break;
      case '_':rect(x,y,TS,TS,'#dad3c5');for(let i=0;i<4;i++)rect(x,y+i*8+6,TS,2,'#bfb7a8');break;
      case 'h':plaza();rect(x+1,y+4,30,26,'#2f5e32');rect(x+3,y+4,26,6,'#3f7a3f');speck(x,y+6,'#264d29',c*7+r);break;
      case 'T':plaza();rect(x+4,y+18,24,13,'#9c968c');rect(x+4,y+18,24,3,'#b5afa5');rect(x+14,y+6,4,13,'#5a3e28');circ(x+16,y+3,15,'#3d7a38');circ(x+11,y-2,6,'#4f9447');break;
      case 'l':plaza();rect(x+15,y-14,3,42,'#2b2b30');rect(x+11,y-20,11,8,'#2b2b30');rect(x+13,y-18,7,4,'#ffe9a8');rect(x+12,y+26,9,3,'#2b2b30');break;
      case 'B':plaza();drawBench(x,y);break;
      case 'o':plaza();rect(x+14,y+8,4,22,'#2f4f4f');rect(x+10,y+28,12,3,'#2b3a3a');rect(x+6,y-3,20,12,'#2e6b5e');rect(x+5,y-1,4,7,'#1d4a40');rect(x+23,y-1,4,7,'#1d4a40');
        rect(x+8,y,6,4,'#9fd3e6');rect(x+18,y,6,4,'#9fd3e6');rect(x+12,y+10,8,7,'#3c7d6e');rect(x+14,y+12,4,2,'#d4a017');break;
      default:break;}},
  uni(ch,c,r,x,y){
    const pave=()=>{rect(x,y,TS,TS,'#d9d5cc');rect(x,y+15,TS,1,'#c6c1b6');rect(x+(r%2?8:24),y,1,TS,'#c6c1b6');};
    switch(ch){
      case '.':case 'D':pave();break;
      case '_':rect(x,y,TS,TS,'#cfc9bd');for(let i=0;i<4;i++)rect(x,y+i*8+6,TS,2,'#b6af9f');break;
      case 'h':pave();rect(x+1,y+4,30,26,'#2f5e32');rect(x+3,y+4,26,6,'#3f7a3f');break;
      case 'b':pave();rect(x+2,y+24,28,2,'#7f8c8d');ctx.strokeStyle='#2c3e50';ctx.lineWidth=2;
        for(const wx of [9,23]){ctx.beginPath();ctx.arc(x+wx,y+20,6,0,Math.PI*2);ctx.stroke();}rect(x+9,y+13,14,2,(c%2)?'#c0392b':'#2980b9');rect(x+15,y+9,2,6,'#2c3e50');break;
      case 'A':pave();rect(x+8,y-18,16,46,'#3d4b3f');rect(x+9,y-12,14,10,'#f1c40f');rect(x+9,y,14,12,'#e74c3c');rect(x+9,y+14,14,8,'#ecf0f1');rect(x+6,y-22,20,5,'#2c3a2f');break;
      case 'B':pave();drawBench(x,y);break;
      case 's':rect(x,y,TS,TS,'#a3a3a3');rect(x,y+TS-4,TS,4,'#c9c9c9');rect(x,y,1,TS,'#959595');break;
      case 'Z':rect(x,y,TS,TS,'#a3a3a3');rect(x,y+TS-4,TS,4,'#c9c9c9');rect(x+15,y-18,3,46,'#2b2b30');rect(x+6,y-26,21,14,'#1f4f8f');txt('H',x+16,y-27,{size:16,align:'center',color:'#fff'});break;
      default:break;}},
  hg(ch,c,r,x,y){
    const fl=()=>{rect(x,y,TS,TS,(c+r)%2?'#e6dcc8':'#ddd1ba');rect(x+4,y+4,24,24,(c+r)%2?'#ece3d1':'#e3d8c3');rect(x,y,TS,1,'#c9bb9f');rect(x,y,1,TS,'#c9bb9f');};
    const wall=()=>{rect(x,y,TS,TS,'#c8b48c');rect(x,y+TS-5,TS,5,'#a8956f');rect(x,y,TS,3,'#d6c4a0');};
    switch(ch){
      case '.':fl();break;
      case '#':wall();if(r===0){ctx.fillStyle='#b59f76';ctx.beginPath();ctx.arc(x+16,y+14,9,Math.PI,0);ctx.fill();rect(x+7,y+14,18,12,'#b59f76');}else if(c===0||c===19)rect(x+12,y,8,TS,'#bda983');break;
      case 'O':fl();hgPillar(x,y);break;
      case 'E':wall();rect(x+2,y+2,28,30,'#3a2618');rect(x+4,y+6,11,26,'#6b4428');rect(x+17,y+6,11,26,'#6b4428');rect(x+12,y+18,2,3,'#e0c068');rect(x+18,y+18,2,3,'#e0c068');break;
      case 'L':wall();rect(x+2,y+2,28,30,'#3a2618');rect(x+4,y+6,11,26,'#8fb0c8');rect(x+17,y+6,11,26,'#8fb0c8');rect(x+15,y+6,2,26,'#3a2618');break;
      case 'N':wall();rect(x+2,y+4,28,22,'#7a5232');rect(x+4,y+6,24,18,'#b07b46');rect(x+6,y+8,8,7,'#fff');rect(x+16,y+9,9,10,'#ffe08a');rect(x+8,y+16,7,6,'#f8b4c4');break;
      case 'p':fl();plant(x,y);break;
      case 'B':fl();drawBench(x,y);break;
      case 'D':if(c===0||c===19){wall();const dx=c===0?14:2;rect(x+dx,y+2,16,30,'#3a2618');rect(x+dx+2,y+4,12,28,'#b98d55');rect(x+dx+4,y+8,8,10,'#bfe0ef');}else{fl();rect(x+2,y+18,28,12,'#7a2e2e');}break;
      default:fl();}},
  cab(ch,c,r,x,y){
    const fl=()=>{rect(x,y,TS,TS,(c+r)%2?'#cfccc4':'#c7c3ba');rect(x,y,TS,1,'#b3afa5');rect(x,y,1,TS,'#b3afa5');};
    const wall=()=>{rect(x,y,TS,TS,'#e8e4dc');rect(x,y+TS-6,TS,6,'#8d8a83');rect(x,y+8,TS,2,'#d8d3c8');};
    const door=col=>{wall();rect(x+4,y+2,24,30,'#3b2a1c');rect(x+6,y+4,20,28,col);rect(x+21,y+18,3,3,'#e0c068');};
    switch(ch){
      case '.':case 'Y':fl();break;
      case '#':wall();break;
      case 'E':door('#6b4a2b');break;
      case 'v':door('#1f5fa8');break;
      case 'G':door('#5b2c6f');break;
      case 'K':wall();rect(x,y+10,TS,22,'#8b6a4a');rect(x,y+8,TS,4,'#c8a27a');rect(x+3,y+12,26,8,'#bfe3f0');rect(x+6,y+15,7,3,'#d68a3c');rect(x+18,y+15,7,3,'#d68a3c');break;
      case 'V':fl();rect(x+3,y-10,26,40,'#2c3e50');rect(x+4,y-9,24,38,'#34495e');rect(x+7,y-6,13,24,'#1d2b38');
        for(let i=0;i<3;i++)for(let j=0;j<2;j++)rect(x+9+j*6,y-4+i*8,3,6,'#f1c40f');rect(x+22,y-4,4,10,'#ecf0f1');rect(x+7,y+21,18,5,'#111');
        rect(x+4,y-9,24,2,(Math.floor(performance.now()/500)%2)?'#ffd166':'#34495e');break;
      case 't':fl();rect(x,y+6,TS,16,'#f2f2f2');rect(x,y+20,TS,2,'#bdbdbd');rect(x+8,y+8,14,9,'#2c3e50');rect(x+9,y+9,12,6,'#7fdbff');break;
      case 'L':fl();rect(x+2,y+1,28,30,'#5a3b22');for(let i=0;i<3;i++){rect(x+4,y+4+i*9,24,7,'#2e1d10');for(let j=0;j<5;j++)rect(x+5+j*5,y+5+i*9,4,6,['#c0392b','#2980b9','#27ae60','#f1c40f','#8e44ad'][(j+i+c)%5]);}break;
      case 'p':fl();plant(x,y);break;
      case 'D':if(c===19){wall();rect(x+2,y+2,18,30,'#3b2a1c');rect(x+4,y+4,14,28,'#c0392b');rect(x+6,y+8,10,8,'#bfe3f0');rect(x+15,y+18,2,3,'#e0c068');}else{fl();rect(x+2,y+18,28,12,'#2c3e50');}break;
      default:fl();}},
  f6(ch,c,r,x,y){
    const floor=()=>{rect(x,y,TS,TS,'#6e2f28');rect(x+((c*7+r*3)%18)+3,y+7+((c+r)%3)*6,12,2,'#86413a');};
    const wall=()=>{rect(x,y,TS,TS,'#e9e8e3');rect(x,y+TS-5,TS,5,'#c9c6bd');};
    const off=r>=3?Math.round(Math.pow(c+0.5-10,2)*0.1):0;
    switch(ch){
      case '.':if(r>=3){rect(x,y,TS,TS,'#c49a5c');for(let i=0;i<4;i++){rect(x,y+i*8,TS,6,'#d9b47a');rect(x,y+i*8+6,TS,2,'#9a7442');}
          if(c===1)rect(x+TS-3,y,3,TS,'#9aa0a6');if(c===18)rect(x,y,3,TS,'#9aa0a6');}else floor();break;
      case 'D':wall();rect(x+3,y+2,26,30,'#9c7444');rect(x+5,y+4,22,28,'#d9b47a');rect(x+9,y+7,14,10,'#bfe0ef');rect(x+22,y+19,3,3,'#555');break;
      case '#':wall();if(r===9&&c>1&&c<18)rect(x,y,TS,TS-5,'#8f6a3c');break;
      case 'Q':wall();rect(x,y+3,TS,18,'#2f3833');rect(x,y+21,TS,3,'#8e8f8a');rect(x,y+24,TS,8,'#d6b07a');rect(x+(c%2?0:TS-1),y+24,1,8,'#a8844a');break;
      case 'X':wall();rect(x+2,y+5,28,17,'#111');rect(x+4,y+7,24,13,(Math.floor(performance.now()/700)%2)?'#24416b':'#2a4a78');break;
      case 'w':floor();rect(x,y+6,TS,22,'#f4f4f2');rect(x,y+26,TS,3,'#c9c9c4');if(c===4){rect(x+8,y,16,11,'#222');rect(x+10,y+2,12,7,'#5c7fa6');}if(c===3)rect(x+6,y-6,14,10,'#2c3e50');break;
      case 'k':rect(x,y,TS,TS,'#8f6a3c');{const yy=y-off;rect(x,yy+2,TS,9,'#e3c58e');rect(x,yy+11,TS,3,'#a37a45');rect(x,yy+16,TS,10,'#d9b47a');rect(x,yy+26,TS,6,'#8f6a3c');
          for(let i=2;i<TS;i+=8)rect(x+i,yy+16,1,10,'#c29e64');}break;
      default:floor();}},
  f7(ch,c,r,x,y){
    const floor=()=>{rect(x,y,TS,TS,'#8a5a32');for(let i=0;i<4;i++){rect(x,y+i*8+7,TS,1,'#6f4626');rect(x+((c*13+r*7+i*11)%24)+4,y+i*8,1,7,'#6f4626');}};
    const wall=()=>{rect(x,y,TS,TS,'#e5dcc5');rect(x,y+TS-8,TS,8,'#6b4428');rect(x,y+TS-9,TS,1,'#4a2f1c');};
    switch(ch){
      case '.':floor();break;
      case 'D':rect(x,y,TS,TS,'#d6ccb4');rect(x+3,y+2,24,30,'#3a2618');rect(x+5,y+4,20,28,'#7a5232');rect(x+8,y+7,14,9,'#bfe0ef');rect(x+21,y+18,2,3,'#e0c068');break;
      case '#':if(r===0||r===9)wall();else{rect(x,y,TS,TS,'#d6ccb4');rect(x+(c===0?TS-6:0),y,6,TS,'#6b4428');
          if(c===19&&r>=2&&r<=7){rect(x+8,y+2,20,28,'#4a3a2a');rect(x+10,y+4,16,24,'#bfe0ef');rect(x+17,y+4,2,24,'#4a3a2a');rect(x+10,y+15,16,2,'#4a3a2a');}}break;
      case 'Q':wall();rect(x,y+2,TS,21,'#2e4a3a');rect(x,y+2,TS,2,'#5a3b22');rect(x,y+23,TS,3,'#5a3b22');rect(x+4+(c%3)*7,y+26,5,2,'#ecebe4');break;
      case 'w':floor();rect(x,y+4,TS,24,'#5a3b22');rect(x,y+4,TS,4,'#7a5232');rect(x,y+26,TS,2,'#3a2618');if(c===9){rect(x+6,y+8,14,9,'#f4f1e6');rect(x+8,y+10,10,1,'#999');rect(x+8,y+13,8,1,'#999');}break;
      case 'k':floor();rect(x,y+1,TS,15,'#6b4428');rect(x,y+1,TS,3,'#8a5a32');rect(x,y+14,TS,2,'#4a2f1c');rect(x,y+21,TS,7,'#5a3b22');rect(x,y+21,TS,2,'#7a5232');break;
      default:floor();}},
  einstein(ch,c,r,x,y){
    const fl=()=>{rect(x,y,TS,TS,(c+r)%2?'#e6dcc8':'#ddd1ba');rect(x+4,y+4,24,24,(c+r)%2?'#ece3d1':'#e3d8c3');rect(x,y,TS,1,'#c9bb9f');rect(x,y,1,TS,'#c9bb9f');};
    const wall=()=>{rect(x,y,TS,TS,'#c8b48c');rect(x,y+TS-5,TS,5,'#a8956f');rect(x,y,TS,3,'#d6c4a0');};
    switch(ch){
      case '.':fl();break;
      case '#':wall();if(c===0||c===19)rect(x+12,y,8,TS,'#bda983');break;
      case 'D':wall();rect(x+14,y+2,16,30,'#3a2618');rect(x+16,y+4,12,28,'#b98d55');rect(x+18,y+8,8,10,'#bfe0ef');break;
      case 'U':wall();for(const dx of [1,17]){rect(x+dx,y+1,14,31,'#5a3d24');rect(x+dx+1,y+2,12,29,'#86613d');rect(x+dx+3,y+5,8,1,'#5a3b22');rect(x+dx+3,y+8,8,1,'#5a3b22');rect(x+dx+4,y+13,6,3,'#d8c9a0');rect(x+dx+9,y+19,2,3,'#3a2618');}break;
      case 'Y':wall();rect(x+(c===9?1:0),y,31,32,'#4a2f1c');rect(x+(c===9?4:0),y+3,28,22,'#cfe3ea');rect(x,y+25,TS,7,'#b8902a');break;
      case 'r':fl();rect(x,y+12,TS,3,'#8e1b2b');if(c===8||c===11){const px=c===8?4:24;rect(x+px,y+4,4,24,'#c9a227');rect(x+px-2,y+26,8,3,'#8a6d1f');rect(x+px-1,y+2,6,3,'#e0c068');}break;
      case '^':rect(x,y,TS,TS,'#c8b48c');rect(x,y+4,TS,5,'#efe6d2');for(let i=3;i<TS;i+=8)rect(x+i,y+9,4,16,'#d8ceb8');rect(x,y+25,TS,5,'#bfb391');break;
      case '~':rect(x,y,TS,TS,'#8f846f');rect(x+4,y+4,24,24,(c+r)%2?'#9d917b':'#978b75');break;
      default:fl();}},
  cabrec(ch,c,r,x,y){
    const fl=()=>{rect(x,y,TS,TS,'#b98d55');rect(x,y+15,TS,1,'#a57a46');rect(x+((c*7+r*13)%24)+4,y,1,15,'#a57a46');rect(x+((c*11+r*5)%24)+2,y+16,1,16,'#a57a46');};
    const wall=()=>{rect(x,y,TS,TS,'#e8e4dc');rect(x,y+TS-6,TS,6,'#8d8a83');rect(x,y+10,TS,3,'#c0392b');};
    switch(ch){
      case '.':fl();break;
      case '#':if(r===0||r===9)wall();else{rect(x,y,TS,TS,'#e1ddd4');rect(x+(c===0?TS-5:0),y,5,TS,'#c0392b');}break;
      case 'D':rect(x,y,TS,TS,'#e1ddd4');rect(x+12,y+2,18,30,'#3b2a1c');rect(x+14,y+4,14,28,'#c0392b');rect(x+16,y+8,10,8,'#bfe3f0');break;
      case 'K':{wall();rect(x+2,y+18,28,14,'#8b6a4a');rect(x+2,y+17,28,2,'#a88462');const br=machineBroken();rect(x+8,y+1,16,18,'#2b2b2b');rect(x+9,y+2,14,6,br?'#3a0d0d':'#0d2a12');rect(x+10,y+9,12,2,'#9aa0a6');
        if(br){if(Math.floor(performance.now()/400)%2)rect(x+11,y+4,10,2,'#ff4d4d');rect(x+20,y+9,10,10,'#fffbe6');rect(x+22,y+12,1,1,'#333');rect(x+27,y+12,1,1,'#333');rect(x+23,y+15,4,1,'#333');rect(x+22,y+16,1,1,'#333');rect(x+27,y+16,1,1,'#333');}
        else{rect(x+11,y+4,10,2,'#5dff7a');rect(x+13,y+12,6,5,'#f4f4f4');rect(x+14,y+13,4,2,'#6b3e1e');}break;}
      case 'R':case 'I':wall();break;
      case 'M':wall();rect(x,y+16,TS,16,'#8b6a4a');rect(x,y+15,TS,2,'#a88462');if(c===13){rect(x+4,y+3,24,14,'#ecf0f1');rect(x+6,y+5,14,10,'#2c3e50');rect(x+22,y+6,4,8,'#95a5a6');}else{rect(x+3,y+10,8,6,'#e67e22');rect(x+13,y+11,8,5,'#3498db');rect(x+23,y+12,6,4,'#27ae60');}break;
      case 'V':{wall();rect(x+3,y-6,26,38,'#f4f6f7');rect(x+3,y-6,26,2,'#ffffff');rect(x+3,y+8,26,1,'#bdc3c7');rect(x+24,y-2,2,8,'#95a5a6');rect(x+24,y+12,2,10,'#95a5a6');
        if(dayNo()-G.freeBeerDay<3){rect(x+8,y+15,10,8,'#d4a017');rect(x+10,y+11,6,5,'#7f8c8d');rect(x+11,y+12,4,4,'#f4f6f7');}else rect(x+8,y+14,10,8,'#2ecc71');break;}
      case 'S':{fl();const top=r===2;rect(x,y+4,TS,24,'#2e7d7a');rect(x,top?y+4:y+21,TS,7,'#25615f');if(c===2)rect(x,y+4,5,24,'#25615f');if(c===4)rect(x+27,y+4,5,24,'#25615f');if(c<4)rect(x+31,top?y+11:y+4,1,17,'#25615f');break;}
      case 't':fl();rect(x,y+3,TS,26,'#d6c3a5');rect(x,y+3,TS,2,'#e8d8bc');rect(x+6+(c%2)*12,y+9+(r%2)*6,4,6,'#b5462e');rect(x+6+(c%2)*12,y+9+(r%2)*6,4,1,'#e8d8bc');if(c===13&&r===2){rect(x+18,y+6,7,14,'#4a6b8a');rect(x+19,y+4,5,3,'#2c3e50');}break;
      case 'G':fl();rect(x,y+5,TS,22,'#3b2a1c');rect(x+(c===12?2:0),y+7,TS-2,18,'#2e8b57');rect(x+(c===12?2:0),y+15,TS-2,1,'#e8f5e9');rect(c===12?x+2:x+TS-4,y+12,2,6,'#ecf0f1');
        for(let i=6;i<TS;i+=8){rect(x+i,y+2,2,28,'#bdc3c7');rect(x+i-1,y+9+((i>>3)%2)*7,4,3,(i+c*TS)%16<8?'#c0392b':'#1f5fa8');}break;
      case 'p':fl();plant(x,y);break;
      default:fl();}},
  mensa(ch,c,r,x,y){
    const fl=()=>{rect(x,y,TS,TS,(c+r)%2?'#e3d8c4':'#ddd1bb');rect(x,y,TS,1,'#cdbfa5');};
    switch(ch){
      case '.':fl();break;
      case 'D':fl();rect(x,y+4,6,24,'#6b4428');break;
      case '#':rect(x,y,TS,TS,'#c9b597');rect(x,y+TS-5,TS,5,'#a8926f');break;
      case 'M':fl();rect(x,y+6,TS,24,'#9aa4ad');rect(x,y+4,TS,5,'#d4dbe0');rect(x+2,y,TS-4,4,'rgba(200,230,255,.6)');
        rect(x+5,y+11,10,8,['#e67e22','#27ae60','#f1c40f','#c0392b'][c%4]);rect(x+18,y+11,10,8,['#ecf0f1','#d35400','#8e44ad','#16a085'][c%4]);break;
      case 't':fl();rect(x,y+8,TS,14,'#b07b46');rect(x,y+8,TS,2,'#c98f55');if(c%2){rect(x+8,y+11,8,6,'#fff');rect(x+10,y+12,4,3,'#e67e22');}break;
      case 'J':fl();rect(x+14,y+16,4,14,'#5a3b22');rect(x+2,y,28,20,'#b07b46');rect(x+5,y+3,9,7,'#fff');rect(x+17,y+5,9,9,'#ffe08a');rect(x+7,y+12,8,6,'#cde');break;
      case 'p':fl();plant(x,y);break;
      default:break;}}
};

/* ---------------- set pieces drawn after tiles ---------------- */
const PAINT={
  campus(t){const y0=HUD,fy=y0+32;
    const g=ctx.createLinearGradient(0,y0,0,fy);g.addColorStop(0,'#86b6de');g.addColorStop(1,'#cde2f1');ctx.fillStyle=g;ctx.fillRect(0,y0,W,32);
    ctx.fillStyle='#46555f';ctx.beginPath();ctx.ellipse(320,fy-2,64,30,0,Math.PI,0);ctx.fill();
    ctx.fillStyle='#55666f';ctx.beginPath();ctx.moveTo(300,fy-2);ctx.ellipse(300,fy-2,30,26,0,Math.PI,1.5*Math.PI);ctx.closePath();ctx.fill();
    for(let i=-2;i<=2;i++)rect(320+i*22,fy-26+Math.abs(i)*5,2,24-Math.abs(i)*5,'#3a4750');
    rect(0,fy-4,W,4,'#bba779');rect(0,fy,W,64,'#dccba4');
    for(let c=0;c<20;c++){if(c>=8&&c<=11)continue;const x=c*TS;
      rect(x,fy,3,32,'#cebd94');ctx.fillStyle='#46596c';ctx.beginPath();ctx.arc(x+16,fy+12,7,Math.PI,0);ctx.fill();rect(x+9,fy+12,14,14,'#46596c');
      rect(x+15,fy+5,2,21,'#cdbb92');rect(x+7,fy+26,18,3,'#c2ae85');}
    rect(0,fy+31,W,4,'#c4b088');for(let yy=fy+38;yy<fy+64;yy+=6)rect(0,yy,W,1,'#c6b48c');
    for(let c=0;c<20;c++){if(c>=8&&c<=11)continue;const x=c*TS;rect(x+10,fy+40,12,15,'#3f5164');rect(x+10,fy+40,12,2,'#2d3a48');}
    ctx.fillStyle='#e9dcb9';ctx.beginPath();ctx.moveTo(248,fy-2);ctx.lineTo(320,fy-20);ctx.lineTo(392,fy-2);ctx.closePath();ctx.fill();rect(248,fy-3,144,3,'#cdbd96');
    rect(256,fy-2,128,66,'#e5d6b0');
    for(const cx of [262,278,352,368]){rect(cx,fy,10,62,'#f2e8cc');rect(cx+8,fy,2,62,'#d4c6a2');rect(cx-2,fy-2,14,4,'#d9c9a3');rect(cx-2,fy+60,14,4,'#d9c9a3');}
    rect(292,fy+24,56,40,'#2a1c12');ctx.fillStyle='#2a1c12';ctx.beginPath();ctx.arc(320,fy+24,28,Math.PI,0);ctx.fill();
    ctx.fillStyle='#9fb8cc';ctx.beginPath();ctx.arc(320,fy+24,22,Math.PI,0);ctx.fill();rect(319,fy+2,2,22,'#2a1c12');
    rect(296,fy+28,23,36,'#6b4428');rect(321,fy+28,23,36,'#6b4428');rect(300,fy+32,15,12,'#7d5233');rect(325,fy+32,15,12,'#7d5233');
    const sx=544,sy=y0+6*TS;rect(sx+2,sy+2,60,62,'#e8e6e1');rect(sx+2,sy+2,60,14,'#c0392b');txt('POLYBAHN',sx+32,sy+2,{size:14,align:'center',color:'#fff'});
    rect(sx+8,sy+22,48,14,'#7fa6c6');rect(sx+24,sy+40,16,24,'#5c6670');
    const by=y0+8*TS;rect(0,by,W,16,'#cfc9bd');rect(0,by,W,5,'#ece6da');for(let x=3;x<W;x+=9)rect(x,by+5,4,8,'#ddd5c6');rect(0,by+12,W,4,'#d2c9b8');
    const py=by+16;skyline(0,py,W,H-py);
    ctx.strokeStyle='#6d6d6d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(560,py);ctx.lineTo(640,H);ctx.stroke();
    const k=(Math.sin(t*0.4)+1)/2;ctx.save();ctx.translate(566+k*40,py+6+k*22);ctx.rotate(0.5);rect(-14,-7,28,14,'#c0392b');rect(-11,-4,22,5,'#f5d6a1');ctx.restore();},
  uni(t){const y0=HUD;
    rect(0,y0,W,14,'#5c6268');for(let c=0;c<20;c+=2){rect(c*TS+10,y0+2,12,10,'#7d858c');rect(c*TS+13,y0+5,6,6,'#2f3a44');}
    rect(0,y0+14,W,4,'#b9ad8f');rect(0,y0+18,W,78,'#d6cbb0');rect(0,y0+50,W,3,'#c3b696');
    for(let c=0;c<20;c++){if(c===9||c===10)continue;const x=c*TS;
      rect(x+9,y0+22,14,24,'#3f5164');rect(x+7,y0+20,18,3,'#c3b696');rect(x+15,y0+22,2,24,'#cfc4a8');
      rect(x+9,y0+58,14,24,'#3f5164');rect(x+7,y0+56,18,3,'#c3b696');rect(x+15,y0+58,2,24,'#cfc4a8');}
    rect(0,y0+86,W,10,'#b9ad8f');
    rect(286,y0+50,68,46,'#1f2a33');for(let i=0;i<5;i++)rect(288+i*16,y0+52,2,44,'#9aa5ad');rect(280,y0+46,80,6,'#9aa0a6');
    txt('CAB',320,y0+24,{font:PX,size:16,align:'center',color:'#2a3440'});
    const ry=y0+7*TS;rect(0,ry,W,64,'#55585e');for(const k of [14,22,42,50])rect(0,ry+k,W,2,'#8e9196');rect(0,ry-1,W,1,'#33363b');
    drawTram(((t*70)%1500)-520,ry+10);
    const gy=y0+9*TS;rect(0,gy,W,32,'#a9a9a9');for(let x=0;x<W;x+=80){rect(x+6,gy+8,68,24,'#d9cfb8');rect(x+16,gy+14,12,10,'#3f5164');rect(x+48,gy+14,12,10,'#3f5164');}},
  f6(t){const y0=HUD;
    txt('HG F 6',4*TS+8,y0+5,{size:14,color:'rgba(230,240,230,.75)'});txt('∫ Lernphase dt = ∞',7*TS,y0+5,{size:14,color:'rgba(230,240,230,.75)'});txt('goat',15*TS+6,y0+10,{size:12,color:'rgba(230,240,230,.45)'});
    for(let r=3;r<=8;r++)for(let c=2;c<18;c++){if(c===9||c===10||(c*7+r*3)%5!==0)continue;const off=Math.round(Math.pow(c+0.5-10,2)*0.1),x=c*TS,y=y0+r*TS-off;
      rect(x+10,y+4,12,10,['#3b2a1e','#d9b13b','#1c1c1c','#8a5a2b','#c0392b'][(c+r)%5]);rect(x+8,y+12,16,6,['#2e8b57','#1f5fa8','#8e44ad','#e67e22','#34495e'][(c*3+r)%5]);}
    ctx.globalAlpha=0.08;for(let i=0;i<5;i++)rect(40+i*120,y0+32,70,2,'#ffffff');ctx.globalAlpha=1;},
  hg(){ctx.globalAlpha=0.1;ctx.fillStyle='#fffbe8';for(const bx of [150,330,500]){ctx.beginPath();ctx.moveTo(bx,HUD+32);ctx.lineTo(bx+40,HUD+32);ctx.lineTo(bx+90,H-40);ctx.lineTo(bx+10,H-40);ctx.closePath();ctx.fill();}ctx.globalAlpha=1;},
  cab(){drawCray(320,HUD+4*TS+6);},
  f7(){const y0=HUD,ch='rgba(236,240,232,.85)';
    txt('Ax = λx',5*TS+4,y0+5,{size:16,color:ch});txt('det(A − λI) = 0',8*TS+8,y0+5,{size:16,color:ch});txt('⇒ Eigenwerte',13*TS+14,y0+7,{size:14,color:'rgba(236,240,232,.6)'});
    const sx=5*TS+3,sy=y0+3*TS+3,sc='rgba(205,170,120,.75)';txt('Sind Sie vorbei?',sx,sy-1,{size:11,color:sc});
    for(let g=0;g<4;g++){for(let i=0;i<4;i++)rect(sx+g*10+i*2,sy+9,1,4,sc);rect(sx+g*10-1,sy+11,9,1,sc);}for(let i=0;i<3;i++)rect(sx+42+i*2,sy+9,1,4,sc);
    for(let r=3;r<=8;r++)for(let c=2;c<18;c++){if(c===9||c===10||(c*5+r*7)%6!==0||(r===3&&c>=5&&c<=8))continue;const x=c*TS,y=y0+r*TS;
      rect(x+10,y+12,12,9,['#3b2a1e','#d9b13b','#1c1c1c','#8a5a2b','#c0392b'][(c+r)%5]);rect(x+8,y+20,16,7,['#2e8b57','#1f5fa8','#8e44ad','#e67e22','#34495e'][(c*3+r)%5]);}
    },
  einstein(){const y0=HUD;
    ctx.globalAlpha=0.16;ctx.fillStyle='#fff2b0';ctx.beginPath();ctx.moveTo(9*TS+12,y0);ctx.lineTo(11*TS-12,y0);ctx.lineTo(11*TS+30,y0+3*TS);ctx.lineTo(9*TS-30,y0+3*TS);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    const gx=9*TS+6,gy=y0+4;rect(gx+3,gy+1,13,16,'#a5865a');rect(gx+5,gy+3,9,12,'#6e5a44');rect(gx+7,gy+5,5,5,'#9c8466');
    rect(gx+20,gy,14,19,'#f4f1e6');for(let i=0;i<5;i++)rect(gx+22,gy+3+i*3,10,1,'#8a8a8a');
    rect(gx+38,gy+2,16,15,'#efe9d6');txt('E=mc²',gx+46,gy+4,{size:10,align:'center',color:'#333'});
    txt('ALBERT EINSTEIN',10*TS,y0+25,{size:10,align:'center',color:'#3a2618'});
    for(const px of [4,8,11,15]){rect(px*TS+9,y0+7*TS+10,14,14,'#d8cbb0');rect(px*TS+11,y0+7*TS+12,10,10,'#e6dcc6');}
    rect(16*TS+10,y0+8*TS+8,8,5,'#f4f1ea');rect(16*TS+9,y0+8*TS+7,2,2,'#8c7a5b');
    for(const [px,py,col] of [[6,8,'#16a085'],[13,7,'#8e44ad'],[3,8,'#34495e']]){circ(px*TS+16,y0+py*TS+16,4,col);circ(px*TS+16,y0+py*TS+14,2,'#3b2a1e');}
    ctx.globalAlpha=0.25;rect(0,y0+7*TS,W,3*TS,'#000');ctx.globalAlpha=1;},
  cabrec(){const y0=HUD;
    const bx=3*TS+3,bw=5*TS-6;rect(bx,y0+1,bw,28,'#7a5232');rect(bx+2,y0+3,bw-4,24,'#c49a6c');rect(bx+6,y0+4,bw-12,22,'#fffbe6');
    const fit=(s,max)=>{let z=12;while(z>8&&tw(s,z)>max)z--;return z;};
    txt('2 Kafi ODER 1 Bier pro Tag',bx+bw/2,y0+5,{size:fit('2 Kafi ODER 1 Bier pro Tag',bw-16),align:'center',color:'#333'});txt('Bier: alle 3 Tage!',bx+bw/2,y0+15,{size:fit('Bier: alle 3 Tage!',bw-16),align:'center',color:'#c0392b'});
    const px=9*TS+3,pw=2*TS-6;rect(px,y0+1,pw,28,'#1f4f8f');rect(px+2,y0+3,pw-4,24,'#e8f0fb');bigWord('IOI',px+pw/2-1,y0+4,2,'#2f5aa8','#9fb6d8');
    for(let i=0;i<7;i++){rect(px+6+i*7,y0+20,3,3,'#f2c7a5');rect(px+5+i*7,y0+23,5,3,'#2f5aa8');}},
  mensa(){const y0=HUD;rect(32,y0,224,32,'#5b3a26');
    const board=(x,title,price,col)=>{rect(x,y0+3,104,26,'#1d1d1f');rect(x,y0+3,104,10,col);txt(title,x+52,y0+2,{size:12,align:'center'});txt(price,x+52,y0+13,{size:16,align:'center',color:'#ffd166'});};
    board(38,'natürlich vegi','5.40','#3c8d40');board(146,'LOCAL','10.50','#c0392b');
    const wx=256,ww=352;rect(wx,y0,ww,32,'#2f353b');ctx.save();ctx.beginPath();ctx.rect(wx+2,y0+2,ww-4,28);ctx.clip();skyline(wx,y0+2,ww,28);ctx.restore();
    for(let x=wx;x<=wx+ww;x+=32)rect(x-1,y0,3,32,'#2f353b');}
};
function drawCray(cx,cy){
  ctx.fillStyle='#3d2a22';ctx.beginPath();ctx.ellipse(cx,cy+14,76,22,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#6b3a2a';ctx.beginPath();ctx.ellipse(cx,cy+10,72,18,0,0,Math.PI*2);ctx.fill();
  const panels=[];for(let i=0;i<14;i++){const a=(i+0.5)/14*Math.PI*2;if(Math.sin(a)<-0.8)continue;panels.push({a,x:cx+Math.cos(a)*50,y:cy+Math.sin(a)*12});}
  panels.sort((p,q)=>p.y-q.y);
  for(const p of panels){const sh=0.72+0.28*Math.max(0,Math.sin(p.a)+0.3),col=`rgb(${Math.round(242*sh)},${Math.round(194*sh)},${Math.round(48*sh)})`;
    rect(p.x-7,p.y-46,14,46,col);rect(p.x-7,p.y-46,14,3,'#fff2b0');rect(p.x-7,p.y-3,14,3,'#7a5a10');}
  ctx.fillStyle='#7a4532';ctx.beginPath();ctx.ellipse(cx,cy+12,72,16,0,0,Math.PI);ctx.fill();
  const lw=tw('CRAY X-MP/28',14)+10;rect(cx-lw/2,cy+30,lw,14,'#1d2633');txt('CRAY X-MP/28',cx,cy+30,{size:14,align:'center',color:'#f2c230'});}
function drawSign(c,r,s){const w=tw(s,14)+8,cx=clamp(c*TS+16,w/2+2,W-w/2-2),y=HUD+r*TS+1;rect(cx-w/2,y,w,13,'#1d2633');txt(s,cx,y,{size:14,align:'center',color:'#fff'});}

/* ---------------- HUD ---------------- */
function drawHUD(){rect(0,0,W,HUD,'#0c0a16');rect(0,HUD-2,W,2,'#2a2445');
  let x=10;const item=(s,c,y)=>{txt(s,x,y,{size:18,color:c});x+=tw(s,18)+14;};
  item(`${semester()} · WEEK ${G.week}/14 · ${dayName()}`,'#ffd166',3);item(`AP ${'●'.repeat(G.ap)}${'○'.repeat(3-G.ap)}`,'#7fdbff',3);item(`LV ${G.level}`,'#fff',3);item(`XP ${G.xp}/${nextXP()}`,'#fff',3);item(`KP ${G.ects}/56`,'#9be564',3);
  x=10;item(`SANITY ${G.sanity}`,G.sanity<25?'#ff5d5d':'#fff',20);item(`${chf(G.money)} CHF`,'#fff',20);item(`BEER ${G.beers}`,'#f1c40f',20);if(G.buff)item('(buzzed)','#ff6ad5',20);
  txt(MAPS[G.map].name,W-10,20,{size:18,align:'right',color:'#8f89b0'});}

/* ---------------- overworld scene ---------------- */
const DIRV={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const OW={get music(){return MAPS[G.map].music;},anim:0,banner:0,moving:false,t:0,flashUntil:0,
  update(dt){this.t+=dt;this.banner-=dt;if(lock)return;
    if(back()){flow(menu);return;}
    if(hit('ok')){const v=DIRV[G.dir],c=Math.floor((G.x+v[0]*22)/TS),r=Math.floor((G.y-8+v[1]*24)/TS);
      const n=npcAt(G.map,c,r);if(n){flow(()=>talkNPC(n));return;}
      const ch=tileAt(G.map,c,r);if(ch&&INTERACT.has(ch)){flow(()=>interact(ch,c,r));return;}
      const fx=G.x+v[0]*22,fy=G.y-8+v[1]*24,inR=(e,x,y)=>x>=e.x0&&x<=e.x1&&y>=e.y0&&y<=e.y1;
      const egg=EGGS.find(e=>e.map===G.map&&(inR(e,fx,fy)||inR(e,G.x,G.y-8)));if(egg){flow(egg.fn);return;}}
    const dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
    if(dx||dy){
      if(dy&&!dx)G.dir=dy<0?'up':'down';else if(dx&&!dy)G.dir=dx<0?'left':'right';
      else if(!((G.dir==='left'&&dx<0)||(G.dir==='right'&&dx>0)||(G.dir==='up'&&dy<0)||(G.dir==='down'&&dy>0)))G.dir=dx<0?'left':'right';
      const sp=(keys.c?175:115)*(dx&&dy?0.7071:1),nx=G.x+dx*sp*dt;if(!blocked(nx,G.y))G.x=nx;const ny=G.y+dy*sp*dt;if(!blocked(G.x,ny))G.y=ny;
      this.anim+=dt*(keys.c?12:8);this.moving=true;}else this.moving=false;
    const d=MAPS[G.map].doors[Math.floor(G.x/TS)+','+Math.floor((G.y-6)/TS)];
    if(d){lock=true;this.moving=false;SFX.door();fadeTo(()=>{G.map=d[0];G.x=d[1]*TS+16;G.y=d[2]*TS+28;G.dir=d[3];playSong(MAPS[G.map].music);this.banner=2.2;lock=false;});}},
  draw(){const m=MAPS[G.map],tp=TILE[G.map];rect(0,0,W,H,'#000');
    m.rows.forEach((row,r)=>{for(let c=0;c<row.length;c++)tp(row[c],c,r,c*TS,HUD+r*TS);});
    PAINT[G.map](this.t);m.signs.forEach(s=>drawSign(...s));
    const side=G.dir==='left'||G.dir==='right',f=this.moving?(side?Math.floor(this.anim)%2:1+Math.floor(this.anim)%2):0;
    const ents=NPCS.filter(n=>n.map===G.map).map(n=>({y:n.r*TS+30,d:()=>{const x=n.c*TS+16,y=HUD+n.r*TS+30,dir=n.face||n.dir;
      if(n.goat)return drawGoat(x,y,dir==='right');drawChar(n.pal,dir,0,x,y);if(n.photo)drawPhoto(n,x,y,dir);}}));
    ents.push({y:G.y,d:()=>drawChar(PAL.player,G.dir,f,G.x,HUD+G.y)});ents.sort((a,b)=>a.y-b.y).forEach(e=>e.d());
    drawHUD();
    if(performance.now()<this.flashUntil){ctx.globalAlpha=0.8;rect(0,0,W,H,'#fff');ctx.globalAlpha=1;}
    if(this.banner>0){ctx.globalAlpha=clamp(this.banner,0,1);const s=m.name,w=tw(s,22)+30;rect(W/2-w/2,52,w,30,'rgba(0,0,0,.75)');txt(s,W/2,56,{size:22,align:'center',color:'#ffd166'});ctx.globalAlpha=1;}}
};
