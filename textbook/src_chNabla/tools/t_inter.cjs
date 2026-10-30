// interaction smoke test: for every figure canvas and every seg mode, drag on the canvas, tap it, move every slider, click the other buttons; report JS errors
const {chromium}=require('playwright');
const fs=require('fs');const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
(async()=>{const b=await chromium.launch();
for(const w of [820,390]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'nb/t_me.html'));await p.evaluate(()=>MathJax.startup.promise);
const ids=await p.evaluate(()=>[...document.querySelectorAll('figure canvas[id]')].map(c=>c.id));
for(const id of ids){
  const el=await p.$('#'+id);await el.scrollIntoViewIfNeeded();
  const fig=await el.evaluateHandle(e=>e.closest('figure'));
  const keys=await fig.evaluate(f=>[...f.querySelectorAll('.seg button')].map(b=>b.dataset.k));
  for(const k of (keys.length?keys:[null])){
    if(k)await fig.evaluate((f,k)=>f.querySelector(`.seg button[data-k="${k}"]`).click(),k);
    await p.waitForTimeout(100);const bb=await el.boundingBox();
    for(const [fx,fy] of [[0.3,0.4],[0.7,0.6],[0.5,0.2],[0.45,0.5]]){await p.mouse.move(bb.x+bb.width*fx,bb.y+bb.height*fy);await p.mouse.down();
      await p.mouse.move(bb.x+bb.width*(fx+0.05),bb.y+bb.height*(fy+0.05),{steps:4});await p.mouse.up();}
    await p.mouse.click(bb.x+bb.width*0.45,bb.y+bb.height*0.55);
    await fig.evaluate(f=>{for(const s of f.querySelectorAll('input[type=range]')){if(s.closest('[hidden]'))continue;for(const v of [s.min,s.max,(+s.min+ +s.max)/2]){s.value=v;s.dispatchEvent(new Event('input'));}}
      for(const btn of f.querySelectorAll('button:not(.seg button)'))if(!btn.closest('[hidden]'))btn.click();});
    await p.waitForTimeout(300);}
}
await p.waitForTimeout(3000);console.log(w,ids.length+' canvases',errs.length?errs:'no errors');await p.close();}
await b.close();})();
