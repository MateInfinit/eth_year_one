/* ---------------- content ---------------- */
const FLYERS=['* LOST: motivation. Last seen in week 2. Reward: 5 CHF.',
  '* SELLING: Analysis script. Slightly tear-stained. Price negotiable.',
  '* ROOM FOR RENT in Zurich: 1 m², 1200 CHF/month, shared bathroom. Call now!',
  '* STUDY GROUP seeks one member who actually did the exercises.',
  '* FREE: 200 pages of notes. Written in a font only the author can read.',
  '* PARTY on Friday! Theme: "Things I should be studying instead."'];
const DISHES=['Pasta, but different','Vegi curry (the brave choice)','Schnitzel with fries','Mystery bowl','Älplermagronen','Pasta, again'];
const TA_INTRO=[["Today: find the bug. It's only one line. It's always only one line."],
  ["Quick quiz! Don't worry, it's not graded. (It is a little bit graded.)"],
  ["Okay, I'll explain the solution now. ...Any questions?"]];
const CONTROLS=['* EXPLORE: arrows/WASD move · Z talk & confirm · X menu · hold C to run.',
  '* FIGHT: ←→ move · Z jump · Z again in the air while touching something PINK = parry (fills your super).',
  '* Hold X to shoot · C dash · V fires the super when all 5 cards are full · Esc pauses.',
  '* M mutes the sound. Have fun, and drink responsibly (in-game too).'];

/* ---------------- helpers ---------------- */
const BOSS_ORDER=['diskret','eprog','linalg','analysis','ddca'];
const beatenCount=()=>BOSS_ORDER.filter(id=>G.beaten[id]).length;
const allBeaten=()=>beatenCount()===5;
async function gainXP(n){const old=G.level,oldHp=hpFor(old);G.xp+=n;G.level=levelFor(G.xp);const lines=[`* +${n} XP.`];
  if(G.level>old){SFX.level();lines.push(`* LEVEL UP! You are now LV ${G.level}.`);if(hpFor(G.level)>oldHp)lines.push(`* Your max HP in fights is now ${hpFor(G.level)}.`);
    const un=BOSS_ORDER.filter(id=>BOSSES[id].lvl>old&&BOSSES[id].lvl<=G.level).map(id=>`${BOSSES[id].name} (${BOSSES[id].where})`);if(un.length)lines.push(`* Unlocked: ${un.join(', ')}.`);}
  await say(lines);}
async function spendAP(){if(G.ap<=0){SFX.bad();await say(["* You're exhausted. No energy left this week.","* Sit on a bench at the Polyterrasse to go home and sleep."]);return false;}G.ap--;return true;}
async function afterAction(){
  if(G.sanity<=0){SFX.bad();await say(['* Your sanity hits zero.','* BURNOUT. You spend the rest of the week in bed, watching lecture recordings at 2× speed.']);return nextWeek(true);}
  if(G.ap===0)await say(["* You're out of energy for this week.","* Head to the Polyterrasse and sit on a bench to sleep."]);saveGame();}
async function nextWeek(burnout){
  await new Promise(r=>fadeTo(()=>{G.week++;G.ap=3;G.sanity=burnout?40:Math.min(100,G.sanity+30);G.money+=2000;G.map='campus';G.x=4*TS+16;G.y=6*TS+28;G.dir='down';playSong('campus');r();}));
  if(G.week>14)return endGame(false);
  const left=15-G.week,lines=[`* WEEK ${G.week} of 14.`,'* Your parents sent 20.00 CHF. "Eat something proper!"'];
  if(G.week===8)lines.push('* Halfway through the semester. The Mensa queue is now part of your identity.');
  if(G.week>=11&&!allBeaten())lines.push(`* ${left} week${left>1?'s':''} left. You still need to beat ${5-beatenCount()} professor${5-beatenCount()>1?'s':''} before the Basisprüfung.`);
  if(G.week===14)lines.push('* FINAL WEEK. Pass the Basisprüfung this week, or repeat the year!');
  await say(lines);saveGame();}
