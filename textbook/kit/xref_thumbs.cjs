// node kit/xref_thumbs.cjs page.html … : renders every numbered figure of the built pages as a small picture in both themes,
// kit/thumbs/<key>_<light|dark>.png; kit/xref_index.py turns them into WebP thumbnails for the cards of mentions in other parts.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
const OUT=path.join(__dirname,'thumbs');fs.mkdirSync(OUT,{recursive:true});
const SAFE={'∅':'0','∇':'nabla','∠':'ang','𝒩':'N','⊥':'perp'};
(async()=>{const b=await chromium.launch();let n=0;
for(const th of ['light','dark']){
  const ctx=await b.newContext({viewport:{width:640,height:900},deviceScaleFactor:1,colorScheme:th,reducedMotion:'reduce'});
  for(const page of process.argv.slice(2)){
    const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
    await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
    await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
    await p.goto('file://'+path.resolve(page));await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(300);
    const figs=await p.$$('figure');
    for(const f of figs){
      const key=await f.evaluate(e=>{const c=e.querySelector(':scope>figcaption');const m=c&&c.textContent.trim().match(/^Рис\.\s*([∅∇𝒩∠⊥]\.\d+)/u);return m?m[1]:null;});
      if(!key)continue;
      await f.scrollIntoViewIfNeeded();await p.waitForTimeout(250);
      /* the picture itself: the first block of the figure that holds a canvas or a drawing, without controls and caption */
      const vis=await f.evaluateHandle(e=>[...e.children].find(c=>c.querySelector('canvas,svg')||/^(CANVAS|svg)$/i.test(c.tagName))||e);
      const file=path.join(OUT,key.replace(/^(.)/u,(m,s)=>SAFE[s]||s)+'_'+th+'.png');
      await vis.asElement().screenshot({path:file});n++;}
    if(errs.length)console.log(page,th,errs.slice(0,3));await p.close();}
  await ctx.close();}
await b.close();console.log('thumbs',n);})();
