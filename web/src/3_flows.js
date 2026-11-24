/* ---------------- content ---------------- */
const FLYERS=['* VIS PRÜFUNGSSAMMLUNG: old exams, now only slightly coffee-stained. CAB, VIS office.',
  '* LOST: motivation. Last seen in week 2. Reward: one Gipfeli.',
  '* ROOM FOR RENT in Zurich: 1 m², 1200 CHF/month, shared bathroom. Call now!',
  '* LERNGRUPPE Analysis I seeks one member who actually solved the Serie.',
  '* FREE: 200 pages of notes. Written in a font only the author can read.',
  '* ERSTSEMESTRIGENFEST on Friday! Snacks while stocks last.'];
const POSTERS=['* A poster: "POLYBALL: dress code black tie. Dress code for the Basisprüfung: panic."',
  '* A poster: "VSETH: your student union. We fight for longer Mensa opening hours."',
  '* A poster: "Lost: one Velo, red, probably still locked somewhere on this street."'];
const VEGI=['Gefüllte Aubergine with Bratkartoffeln','Vegi curry with rice','Älplermagronen with Apfelmus','Pasta al pomodoro'];
const LOCAL=['Zürcher Geschnetzeltes with Rösti','Rindshackfleisch-Pilzragout with Spätzli','Poulet with Pommes'];
const TA_INTRO=[["Today: find the bug. It's only one line. It's always only one line."],
  ["Quick quiz! Don't worry, it's not graded. (It is a little bit graded.)"],
  ["Okay, I'll explain the solution now. ...Any questions?"]];
const CONTROLS=['* EXPLORE: arrows/WASD move · Z talk & confirm · X menu · hold C to run.',
  '* FIGHT: ←→ move · Z jump · Z again in the air while touching something PINK = parry (fills your super).',
  '* Hold X to shoot · C dash · V fires the super when all 5 cards are full · Esc pauses.',
  '* M mutes the sound. Have fun, and drink responsibly (in-game too).'];

/* ---------------- helpers ---------------- */
const HS=['diskret','eprog','linalg','ad'],FS=['analysis','ddca','aw','pprog'],BOSS_ORDER=HS.concat(FS);
const semester=()=>G.week<=7?'HS':'FS';
const beatenOf=l=>l.filter(id=>G.beaten[id]).length;
const beatenCount=()=>beatenOf(BOSS_ORDER);
const available=id=>BOSSES[id].sem==='HS'||G.week>=8;
const mark=id=>G.beaten[id]?'✓':!available(id)?'(FS)':G.level<BOSSES[id].lvl?`(LV ${BOSSES[id].lvl})`:'·';
// Each action (AP) takes a day: Monday, Wednesday, Friday; with no AP left it is Saturday.
const DAYN=['Mo','Mi','Fr','Sa'],DAYLONG=['Monday','Wednesday','Friday','Saturday'],DAYOFF=[0,2,4,5];
const dayIdx=()=>clamp(3-G.ap,0,3),dayName=()=>DAYN[dayIdx()],dayNo=()=>(G.week-1)*7+DAYOFF[dayIdx()];
const machineBroken=()=>(((dayNo()+3)*2654435761)>>>0)%100<30;
function freeToday(){const d=dayNo();if(!G.free||G.free.day!==d)G.free={day:d,coffee:0,beer:false};return G.free;}
function nextBeerLabel(){const need=(G.freeBeerDay??-99)+3;
  for(let w=G.week;w<=G.week+1;w++)for(let i=0;i<4;i++){const d=(w-1)*7+DAYOFF[i];if(d>=need&&d>dayNo())return (w===G.week?'':'next week, ')+DAYLONG[i];}return 'soon';}
const COFFEE_MEMES=[
  ['* The display says: ENTKALKEN.','* It has said ENTKALKEN since 2019. Nobody knows how. Nobody dares.'],
  ['* The display says: Satzbehälter leeren.','* The grounds container is full. Everyone assumed someone else would empty it. Tragedy of the commons, live.'],
  ['* The display says: Error 418. I\'m a teapot.','* RFC 2324, the Hyper Text Coffee Pot Control Protocol. It is real. The machine has chosen violence.'],
  ['* A note is taped to the machine: "DEFEKT. Techniker kommt bald."','* The note is dated last semester.'],
  ['* The machine makes a noise like a dial-up modem and pours exactly three drops.','* Segmentation fault (coffee dumped).'],
  ['* The display says: Bitte Bohnen füllen.','* The bean container is empty. Like your motivation in week 9.'],
  ['* A sticky note: "Exception in thread main: NullPointerException at Kaffee.brew(Kaffee.java:42)"','* Someone from EProg wrote it. It is the most accurate error message in CAB.'],
  ['* The machine is "heating up".','* It has been heating up for 45 minutes. The queue has formed a Lerngruppe.']];
async function gainXP(n){const old=G.level,oldHp=hpFor(old);G.xp+=n;G.level=levelFor(G.xp);const lines=[`* +${n} XP.`];
  if(G.level>old){SFX.level();lines.push(`* LEVEL UP! You are now LV ${G.level}.`);if(hpFor(G.level)>oldHp)lines.push(`* Your max HP in fights is now ${hpFor(G.level)}.`);
    const un=BOSS_ORDER.filter(id=>available(id)&&BOSSES[id].lvl>old&&BOSSES[id].lvl<=G.level).map(id=>BOSSES[id].short);if(un.length)lines.push(`* Unlocked in the HG lecture halls: ${un.join(', ')}.`);}
  await say(lines);}
