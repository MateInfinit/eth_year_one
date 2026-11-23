/* ---------------- shared minigame bits ---------------- */
const COURSE={diskret:'Diskrete Mathematik',linalg:'Lineare Algebra',eprog:'Einführung in die Programmierung',ad:'Algorithmen und Datenstrukturen',analysis:'Analysis I',ddca:'Digital Design and Computer Architecture',aw:'Algorithmen und Wahrscheinlichkeit',pprog:'Parallele Programmierung',life:'Studileben'};
function introCard(t,sub){rect(0,0,W,H,'rgba(0,0,0,.84)');txt(t,W/2,140,{font:PX,size:16,align:'center',color:'#ffd166'});txt(sub,W/2,176,{size:22,align:'center',color:'#fff'});txt('GET READY...',W/2,214,{size:20,align:'center',color:'#8f89b0'});}
function bgGrid(c){rect(0,0,W,H,c);for(let x=0;x<W;x+=32)rect(x,0,1,H,'#17152c');for(let y=0;y<H;y+=32)rect(0,y,W,1,'#17152c');}
function endMini(S,done,score){if(S.ended)return;S.ended=true;fadeTo(()=>{setScene(OW);done(score);});}

/* ---------------- Übung: quiz ---------------- */
const QUIZ=[
  {k:'diskret',q:'What is the negation of "∀x: P(x)"?',o:['∃x: ¬P(x)','∀x: ¬P(x)','∃x: P(x)','¬∀x: ¬P(x)']},
  {k:'diskret',q:'How many subsets does a set with 4 elements have?',o:['16','8','4','24']},
  {k:'diskret',q:'gcd(12, 18) = ?',o:['6','3','36','2']},
  {k:'diskret',q:'Which of these is a real proof technique?',o:['Induction','Proof by vibes','Proof by "trust me"','Proof by majority vote']},
  {k:'diskret',q:'"A → B" is false exactly when...',o:['A is true and B is false','A is false and B is true','both are false','both are true']},
  {k:'linalg',q:'What is the determinant of the 3×3 identity matrix?',o:['1','0','3','9']},
  {k:'linalg',q:'A square matrix is invertible exactly when its determinant is...',o:['not 0','0','1','positive']},
  {k:'linalg',q:'An eigenvector of A is a vector that A only...',o:['scales','rotates by 90°','deletes','forwards to the TA']},
  {k:'linalg',q:'What is the dimension of ℝ³?',o:['3','1','9','∞']},
  {k:'analysis',q:'d/dx eˣ = ?',o:['eˣ','x · eˣ⁻¹','1','ln x']},
  {k:'analysis',q:'lim 1/n for n → ∞ = ?',o:['0','1','∞','does not exist']},
  {k:'analysis',q:'∫ 2x dx = ?',o:['x² + C','2x² + C','x + C','2 + C']},
  {k:'analysis',q:'Which sequence converges?',o:['1/n','n','(−1)ⁿ','n²']},
  {k:'eprog',q:'In Java, how do you compare the contents of two Strings a and b?',o:['a.equals(b)','a == b','a = b','a.same(b)']},
  {k:'eprog',q:'The index of the first element of a Java array is...',o:['0','1','−1','depends on the mood']},
  {k:'eprog',q:'Binary search on a sorted array takes...',o:['O(log n)','O(n)','O(n²)','O(1)']},
  {k:'eprog',q:'Which of these loops never ends?',o:['while (true) {}','for (int i = 0; i < 3; i++) {}','do {} while (false);','if (true) {}']},
  {k:'ddca',q:'NAND with inputs 1 and 1 gives...',o:['0','1','X','2']},
  {k:'ddca',q:'How many different values can 8 bits represent?',o:['256','255','8','512']},
  {k:'ddca',q:'Binary 1011 in decimal is...',o:['11','13','9','1011']},
  {k:'ddca',q:'Which gate outputs 1 exactly when its two inputs differ?',o:['XOR','AND','NOR','NAND']},
  {k:'ad',q:'Mergesort sorts n elements in (worst case)...',o:['O(n log n)','O(n²)','O(n)','O(log n)']},
  {k:'ad',q:'Which data structure is first-in, first-out (FIFO)?',o:['Queue','Stack','Heap','Binary tree']},
  {k:'ad',q:'Dijkstra\'s algorithm requires edge weights that are...',o:['non-negative','integers','negative','all equal']},
  {k:'ad',q:'The height of a balanced binary search tree with n nodes is...',o:['O(log n)','O(n)','O(1)','O(n log n)']},
  {k:'aw',q:'Expected value of one roll of a fair six-sided die?',o:['3.5','3','6','1/6']},
  {k:'aw',q:'Probability of two heads in two fair coin flips?',o:['1/4','1/2','1/3','1']},
  {k:'aw',q:'Events A and B are independent exactly when...',o:['Pr[A ∩ B] = Pr[A] · Pr[B]','Pr[A ∪ B] = Pr[A] + Pr[B]','Pr[A] = Pr[B]','A ∩ B = ∅']},
  {k:'pprog',q:'Two threads write the same variable without synchronization. That is a...',o:['race condition','deadlock','livelock','stack overflow']},
  {k:'pprog',q:'In Java, which keyword makes a method mutually exclusive on its object?',o:['synchronized','volatile','static','final']},
  {k:'pprog',q:'Mutual exclusion, hold and wait, no preemption and circular wait are the conditions for...',o:['deadlock','starvation','parallel speedup','garbage collection']},
  {k:'life',q:'The most reliable machine in CAB is the...',o:['beer vending machine','coffee machine','printer','submission server']},
  {k:'life',q:'A TA says "this exercise is easy". This means...',o:['it is not easy','it is easy','there is no exercise','free points for everyone']},
  {k:'life',q:'Best strategy for the week before the Basisprüfung?',o:['Sleep, eat, review old exams','Learn everything from scratch at 3am','Become one with the Mensa queue','Panic, but efficiently']}
];
function makeQuiz(done){
  const acad=shuffle(QUIZ.filter(q=>q.k!=='life')).slice(0,4),life=shuffle(QUIZ.filter(q=>q.k==='life')).slice(0,1);
  const qs=shuffle(acad.concat(life)).map(q=>({q:q.q,k:q.k,opts:shuffle(q.o.map((t,i)=>({t,ok:i===0})))}));
  const S={music:'uebung',i:0,sel:0,t:12,fb:null,score:0,intro:1.5,ended:false};
  S.update=dt=>{if(S.intro>0){S.intro-=dt;return;}if(S.ended)return;
    if(S.fb){S.fb.t-=dt;if(S.fb.t<=0||(S.fb.t<1.4&&hit('ok'))){S.fb=null;S.i++;S.sel=0;S.t=12;if(S.i>=qs.length)endMini(S,done,S.score/qs.length);}return;}
    S.t-=dt;if(hit('up')){S.sel=(S.sel+3)%4;SFX.select();}if(hit('down')){S.sel=(S.sel+1)%4;SFX.select();}
    if(hit('ok')||S.t<=0){const q=qs[S.i],ok=S.t>0&&q.opts[S.sel].ok;if(ok){S.score++;SFX.coin();}else SFX.bad();S.fb={ok,t:2,timeout:S.t<=0};}};
  S.draw=()=>{bgGrid('#0b0b16');const q=qs[Math.min(S.i,qs.length-1)];
    txt('ÜBUNG · MATH & LOGIC',24,14,{font:PX,size:16,color:'#ffd166'});
    txt(`Question ${Math.min(S.i+1,qs.length)}/${qs.length} · score ${S.score}`,W-24,12,{size:20,align:'right',color:'#cfc9e8'});
    ubox(30,44,580,292);txt(COURSE[q.k],50,56,{size:18,color:'#8f89b0'});
    wrap(q.q,540,24).forEach((l,i)=>txt(l,50,78+i*24,{size:24}));
    q.opts.forEach((o,i)=>{const y=140+i*34,sel=i===S.sel;let col=sel?'#ffd166':'#fff';if(S.fb){col=o.ok?'#9be564':sel?'#ff5d5d':'#77738f';}
      txt(o.t,90,y,{size:24,color:col});if(sel&&!S.fb)drawHeart(60,y+5,2);});
    if(S.fb)txt(S.fb.ok?'RICHTIG!':S.fb.timeout?'TIME UP!':'FALSCH!',W/2,280,{font:PX,size:16,align:'center',color:S.fb.ok?'#9be564':'#ff5d5d'});
    rect(50,306,540,10,'#2a2445');rect(50,306,540*clamp(S.t/12,0,1),10,S.t<4?'#ff5d5d':'#7fdbff');
    if(S.intro>0)introCard('MATH & LOGIC QUIZ','↑↓ choose · Z answer · 12 seconds per question');};
  return S;}

