const {chromium}=require('playwright');
const fs=require('fs');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:900},deviceScaleFactor:2,colorScheme:'light'});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/ch0_lebesgue.html');
  await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(600);
  for(const id of ['simpleF','signF']){const fig=await p.evaluateHandle(i=>document.getElementById(i).closest('figure'),id);await fig.scrollIntoViewIfNeeded();await fig.screenshot({path:'p2/shots/p1m_'+id+'.png'});}
  await b.close();})();