async function spendAP(){if(G.ap<=0){SFX.bad();await say(["* You're exhausted. No energy left this week.","* Sit on a bench at the Polyterrasse to go home and sleep."]);return false;}G.ap--;return true;}
async function afterAction(){
  if(G.sanity<=0){SFX.bad();await say(['* Your sanity hits zero.','* BURNOUT. You spend the rest of the week in bed, watching lecture recordings at 2× speed.']);return nextWeek(true);}
  if(G.ap===0)await say(["* You're out of energy for this week.","* Head to the Polyterrasse and sit on a bench to sleep."]);saveGame();}
async function nextWeek(burnout){
  await new Promise(r=>fadeTo(()=>{G.week++;G.ap=3;G.sanity=burnout?40:Math.min(100,G.sanity+30);G.money+=2000;G.map='campus';G.x=4*TS+16;G.y=6*TS+28;G.dir='down';playSong('campus');r();}));
  if(G.week>14)return endGame(false);
  const left=15-G.week,lines=[`* ${semester()} · WEEK ${G.week} of 14.`,'* Your parents sent 20.00 CHF. "Eat something proper!"'];
  if(G.week===8)lines.push('* The Herbstsemester is over. Winter break, Raclette, and then the Prüfungssession in February.',
    '* FRÜHJAHRSSEMESTER! New professors in the HG lecture halls: Analysis I, Digital Design and Computer Architecture, Algorithmen und Wahrscheinlichkeit, Parallele Programmierung.');
  if(G.week>=11){const miss=[];if(!G.beaten.block1)miss.push('Block 1');if(!G.beaten.block2)miss.push('Block 2');
    if(miss.length)lines.push(`* ${left} week${left>1?'s':''} left. Still to pass: ${miss.join(' and ')} of the Basisprüfung.`);}
  if(G.week===14)lines.push('* FINAL WEEK. Pass both Basisprüfung blocks this week, or repeat the Basisjahr!');
  await say(lines);saveGame();}
function endGame(passed){return new Promise(r=>fadeTo(()=>{setScene(makeEnding(passed));r();}));}
async function talkNPC(n){const i=G.talk[n.id]||0;G.talk[n.id]=i+1;n.face={up:'down',down:'up',left:'right',right:'left'}[G.dir];
  if(n.goat)n.face=G.x<n.c*TS+16?'left':'right';
  await say(n.lines[i%n.lines.length],n.name);
  if(n.after){let a=n.after[i%n.after.length];if(typeof a==='function')a=await a();if(a)await say(Array.isArray(a)?a:[a]);}
  n.face=null;}

