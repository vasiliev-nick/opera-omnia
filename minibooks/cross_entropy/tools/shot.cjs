// Usage: node shot.cjs <page.html> <tex-svg.js> <outdir> <theme> <width> [names]. Screenshots of every figure in several states.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const [page,mj,out,theme,wid,only]=process.argv.slice(2);const MJ=fs.readFileSync(mj,'utf8');const width=+wid;
/* name: [canvas id, actions]; ['v',input,value], ['k',canvas,data-k] or ['c',button id]. */
const SHOTS={
  dice:['dice',[]],diceL:['dice',[['k','dice','L'],['k2','dice','B'],['p','dice','dbl']]],
  delta:['delta',[]],delta2:['delta',[['k','delta','2']]],deltaD:['delta',[['k','delta','3'],['p','delta','d']]],
  exVar:['exVar',[]],exDie:['exDie',[]],exSeq:['exSeq',[]],exTree:['exTree',[]],exHand:['exHand',[]],exTri:['exTri',[]],exSm:['exSm',[]],exLin:['exLin',[]],
  cat:['cat',[]],catBad:['cat',[['p','cat','bad']]],
  klg:['klg',[]],klgI:['klg',[['p','klg','in'],['v','kgT',0.8]]],klg1:['klg',[['v','kgT',1]]],
  lnx:['lnx',[]],lnxG:['lnx',[['k','lnx','gib']]],lnxR:['lnx',[['k','lnx','gib'],['p','lnx','rnd']]],lnxE:['lnx',[['k','lnx','gib'],['p','lnx','eq']]],
  likc:['likc',[]],likc3:['likc',[['v','lcN',3]]],
  model:['model',[]],modelT:['model',[['k','model','two']]],modelF:['model',[['k','model','full']]],
  iid:['iid',[]],iid6:['iid',[['v','iiN',6],['v','iiT',0.3]]],iid1:['iid',[['v','iiN',1]]],
  emp:['emp',[]],empBig:['emp',[['v','emN',3.7]]],empN1:['emp',[['v','emN',0]]],
  lik:['lik',[]],likN1:['lik',[['v','likN',0]]],likBig:['lik',[['v','likN',16],['v','likT',0.3]]],
  guess:['guess',[]],guess64:['guess',[['v','gsN',64],['v','gsJ',6]]],guess5:['guess',[['v','gsN',5],['v','gsJ',1]]],
  surp:['surpSq',[]],surpS:['surpSq',[['v','suA',0.1],['v','suB',0.1]]],surpB:['surpSq',[['v','suA',0.95],['v','suB',0.9]]],
  sky1:['sky1',[]],sky1n2:['sky1',[['k','sky1','2']]],
  sky2:['sky2',[]],
  simF:['simplex',[]],simR:['simplex',[['k','simplex','R']]],
  lln:['lln',[]],llnU:['lln',[['k1','lln','U'],['k2','lln','m0']]],llnS:['lln',[['k2','lln','m3'],['v','llnN',4]]],llnN1:['lln',[['v','llnN',1]]],
  flow:['flow',[]],flowT0:['flow',[['v','flT',0]]],flowBig:['flow',[['v','flE',2],['v','flT',200]]],
  mse:['mse',[]],mseR:['mse',[['v','msT',4]]]
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