function endGame(passed){return new Promise(r=>fadeTo(()=>{setScene(makeEnding(passed));r();}));}
async function talkNPC(n){const i=G.talk[n.id]||0;G.talk[n.id]=i+1;n.face={up:'down',down:'up',left:'right',right:'left'}[G.dir];await say(n.lines[i%n.lines.length],n.name);n.face=null;}

/* ---------------- interactions ---------------- */
async function interact(ch,c,r){const m=G.map;
  if(ch==='V')return vending();if(ch==='C')return coffee();if(ch==='M')return mensaFood();if(ch==='J')return jobBoard();
  if(ch==='N')return say([pick(FLYERS)]);if(ch==='B')return bench();
  if(ch==='E'){if(m==='cab'&&c===5)return uebungRoom();if(m==='cab'&&c===12)return lectureHall(['eprog','ddca']);
    if(m==='hg'&&c===4)return lectureHall(['diskret','linalg','analysis']);if(m==='hg'&&c===14)return examRoom();}
  if(ch==='L')return say([pick(["* A shelf of scripts. One is titled 'Analysis, 2nd edition (now with more errors)'.","* Books on algorithms, sorted. You check: it's bubble sort order.","* Old exams. They look... suspiciously familiar."])]);
  if(ch==='T')return say(['* A tree. It has no exercise sheet. Lucky tree.']);
  if(ch==='S')return say(['* A sofa. It has absorbed the souls of countless all-nighters.']);
  if(ch==='p')return say(['* A plant. It is thriving. Unlike you.']);
  if(ch==='t')return say([pick(['* Someone left an exercise sheet here. Question 3 just says "obviously".','* A table. Sticky. Mensa-adjacent.','* A table with a laptop sticker: "I paused my game to be here."'])]);
  if(ch==='^'||ch==='~')return say(['* The view over Zurich. The lake glitters. The Alps pretend not to see you.']);}
async function vending(){
  const c=await ask('* A humming vending machine. The most reliable machine in CAB. Cold beer: 2.50 CHF.',['Buy a beer','Leave']);if(c!==0)return;
  if(G.money<250){SFX.bad();return say(['* INSUFFICIENT FUNDS.',G.ects<30?'* ...like your ECTS.':'* The machine judges you silently.']);}
  G.money-=250;G.beers++;SFX.coin();await say(['* Clunk. A cold beer drops.','* (Drink it from the menu with X: +15 Sanity and +1 HP in your next fight.)']);}
async function coffee(){
  const c=await ask('* Coffee machine, 1.50 CHF. A sticker says "WORKS (mostly)".',['Buy a coffee','Leave']);if(c!==0)return;
  if(G.money<150){SFX.bad();return say(['* Not enough money. Not even for coffee.']);}
  G.money-=150;if(Math.random()<0.25){SFX.bad();return say(['* The machine eats your coins and makes a satisfied noise.','* No coffee. Classic.']);}
  G.stats.coffees++;G.sanity=Math.min(100,G.sanity+10);SFX.coin();await say(['* You get a coffee. It tastes like debugging. +10 Sanity.']);}
async function mensaFood(){const d=DISHES[(G.week*3+G.ap)%DISHES.length];
  const c=await ask(`* Polymensa. Today: "${d}". 7.00 CHF.`,['Eat (7.00 CHF)','Leave']);if(c!==0)return;
  if(G.money<700){SFX.bad();return say(['* Not enough money. You stare at the menu until the queue pushes you out.']);}
  G.money-=700;G.sanity=Math.min(100,G.sanity+20);SFX.coin();await say([`* You eat "${d}". It is... food. +20 Sanity.`]);}
async function jobBoard(){
  const c=await ask('* JOB BOARD: "Hilfsassistent wanted to correct exercise sheets." +30 CHF, −15 Sanity, 1 AP.',['Work a shift','Leave']);if(c!==0)return;
  if(!await spendAP())return;G.money+=3000;G.sanity=Math.max(0,G.sanity-15);G.stats.shifts++;SFX.coin();
  await say([`* You correct ${30+Math.floor(Math.random()*40)} exercise sheets.`,pick(['* Most of them prove that 1 = 1. One proves that 1 = 2.','* One student wrote "see attached" and attached nothing.','* Someone drew a very detailed cat instead of a proof. Partial credit.']),'* +30.00 CHF, −15 Sanity.']);
  await afterAction();}
