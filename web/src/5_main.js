/* ---------------- main loop ---------------- */
function frame(now){const dt=Math.min(0.033,Math.max(0,(now-last)/1000));last=now;
  try{if(fade)updFade(dt);else if(dlg)updDlg(dt);else if(scene)scene.update(dt);}catch(e){console.error(e);}
  musicTick();
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.globalAlpha=1;
  try{if(scene)scene.draw();if(dlg)drawDlg();}catch(e){console.error(e);}
  if(fade){ctx.globalAlpha=1;rect(0,0,W,H,`rgba(0,0,0,${clamp(fade.a,0,1)})`);}
  for(const k in pressed)delete pressed[k];
  requestAnimationFrame(frame);}
async function boot(){
  try{await Promise.race([Promise.all([document.fonts.load(`20px ${VT}`),document.fonts.load(`16px ${PX}`)]),new Promise(r=>setTimeout(r,1500))]);}catch(e){}
  setScene(makeTitle());requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});}
window.__eth={get G(){return G;},set G(v){G=v;},get scene(){return scene;},get dlg(){return dlg;},get lock(){return lock;},get fade(){return fade;},
  setScene,makeCombat,makeQuiz,makeBug,makeDodge,OW,BOSSES,flow,fight,nextWeek,newGame};
boot();
})();
</script>
</body>
</html>