/* ---------------- Übung: find the bug ---------------- */
const BUGS=[
  {code:['int[] a = {3, 1, 4};','int sum = 0;','for (int i = 0; i <= a.length; i++) {','    sum += a[i];','}'],bug:2,why:'i <= a.length goes one step too far: ArrayIndexOutOfBoundsException. Use i < a.length.'},
  {code:['String pw = readInput();','if (pw == "hunter2") {','    login();','}'],bug:1,why:'== compares references, not contents. Use pw.equals("hunter2").'},
  {code:['int i = 0;','while (i < 10) {','    System.out.println(i);','    i--;','}'],bug:3,why:'i-- moves away from 10, so the loop never ends. You wanted i++.'},
  {code:['int a = 7, b = 2;','double avg = a / b;','System.out.println(avg); // want 3.5'],bug:1,why:'a / b is integer division and gives 3. Write (double) a / b.'},
  {code:['static int max(int x, int y) {','    if (x > y) return x;','    return x;','}'],bug:2,why:'The last return should be y. Right now max(1, 5) returns 1.'},
  {code:['String s = null;','if (s.length() > 0) {','    print(s);','}'],bug:1,why:'s is null, so s.length() throws a NullPointerException. Prof. Null sends regards.'},
  {code:['int count = 0;','for (int i = 0; i < 10; i++);','{','    count++;','}'],bug:1,why:'The ; after the for loop is an empty loop body. count++ runs only once.'}
];
function makeBug(done){const rounds=shuffle(BUGS).slice(0,3);
  const S={music:'uebung',i:0,sel:0,t:20,fb:null,score:0,intro:1.5,ended:false};
  S.update=dt=>{if(S.intro>0){S.intro-=dt;return;}if(S.ended)return;
    if(S.fb){S.fb.t-=dt;if(S.fb.t<=0||(S.fb.t<2.8&&hit('ok'))){S.fb=null;S.i++;S.sel=0;S.t=20;if(S.i>=rounds.length)endMini(S,done,S.score/rounds.length);}return;}
    S.t-=dt;const R=rounds[S.i],n=R.code.length;if(hit('up')){S.sel=(S.sel+n-1)%n;SFX.select();}if(hit('down')){S.sel=(S.sel+1)%n;SFX.select();}
    if(hit('ok')||S.t<=0){const ok=S.t>0&&S.sel===R.bug;if(ok){S.score++;SFX.coin();}else SFX.bad();S.fb={ok,t:3.6,timeout:S.t<=0};}};
  S.draw=()=>{bgGrid('#0b0b16');const R=rounds[Math.min(S.i,rounds.length-1)];
    txt('ÜBUNG · PROGRAMMING',24,14,{font:PX,size:16,color:'#ffd166'});
    txt(`Round ${Math.min(S.i+1,rounds.length)}/${rounds.length} · score ${S.score}`,W-24,12,{size:20,align:'right',color:'#cfc9e8'});
    txt('Which line has the bug?',30,42,{size:22});ubox(30,68,580,172,'#7fdbff');
    R.code.forEach((l,i)=>{const y=84+i*28,sel=i===S.sel;
      if(S.fb&&i===R.bug)rect(36,y-3,568,26,'#1f4d2b');else if(sel)rect(36,y-3,568,26,S.fb?'#4d1f26':'#24304a');
      txt(String(i+1),56,y,{size:22,align:'right',color:'#6f6990'});txt(l,74,y,{size:22,color:sel?'#ffd166':'#e8e8f0'});});
    rect(30,248,580,10,'#2a2445');rect(30,248,580*clamp(S.t/20,0,1),10,S.t<6?'#ff5d5d':'#7fdbff');
    if(S.fb){ubox(30,264,580,86,S.fb.ok?'#9be564':'#ff5d5d');txt(S.fb.ok?'RICHTIG!':S.fb.timeout?'TIME UP!':'FALSCH!',46,274,{font:PX,size:16,color:S.fb.ok?'#9be564':'#ff5d5d'});
      wrap(R.why,548,20).slice(0,2).forEach((l,i)=>txt(l,46,298+i*21,{size:20}));}
    else txt('↑↓ choose a line · Z select',W/2,286,{size:20,align:'center',color:'#8f89b0'});
    if(S.intro>0)introCard('FIND THE BUG','Exactly one line is wrong. 20 seconds per round.');};
  return S;}