async function bench(){
  const c=await ask('* A bench on the Polyterrasse. Zurich glitters below.',['Go home & sleep (next week)','Enjoy the view','Leave']);
  if(c===0){if(G.ap>0){const s=await ask(`* You still have ${G.ap} AP this week. Sleep anyway?`,['Sleep','Stay']);if(s!==0)return;}return nextWeek(false);}
  if(c===1){if(G.view===G.week)return say(['* You already stared at the lake this week. The lake is starting to stare back.']);
    G.view=G.week;G.sanity=Math.min(100,G.sanity+5);await say(['* You watch the lake and the Alps for a while.','* +5 Sanity. Free therapy.']);}}
async function uebungRoom(){
  const c=await ask('* Übungsraum. Which Übung? (1 AP, −10 Sanity)',['Programming: find the bug','Math & Logic: quiz','Q&A: survive "Any questions?"','Leave']);
  if(c<0||c>2)return;if(!await spendAP())return;
  await say(pick(TA_INTRO[c]),'TA');
  const score=await new Promise(res=>fadeTo(()=>setScene([makeBug,makeQuiz,makeDodge][c](res))));
  G.sanity=Math.max(0,G.sanity-10);G.stats.ubungen++;
  const xp=Math.round(20+score*50);
  await say([`* Übung done. Score: ${Math.round(score*100)}%.`,score>=0.8?pick(['TA: "Wow. Someone actually did the exercises."','TA: "Perfect! Please explain it to the others."']):score>=0.4?'TA: "Not bad! Partial credit is still credit."':'TA: "...we will go over this again next week."']);
  await gainXP(xp);await afterAction();}
async function lectureHall(list){
  const opts=list.map(id=>{const b=BOSSES[id];return `${b.name} · ${b.course}`+(G.beaten[id]?' ✓':G.level<b.lvl?` (LV ${b.lvl})`:'');});opts.push('Leave');
  const c=await ask('* Lecture hall. Who do you challenge? (1 AP)',opts);if(c<0||c>=list.length)return;
  const id=list[c],b=BOSSES[id];
  if(G.level<b.lvl)return say([`* ${b.name} looks at you over their glasses.`,`* "Come back at LV ${b.lvl}. The Übungen exist for a reason."`]);
  if(G.beaten[id]){const r=await ask(`* You already passed ${b.course}. Rematch for fun? (1 AP, small XP)`,['Rematch','Leave']);if(r!==0)return;}
  if(!await spendAP())return;await fight(id);}
async function examRoom(){const n=beatenCount();
  if(n<5)return say(['* PRÜFUNGSRAUM. The door is sealed.',`* A sign: "Basisprüfung — admission only after defeating all 5 professors." (${n}/5)`]);
  const c=await ask('* The Basisprüfung waits behind this door. Three hours. No cheat sheet. Enter? (1 AP)',['Enter','Not yet']);if(c!==0)return;
  if(!await spendAP())return;await fight('basis');}
