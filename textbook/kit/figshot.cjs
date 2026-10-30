// node figshot.cjs page.html outprefix id1,id2,... : screenshots of the figures holding these canvases at 820/390, light/dark.
const {chromium}=require('playwright');
const fs=require('fs');const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
const [page,out,ids]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();
for(const [w,th] of [[820,'light'],[390,'dark'],[820,'dark'],[390,'light']]){
  const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1,colorScheme:th});const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(String(e)));
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/'+page);await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(300);
  for(const id of ids.split(',')){const el=await p.$('#'+id);if(!el){console.log('missing',id);continue;}
    const fig=await el.evaluateHandle(e=>e.closest('figure'));await fig.scrollIntoViewIfNeeded();await p.waitForTimeout(150);
    await fig.screenshot({path:`${out}_${id}_${w}${th}.png`});}
  if(errs.length)console.log(w,th,errs);await ctx.close();}
await b.close();})();