/* ---------------- interactions ---------------- */
async function interact(ch,c,r){const m=G.map;
  if(m==='campus'){
    if(ch==='B')return bench();if(ch==='P')return polybahn();
    if(ch==='T')return say(['* A tree on the Polyterrasse. It has seen generations of students cry here. It stays calm.']);
    if(ch==='l')return say(['* A lamp post. At night the whole terrace glows. Romantic, unless you are in Lernphase.']);
    if(ch==='h')return say(['* A perfectly trimmed hedge. Swiss precision.']);
    if(ch==='^'||ch==='~'||ch==='o')return viewMode();
    if(ch==='F'||ch==='S')return say(['* The Hauptgebäude. Gottfried Semper\'s city-facing facade from 1864; the dark dome was added by Gustav Gull in the 1920s.','* It looks like it is judging your study habits.']);}
  if(m==='uni'){
    if(ch==='Z')return say(['* Tram stop "ETH/Universitätsspital". Tram 10 goes down to the main station and out to the airport.','* You briefly consider the airport. Then you remember the Serie is due on Monday.']);
    if(ch==='A')return say([pick(POSTERS)]);
    if(ch==='b')return say(['* A forest of bikes. Half of them have not moved since 2009.']);
    if(ch==='R')return say(['* Universitätstrasse. Trams, bikes, and the occasional lost tourist.']);
    if(ch==='g')return say(['* The other side of the street. Same as this side, minus the exercise sheets.']);
    if(ch==='h')return say(['* A hedge. Well-groomed. More than can be said for anyone in Lernphase.']);
    if(ch==='B')return say(['* A bench in front of CAB. Prime spot for complaining about Serien.']);
    if(ch==='F')return say(['* CAB: the old chemistry building, here since 1886. A plaque calls it a "Chemical Landmark".','* Today it is the home of the computer science department. The chemicals have been replaced by caffeine.']);}
  if(m==='hg'){
    if(ch==='E'&&c===4)return lectureHall('HG F 1');if(ch==='E'&&c===15)return examRoom();
    if(ch==='N')return say([pick(FLYERS)]);if(ch==='L')return library();
    if(ch==='O')return say(['* A massive stone column. It has held up the HG for over a century.','* You can barely hold up your sleep schedule.']);
    if(ch==='B')return say(['* A wooden bench in the Haupthalle. Someone carved "BP 2x" into it. Respect.']);
    if(ch==='p')return say(['* A plant. It is thriving. Unlike you.']);}
  if(m==='cab'){
    if(ch==='E')return uebungRoom();if(ch==='v')return visOffice();if(ch==='K')return foodLab();if(ch==='V')return vending();if(ch==='Y')return cray();
    if(ch==='G')return say(['* CABinett, the student party room.','* A poster on the door: "Lernphase? Never heard of it. Friday, 20:00."']);
    if(ch==='t')return say([pick(['* A laptop with 47 tabs open. One of them is Code Expert. The rest are not.','* Someone left this week\'s Serie here. Exercise 3 just says "obviously".'])]);
    if(ch==='L')return say(['* Textbooks. One is open at "Chapter 1: Introduction". The bookmark has not moved since September.']);
    if(ch==='p')return say(['* A plant. The only thing in CAB getting enough light.']);}
  if(m==='f6'){
    if(ch==='w')return lectureHall('HG F 6');if(ch==='k')return attendLecture('HG F 6');
    if(ch==='Q')return say(['* The long blackboard still shows yesterday\'s proof.','* In the bottom corner, very small, someone wrote: "goat".']);
    if(ch==='X')return say(['* A screen shows the lecture livestream. 37 people are watching it from bed.']);}
  if(m==='f7'){
    if(ch==='k'&&r===3&&c>=5&&c<=8)return vorbeiTable();if(ch==='k')return attendLecture('HG F 7');if(ch==='w')return lectureHall('HG F 7');
    if(ch==='Q')return say(['* The blackboard: "Ax = λx" and "det(A − λI) = 0 ⇒ Eigenwerte".','* Half of yesterday\'s proof was erased. The other half will remain a mystery forever.']);}
  if(m==='einstein'){
    if(ch==='Y'||ch==='r')return einsteinLocker();
    if(ch==='U')return say([pick(['* An old wooden locker with a tiny brass number. Locked.','* A locker from the days when ETH was the Polytechnikum. Probably full of 19th-century Serien.','* Locked. Inside, maybe, someone\'s motivation from 1897.'])]);
    if(ch==='^'||ch==='~')return say(['* You lean over the railing and look down into the Haupthalle.','* There is a goat down there. Huh.']);}
  if(m==='cabrec'){
    if(ch==='K')return coffeeMachine();if(ch==='V')return fridge();if(ch==='R')return loungeRules();if(ch==='I')return ioiPoster();if(ch==='S')return sofa();if(ch==='G')return toeggeli();
    if(ch==='M')return say(['* The microwave. Six Tupperware boxes are queued in front of it.','* The only perfectly fair FIFO queue at ETH.']);
    if(ch==='t')return say(['* Small tulip-shaped tea glasses and a big thermos. Someone here has a system.']);
    if(ch==='p')return say(['* A plant. Someone has been watering it with cold coffee. It seems fine with that.']);}
  if(m==='mensa'){
    if(ch==='M')return mensaFood();if(ch==='J')return jobBoard();
    if(ch==='R')return say(['* Two menu lines today: "natürlich vegi" and "LOCAL".','* The prices are written in a font size designed to cause emotional damage.']);
    if(ch==='W')return say(['* Big windows over the old town. The best view in Zurich, served with pasta.']);
    if(ch==='t')return say([pick(['* A table. Sticky. Mensa-adjacent.','* Someone left half a Gipfeli on a tray. Respect the dead.'])]);
    if(ch==='p')return say(['* A plant. It eats better than you.']);}}
async function vending(){
  const c=await ask('* The beer vending machine of CAB. The most reliable machine in the building. 2.50 CHF.',['Buy a beer','Leave']);if(c!==0)return;
  if(G.money<250){SFX.bad();return say(['* INSUFFICIENT FUNDS.',G.ects<28?'* ...like your KP.':'* The machine judges you silently.']);}
  G.money-=250;G.beers++;SFX.coin();await say(['* Clunk. A cold beer drops.','* (Drink it from the menu with X: +15 Sanity and +1 HP in your next fight.)']);}
async function foodLab(){
  const c=await ask('* food&lab, the CAB cafeteria. Coffee 3.00 · Gipfeli 2.00.',['Coffee (+10 Sanity)','Gipfeli (+8 Sanity)','Leave']);if(c<0||c>1)return;
  const price=c===0?300:200,gain=c===0?10:8;
  if(G.money<price){SFX.bad();return say(['* Not enough money. You stare at the Gipfeli. The Gipfeli stares back.']);}
  G.money-=price;G.sanity=Math.min(100,G.sanity+gain);if(c===0)G.stats.coffees++;SFX.coin();
  await say([c===0?'* A coffee. It tastes like debugging. +10 Sanity.':'* A buttery Gipfeli. For a moment, everything is fine. +8 Sanity.']);}
async function cray(){
  if(G.cray===G.week)return say(['* You already sat on the Cray this week. It needs to cool down. So do you.']);
  const c=await ask('* The Cray X-MP/28, a real supercomputer from the 1980s. Today: the comfiest bench in CAB.',['Sit down for a while','Leave']);if(c!==0)return;
  G.cray=G.week;G.sanity=Math.min(100,G.sanity+8);await say(['* You sit on a machine that once filled a computing centre. Now it holds your backpack.','* +8 Sanity.']);}