/* ---------------- Übung: "Any questions?" ---------------- */
function makeDodge(done){const bx=220,by=170,bw=200,bh=130;
  const QS=['Any questions?','...anyone?','No questions? Great, so everyone understood.','The solution is trivial, so...','...','Questions? Last chance!'];
  const S={music:'uebung',t:0,dur:16,intro:1.6,hx:bx+bw/2,hy:by+bh-20,hits:0,inv:0,bul:[],spawn:0.4,q:0,qT:2.5,ended:false};
  S.update=dt=>{if(S.intro>0){S.intro-=dt;return;}if(S.ended)return;
    S.t+=dt;S.inv-=dt;S.qT-=dt;if(S.qT<=0){S.q=(S.q+1)%QS.length;S.qT=2.6;}
    const dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);
    S.hx=clamp(S.hx+dx*150*dt,bx+10,bx+bw-10);S.hy=clamp(S.hy+dy*150*dt,by+10,by+bh-10);
    S.spawn-=dt;if(S.spawn<=0){const ph=S.t<5?0:S.t<10?1:2;
      if(ph===0){S.bul.push({x:rnd(bx+8,bx+bw-8),y:by-8,vx:0,vy:rnd(90,140)});S.spawn=0.2;}
      else if(ph===1){const l=Math.random()<0.5;S.bul.push({x:l?bx-8:bx+bw+8,y:rnd(by+8,by+bh-8),vx:l?150:-150,vy:0});S.spawn=0.26;}
      else{const a=Math.atan2(S.hy-(by-20),S.hx-W/2);S.bul.push({x:W/2,y:by-20,vx:Math.cos(a)*170,vy:Math.sin(a)*170});if(Math.random()<0.6)S.bul.push({x:rnd(bx+8,bx+bw-8),y:by-8,vx:0,vy:120});S.spawn=0.34;}}
    for(const b of S.bul){b.x+=b.vx*dt;b.y+=b.vy*dt;if(S.inv<=0&&Math.hypot(b.x-S.hx,b.y-S.hy)<9){S.hits++;S.inv=0.9;SFX.hit();b.dead=true;}}
    S.bul=S.bul.filter(b=>!b.dead&&b.y<by+bh+20&&b.y>by-40&&b.x>bx-30&&b.x<bx+bw+30);
    if(S.t>=S.dur)endMini(S,done,clamp(1-S.hits*0.12,0,1));};
  S.draw=()=>{rect(0,0,W,H,'#000');
    txt('ÜBUNG · Q&A SESSION',24,14,{font:PX,size:16,color:'#ffd166'});txt(`Awkward moments: ${S.hits}`,W-24,12,{size:20,align:'right',color:'#cfc9e8'});
    spr(PROF_F,profPal('#c0392b','#f39c12','#2c3e50'),W/2-24,42,4);
    const q=QS[S.q],qw=tw(q,20)+24;ubox(W/2-qw/2,114,qw,32);txt(q,W/2,120,{size:20,align:'center'});
    ubox(bx-3,by-3,bw+6,bh+6);ctx.save();ctx.beginPath();ctx.rect(bx,by,bw,bh);ctx.clip();
    for(const b of S.bul)txt('?',b.x,b.y,{size:22,align:'center',base:'middle',color:'#ffd166'});ctx.restore();
    if(!(S.inv>0&&Math.floor(S.inv*16)%2))drawHeart(S.hx-7,S.hy-6,2);
    rect(bx,by+bh+10,bw,8,'#2a2445');rect(bx,by+bh+10,bw*clamp(1-S.t/S.dur,0,1),8,'#7fdbff');
    txt('Survive the silence until the bar runs out. Arrows move.',W/2,by+bh+24,{size:18,align:'center',color:'#8f89b0'});
    if(S.intro>0)introCard('"ANY QUESTIONS?"','Dodge the question marks. Never make eye contact.');};
  return S;}

