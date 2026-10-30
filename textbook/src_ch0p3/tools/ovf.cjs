const {chromium}=require('playwright');
const fs=require('fs');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
(async()=>{
  const width=+(process.argv[2]||390),file=process.argv[3]||'p3/ch0p3.html';
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width,height:900}});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/'+file);
  await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{const W=document.documentElement.clientWidth;
    const o=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>W+1&&r.width>0;})
      .filter(e=>!e.closest('.math-wrap,.svgwrap')&&(!e.parentElement||e.parentElement.getBoundingClientRect().right<=W+1))
      .map(e=>{const r=e.getBoundingClientRect();return e.tagName+'.'+e.className+' #'+e.id+' right='+Math.round(r.right)+' in '+(e.closest('[id]')||{}).id+' :: '+(e.textContent||'').slice(0,60);});
    return {sw:document.documentElement.scrollWidth,W,o:o.slice(0,20)};});
  console.log(JSON.stringify(r,null,1));await b.close();})();