async function visOffice(){
  const c=await ask('* VIS office. Home of the legendary Prüfungssammlung: old exams from years past.',['Study old exams (1 AP)','Chat with VIS','Leave']);
  if(c===1)return say([pick(['"Erstsemestrigenfest on Friday! Snacks while stocks last."','"Do old exams under real conditions: timer, no phone, no crying."','"Block 1 is the HS courses, Block 2 the FS ones. You need both."'])],'VIS');
  if(c!==0)return;if(!await spendAP())return;G.sanity=Math.max(0,G.sanity-10);G.prep=true;
  await say(['* You work through three old exams. Patterns emerge. The exam writers are only human.','* Altprüfungen bonus: +1 HP in your next Basisprüfung block. (−10 Sanity)']);await gainXP(35);await afterAction();}
async function library(){
  const c=await ask('* ETH-Bibliothek. So quiet you can hear people panicking about Lernphase.',['Study the script (1 AP)','Write your Zusammenfassung (1 AP)','Leave']);if(c<0||c>1)return;
  if(c===1){if(G.notes)return say(['* Your Zusammenfassung is already done. Six pages, tiny letters, colour-coded.']);
    if(!await spendAP())return;G.notes=true;G.sanity=Math.max(0,G.sanity-5);
    await say(['* You write six dense A4 pages by hand. Allowed in the LinAlg and Diskrete Mathe exams of Block 1.','* Block 1 bonus: the LinAlg and Diskrete Mathe parts start with +2 super cards. (−5 Sanity)']);return afterAction();}
  if(!await spendAP())return;G.sanity=Math.max(0,G.sanity-10);
  await say([pick(['* You read the script for three hours. You understood one theorem. It was the one with the picture.','* You find a seat by the window and actually work. A rare, beautiful moment.']),'* (−10 Sanity)']);
  await gainXP(30);await afterAction();}
async function polybahn(){
  const c=await ask('* POLYBAHN. Down to Central in two and a half minutes, then into the Niederdorf.',['Night out in the Niederdorf (1 AP, 15 CHF)','Leave']);if(c!==0)return;
  if(G.money<1500){SFX.bad();return say(['* You count your coins. The Niederdorf will have to wait.']);}
  if(!await spendAP())return;G.money-=1500;G.sanity=Math.min(100,G.sanity+30);SFX.coin();
  await say(['* You ride the Polybahn down, eat a Döner in the Niederdorf and walk along the Limmat.','* +30 Sanity, −15 CHF. You did not think about Serien for three whole hours.']);await afterAction();}
async function mensaFood(){const i=G.week*3+G.ap,v=VEGI[i%VEGI.length],l=LOCAL[i%LOCAL.length];
  const c=await ask(`* Mensa Polyterrasse. natürlich vegi: ${v}. LOCAL: ${l}.`,['natürlich vegi · 5.40','LOCAL · 10.50','Leave']);if(c<0||c>1)return;
  const price=c===0?540:1050,gain=c===0?15:25;
  if(G.money<price){SFX.bad();return say(['* Not enough money. You stare at the menu until the queue pushes you along.']);}
  G.money-=price;G.sanity=Math.min(100,G.sanity+gain);SFX.coin();await say([`* You eat ${c===0?v:l}. +${gain} Sanity.`]);}
async function jobBoard(){
  const c=await ask('* JOB BOARD: "Hilfsassistent wanted to correct Serien." +30 CHF, −15 Sanity, 1 AP.',['Work a shift','Leave']);if(c!==0)return;
  if(!await spendAP())return;G.money+=3000;G.sanity=Math.max(0,G.sanity-15);G.stats.shifts++;SFX.coin();
  await say([`* You correct ${30+Math.floor(Math.random()*40)} Serien.`,pick(['* Most of them prove that 1 = 1. One proves that 1 = 2.','* One student wrote "see attached" and attached nothing.','* Someone drew a very detailed cat instead of a proof. Partial credit.']),'* +30.00 CHF, −15 Sanity.']);
  await afterAction();}
async function bench(){
  const c=await ask('* A bench on the Polyterrasse. Zurich glitters below.',['Go home & sleep (next week)','Enjoy the view','Leave']);
  if(c===0){if(G.ap>0){const s=await ask(`* You still have ${G.ap} AP this week. Sleep anyway?`,['Sleep','Stay']);if(s!==0)return;}return nextWeek(false);}
  if(c===1){if(G.view===G.week)return say(['* You already stared at the lake this week. The lake is starting to stare back.']);
    G.view=G.week;G.sanity=Math.min(100,G.sanity+5);await say(['* You watch the lake and the Alps for a while.','* +5 Sanity. Free therapy.']);}}
async function uebungRoom(){
  const c=await ask('* Übungsraum. Which Übung? (1 AP, −10 Sanity)',['Programming: find the bug','Math & Logic: quiz','Q&A: survive "Any questions?"','Leave']);
  if(c<0||c>2)return;if(!await spendAP())return;
  await say(pick(TA_INTRO[c]),'Laura (TA)');
  const score=await new Promise(res=>fadeTo(()=>setScene([makeBug,makeQuiz,makeDodge][c](res))));
  G.sanity=Math.max(0,G.sanity-10);G.stats.ubungen++;
  await say([`* Übung done. Score: ${Math.round(score*100)}%.`,score>=0.8?pick(['Laura: "Wow. Someone actually did the Serie."','Laura: "Perfect! Please explain it to the others."']):score>=0.4?'Laura: "Not bad! Partial credit is still credit."':'Laura: "...we will go over this again next week."']);
  await gainXP(Math.round(20+score*50));await afterAction();}