/* ---------------- professors (fictional, Swiss-flavoured) ---------------- */
const CY='#ffd166',CR='#ff6b6b',CG='#9be564',CB='#7fdbff',CO='#ffa94d',CV='#c3a6ff',CT='#5fe3c0',CM='#ff9ff3';
const BOSSES={
  diskret:{id:'diskret',name:'Prof. Dr. Reto Beweisli',short:'Prof. Beweisli',course:'Diskrete Mathematik',courseShort:'Diskrete Mathe',sem:'HS',lvl:1,kp:7,hall:'HG F 1',hp:220,sprite:'m',pal:profPal('#ececec','#5a3f7a','#e0c068'),
    chalk:['∀x ∃y: P(x, y)','¬(A ∧ B) ≡ ¬A ∨ ¬B','|P(S)| = 2^|S|','Beweis: trivial. □'],
    taunts:['Hut Hut!','Trivial. Hut Hut.','Hut hut hut...','Beweis: Hut Hut. □'],
    intro:['Grüezi mitenand. Hut Hut! Welcome to Diskrete Mathematik.','Today\'s lemma: for every student x there exists a Serie y that x does not finish.','The proof is trivial. Hut Hut. I will now spend ninety minutes on it.'],
    win:['...Hut Hut. Your argument is correct. And complete.','I am writing "trivial" next to it. That is the highest praise I give.'],
    lose:['Hut Hut. The remaining cases are left as an exercise.','Come back when your proof has fewer holes than an Emmentaler.'],
    phases:A=>[
      {name:'Lemma 1: Quantoren',rate:1.35,atk:[()=>A.aimed({n:3,g:'∀',c:CY}),()=>A.aimed({n:3,g:'∃',c:CY,spread:0.35}),()=>A.aimed({g:'□',pink:true,speed:220})]},
      {name:'Beweis durch Induktion',rate:1.5,atk:[()=>A.bounce({n:3,g:['n','n+1'],c:CG}),()=>A.aimed({n:5,spread:0.3,g:'∀',c:CY,speed:280}),()=>A.bounce({n:3,g:'□',c:CG,pink:true})]},
      {name:'Widerspruchsbeweis',rate:1.35,atk:[()=>A.ring({n:12,g:'¬',c:CR,pinkEvery:4}),()=>A.aimed({n:3,g:'⊥',c:CR,speed:340,spread:0.18}),()=>A.rain({n:9,g:['∃','∀','¬'],c:CY,pinkEvery:5})]}]},
  eprog:{id:'eprog',name:'Prof. Dr. Beat Nullpointer',short:'Prof. Nullpointer',course:'Einführung in die Programmierung',courseShort:'EProg',sem:'HS',lvl:2,kp:7,hall:'HG F 1',hp:250,sprite:'b',pal:profPal('#6b4a2b','#2e7d4f','#e8e8e8'),
    chalk:['public static void main(...)','int x = null; // ?!','while (true) { cry(); }','Code Expert: 0/10 tests'],
    taunts:['Kompiliert es?','Code style: −1.','Did you push to Code Expert?','NullPointer! Ha!'],
    intro:['public static void main(String[] args) {','    student.bestehen(); // TODO','}','Let me run you through Code Expert. Expect red.'],
    win:['BUILD SUCCESSFUL. All tests green.','Fine. You pass. I am still deducting a point for code style.'],
    lose:['Exception in thread "main": StudentNotPreparedException','    at Basisjahr.herbstsemester(ETH.java:1)'],
    phases:A=>[
      {name:'Syntax Error',rate:1.3,atk:[()=>A.rain({n:12,g:';',c:CG,pinkEvery:6}),()=>A.aimed({n:2,g:'{ }',c:CG,spread:0.2,speed:290})]},
      {name:'NullPointerException',rate:1.5,atk:[()=>A.bar({text:'NPE!',speed:320}),()=>{A.aimed({g:'null',c:CR,speed:300});A.later(0.45,()=>A.aimed({g:'null',pink:true,speed:210}));},()=>A.bar({text:'null',speed:360})]},
      {name:'while (true)',rate:2.1,atk:[()=>A.spiral({arms:3,steps:14,g:'()',c:CG,pinkEvery:5}),()=>A.bar({text:'STACK!',speed:340})]}]},
  linalg:{id:'linalg',name:'Prof. Dr. Heidi Eigenwert',short:'Prof. Eigenwert',course:'Lineare Algebra',courseShort:'LinAlg',sem:'HS',lvl:2,kp:7,hall:'HG F 1',hp:260,sprite:'f',pal:profPal('#e3c16f','#2c5d8f','#c0392b'),
    chalk:['Av = λv','det(A − λI) = 0','rank A + dim ker A = n','A⁻¹ exists ⇔ det A ≠ 0'],
    taunts:['Sind Sie vorbei???','...Sind Sie vorbei???','Sind Sie vorbei??? In ℝ³?','SIND SIE VORBEI???'],
    intro:['Grüezi! Let us look at this in ℝ³. Everything is easier in ℝ³.','You are a vector. I am the matrix.','...Sind Sie vorbei???','Then let us see if you are an eigenvector... or just noise.'],
    win:['You kept your direction under my transformation.','Sind Sie vorbei??? ...Yes. Yes, you are. Eigenvalue: very positive.'],
    lose:['det(you) = 0.','Sind Sie vorbei??? No. Come back with full rank.'],
    phases:A=>[
      {name:'Vektoren',rate:1.3,atk:[()=>A.aimed({n:4,spread:0.22,g:'→',c:CB,speed:300}),()=>A.aimed({g:'I',pink:true,speed:230}),()=>A.ring({n:8,g:'λ',c:CB})]},
      {name:'Matrixmultiplikation',rate:1.9,atk:[()=>A.vlas({xs:[40,160,280,400]}),()=>A.vlas({xs:[100,220,340]}),()=>A.aimed({n:3,g:'λ',c:CB,pink:'mid'})]},
      {name:'Determinante = 0',rate:1.8,atk:[()=>{A.hlas({y:FLOOR-12});A.later(1.5,()=>A.hlas({y:FLOOR-70}));},()=>A.atPlayer({count:2}),()=>A.ring({n:10,g:'det',c:CB,pinkEvery:5})]}]},
  ad:{id:'ad',name:'Prof. Dr. Vreni Rekursion',short:'Prof. Rekursion',course:'Algorithmen und Datenstrukturen',courseShort:'A&D',sem:'HS',lvl:3,kp:7,hall:'HG F 1',hp:270,sprite:'f',pal:profPal('#7a4a2a','#a0522d','#f1c40f'),
    chalk:['T(n) = 2T(n/2) + O(n)','⇒ T(n) = O(n log n)','Invariante: A[1..i] sortiert','Dijkstra: Kanten ≥ 0'],
    taunts:['Basisfall!','Invariante?','O(n log n), bitte.','Rekursion... Rekursion...'],
    intro:['To understand recursion, you must first understand recursion.','Today I sort you. In O(n log n), if you behave.','Bubble sort if you don\'t.'],
    win:['Sorted. Stable, even.','Your runtime was... acceptable. Θ(respect).'],
    lose:['Worst case. O(n²).','Back to the base case. Try again with a better invariant.'],
    phases:A=>[
      {name:'O-Notation',rate:1.35,atk:[()=>A.aimed({n:3,g:'O(n)',c:CT,spread:0.28}),()=>A.rain({n:10,g:'n²',c:CT,pinkEvery:5}),()=>A.aimed({g:'O(1)',pink:true,speed:220})]},
      {name:'Mergesort',rate:1.9,atk:[()=>A.sweep({from:30,to:430,step:80,gap:0.22}),()=>A.bounce({n:5,g:['3','1','4','1','5'],c:CT,pink:true})]},
      {name:'Rekursion',rate:1.8,atk:[()=>A.spiral({arms:4,steps:10,g:'f(n−1)',c:CT,pinkEvery:4,speed:160}),()=>A.ring({n:10,g:'n−1',c:CT,pinkEvery:5})]}]},
  analysis:{id:'analysis',name:'Prof. Dr. Urs Grenzwert',short:'Prof. Grenzwert',course:'Analysis I',courseShort:'Analysis I',sem:'FS',lvl:3,kp:7,hall:'HG F 1',hp:290,sprite:'m',pal:profPal('#f0f0f0','#8f5a2c','#2c3e50'),
    chalk:['∀ε > 0 ∃δ > 0','lim 1/n = 0','f′(x) = lim (f(x+h) − f(x)) / h','∫ eˣ dx = eˣ + C'],
    taunts:['Sei ε > 0.','Wähle δ geschickt.','Konvergiert!','Trivialerweise stetig.'],
    intro:['For every ε > 0 there exists a δ > 0...','...such that your chances become arbitrarily small.','Let ε be your hope. Now let it tend to zero.'],
    win:['Your performance converges.','Absolutely, even. Gut gemacht.'],
    lose:['lim (your HP) = 0.','The sequence diverges. Revisit the definitions. Slowly.'],
    phases:A=>[
      {name:'Sei ε > 0',rate:1.7,atk:[()=>A.sine({n:5,g:'ε',c:CO,ys:[FLOOR-45],amp:40,gap:0.42}),()=>A.sine({n:6,g:'ε',c:CO,ys:[FLOOR-130],amp:25,gap:0.25}),()=>A.aimed({g:'dx',pink:true,speed:220})]},
      {name:'Wähle δ',rate:1.8,atk:[()=>A.homing({n:3,g:'δ',c:CO,pink:true}),()=>A.sine({n:5,g:'ε',c:CO,ys:[FLOOR-45],amp:40,gap:0.4})]},
      {name:'lim x → du',rate:1.9,atk:[()=>A.atPlayer({count:3}),()=>{A.sine({n:4,g:'∞',c:CO,ys:[FLOOR-45],amp:40,gap:0.45});A.homing({n:2,g:'δ',c:CO});}]}]},
  ddca:{id:'ddca',name:'Prof. Dr. Gion Gatter',short:'Prof. Gatter',course:'Digital Design and Computer Architecture',courseShort:'DDCA',sem:'FS',lvl:4,kp:7,hall:'HG F 1',hp:300,sprite:'b',pal:profPal('#c96a3a','#555c66','#f1c40f'),
    chalk:['A NAND B = ¬(A ∧ B)','0b1011 = 11','f = 1 / T','add t0, t1, t2'],
    taunts:['Allegra!','Rising edge!','0 or 1. Choose.','Timing!'],
    intro:['Allegra! Every computer is just billions of tiny gates.','Today, I am the gate.','And you... are a 0.'],
    win:['Signal received: 1.','You switched on the rising edge. Respect.'],
    lose:['Timing violation detected.','You missed the clock edge. Again.'],
    phases:A=>[
      {name:'Bits',rate:1.3,atk:[()=>A.bounce({n:4,g:['0','1'],c:CV}),()=>A.aimed({n:3,g:'1',c:CV,spread:0.3,pink:'mid'})]},
      {name:'Taktsignal',rate:1.2,atk:[()=>A.bar({text:'CLK',speed:300,c:CV}),()=>A.bar({text:'CLK',speed:300,high:true,c:CV}),()=>A.aimed({g:'1',pink:true,speed:220})]},
      {name:'Logikgatter',rate:1.6,atk:[()=>A.ring({n:9,g:['AND','OR','XOR','NOT'],c:CV,pinkEvery:3}),()=>A.vlas({xs:[60,200,340]}),()=>A.bounce({n:4,g:['0','1'],c:CV})]}]},
  aw:{id:'aw',name:'Prof. Dr. Erwin Erwartungswert',short:'Prof. Erwartungswert',course:'Algorithmen und Wahrscheinlichkeit',courseShort:'A&W',sem:'FS',lvl:4,kp:7,hall:'HG F 1',hp:300,sprite:'m',pal:profPal('#9a9a9a','#2f6b5a','#e67e22'),
    chalk:['E[X] = Σ x · Pr[X = x]','Pr[A ∪ B] ≤ Pr[A] + Pr[B]','E[X + Y] = E[X] + E[Y]','Las Vegas ≠ Monte Carlo'],
    taunts:['Mit hoher Wahrscheinlichkeit...','E[X] = ?','Linearität des Erwartungswerts!','Zufall? Nein. Pech.'],
    intro:['Welcome. Let X be the number of attacks you dodge.','E[X] = ... let me compute ... oh dear.','With high probability, this ends badly for you.'],
    win:['An outlier! Statistically, you should not exist.','I will need to update my priors.'],
    lose:['As predicted. Pr[you pass] was always small.','But the expected number of attempts is finite. Try again.'],
    phases:A=>[
      {name:'Zufall',rate:1.4,atk:[()=>A.bounce({n:4,g:['1/6','1/2','P(A)'],c:CM}),()=>A.rain({n:12,g:['?','1/6'],c:CM,smin:140,smax:300,pinkEvery:6}),()=>A.aimed({g:'E[X]',pink:true,speed:220})]},
      {name:'Erwartungswert',rate:1.5,atk:[()=>A.ring({n:12,g:'E[X]',c:CM,pinkEvery:6}),()=>A.aimed({n:5,g:'1/2',c:CM,spread:0.25,speed:300})]},
      {name:'Markov-Kette',rate:1.8,atk:[()=>A.vrand({n:3}),()=>{A.homing({n:3,g:'P',c:CM,pink:true});A.later(0.8,()=>A.vrand({n:2}));}]}]},
  pprog:{id:'pprog',name:'Prof. Dr. Sämi Semaphor',short:'Prof. Semaphor',course:'Parallele Programmierung',courseShort:'PProg',sem:'FS',lvl:5,kp:7,hall:'HG F 1',hp:310,sprite:'b',pal:profPal('#2b2b2b','#6b2d5c','#ecf0f1'),
    chalk:['synchronized (lock) { ... }','wait() / notify()','Amdahl: S = 1 / (s + (1−s)/n)','Deadlock: 4 Bedingungen'],
    taunts:['Hoi zäme!','synchronized!','Deadlock incoming.','Join me. join().'],
    intro:['Hoi zäme! Today we do everything in parallel.','I will attack you with four threads at once.','Don\'t worry. Probably no race conditions. Probably.'],
    win:['Deadlock-free and correct. Rare. Beautiful.','You may release the lock now.'],
    lose:['Race condition detected. You lost.','Next time, synchronize your jumps.'],
    phases:A=>[
      {name:'Threads',rate:1.5,atk:[()=>{A.sine({n:6,g:'T1',c:CV,ys:[FLOOR-120],amp:14,gap:0.22});A.sine({n:6,g:'T2',c:CV,ys:[FLOOR-80],amp:10,gap:0.22});},()=>A.aimed({n:2,g:'T3',c:CV,spread:0.2,speed:300}),()=>A.aimed({g:'join()',pink:true,speed:220})]},
      {name:'Race Condition',rate:1.6,atk:[()=>{A.bar({text:'RACE',speed:420});A.later(0.7,()=>A.bar({text:'RACE',speed:260,high:true}));},()=>A.aimed({g:'lock()',pink:true,speed:230}),()=>A.rain({n:8,g:'++',c:CV})]},
      {name:'Deadlock',rate:2.2,atk:[()=>{A.vlas({xs:[30,430]});A.later(0.5,()=>A.vlas({xs:[90,370]}));A.later(1.0,()=>A.vlas({xs:[150,310]}));},()=>A.aimed({n:3,g:'wait()',c:CV,spread:0.2,pink:'mid'})]}]},
  block1:{id:'block1',name:'BASISPRÜFUNG · BLOCK 1',short:'Block 1',course:'A&D · EProg · LinAlg · Diskrete Mathe',courseShort:'Block 1',sem:'HS',lvl:1,kp:0,hall:'Prüfungssession',hp:460,exam:true,paper:'#c0392b',block:'BLOCK 1',
    durations:[240,160,180,180],
    chalk:['Mi 03.02. A&D 09:30–13:30','Sa 06.02. EProg 09:30–12:10','Mi 10.02. LinAlg 09:00–12:00','Sa 13.02. DM'],
    intro:['...','I am the Prüfungssession in February.','A&D, EProg, Lineare Algebra, Diskrete Mathematik. Four exams. Twelve hours and forty minutes.','Hilfsmittel: none for A&D and EProg. Six A4 pages of notes for LinAlg and Diskrete Mathe.','BASISPRÜFUNG, BLOCK 1. Begin.'],
    win:['...','...you passed.','(The exam quietly turns into a "Bestanden" email.)'],
    lose:['NOT PASSED.','You may try again... while the year lasts.'],
    phases:A=>[[BOSSES.ad.phases(A)[2],'Mi 03.02. · A&D',false],[BOSSES.eprog.phases(A)[1],'Sa 06.02. · EProg',false],[BOSSES.linalg.phases(A)[1],'Mi 10.02. · LinAlg',true],[BOSSES.diskret.phases(A)[2],'Sa 13.02. · Diskrete Mathe',true]]
      .map(([p,n,notes])=>({name:n,rate:p.rate*0.9,atk:p.atk,notes}))},
  block2:{id:'block2',name:'BASISPRÜFUNG · BLOCK 2',short:'Block 2',course:'Analysis I · DDCA · A&W · PProg',courseShort:'Block 2',sem:'FS',lvl:1,kp:0,hall:'Prüfungsraum',hp:480,exam:true,paper:'#1f5fa8',block:'BLOCK 2',
    chalk:['Aufgabe 1 (15 Punkte)','Aufgabe 2 (20 Punkte)','Aufgabe 3 (25 Punkte)','Viel Erfolg!'],
    intro:['...','So. The Frühjahrssemester, compressed into three hours.','Analysis, gates, probabilities and threads. All at once.','BASISPRÜFUNG, BLOCK 2. Begin.'],
    win:['...','...BESTANDEN.','You are officially through the Basisjahr.'],
    lose:['NOT PASSED.','You may try again... while the year lasts.'],
    phases:A=>[BOSSES.analysis.phases(A)[2],BOSSES.ddca.phases(A)[2],BOSSES.aw.phases(A)[2],BOSSES.pprog.phases(A)[2]].map((p,i)=>({name:`Aufgabe ${i+1}: ${p.name}`,rate:p.rate*0.9,atk:p.atk}))}
};

