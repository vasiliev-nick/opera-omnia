const {chromium}=require('playwright');
const fs=require('fs');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
/* name: [figure element id, list of actions]; an action is ['v', input id, value] or ['k', canvas id, data-k]. */
const SHOTS={
  needleN4:['needle',[]],needleN17:['needle',[['v','ndN',17]]],needleE5:['needle',[['k','needle','E'],['v','ndN',5]]],needleP12:['needle',[['k','needle','P'],['v','ndN',12]]],needleP1:['needle',[['k','needle','P'],['v','ndN',1]]],
  fatou1:['fatou',[]],fatou8:['fatou',[['v','ftN',8]]],fatou24:['fatou',[['v','ftN',24]]],
  dctM6:['dct',[]],dctM20:['dct',[['v','dcN',20]]],dctM1:['dct',[['v','dcN',1]]],dctS6:['dct',[['k','dct','S']]],dctS15:['dct',[['k','dct','S'],['v','dcN',15],['v','dcE',3.2]]],
  tw13:['typewriter',[]],tw63:['typewriter',[['v','twN',63]]],tw2:['typewriter',[['v','twN',2]]],
  modes:['mdA',[]],dsA3:['dseries',[]],dsA10:['dseries',[['v','dsK',10]]],dsP4:['dseries',[['k','dseries','P'],['v','dsK',4]]]
};
(async()=>{
  const theme=process.argv[2]||'light';const width=+(process.argv[3]||820);
  const names=(process.argv[4]||Object.keys(SHOTS).join(',')).split(',');
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width,height:1000},colorScheme:theme,deviceScaleFactor:width<500?2:1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/p2/ch0p2.html');
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
    await fig.screenshot({path:'p2/shots/'+theme+'_'+width+'_'+nm+'.png'});
    /* reset to the initial state */
    await p.evaluate(([id])=>{const f=document.getElementById(id).closest('figure');
      f.querySelectorAll('input[type=range]').forEach(e=>{e.value=e.defaultValue;e.dispatchEvent(new Event('input',{bubbles:true}));});
      const s=f.querySelector('.seg button');if(s)s.click();},[id]);
  }
  console.log(log.join('\n'));console.log('errors:',JSON.stringify(errs));await b.close();})();