async function lectureHall(hall='HG F 1'){G.hall=hall;
  let list=HS;
  if(G.week>=8){const s=await ask(`* ${hall}. Which semester's lecture?`,['Herbstsemester (HS)','Frühjahrssemester (FS)','Leave']);if(s<0||s>1)return;list=s===0?HS:FS;}
  const opts=list.map(id=>{const b=BOSSES[id],mk=mark(id);return `${b.short} · ${b.courseShort}${mk==='·'?'':' '+mk}`;});opts.push('Leave');
  const c=await ask(`* ${hall}. ${list===HS?'Herbstsemester':'Frühjahrssemester'}: who do you challenge? (1 AP)`,opts);if(c<0||c>=list.length)return;
  const id=list[c],b=BOSSES[id];
  if(G.level<b.lvl)return say([`* ${b.short} looks at you over their glasses.`,`* "Come back at LV ${b.lvl}. The Übungen exist for a reason."`]);
  if(G.beaten[id]){const r=await ask(`* You already passed ${b.course}. Rematch for fun? (1 AP, small XP)`,['Rematch','Leave']);if(r!==0)return;}
  if(!await spendAP())return;await fight(id);}
async function attendLecture(hall='HG F 6'){
  const desc=hall==='HG F 6'?'Birch wood, fold-down desk, surprisingly comfy.':'Old oak, carved by generations of students.';
  const c=await ask(`* A seat in ${hall}. ${desc} Sit in on a lecture? (1 AP)`,['Attend the lecture','Leave']);if(c!==0)return;
  if(!await spendAP())return;
  if(Math.random()<0.3){G.sanity=Math.min(100,G.sanity+10);await say(['* The room is warm. The voice is calm. You fall asleep in minute 12.','* You wake up refreshed and slightly confused. +10 Sanity.']);await gainXP(5);}
  else{G.sanity=Math.max(0,G.sanity-5);await say(['* You follow the whole lecture. You even understand the last slide.','* (−5 Sanity)']);await gainXP(25);}
  await afterAction();}
const EGGS=[];
async function vorbeiTable(){
  await say(['* A long oak table in the front row. Scratched into the wood, very small:','* "Sind Sie vorbei?"','* Next to it, tally marks. Twenty-three of them. Someone counted during one single lecture.']);
  const c=await ask('* Sind Sie vorbei?',['Ja!','Nein...','Was heisst "vorbei"?']);
  if(c===0)await say(['* You say "Ja" to a table. Like everyone else in the lecture.','* Nobody in the room was vorbei.']);
  else if(c===1)await say(['* Brave and honest. The lecture moves on anyway.']);
  else await say(['* Literally: "Are you past it?"','* In a lecture it means: Got it? Can I go on?','* (Prof. Eigenwert asks it about forty times per lecture. The answer is always "Ja".)']);
  if(!G.eggVorbei){G.eggVorbei=true;SFX.coin();await gainXP(10);}}
function goatMeet(){
  if(!G.eggGoat){G.eggGoat=true;G.sanity=Math.min(100,G.sanity+5);SFX.level();
    return ['* A goat. In the middle of the HG. Nobody knows how it got past Herr Brunner.','* It looks at you with the calm of someone who passed every exam with a 6.0. It is the GOAT.','* You feel strangely inspired. +5 Sanity.'];}
  return [pick(['* The goat is chewing on an old Serie. It seems to enjoy Exercise 3.','* The goat stares into the distance. It has seen things. It has seen Block 2.','* Mäh. (You are fairly sure it said "Bestanden".)'])];}
function teaGift(){
  if(G.teaDay===dayNo())return '* She points at the thermos, then at you, and laughs. (Probably: "you already had one today".)';
  G.teaDay=dayNo();G.sanity=Math.min(100,G.sanity+5);return '* She pours you a small glass of tea. You did not understand a word, but you understood the tea. +5 Sanity.';}
async function photoFavor(){
  const c=await ask('* They hold out a phone.',['Take the photo','Sorry, no time']);if(c!==0)return '* "No problem! Have a nice day!"';
  OW.flashUntil=performance.now()+160;SFX.confirm();
  if(G.favorDay===dayNo())return '* *click* "Perfect, thanks again!"';
  G.favorDay=dayNo();G.sanity=Math.min(100,G.sanity+3);return ['* *click* Four tourists, one locker, nobody blinking. A masterpiece.','* "Thank you so much!" +3 Sanity.'];}
async function einsteinLocker(){
  await say(['* Einstein\'s locker. Today it is a tiny exhibition behind glass, maybe the smallest Einstein museum in the world.',
    '* Albert Einstein studied here from 1896 to 1900, when ETH was still the Polytechnikum. In 1912 he came back as a professor.',
    '* Fun fact: he often skipped lectures and studied from his friends\' notes before the exams.',
    '* His grades went from 1 to 6, like yours. He had 4s, 5s and, of course, 6s.']);
  if(!G.eggEinstein){G.eggEinstein=true;await say(['* You feel a little smarter just standing here. Or that was the flash.']);await gainXP(15);}
  const c=await ask('* Take a photo too?',['Take a photo','Leave']);
  if(c===0){OW.flashUntil=performance.now()+160;SFX.confirm();await say(['* *click* Now you are one of them.']);}}
async function viewMode(){
  const c=await ask('* A coin binocular at the edge of the Polyterrasse. A sticker says: "FREE for students. Can you find the professor hiding in the city?"',['Look through it','Leave']);if(c!==0)return;
  await new Promise(res=>fadeTo(()=>setScene(makeView(res))));saveGame();}