/* ---------------- boss fight ---------------- */
function drawLecture(B,t,rest){rect(0,0,W,H,'#2b2438');for(let x=0;x<W;x+=64)rect(x,0,2,FLOOR,'#30293f');
  rect(118,64,404,146,'#5a3d26');rect(124,70,392,132,B.exam?'#24242c':'#1f3b2d');
  B.chalk.forEach((s,i)=>txt(s,140,78+i*30,{size:22,color:'rgba(230,240,230,.78)'}));rect(124,202,392,6,'#7a5232');
  const pw=tw(B.hall,14)+12;rect(124,50,pw,14,'#1d2633');txt(B.hall,124+pw/2,50,{size:14,align:'center',color:'#fff'});
  if(rest)txt(`Restzeit ${rest}`,160+tw(B.chalk[3],22),168,{size:22,color:'#ff6b6b'});
  rect(0,FLOOR,W,H-FLOOR,'#4b3527');for(let x=0;x<W;x+=48)rect(x,FLOOR,2,H-FLOOR,'#3c2a1f');rect(0,FLOOR,W,3,'#6b4c38');
  rect(572,FLOOR-58,50,58,'#6b4a2b');rect(568,FLOOR-62,58,8,'#8a6238');}
function drawExam(x,y,flash,t,B){const w=112,h=132;ctx.save();ctx.translate(x,y+h/2);ctx.rotate(Math.sin(t*1.5)*0.05);ctx.translate(-w/2,-h/2);
  rect(5,5,w,h,'rgba(0,0,0,.35)');rect(0,0,w,h,flash?'#fff':'#f4f1e8');rect(0,0,w,20,flash?'#fff':B.paper);txt('BASISPRÜFUNG',w/2,2,{size:16,align:'center',color:'#fff'});
  txt(B.block,w/2,22,{size:14,align:'center',color:B.paper});
  rect(18,36,30,3,'#1a1a1a');rect(64,36,30,3,'#1a1a1a');rect(22,42,22,9,'#1a1a1a');rect(68,42,22,9,'#1a1a1a');rect(27,44,6,5,'#ff4d6d');rect(73,44,6,5,'#ff4d6d');
  rect(34,60,44,6,'#1a1a1a');for(let i=0;i<5;i++)rect(12,76+i*9,w-24,2,'#c9c2b0');txt('Note: ?',w-12,h-18,{size:16,align:'right',color:B.paper});ctx.restore();}
