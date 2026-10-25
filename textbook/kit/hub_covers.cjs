// node kit/hub_covers.cjs : sharp cover pictures for the library page (index.html), one figure per book part, both themes.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'),path=require('path');const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
const COVERS=[['p1','ch0_lebesgue.html','∅.1'],['p2','p2/ch0p2.html','∅.24'],['p3','p3/ch0p3.html','∅.49'],['nb','nb/ch_nabla.html','∇.11'],
  ['ang','ang/ch_angle.html','∠.1'],['n1','n1/ch_n_part1.html','𝒩.1'],['mb','/mnt/project-files/minibooks/cross_entropy/cross_entropy_file.html','14']];
(async()=>{const b=await chromium.launch();
for(const th of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:820,height:1000},deviceScaleFactor:2,colorScheme:th,reducedMotion:'reduce'});
  for(const [key,file,num] of COVERS){const p=await ctx.newPage();
    await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
    await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
    await p.goto('file://'+(file.startsWith('/')?file:path.join(process.cwd(),file)));await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(400);
    const h=await p.evaluateHandle(n=>{const f=[...document.querySelectorAll('figure>figcaption')].find(c=>c.textContent.trim().startsWith('Рис. '+n+'.'));
      if(!f)return null;const fig=f.parentNode;return [...fig.children].find(e=>e.querySelector('canvas,svg'))||fig;},num);
    const el=h.asElement();if(!el){console.log('missing',key,num);await p.close();continue;}
    await el.scrollIntoViewIfNeeded();await p.waitForTimeout(500);await el.screenshot({path:`kit/covers/${key}_${th}.png`});await p.close();}
  await ctx.close();}
await b.close();})();