async function coffeeMachine(){const f=freeToday();
  if(machineBroken()){SFX.bad();await say(COFFEE_MEMES[dayNo()%COFFEE_MEMES.length]);return say(['* No free coffee today. (food&lab next door sells it for 3.00.)']);}
  if(f.beer)return say(['* You already had today\'s free beer. Coffee OR beer, not both. Rules are rules.']);
  if(f.coffee>=2)return say(['* Two free coffees today already. The machine beeps judgmentally.','* Come back tomorrow, or buy one at food&lab.']);
  const c=await ask(`* The Aufenthaltsraum coffee machine. Free for students. (${2-f.coffee} left today)`,['Coffee (+10 Sanity)','Leave']);if(c!==0)return;
  f.coffee++;G.stats.coffees++;G.sanity=Math.min(100,G.sanity+10);SFX.coin();
  await say([pick(['* Grrrr... pssshhh. A free coffee. It tastes like free coffee. +10 Sanity.','* The machine grinds the beans with the energy of a Basisprüfung. +10 Sanity.']),f.coffee===2?'* That was your second one. Your hands are vibrating slightly.':'* One more free coffee left today.']);saveGame();}
async function fridge(){const f=freeToday(),d=dayNo();
  if(f.coffee>0)return say(['* You already had coffee today. Per day it\'s 2 coffees OR 1 beer.','* The fridge hums disapprovingly.']);
  if(f.beer)return say(['* You already took today\'s free beer.']);
  if(d-G.freeBeerDay<3){SFX.bad();return say(['* The fridge is locked. A note: "Free beer: max. one every 3 days."',`* Next free beer: ${nextBeerLabel()}.`]);}
  const c=await ask('* The Aufenthaltsraum fridge. One free beer, every 3 days.',['Take a beer','Leave']);if(c!==0)return;
  f.beer=true;G.freeBeerDay=d;G.beers++;SFX.coin();
  await say(['* Psssht. A cold, free beer. It goes straight into your bag.','* (Drink it from the menu with X: +15 Sanity and +1 HP in your next fight.)']);saveGame();}
async function loungeRules(){const f=freeToday(),beerOk=dayNo()-G.freeBeerDay>=3;
  await say(['* AUFENTHALTSRAUM · RULES','* 1. Free for students: per day EITHER 2 coffees OR 1 beer.','* 2. Beer: max. one every 3 days. The fridge knows. The fridge always knows.','* 3. Please empty the Satzbehälter. PLEASE. – die Kafi-Kommission',
    `* Today is ${DAYLONG[dayIdx()]}. ${f.beer?'You already took your beer.':f.coffee?`Coffees today: ${f.coffee}/2.`:'You have not had anything yet.'} ${beerOk?'Beer is available.':`Next free beer: ${nextBeerLabel()}.`}`]);}
async function ioiPoster(){
  await say(['* A framed photo on the wall: a team in matching blue T-shirts. Big letters: IOI.','* The International Olympiad in Informatics. A note below: "Our alumni. Ask them about dynamic programming. Or don\'t."','* Some of your classmates were there. They solve the Serie in twenty minutes. You try not to think about it.']);
  if(!G.eggIoi){G.eggIoi=true;SFX.coin();await gainXP(10);}}
async function sofa(){if(G.sofaDay===dayNo())return say(['* The sofa still has your shape in it from earlier. Better not get too comfortable.']);
  G.sofaDay=dayNo();G.sanity=Math.min(100,G.sanity+5);await say(['* You sink into the sofa. For ten minutes, nothing is due.','* +5 Sanity.']);}
async function toeggeli(){const c=await ask('* A Töggelikasten (table football). One of the red goalkeepers is missing a leg.',['Play a round','Leave']);if(c!==0)return;
  if(G.toeggeliDay===dayNo())return say(['* Your wrists still hurt from the last round.']);
  G.toeggeliDay=dayNo();const w=Math.random()<0.5;G.sanity=Math.min(100,G.sanity+(w?6:3));SFX.coin();
  await say([w?'* You win 10:8 against a second-year. You will mention this for weeks. +6 Sanity.':'* You lose 4:10 against a second-year who "barely plays". +3 Sanity anyway.']);}
async function examRoom(){const b1=beatenOf(HS),b2=beatenOf(FS);
  const st=(id,n,sem)=>G.beaten[id]?' ✓':n<4?` (${n}/4 ${sem} profs)`:'';
  const c=await ask('* PRÜFUNGSRAUM. The Basisprüfung comes in two blocks. Three hours each. No cheat sheet.',[`Block 1 · HS courses${st('block1',b1,'HS')}`,`Block 2 · FS courses${st('block2',b2,'FS')}`,'Leave']);
  if(c<0||c>1)return;const id=c===0?'block1':'block2',n=c===0?b1:b2;
  if(G.beaten[id])return say(['* You already passed this block. The exam office sends a polite email: "Please stop."']);
  if(n<4)return say([`* Sealed. Admission to Block ${c+1} requires defeating all four ${c===0?'HS':'FS'} professors in the HG lecture halls. (${n}/4)`]);
  if(!await spendAP())return;await fight(id);}