function makeCombat(id,done){const B=BOSSES[id];
  const maxHp=hpFor(G.level)+(G.buff?1:0)+(B.exam&&G.prep?1:0);
  const S={music:id==='basis'?'final':'boss',t:0,st:'intro',stT:0,paused:false,hitstop:0,shake:0,banner:'',bannerT:0,beam:0,wob:G.buff,ended:false,hits:0,
    boss:{hp:B.hp,max:B.hp,ph:-1,x:530,flash:0,atkT:1,ai:0},
    p:{x:90,y:FLOOR,vx:0,vy:0,ground:true,hp:maxHp,max:maxHp,inv:0,dash:0,dashCd:0,cool:0,sup:0,dir:1,anim:0,parry:0},
    shots:[],projs:[],lasers:[],ev:[],parts:[],phStart:0,taunt:null,tauntT:3,notes:B.id==='block1'&&!!G.notes};
  G.buff=false;if(B.exam)G.prep=false;if(B.id==='block1')G.notes=false;
  const mouth=()=>({x:S.boss.x-34,y:FLOOR-78}),pc=()=>({x:S.p.x,y:S.p.y-14});
  const later=(d,f)=>S.ev.push({t:d,f});
  const gl=g=>Array.isArray(g)?pick(g):g;
  const proj=o=>S.projs.push(Object.assign({x:0,y:0,vx:0,vy:0,r:11,g:'•',c:'#fff',pink:false,ay:0,life:8,t:0},o));
  const A={later,
    aimed({n=1,spread=0.25,speed=260,g='•',c=CY,pink=false}={}){const m=mouth(),t=pc(),base=Math.atan2(t.y-m.y,t.x-m.x);
      for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*spread;proj({x:m.x,y:m.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,g:gl(g),c,pink:pink===true||(pink==='mid'&&i===(n-1)/2)});}},
    ring({n=10,speed=200,g='•',c='#fff',pinkEvery=0,off=0}={}){const m=mouth();
      for(let i=0;i<n;i++){const a=off+i/n*Math.PI*2;proj({x:m.x,y:m.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,g:gl(g),c,pink:pinkEvery>0&&i%pinkEvery===0});}},
    rain({n=10,g='•',c='#fff',dur=1.6,smin=170,smax=250,pinkEvery=0}={}){for(let i=0;i<n;i++)later(i*dur/n,()=>proj({x:rnd(20,440),y:-10,vy:rnd(smin,smax),g:gl(g),c,pink:pinkEvery>0&&i%pinkEvery===pinkEvery-1}));},
    bounce({n=3,g='•',c='#fff',pink=false}={}){for(let i=0;i<n;i++)later(i*0.28,()=>{const m=mouth();proj({x:m.x,y:m.y,vx:-rnd(170,330),vy:-rnd(250,420),ay:900,bounce:true,life:7,g:gl(g),c,pink:pink&&i===n-1});});},
    bar({text='ERR',speed=300,high=false,c=CR}={}){const w=Math.max(56,tw(text,20)+18);proj({x:W+40,y:high?FLOOR-62:FLOOR-12,vx:-speed,rect:true,w,h:24,g:text,c,life:6});},
    vlas({xs=[],warn=0.8,dur=0.45,th=26}={}){for(const x of xs)S.lasers.push({v:true,pos:x,th,warn,dur,t:0});SFX.charge();},
    hlas({y=FLOOR-12,warn=0.8,dur=0.45,th=22}={}){S.lasers.push({v:false,pos:y,th,warn,dur,t:0});SFX.charge();},
    sine({n=6,g='~',c=CB,amp=40,freq=4,speed=200,gap=0.25,ys=null}={}){for(let i=0;i<n;i++)later(i*gap,()=>{const m=mouth(),by=ys?ys[i%ys.length]:m.y;proj({x:m.x,y:by,by,vx:-speed,sine:true,amp,freq,g:gl(g),c});});},
    homing({n=3,g='δ',c=CO,speed=130,dur=2.6,pink=false}={}){for(let i=0;i<n;i++)later(i*0.35,()=>{const m=mouth();proj({x:m.x,y:m.y-20+i*20,vx:-speed,vy:0,homing:dur,speed,g:gl(g),c,pink:pink&&i===n-1,life:7});});},
    atPlayer({count=3,gap=0.7,th=30}={}){for(let i=0;i<count;i++)later(i*gap,()=>A.vlas({xs:[clamp(S.p.x,20,440)],th,warn:0.65,dur:0.35}));},
    sweep({from=30,to=430,step=80,gap=0.22,warn=0.6,dur=0.3,th=24}={}){let k=0;for(let x=from;x<=to;x+=step,k++){const xx=x;later(k*gap,()=>A.vlas({xs:[xx],warn,dur,th}));}},
    vrand({n=3,th=26}={}){const xs=[];let tries=0;while(xs.length<n&&tries<60){tries++;const x=rnd(30,430);if(xs.every(v=>Math.abs(v-x)>100))xs.push(x);}A.vlas({xs,th});},
    spiral({arms=4,steps=12,speed=170,g='•',c='#fff',dt=0.13,pinkEvery=0}={}){for(let k=0;k<steps;k++)later(k*dt,()=>A.ring({n:arms,speed,g,c,off:k*0.33,pinkEvery:pinkEvery&&k%pinkEvery===0?arms:0}));}
  };
  const PH=B.phases(A);
  function burst(x,y,c,n=8,sp=160){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=rnd(40,sp);S.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(0.3,0.7),c,s:rnd(2,4)});}}
  function clearField(){S.projs.length=0;S.lasers.length=0;S.ev.length=0;}
  function hurt(){const p=S.p;if(p.inv>0||S.st!=='fight')return;p.hp--;p.inv=1.3;S.hits++;S.shake=0.3;SFX.hit();burst(p.x,p.y-14,'#ff5d5d',10);
    if(p.hp<=0){S.st='lose';S.stT=0;clearField();playSong('');SFX.lose();}}
  function finish(won,gaveUp=false){if(S.ended)return;S.ended=true;
    let grade=won?clamp(6-S.hits*0.5-Math.max(0,(S.t-75)/60)*0.5,4,6):clamp(1+3*(1-S.boss.hp/S.boss.max),1,3.75);grade=Math.round(grade*4)/4;
    fadeTo(()=>{setScene(OW);done({won,grade,gaveUp,hits:S.hits,time:S.t});});}
  S.update=dt=>{const p=S.p,b=S.boss;
    S.shake=Math.max(0,S.shake-dt);S.bannerT-=dt;b.flash-=dt;
    for(const q of S.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;if(!q.ghost)q.vy+=300*dt;q.life-=dt;}S.parts=S.parts.filter(q=>q.life>0);
    if(S.st==='intro'){S.stT+=dt;if(S.stT>=2.2)S.st='fight';return;}
    if(S.st==='win'||S.st==='lose'){S.stT+=dt;p.vy+=1300*dt;p.y=Math.min(FLOOR,p.y+p.vy*dt);
      if(S.st==='win'&&Math.random()<0.3){burst(b.x+rnd(-45,45),FLOOR-rnd(20,110),pick(['#ffd166','#ff6ad5','#fff']),6,220);if(Math.random()<0.25)SFX.boom();}
      if(S.stT>3)finish(S.st==='win');return;}
    if(S.paused){if(hit('esc')||hit('ok'))S.paused=false;else if(hit('q')){S.paused=false;finish(false,true);}return;}
    if(hit('esc')){S.paused=true;return;}
    if(S.hitstop>0){S.hitstop-=dt;return;}
    S.t+=dt;
    const dir=(keys.right?1:0)-(keys.left?1:0);if(dir)p.dir=dir;
    if(hit('c')&&p.dashCd<=0){p.dash=0.16;p.dashCd=0.5;SFX.dash();}
    if(hit('ok')){if(p.ground){p.vy=-480;p.ground=false;SFX.jump();}else p.parry=0.2;}
    if(p.dash>0){p.dash-=dt;p.vx=p.dir*540;p.vy=0;S.parts.push({x:p.x,y:p.y-14,vx:0,vy:0,life:0.15,c:'rgba(127,219,255,.5)',s:12,ghost:true});}
    else{p.vx=dir*215;p.vy+=(p.vy<0&&!keys.ok?2600:1300)*dt;}
    p.x=clamp(p.x+p.vx*dt,14,445);p.y+=p.vy*dt;if(p.y>=FLOOR){p.y=FLOOR;p.vy=0;p.ground=true;}else p.ground=false;
    p.dashCd-=dt;p.parry-=dt;p.inv-=dt;p.cool-=dt;if(dir&&p.ground)p.anim+=dt*9;
    if(keys.x&&p.cool<=0){p.cool=0.11;S.shots.push({x:p.x+14,y:p.y-17+rnd(-2,2)});SFX.shoot();}
    if(hit('v')&&p.sup>=5){p.sup=0;S.beam=0.9;S.projs.length=0;SFX.super();S.shake=0.4;}
    for(const s of S.shots){s.x+=660*dt;if(!s.dead&&s.x>b.x-44&&s.y>FLOOR-118){s.dead=true;b.hp-=1;if(b.flash<-0.12)b.flash=0.04;p.sup=Math.min(5,p.sup+0.035);burst(s.x,s.y,'#fff3a0',2,90);if(Math.random()<0.3)SFX.bosshit();}}
    S.shots=S.shots.filter(s=>!s.dead&&s.x<W+10);
    if(S.beam>0){S.beam-=dt;b.hp-=40*dt;b.flash=0.05;S.shake=Math.max(S.shake,0.05);}
    const n=PH.length,ph=Math.min(n-1,Math.floor((1-Math.max(0,b.hp)/b.max)*n));
    if(ph!==b.ph){b.ph=ph;S.banner=PH[ph].name;S.bannerT=2.2;S.phStart=S.t;if(PH[ph].notes&&S.notes){p.sup=Math.min(5,p.sup+2);S.banner+=' · Notizen: +2';}b.atkT=ph===0?0.6:1.5;b.ai=0;if(ph>0){clearField();SFX.boom();burst(b.x,FLOOR-60,'#fff',20,260);}}
    if(B.taunts){S.tauntT-=dt;if(S.tauntT<=0){S.taunt={s:pick(B.taunts),t:1.8};S.tauntT=rnd(5,8);SFX.blip();}}if(S.taunt){S.taunt.t-=dt;if(S.taunt.t<=0)S.taunt=null;}
    b.atkT-=dt;if(b.atkT<=0){const P=PH[ph];P.atk[b.ai%P.atk.length]();b.ai++;b.atkT=P.rate;}
    for(const e of S.ev){e.t-=dt;if(e.t<=0&&!e.done){e.done=true;e.f();}}S.ev=S.ev.filter(e=>!e.done);
    const pr=pc();
    for(const q of S.projs){q.t+=dt;q.life-=dt;
      if(q.homing&&q.t<q.homing){const a=Math.atan2(pr.y-q.y,pr.x-q.x),cur=Math.atan2(q.vy,q.vx);let d=a-cur;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
        const na=cur+clamp(d,-2.2*dt,2.2*dt);q.vx=Math.cos(na)*q.speed;q.vy=Math.sin(na)*q.speed;}
      q.x+=q.vx*dt;if(q.sine)q.y=q.by+Math.sin(q.t*q.freq)*q.amp;else{q.vy+=q.ay*dt;q.y+=q.vy*dt;}
      if(q.bounce&&q.y>FLOOR-q.r){q.y=FLOOR-q.r;q.vy=-Math.abs(q.vy)*0.82;if(Math.abs(q.vy)<140)q.vy=-320;}
      if(q.pink&&p.parry>0&&!p.ground&&Math.hypot(q.x-p.x,q.y-(p.y-14))<q.r+26){q.dead=true;p.parry=0;p.vy=-420;p.sup=Math.min(5,p.sup+1);S.hitstop=0.07;SFX.parry();burst(q.x,q.y,'#ff6ad5',14,220);continue;}
      let touch;if(q.rect)touch=Math.abs(q.x-p.x)<q.w/2+6&&Math.abs(q.y-(p.y-14))<q.h/2+11;
      else{const cx=clamp(q.x,p.x-7,p.x+7),cy=clamp(q.y,p.y-26,p.y-2);touch=Math.hypot(q.x-cx,q.y-cy)<q.r*0.8;}
      if(touch){hurt();if(!q.rect)q.dead=true;}}
    S.projs=S.projs.filter(q=>!q.dead&&q.life>0&&q.x>-200&&q.x<W+300&&q.y<H+60&&q.y>-200);
    for(const l of S.lasers){l.t+=dt;const act=l.t>l.warn&&l.t<l.warn+l.dur;if(act&&!l.snd){l.snd=true;SFX.boom();S.shake=Math.max(S.shake,0.12);}
      if(act&&(l.v?Math.abs(p.x-l.pos)<l.th/2+5:(p.y-28<l.pos+l.th/2&&p.y-2>l.pos-l.th/2)))hurt();}
    S.lasers=S.lasers.filter(l=>l.t<l.warn+l.dur);
    if(b.hp<=0&&S.st==='fight'){b.hp=0;S.st='win';S.stT=0;clearField();playSong('');SFX.win();}};
  S.draw=()=>{const p=S.p,b=S.boss;ctx.save();
    if(S.shake>0)ctx.translate(rnd(-4,4),rnd(-3,3));
    if(S.wob&&S.st==='fight')ctx.translate(Math.sin(S.t*1.7)*4,Math.sin(S.t*1.3)*2);
    const rest=B.exam?(()=>{const dur=(B.durations||[])[Math.max(0,b.ph)]||180,left=Math.max(0,dur-(S.t-S.phStart)*2);return `${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')}`;})():null;
    drawLecture(B,S.t,rest);
    for(const l of S.lasers){const warn=l.t<l.warn,blink=Math.floor(l.t*12)%2?'rgba(255,80,80,.9)':'rgba(255,80,80,.35)';
      if(l.v){if(warn){rect(l.pos-1,40,2,FLOOR-40,blink);rect(l.pos-l.th/2,40,l.th,FLOOR-40,'rgba(255,80,80,.10)');}else{rect(l.pos-l.th/2,40,l.th,FLOOR-40,'#ff4d6d');rect(l.pos-l.th/4,40,l.th/2,FLOOR-40,'#fff');}}
      else{if(warn){rect(0,l.pos-1,W,2,blink);rect(0,l.pos-l.th/2,W,l.th,'rgba(255,80,80,.10)');}else{rect(0,l.pos-l.th/2,W,l.th,'#ff4d6d');rect(0,l.pos-l.th/4,W,l.th/2,'#fff');}}}
    const bob=Math.sin(S.t*2.2)*3;ctx.globalAlpha=S.st==='win'?Math.max(0,1-S.stT/2.6):1;
    if(B.exam)drawExam(b.x,FLOOR-140+bob,b.flash>0,S.t,B);else spr(PROF_SPR[B.sprite||'m'],B.pal,b.x-42,FLOOR-112+bob,7,true,b.flash>0?'#ffffff':null);
    ctx.globalAlpha=1;
    if(S.taunt&&S.st==='fight'){const w=tw(S.taunt.s,20)+18,bx=Math.max(8,b.x-24-w),by=FLOOR-170;rect(bx,by,w,28,'#fff');rect(bx+w-14,by+28,10,6,'#fff');rect(bx+w-8,by+34,5,4,'#fff');txt(S.taunt.s,bx+w/2,by+4,{size:20,align:'center',color:'#1a1a1a'});}
    for(const s of S.shots){rect(s.x-7,s.y-2,12,4,'#fff3a0');rect(s.x+5,s.y-1,3,2,'#ff9f43');}
    for(const q of S.projs){if(q.rect){rect(q.x-q.w/2,q.y-q.h/2,q.w,q.h,'#1b0f14');rect(q.x-q.w/2+2,q.y-q.h/2+2,q.w-4,q.h-4,q.c);txt(q.g,q.x,q.y-q.h/2+2,{size:20,align:'center',color:'#1b0f14'});continue;}
      if(q.pink){ctx.fillStyle='rgba(255,106,213,.35)';ctx.beginPath();ctx.arc(q.x,q.y,q.r+5,0,Math.PI*2);ctx.fill();}
      txt(q.g,q.x,q.y,{size:q.g.length>2?18:24,color:q.pink?'#ff6ad5':q.c,align:'center',base:'middle',shadow:'#000'});}
    for(const q of S.parts){ctx.globalAlpha=clamp(q.life*2,0,1);if(q.ghost)rect(q.x-8,q.y-14,16,28,q.c);else rect(q.x,q.y,q.s,q.s,q.c);}ctx.globalAlpha=1;
    if(!(p.inv>0&&Math.floor(p.inv*20)%2)){const fr=!p.ground?1:(p.vx?Math.floor(p.anim)%2:0);drawChar(PAL.player,'right',fr,p.x,p.y,2);}
    if(p.parry>0&&!p.ground){ctx.strokeStyle='#ff6ad5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y-14,22,0,Math.PI*2);ctx.stroke();}
    if(S.beam>0){const y=p.y-30;rect(p.x+12,y,W,28,'rgba(255,106,213,.85)');rect(p.x+12,y+9,W,10,'#fff');txt('ZUSAMMENFASSUNG!',p.x+40,y+4,{size:20,color:'#7a1f5c'});}
    ctx.restore();
    for(let i=0;i<p.max;i++)drawHeart(12+i*26,10,3,i<p.hp?'#ff4d6d':'#3a3350');
    for(let i=0;i<5;i++){const f=clamp(p.sup-i,0,1);rect(14+i*16,34,12,16,'#2a2445');if(f>0)rect(14+i*16,34+16*(1-f),12,16*f,f>=1?'#ff6ad5':'#a5488f');}
    if(p.sup>=5)txt('V: SUPER!',100,34,{size:16,color:'#ff6ad5',shadow:'#000'});
    txt(B.name,W-12,4,{size:20,align:'right',shadow:'#000'});rect(W-262,26,250,12,'#000');rect(W-260,28,246*Math.max(0,b.hp)/b.max,8,'#ff4d6d');
    for(let i=1;i<PH.length;i++)rect(W-260+246*(1-i/PH.length),26,2,12,'#000');
    txt(B.course,W-12,40,{size:16,align:'right',color:'#cfc9e8',shadow:'#000'});
    if(S.bannerT>0&&S.st==='fight'){ctx.globalAlpha=clamp(S.bannerT,0,1);const w=tw(S.banner,16,PX)+30;rect(W/2-w/2,72,w,32,'#000');txt(S.banner,W/2,80,{font:PX,size:16,align:'center',color:'#ffd166'});ctx.globalAlpha=1;}
    if(S.st==='intro'){rect(0,0,W,H,'rgba(0,0,0,.4)');txt(B.name,W/2,112,{font:PX,size:tw(B.name,24,PX)>600?16:24,align:'center',shadow:'#000'});txt(B.course,W/2,146,{size:24,align:'center',color:'#cfc9e8',shadow:'#000'});
      txt(S.stT<1.4?'READY?':'GO!',W/2,186,{font:PX,size:32,align:'center',color:S.stT<1.4?'#ffd166':'#9be564',shadow:'#000'});
      txt('X shoot · Z jump · Z on pink = parry · C dash',W/2,236,{size:18,align:'center',color:'#fff',shadow:'#000'});}
    if(S.st==='win')txt(B.exam?'BESTANDEN!':'PASSED!',W/2,140,{font:PX,size:32,align:'center',color:'#9be564',shadow:'#000'});
    if(S.st==='lose')txt('NICHT BESTANDEN',W/2,140,{font:PX,size:24,align:'center',color:'#ff5d5d',shadow:'#000'});
    if(S.paused){rect(0,0,W,H,'rgba(0,0,0,.65)');txt('PAUSED',W/2,130,{font:PX,size:24,align:'center'});txt('Z / Esc: resume · Q: give up and leave the lecture hall',W/2,172,{size:20,align:'center',color:'#cfc9e8'});}};
  return S;}