async function fight(id){const b=BOSSES[id];
  await say(b.intro,b.name);
  if(G.buff)await say(['* The beer kicks in. +1 HP. The room is... slightly wobbly.']);
  const r=await new Promise(res=>fadeTo(()=>setScene(makeCombat(id,res))));
  if(r.gaveUp){G.sanity=Math.max(0,G.sanity-10);await say(['* You sneak out of the lecture hall. Nobody saw. Probably. (−10 Sanity)']);return afterAction();}
  if(r.won){const first=!G.beaten[id];G.beaten[id]=true;G.stats.wins++;G.stats.grades.push(r.grade);G.sanity=Math.max(0,G.sanity-5);
    await say(b.win,b.name);
    if(id==='basis'){G.passed=true;G.ects+=b.ects;return endGame(true);}
    if(first){G.ects+=b.ects;await say([`* PASSED with grade ${r.grade.toFixed(2)}! +${b.ects} ECTS.`]);await gainXP(40);
      if(allBeaten())await say(['* All five professors defeated!','* The exam room in HG is open now. The Basisprüfung awaits.']);}
    else{await say([`* Rematch won with grade ${r.grade.toFixed(2)}. Your ego grows.`]);await gainXP(10);}}
  else{G.stats.losses++;G.sanity=Math.max(0,G.sanity-20);await say(b.lose,b.name);
    await say([`* Grade ${r.grade.toFixed(2)}. Not passed. (−20 Sanity)`,'* Tip: higher levels give more HP, and a beer gives +1 HP. Pink things can be parried!']);}
  await afterAction();}

/* ---------------- menu ---------------- */
async function menu(){
  const c=await ask('* MENU',['Items','Stats','Save','Controls','Quit to title','Close']);
  if(c===0){const i=await ask('* ITEMS',[`Beer ×${G.beers}`,'Back']);if(i!==0)return;
    if(G.beers<=0)return say(['* You have no beer. The vending machine in CAB can fix that.']);
    G.beers--;G.stats.beers++;G.sanity=Math.min(100,G.sanity+15);G.buff=true;SFX.coin();
    return say(['* You drink a beer. +15 Sanity.','* Liquid courage: +1 HP in your next fight. (Side effects may include wobbling.)']);}
  if(c===1)return say([`* WEEK ${G.week}/14 · AP ${G.ap}/3 · LV ${G.level} · XP ${G.xp}/${nextXP()} · ECTS ${G.ects}/60`,
    `* Sanity ${G.sanity}/100 · ${chf(G.money)} CHF · Beers ${G.beers} · Fight HP ${hpFor(G.level)}${G.buff?' (+1 beer)':''}`,
    '* Professors: '+BOSS_ORDER.map(id=>`${BOSSES[id].name} ${G.beaten[id]?'✓':G.level<BOSSES[id].lvl?'(LV '+BOSSES[id].lvl+')':'·'}`).join(', ')]);
  if(c===2)return say([saveGame()?'* Progress saved (in this browser).':'* Saving is not available here, sorry.']);
  if(c===3)return say(CONTROLS);
  if(c===4){const q=await ask('* Quit to the title screen? Unsaved progress is lost.',['Quit','Cancel']);if(q===0)fadeTo(()=>setScene(makeTitle()));}}

/* ---------------- title / intro / ending ---------------- */
function makeTitle(){const hasSave=!!loadSave(),opts=hasSave?['Continue','New game','Controls']:['New game','Controls'];
  const stars=Array.from({length:70},()=>({x:rnd(0,W),y:rnd(0,230),s:Math.random()<0.2?2:1,p:rnd(0,6)}));
  const S={music:'title',sel:0,t:0};
  S.update=dt=>{S.t+=dt;if(lock)return;const n=opts.length;
    if(hit('up')){S.sel=(S.sel+n-1)%n;SFX.select();}if(hit('down')){S.sel=(S.sel+1)%n;SFX.select();}
    if(hit('ok')){const o=opts[S.sel];SFX.confirm();
      if(o==='New game'){G=newGame();lock=true;fadeTo(()=>{setScene(OW);lock=false;flow(intro);});}
      else if(o==='Continue'){G=Object.assign(newGame(),loadSave()||{});lock=true;fadeTo(()=>{setScene(OW);OW.banner=2.2;lock=false;});}
      else flow(()=>say(CONTROLS));}};
  S.draw=()=>{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d0a24');g.addColorStop(1,'#2b1f4a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(const s of stars){ctx.globalAlpha=0.45+0.55*Math.abs(Math.sin(S.t*1.3+s.p));rect(s.x,s.y,s.s,s.s,'#fff');}ctx.globalAlpha=1;
    ctx.fillStyle='#161032';ctx.beginPath();ctx.arc(320,306,50,Math.PI,0);ctx.fill();rect(313,248,14,10,'#161032');rect(90,306,460,54,'#161032');
    for(let i=0;i<12;i++){const lit=((i*7+3)%5)<2;rect(108+i*36,316,14,18,lit?'#ffd16688':'#2a2152');}
    rect(0,338,W,3,'#0a0718');for(let x=4;x<W;x+=12)rect(x,338,2,22,'#0a0718');
    txt('ETH:',W/2,34,{font:PX,size:24,align:'center',color:'#ffd166',shadow:'#000'});
    txt('YEAR ONE',W/2,68,{font:PX,size:32,align:'center',color:'#fff',shadow:'#ff6ad5'});
    txt('survive your first year of Computer Science',W/2,112,{size:20,align:'center',color:'#cfc9e8'});
    opts.forEach((o,i)=>{const y=150+i*30;txt(o,W/2,y,{font:PX,size:16,align:'center',color:i===S.sel?'#ffd166':'#8f89b0'});if(i===S.sel)drawHeart(W/2-tw(o,16,PX)/2-26,y+1,2);});
    txt('↑↓ choose · Z select',W/2,228,{size:16,align:'center',color:'#6f6990'});};
  return S;}