async function fight(id){const b=BOSSES[id];
  await say(b.intro,b.name);
  if(G.buff)await say(['* The beer kicks in. +1 HP. The room is... slightly wobbly.']);
  if(b.exam&&G.prep)await say(['* You remember the old exams from VIS. +1 HP.']);
  if(id==='block1'&&G.notes)await say(['* Your handwritten Zusammenfassung is in your bag. (LinAlg and Diskrete Mathe parts: +2 super cards)']);
  const r=await new Promise(res=>fadeTo(()=>setScene(makeCombat(id,res))));
  if(r.gaveUp){G.sanity=Math.max(0,G.sanity-10);await say(['* You sneak out of the room. Nobody saw. Probably. (−10 Sanity)']);return afterAction();}
  if(r.won){const first=!G.beaten[id];G.beaten[id]=true;G.stats.wins++;G.stats.grades.push(r.grade);G.sanity=Math.max(0,G.sanity-5);
    await say(b.win,b.name);
    if(b.exam){await say([`* ${b.name}: BESTANDEN with grade ${r.grade.toFixed(2)}!`]);
      if(G.beaten.block1&&G.beaten.block2){G.passed=true;return endGame(true);}
      await say([`* One block down. ${G.beaten.block1?'Block 2':'Block 1'} is still to go.`]);await gainXP(60);return afterAction();}
    if(first){G.ects+=b.kp;await say([`* PASSED with grade ${r.grade.toFixed(2)}! +${b.kp} KP.`]);await gainXP(40);
      if(b.sem==='HS'&&beatenOf(HS)===4)await say(['* All four HS professors defeated!','* Block 1 of the Basisprüfung is open in the HG exam room.']);
      if(b.sem==='FS'&&beatenOf(FS)===4)await say(['* All four FS professors defeated!','* Block 2 of the Basisprüfung is open in the HG exam room.']);}
    else{await say([`* Rematch won with grade ${r.grade.toFixed(2)}. Your ego grows.`]);await gainXP(10);}}
  else{G.stats.losses++;G.sanity=Math.max(0,G.sanity-20);await say(b.lose,b.name);
    await say([`* Grade ${r.grade.toFixed(2)}. Not passed. (−20 Sanity)`,'* Tip: higher levels give more HP, a beer gives +1 HP, and pink things can be parried.']);}
  await afterAction();}

/* ---------------- menu ---------------- */
async function menu(){
  const c=await ask('* MENU',['Items','Stats','Save','Controls','Quit to title','Close']);
  if(c===0){const i=await ask('* ITEMS',[`Beer ×${G.beers}`,'Back']);if(i!==0)return;
    if(G.beers<=0)return say(['* You have no beer. The vending machine in CAB can fix that.']);
    G.beers--;G.stats.beers++;G.sanity=Math.min(100,G.sanity+15);G.buff=true;SFX.coin();
    return say(['* You drink a beer. +15 Sanity.','* Liquid courage: +1 HP in your next fight. (Side effects may include wobbling.)']);}
  if(c===1){const sn=id=>`${BOSSES[id].short.replace('Prof. ','')} ${mark(id)}`;
    return say([`* ${semester()} · WEEK ${G.week}/14 · ${DAYLONG[dayIdx()]} · AP ${G.ap}/3 · LV ${G.level} · XP ${G.xp}/${nextXP()} · KP ${G.ects}/56`,
      `* Sanity ${G.sanity}/100 · ${chf(G.money)} CHF · Beers ${G.beers} · Fight HP ${hpFor(G.level)}${G.buff?' (+1 beer)':''}${G.prep?' (+1 old exams)':''}${G.notes?' · Zusammenfassung ready':''}`,
      '* HS: '+HS.map(sn).join(', '),'* FS: '+FS.map(sn).join(', '),
      `* Basisprüfung: Block 1 ${G.beaten.block1?'✓':'·'} · Block 2 ${G.beaten.block2?'✓':'·'}`]);}
  if(c===2)return say([saveGame()?'* Progress saved (in this browser).':'* Saving is not available here, sorry.']);
  if(c===3)return say(CONTROLS);
  if(c===4){const q=await ask('* Quit to the title screen? Unsaved progress is lost.',['Quit','Cancel']);if(q===0)fadeTo(()=>setScene(makeTitle()));}}

