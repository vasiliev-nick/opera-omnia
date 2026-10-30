const {chromium}=require('playwright');
const fs=require('fs');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
(async()=>{
  const width=+(process.argv[2]||390);
  const b=await chromium.launch();const p=await b.newPage({viewport:{width,height:900}});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/p3/ch0p3.html');
  await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(600);
  const r=await p.evaluate(()=>({sw:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    w:[...document.querySelectorAll('.math-wrap')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>{const s=e.closest('[id]');return Math.round(e.scrollWidth)+'/'+e.clientWidth+' '+(s?s.id:'')+' :: '+(e.querySelector('mjx-assistive-mml')||e).textContent.slice(0,70).replace(/\s+/g,' ');}),
    inl:[...document.querySelectorAll('.book mjx-container:not([display])')].filter(e=>e.getBoundingClientRect().width>document.documentElement.clientWidth-40).length,
    clip:[...document.querySelectorAll('.math-wrap')].filter(e=>e.scrollHeight>e.clientHeight+1).length}));
  console.log(JSON.stringify(r,null,1));await b.close();})();
