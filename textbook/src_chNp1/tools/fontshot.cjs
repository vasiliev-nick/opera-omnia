const {chromium}=require('playwright');
const fs=require('fs');const path=require('path');
const MJ=fs.readFileSync(path.join(__dirname,'..','..','mj/node_modules/mathjax/es5/tex-svg.js'),'utf8');
(async()=>{
  const b=await chromium.launch({proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined});
  const p=await b.newPage({viewport:{width:820,height:900},ignoreHTTPSErrors:true});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.goto('file://'+path.resolve(process.argv[2]));await p.evaluate(()=>MathJax.startup.promise);
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
  const ok=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family));
  console.log(JSON.stringify(ok));
  const h=await p.$('#s0 h2');await h.screenshot({path:process.argv[3]});
  const l=await p.$('.stmt .lbl');await l.screenshot({path:process.argv[3].replace('.png','_lbl.png')});
  await b.close();})();
