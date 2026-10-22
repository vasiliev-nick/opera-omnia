const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
/* name: [figure element id, list of actions]; an action is ['v', input id, value] or ['k', canvas id, data-k]. */
const SHOTS={
  pushM2:['push',[]],pushM6:['push',[['v','puH',6]]],pushH1:['push',[['k','push','H'],['v','puH',1]]],pushH5:['push',[['k','push','H'],['v','puH',5]]],
  canC3:['cantor',[]],canC7:['cantor',[['v','caK',7]]],canC0:['cantor',[['v','caK',0]]],canP2:['cantor',[['k','cantor','P'],['v','caK',2]]],canP6:['cantor',[['k','cantor','P'],['v','caK',6]]],
  dens:['dens1',[]],densR:['dens1',[['v','d1X',1.4],['v','d1W',0.6]]],densL:['dens1',[['v','d1X',-2.2],['v','d1W',0.05]]],
  fubX:['fubini',[]],fubX1:['fubini',[['v','fbS',1]]],fubY:['fubini',[['k','fubini','Y'],['v','fbS',0.7]]],
  fcX:['fcounter',[]],fcY4:['fcounter',[['k','fcounter','Y'],['v','fcE',4]]],fcX0:['fcounter',[['v','fcE',0.2]]],
  g2:['gauss2',[]],g2a:['gauss2',[['v','g2A',0.4],['v','g2B',-1.2],['v','g2D',0.3]]],g2b:['gauss2',[['v','g2A',1.8],['v','g2B',1.2],['v','g2D',1.6]]],
  lyV3:['layer',[]],lyV7:['layer',[['v','lyN',7]]],lyH2:['layer',[['k','layer','H'],['v','lyN',2]]],lyH5:['layer',[['k','layer','H'],['v','lyN',5]]]
};
(async()=>{
  const theme=process.argv[2]||'light';const width=+(process.argv[3]||820);
  const names=(process.argv[4]||Object.keys(SHOTS).join(',')).split(',');
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width,height:1000},colorScheme:theme,deviceScaleFactor:width<500?2:1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/p3/ch0p3.html');
  await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(700);
  const log=[];
  for(const nm of names){const [id,acts]=SHOTS[nm];
    const ro=await p.evaluate(([id,acts])=>{
      for(const a of acts){
        if(a[0]==='v'){const e=document.getElementById(a[1]);e.value=a[2];e.dispatchEvent(new Event('input',{bubbles:true}));}
        else{const f=document.getElementById(a[1]).closest('figure');f.querySelector('.seg button[data-k="'+a[2]+'"]').click();}}
      const f=document.getElementById(id).closest('figure');
      return [...f.querySelectorAll('.rr:not([hidden]) output.gv')].map(o=>o.textContent).join(' / ')+' | '+[...f.querySelectorAll('.gk')].map(k=>k.style.left).join(' ');
    },[id,acts]);
    log.push(nm+': '+ro);
    const fig=await p.evaluateHandle(i=>document.getElementById(i).closest('figure'),id);
    await fig.scrollIntoViewIfNeeded();await p.waitForTimeout(350);
    await fig.screenshot({path:'p3/shots/'+theme+'_'+width+'_'+nm+'.png'});
    /* reset to the initial state */
    await p.evaluate(([id])=>{const f=document.getElementById(id).closest('figure');
      f.querySelectorAll('input[type=range]').forEach(e=>{e.value=e.defaultValue;e.dispatchEvent(new Event('input',{bubbles:true}));});
      const s=f.querySelector('.seg button');if(s)s.click();},[id]);
  }
  console.log(log.join('\n'));console.log('errors:',JSON.stringify(errs));await b.close();})();
