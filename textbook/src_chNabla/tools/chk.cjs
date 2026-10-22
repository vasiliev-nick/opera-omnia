// Usage (from the scratchpad root): node nb/tools/chk.cjs [page.html] — structural checks of the built page of chapter ∇.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const path=require('path');
const SP=path.resolve(__dirname,'..','..');
const MJ=fs.readFileSync(SP+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
(async()=>{const b=await chromium.launch();const out={};
for(const w of [820,390]){
const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await p.goto('file://'+path.resolve(process.argv[2]||SP+'/nb/ch_nabla.html'));await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(400);
const r=await p.evaluate(()=>{
  const find=t=>{if(t[0]==='#')return document.getElementById(t.slice(1));const l=[...document.querySelectorAll('.stmt>.lbl,.ex>.lbl')].find(x=>{const s=x.textContent.trim();return s.startsWith(t)&&!/\d/.test(s.charAt(t.length));});return l;};
  const bad=[...document.querySelectorAll('.gref')].filter(a=>!find(a.dataset.t)).map(a=>a.dataset.t);
  const merr=[...document.querySelectorAll('mjx-merror,[data-mjx-error]')].map(e=>e.getAttribute('data-mjx-error')||e.textContent);
  const rawEls=[...document.querySelectorAll('.book p,.book li,.book figcaption,.rl,.book h2,.book h3,.stmt,.ex,.plain,.aside,.step,.fx,.gloss,.probe')].filter(e=>/\$/.test(e.textContent));
  const sols=document.querySelectorAll('.proof.sol.folded').length, ex=document.querySelectorAll('.ex').length;
  const exNoSol=[...document.querySelectorAll('.ex')].filter(e=>{const n=e.nextElementSibling;return !(n&&n.matches('.proof.sol'));}).map(e=>e.querySelector('.lbl').textContent);
  const proofs=[...document.querySelectorAll('.proof:not(.sol)')];
  const noIdea=proofs.filter(pf=>!pf.querySelector('.pin>.plain:first-child')).map(pf=>pf.previousElementSibling&&pf.previousElementSibling.querySelector('.lbl')?pf.previousElementSibling.querySelector('.lbl').textContent:'?');
  const solNoIdea=[...document.querySelectorAll('.proof.sol')].filter(pf=>pf.querySelector('.step')&&!pf.querySelector('.pin>.plain:first-child')).length;
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
  const hrefs=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(h=>h&&!document.getElementById(h));
  const lbls=[...document.querySelectorAll('.stmt>.lbl,.ex>.lbl')].map(e=>e.textContent.trim().replace(/\s*\(.*$/,''));
  const figs=[...document.querySelectorAll('figcaption')].map(e=>(e.textContent.match(/^Рис\. ∇\.\d+/)||['?'])[0]);
  const ov=[...document.querySelectorAll('.book *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>document.documentElement.clientWidth+1&&!e.closest('.math-wrap')&&!e.closest('mjx-container');}).map(e=>e.tagName+'.'+e.className).slice(0,6);
  const old=(document.body.innerText.match(/(глав[аеуы]? \d|∇\.@|TODO)/g)||[]);
  const pills=[...document.querySelectorAll('.nlist .npill')].map(a=>a.textContent);
  return {bad,merr,raw:rawEls.length,rawS:rawEls.slice(0,3).map(e=>e.textContent.slice(0,100)),sols,ex,exNoSol,noIdea,solNoIdea,dup,hrefs,gl:document.querySelectorAll('.gloss:not(.navm) .glist li').length,figs,lbls:lbls.join(' | '),ov,old,scrollW:document.documentElement.scrollWidth,pills:pills.length};});
out[w]={...r,errs};await p.close();}
console.log(JSON.stringify(out,null,1));await b.close();})();
