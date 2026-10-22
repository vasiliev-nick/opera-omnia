// Usage (from the scratchpad root): node n1/tools/shot.cjs <light|dark> <width> [names] — screenshots of every figure of chapter 𝒩, part 1, in several states.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const path=require('path');
const SP=path.resolve(__dirname,'..','..');
const MJ=fs.readFileSync(SP+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
/* name: [element id inside the figure, actions]; an action is ['v', input id, value], ['c', button id, wait ms], ['p', canvas id, fx, fy] (pointer at a fraction of the canvas) or ['w', ms]. */
const SHOTS={
  relief:['relief',[]],relief0:['relief',[['v','teeth',0],['v','lvl',-0.3]]],relief10:['relief',[['v','teeth',10],['v','lvl',0.5]]],reliefP:['relief',[['p','relief',0.62,0.3]]],reliefN:['relief',[['v','lvl',-0.5],['p','relief',0.56,0.46]]],relief00:['relief',[['p','relief',0.5,0.5]]],
  cloud:['cloud',[['w',1600]]],cloud45:['cloud',[['w',1600],['v','ang',45]]],cloud135:['cloud',[['w',1600],['v','ang',135]]],cloud0:['cloud',[['w',1600],['v','ang',0]]],cloudMid:['cloud',[['w',1600],['c','cloudNew',260]]],
  coin0:['coin',[]],coin1:['coin',[['c','coin1',100]]],coinMid:['coin',[['c','coin1000',350]]],coin1000:['coin',[['c','coin1000',1600]]],coin5000:['coin',[['c','coin1000',1600],['c','coin1000',1600],['c','coin1000',1600],['c','coin1000',1600],['c','coin1000',1600]]],
  joint:['joint',[]],jointA:['joint',[['v','rho',0.95],['v','yobs',2.5]]],jointB:['joint',[['v','rho',-0.95],['v','yobs',-2.5]]],joint0:['joint',[['v','rho',0],['v','yobs',0]]]
};
(async()=>{
  const theme=process.argv[2]||'light';const width=+(process.argv[3]||820);
  const names=(process.argv[4]||Object.keys(SHOTS).join(',')).split(',');
  const b=await chromium.launch();const log=[];const errs=[];
  for(const nm of names){const [id,acts]=SHOTS[nm];
    const p=await b.newPage({viewport:{width,height:1000},colorScheme:theme,deviceScaleFactor:width<500?2:1});
    p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
    await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
    await p.goto('file://'+SP+'/n1/ch_n_part1.html');
    await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(300);
    const fig=await p.evaluateHandle(i=>document.getElementById(i).closest('figure'),id);
    await fig.scrollIntoViewIfNeeded();await p.waitForTimeout(200);
    for(const a of acts){
      if(a[0]==='v')await p.evaluate(([i,v])=>{const e=document.getElementById(i);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},[a[1],a[2]]);
      else if(a[0]==='c'){await p.click('#'+a[1]);await p.waitForTimeout(a[2]);}
      else if(a[0]==='w')await p.waitForTimeout(a[1]);
      else if(a[0]==='p'){const bb=await (await p.$('#'+a[1])).boundingBox();await p.mouse.move(bb.x+bb.width*a[2],bb.y+bb.height*a[3]);await p.waitForTimeout(100);}
    }
    const ro=await p.evaluate(i=>{const f=document.getElementById(i).closest('figure');return [...f.querySelectorAll('output')].map(o=>o.textContent).join(' / ')+' | '+((f.querySelector('.probe')||{}).textContent||'')+' | buttons: '+[...f.querySelectorAll('button')].map(x=>x.id+(x.hidden?'-':'+')).join(' ');},id);
    log.push(nm+': '+ro);
    await fig.screenshot({path:SP+'/n1/shots/'+theme+'_'+width+'_'+nm+'.png'});
    await p.close();
  }
  console.log(log.join('\n'));console.log('errors:',JSON.stringify(errs));await b.close();})();
