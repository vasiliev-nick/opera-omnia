const fs=require('fs');const {chromium}=require('playwright');const [mj,wid,...pages]=process.argv.slice(2);const MJ=fs.readFileSync(mj,'utf8');
(async()=>{const b=await chromium.launch();
for(const page of pages){const ctx=await b.newContext({viewport:{width:+wid,height:800},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await ctx.newPage();
await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await p.goto('file://'+page);try{await p.evaluate(()=>MathJax.startup.promise);}catch(e){}await p.waitForTimeout(1500);
const r=await p.evaluate((W)=>{const out=[];const list=[...MathJax.startup.document.math];
 for(const m of list){const e=m.typesetRoot;if(!e||m.display)continue;const rc=e.getBoundingClientRect();if(rc.width===0)continue;
  let a=e.parentElement,clipped=false;while(a&&a!==document.body){const s=getComputedStyle(a);if(/(auto|scroll|hidden|clip)/.test(s.overflowX)){clipped=true;break;}if(s.position==='fixed'){clipped=true;break;}a=a.parentElement;}
  if(clipped)continue;
  const nw=e.closest('.nw');const rr=(nw||e).getBoundingClientRect();
  if(rr.right>W+0.5)out.push(Math.round(rr.width)+' '+m.math.slice(0,90));}
 return {sw:document.documentElement.scrollWidth,out};},+wid);
console.log(page.split('/').slice(-2).join('/'),r.sw,r.out.length);r.out.forEach(x=>console.log('   ',x));await ctx.close();}
await b.close();})();
