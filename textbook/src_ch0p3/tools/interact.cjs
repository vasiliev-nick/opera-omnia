const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const MJ=fs.readFileSync(process.cwd()+'/mj/node_modules/mathjax/es5/tex-svg.js','utf8');
(async()=>{
  const theme=process.argv[2]||'light',width=+(process.argv[3]||820);
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width,height:900},colorScheme:theme,deviceScaleFactor:width<500?2:1,hasTouch:width<500});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.route('**/mathjax/**',r=>r.fulfill({body:MJ,contentType:'application/javascript'}));
  await p.route('**/fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
  await p.goto('file://'+process.cwd()+'/p3/ch0p3.html');
  await p.evaluate(()=>MathJax.startup.promise);await p.waitForTimeout(600);
  const out={};
  /* drag the section line of Fig. ∅.23 */
  const cv=await p.$('#fubini');await cv.scrollIntoViewIfNeeded();const bb=await cv.boundingBox();
  const g=await p.evaluate(()=>null);
  out.before=await p.$eval('#fbFx',e=>e.textContent);out.s0=await p.$eval('#fbS',e=>e.value);
  const sm=width<520,L=sm?24:34,top=sm?22:26,B=bb.height-(sm?24:28),S=Math.min(B-top,(bb.width-(sm?8:14)-L)*0.5);
  const xAt=t=>bb.x+L+t*S,yMid=bb.y+B-S/2;
  await p.mouse.move(xAt(0.38),yMid);await p.mouse.down();await p.mouse.move(xAt(0.8),yMid,{steps:6});await p.mouse.up();
  out.after=await p.$eval('#fbFx',e=>e.textContent);out.s1=await p.$eval('#fbS',e=>e.value);
  await p.waitForTimeout(200);
  await (await p.$('#fubini')).evaluateHandle(e=>e.closest('figure')).then(f=>f.screenshot({path:'p3/shots/'+theme+'_'+width+'_fub_drag.png'}));
  /* theme switch redraws the canvases */
  const px=async id=>p.$eval('#'+id,c=>{const d=c.getContext('2d').getImageData(2,c.height-2,1,1).data;return [d[0],d[1],d[2]].join(',');});
  out.paper0=await px('push');
  await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme==='light'?'dark':'light');await p.waitForTimeout(200);
  out.paper1=await px('push');
  await p.evaluate(()=>document.documentElement.removeAttribute('data-theme'));await p.waitForTimeout(200);
  /* resize redraws at the new width */
  out.w0=await p.$eval('#layer',c=>c.width+'x'+c.height);
  await p.setViewportSize({width:width<500?820:390,height:900});await p.waitForTimeout(400);
  out.w1=await p.$eval('#layer',c=>c.width+'x'+c.height);
  await p.setViewportSize({width,height:900});await p.waitForTimeout(400);
  /* header, glossary, an exercise with its solution opened, a question */
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(200);
  await p.screenshot({path:'p3/shots/'+theme+'_'+width+'_top.png'});
  await p.click('.gbtn');await p.waitForTimeout(500);
  await p.screenshot({path:'p3/shots/'+theme+'_'+width+'_gloss.png'});
  await p.keyboard.press('Escape');await p.mouse.click(5,800);await p.waitForTimeout(300);
  const ex=await p.$$('.ex');
  await ex[0].scrollIntoViewIfNeeded();
  await p.evaluate(e=>e.nextElementSibling.querySelector('.lbl').click(),ex[0]);await p.waitForTimeout(700);
  let r=await ex[0].boundingBox();await p.evaluate(y=>window.scrollTo(0,y),r.y+(await p.evaluate(()=>scrollY))-10);await p.waitForTimeout(200);
  await p.screenshot({path:'p3/shots/'+theme+'_'+width+'_ex12open.png',fullPage:false});
  out.folded=await p.$$eval('.proof.sol.folded',a=>a.length);
  const q=ex[7];await q.scrollIntoViewIfNeeded();r=await q.boundingBox();
  await p.evaluate(y=>window.scrollTo(0,y),r.y+(await p.evaluate(()=>scrollY))-60);await p.waitForTimeout(200);
  await p.screenshot({path:'p3/shots/'+theme+'_'+width+'_q18.png'});
  const d3=await p.$('#in3d');await d3.scrollIntoViewIfNeeded();await d3.screenshot({path:'p3/shots/'+theme+'_'+width+'_in3d.png'});
  out.hscroll=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  console.log(JSON.stringify(out,null,1));console.log('errors:',JSON.stringify(errs));await b.close();})();