/* ---------------- title / intro / ending ---------------- */
function makeTitle(){const hasSave=!!loadSave(),opts=hasSave?['Continue','New game','Controls']:['New game','Controls'];
  const stars=Array.from({length:70},()=>({x:rnd(0,W),y:rnd(0,220),s:Math.random()<0.2?2:1,p:rnd(0,6)}));
  const S={music:'title',sel:0,t:0};
  S.update=dt=>{S.t+=dt;if(lock)return;const n=opts.length;
    if(hit('up')){S.sel=(S.sel+n-1)%n;SFX.select();}if(hit('down')){S.sel=(S.sel+1)%n;SFX.select();}
    if(hit('ok')){const o=opts[S.sel];SFX.confirm();
      if(o==='New game'){G=newGame();lock=true;fadeTo(()=>{setScene(OW);lock=false;flow(intro);});}
      else if(o==='Continue'){G=Object.assign(newGame(),loadSave()||{});lock=true;fadeTo(()=>{setScene(OW);OW.banner=2.2;lock=false;});}
      else flow(()=>say(CONTROLS));}};
  S.draw=()=>{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d0a24');g.addColorStop(1,'#2b1f4a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(const s of stars){ctx.globalAlpha=0.45+0.55*Math.abs(Math.sin(S.t*1.3+s.p));rect(s.x,s.y,s.s,s.s,'#fff');}ctx.globalAlpha=1;
    const base=262;ctx.fillStyle='#1b2036';ctx.beginPath();ctx.ellipse(320,base,66,32,0,Math.PI,0);ctx.fill();rect(314,base-38,12,8,'#1b2036');
    rect(40,base,560,H-base,'#171a2e');ctx.fillStyle='#1d2137';ctx.beginPath();ctx.moveTo(250,base+2);ctx.lineTo(320,base-14);ctx.lineTo(390,base+2);ctx.fill();
    for(let i=0;i<14;i++){const x=58+i*38;if(x>240&&x<400)continue;const lit=((i*7+3)%5)<2;ctx.fillStyle=lit?'#ffd16699':'#2a2152';ctx.beginPath();ctx.arc(x+7,base+16,7,Math.PI,0);ctx.fill();rect(x,base+16,14,14,lit?'#ffd16699':'#2a2152');}
    for(const cx of [262,278,352,368])rect(cx,base+4,8,52,'#252a44');ctx.fillStyle='#ffd16655';ctx.beginPath();ctx.arc(320,base+30,22,Math.PI,0);ctx.fill();rect(298,base+30,44,30,'#ffd16655');
    rect(0,336,W,4,'#0a0718');for(let x=4;x<W;x+=10)rect(x,340,4,12,'#0a0718');rect(0,352,W,8,'#0a0718');
    txt('ETH:',W/2,30,{font:PX,size:24,align:'center',color:'#ffd166',shadow:'#000'});
    txt('YEAR ONE',W/2,64,{font:PX,size:32,align:'center',color:'#fff',shadow:'#ff6ad5'});
    txt('survive the Basisjahr in Computer Science',W/2,108,{size:20,align:'center',color:'#cfc9e8'});
    opts.forEach((o,i)=>{const y=142+i*28;txt(o,W/2,y,{font:PX,size:16,align:'center',color:i===S.sel?'#ffd166':'#8f89b0'});if(i===S.sel)drawHeart(W/2-tw(o,16,PX)/2-26,y+1,2);});
    txt('↑↓ choose · Z select',W/2,214,{size:16,align:'center',color:'#6f6990'});};
  return S;}
async function intro(){await say(['* September. You got into Computer Science at ETH Zürich. Welcome to the Basisjahr.',
  '* Weeks 1–7 are the Herbstsemester (HS), weeks 8–14 the Frühjahrssemester (FS).',
  '* Beat the four professors of each semester in the HG lecture halls (F 1, F 6, F 7), then pass Basisprüfung Block 1 and Block 2 in the HG exam room.',
  '* Übungen in CAB give XP. Levels unlock professors and give you more HP in fights.',
  '* You have 3 AP (energy) per week, one action per day: Monday, Wednesday, Friday. Sit on a Polyterrasse bench to sleep and start a new week.',
  '* Also: CAB has a beer vending machine and an Aufenthaltsraum with free coffee. Just saying.']);saveGame();}
function makeEnding(passed){clearSave();const gr=G.stats.grades,avg=gr.length?gr.reduce((a,b)=>a+b,0)/gr.length:0;
  const conf=Array.from({length:60},()=>({x:rnd(0,W),y:rnd(-H,0),v:rnd(30,90),c:pick(['#ffd166','#ff6ad5','#9be564','#7fdbff'])}));
  const S={music:passed?'ending':'title',t:0};
  S.update=dt=>{S.t+=dt;for(const c of conf){c.y+=c.v*dt;if(c.y>H)c.y=-10;}if(S.t>1.5&&hit('ok'))fadeTo(()=>setScene(makeTitle()));};
  S.draw=()=>{rect(0,0,W,H,passed?'#0f2a1d':'#2a0f16');if(passed)for(const c of conf)rect(c.x,c.y,4,6,c.c);
    txt(passed?'BASISJAHR':'NOT PASSED',W/2,40,{font:PX,size:24,align:'center',color:passed?'#9be564':'#ff5d5d',shadow:'#000'});
    txt(passed?'BESTANDEN!':'See you next year.',W/2,78,{font:PX,size:16,align:'center',color:'#fff',shadow:'#000'});
    const lines=passed?[`You passed the Basisjahr in ${G.week} week${G.week>1?'s':''}.`,`KP ${G.ects}/56 · Level ${G.level} · Average grade ${avg?avg.toFixed(2):'–'}`,
      `Beers ${G.stats.beers} · Coffees ${G.stats.coffees} · Übungen ${G.stats.ubungen} · Shifts ${G.stats.shifts}`,`Fights lost along the way: ${G.stats.losses}`,'Second year awaits. (Not in this game. Yet.)']
      :['The semester ended before you passed the Basisprüfung.',`KP ${G.ects}/56 · Level ${G.level} · Professors ${beatenCount()}/8 · Blocks ${(G.beaten.block1?1:0)+(G.beaten.block2?1:0)}/2`,
      'Repeating the Basisjahr is a classic. Many legends did.','Tip: Übungen early, old exams from VIS, beer before fights, parry the pink.'];
    lines.forEach((l,i)=>txt(l,W/2,130+i*30,{size:22,align:'center',color:'#fff'}));
    if(S.t>1.5)txt('Press Z to return to the title screen',W/2,320,{size:18,align:'center',color:'#cfc9e8'});};
  return S;}