async function intro(){await say(['* September. You got into Computer Science at ETH Zürich.','* In 14 weeks: the BASISPRÜFUNG.',
  '* To be allowed in, you must defeat all five professors in their lecture halls (HG and CAB).',
  '* Übungen in CAB give XP. Levels unlock professors and give you more HP in fights.',
  '* You have 3 AP (energy) per week. Sit on a Polyterrasse bench to sleep and start a new week.',
  '* Also, there is a beer vending machine in CAB. Just saying.']);saveGame();}
function makeEnding(passed){clearSave();const gr=G.stats.grades,avg=gr.length?gr.reduce((a,b)=>a+b,0)/gr.length:0;
  const conf=Array.from({length:60},()=>({x:rnd(0,W),y:rnd(-H,0),v:rnd(30,90),c:pick(['#ffd166','#ff6ad5','#9be564','#7fdbff'])}));
  const S={music:passed?'ending':'title',t:0};
  S.update=dt=>{S.t+=dt;for(const c of conf){c.y+=c.v*dt;if(c.y>H)c.y=-10;}if(S.t>1.5&&hit('ok'))fadeTo(()=>setScene(makeTitle()));};
  S.draw=()=>{rect(0,0,W,H,passed?'#0f2a1d':'#2a0f16');if(passed)for(const c of conf)rect(c.x,c.y,4,6,c.c);
    txt(passed?'BASISPRÜFUNG':'NOT PASSED',W/2,40,{font:PX,size:24,align:'center',color:passed?'#9be564':'#ff5d5d',shadow:'#000'});
    txt(passed?'BESTANDEN!':'See you next year.',W/2,78,{font:PX,size:16,align:'center',color:'#fff',shadow:'#000'});
    const lines=passed?[`You survived year one in ${G.week} week${G.week>1?'s':''}.`,`ECTS ${G.ects}/60 · Level ${G.level} · Average grade ${avg?avg.toFixed(2):'–'}`,
      `Beers ${G.stats.beers} · Coffees ${G.stats.coffees} · Übungen ${G.stats.ubungen} · Shifts ${G.stats.shifts}`,`Fights lost along the way: ${G.stats.losses}`,'Year two awaits. (Not in this game. Yet.)']
      :['The semester ended before you passed the Basisprüfung.',`ECTS ${G.ects}/60 · Level ${G.level} · Professors defeated ${beatenCount()}/5`,
      'Repeating the first year is a classic. Many legends did.','Tip: Übungen early, beer before fights, parry the pink.'];
    lines.forEach((l,i)=>txt(l,W/2,130+i*30,{size:22,align:'center',color:'#fff'}));
    if(S.t>1.5)txt('Press Z to return to the title screen',W/2,320,{size:18,align:'center',color:'#cfc9e8'});};
  return S;}
