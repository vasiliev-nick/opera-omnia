// Usage: node kit/chk.cjs page.html outprefix — checks the book controls and takes screenshots of the top with panels open.
const {chromium}=require('playwright');
const fs=require('fs');const path=require('path');
const MJ=fs.readFileSync(path.join(__dirname,'..','mj/node_modules/mathjax/es5/tex-svg.js'),'utf8');
(async()=>{
  const file=path.resolve(process.argv[2]);const out=process.argv[3]||'kitshot';
  const b=await chromium.launch();const res={};
  for(const [w,theme] of [[820,'light'],[390,'dark'],[820,'dark'],[390,'light']]){
    const p=await b.newPage({viewport:{width:w,height:900},colorScheme:theme,deviceScaleFactor:1});
    const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
    await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
    await p.goto('file://'+file);await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(500);
    const info=await p.evaluate(()=>{const nl=document.querySelector('.nlist');
      return {secs:nl.querySelectorAll('li:not(.sub):not(.pills)').length,subs:nl.querySelectorAll('li.sub').length,
        st:nl.querySelectorAll('.p-st').length,ex:nl.querySelectorAll('.p-ex').length,fg:nl.querySelectorAll('.p-fg').length,
        paper:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),
        mjerr:document.querySelectorAll('mjx-merror').length,
        ovf:document.documentElement.scrollWidth>innerWidth};});
    await p.hover('.gloss.navm .gbtn');await p.waitForTimeout(350);
    await p.screenshot({path:out+'_'+w+'_'+theme+'_nav.png'});
    await p.click('.gloss.navm .gbtn');await p.waitForTimeout(350);
    const open1=await p.evaluate(()=>getComputedStyle(document.querySelector('.gloss.navm .gpanel')).visibility);
    await p.click('.gloss.navm .gbtn');await p.waitForTimeout(350);
    const open2=await p.evaluate(()=>getComputedStyle(document.querySelector('.gloss.navm .gpanel')).visibility);
    await p.mouse.move(w-5,880);await p.waitForTimeout(300);
    await p.click('.tbtn');await p.waitForTimeout(300);
    const paper2=await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--paper').trim());
    await p.screenshot({path:out+'_'+w+'_'+theme+'_top.png'});
    res[w+theme]={...info,open1,open2,paper2,errs};
    await p.close();
  }
  console.log(JSON.stringify(res,null,1));await b.close();
})();
