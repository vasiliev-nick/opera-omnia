// Usage: node shot.cjs <page.html> <tex-svg.js> <outdir> <theme> <width> [names]. Screenshots of every figure in several states.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const [page,mj,out,theme,wid,only]=process.argv.slice(2);const MJ=fs.readFileSync(mj,'utf8');const width=+wid;
/* name: [canvas id, actions]; ['v',input,value], ['k',canvas,data-k] or ['c',button id]. */
const SHOTS={
  fog:['fog',[]],fogStep:['fog',[['c','fogStep'],['c','fogStep'],['c','fogStep'],['c','fogStep']]],fogMap:['fog',[['k','fog','map'],['c','fogStep'],['c','fogStep'],['c','fogStep']]],
  balls:['balls',[]],quad:['quad',[]],quadRound:['quad',[['v','qdL1',1],['v','qdL2',1]]],
  dirs:['dirs',[]],dirsRun:['dirs',[['c','drRun']]],dirs1e4:['dirs',[['v','drD',4],['c','drRun']]],
  anneal:['anneal',[]],annealRun:['anneal',[['c','anRun']]],annealConst:['anneal',[['k','anneal','const'],['c','anRun']]],
  steep:['steep',[]],
  upper:['upper',[]],upperSmall:['upper',[['v','upL',0.8]]],
  gd:['gd',[]],gdBig:['gd',[['v','gdK',2]]],gdDiv:['gd',[['v','gdE',2.1]]],
  norms:['norms',[]],normsInf:['norms',[['k','norms','linf']]],normsA:['norms',[['k','norms','A']]],
  prec:['prec',[]],precRot:['prec',[['v','pcA',45]]],precZ:['prec',[['k','prec','z']]]
};
(async()=>{const b=await chromium.launch();
  const p=await b.newPage({viewport:{width,height:1000},colorScheme:theme,deviceScaleFactor:width<500?2:1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+page);await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(600);
  await p.screenshot({path:out+'/'+theme+'_'+width+'_top.png'});
  const names=only?only.split(','):Object.keys(SHOTS);
  for(const nm of names){const [id,acts]=SHOTS[nm];
    await p.evaluate(([id,acts])=>{for(const a of acts){
        if(a[0]==='v'){const e=document.getElementById(a[1]);e.value=a[2];e.dispatchEvent(new Event('input',{bubbles:true}));}
        else if(a[0]==='c')document.getElementById(a[1]).click();
        else if(a[0]==='p')document.getElementById(a[1]).closest('figure').querySelector('button[data-pre="'+a[2]+'"]').click();
        else{const f=document.getElementById(a[1]).closest('figure');const gs=[...f.querySelectorAll('.seg')];const g=a[0]==='k2'?gs[1]:gs[0];g.querySelector('button[data-k="'+a[2]+'"]').click();}}},[id,acts]);
    const fig=await p.evaluateHandle(i=>document.getElementById(i).closest('figure'),id);
    await fig.scrollIntoViewIfNeeded();await p.waitForTimeout(250);
    await fig.screenshot({path:out+'/'+theme+'_'+width+'_'+nm+'.png'});
    await p.evaluate(([id])=>{const f=document.getElementById(id).closest('figure');
      f.querySelectorAll('input[type=range]').forEach(e=>{e.value=e.defaultValue;e.dispatchEvent(new Event('input',{bubbles:true}));});
      f.querySelectorAll('.seg').forEach(g=>{const d=g.querySelector('button[aria-pressed="true"]');});},[id]);
  }
  console.log('errors',JSON.stringify(errs));await b.close();})();
