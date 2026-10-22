// Usage: node chk.cjs <page.html> <tex-svg.js>. Static checks of the assembled page in headless Chromium.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const [page,mj]=process.argv.slice(2);const MJ=fs.readFileSync(mj,'utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:820,height:1000}});const errs=[];
p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await p.goto('file://'+page);await p.evaluate(()=>MathJax.startup.promise);
const r=await p.evaluate(()=>{
  const find=t=>{if(t[0]==='#')return document.getElementById(t.slice(1));return [...document.querySelectorAll('.stmt>.lbl,.ex>.lbl')].find(x=>{const s=x.textContent.trim();return s.startsWith(t)&&!/\d/.test(s.charAt(t.length));});};
  const bad=[...document.querySelectorAll('.gref')].filter(a=>!find(a.dataset.t)).map(a=>a.dataset.t);
  const merr=[...document.querySelectorAll('mjx-merror,[data-mjx-error]')].map(e=>e.getAttribute('data-mjx-error')||e.textContent);
  const rawEls=[...document.querySelectorAll('.book p,.book li,.book figcaption,.rl,.book h2,.book h3,.stmt,.ex,.plain,.aside,.step,.fx,.gloss,button')].filter(e=>/\$/.test(e.textContent));
  const ex=document.querySelectorAll('div.ex').length,sols=document.querySelectorAll('.proof.sol.folded').length;
  const exNoSol=[...document.querySelectorAll('div.ex')].filter(e=>{const n=e.nextElementSibling;return !(n&&n.matches('.proof.sol'));}).map(e=>e.querySelector('.lbl').textContent);
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
  const hrefs=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(h=>h&&!document.getElementById(h));
  const proofsNoIdea=[...document.querySelectorAll('.proof:not(.sol)')].filter(p=>!p.querySelector('.plain')).length;
  const ov=[...document.querySelectorAll('.book *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>document.documentElement.clientWidth+1&&!e.closest('.math-wrap');}).map(e=>e.tagName+'.'+e.className).slice(0,5);
  return {bad,merr,raw:rawEls.length,rawS:rawEls.slice(0,4).map(e=>e.textContent.slice(0,100)),ex,sols,exNoSol,dup,hrefs,proofsNoIdea,gl:document.querySelectorAll('.glist li').length,ov,
    figs:[...document.querySelectorAll('figcaption')].map(e=>(e.textContent.match(/^Рис\. \d+/)||['?'])[0]).join(',')};});
console.log(JSON.stringify(r,null,1));console.log('errors',JSON.stringify(errs));await b.close();})();
