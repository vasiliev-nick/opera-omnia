
(function(){
  /* Glossary and contents: each opens on hover, on keyboard focus, or by tap; closes after a jump. */
  const nl=document.querySelector('.nlist');
  if(nl){const items=[];let uid=0;
    /* Each section lists its subsections and, as short coloured pills, every numbered statement, exercise and figure in it. */
    const AB={'Определение':'Опр.','Теорема':'Теор.','Лемма':'Лемма','Предложение':'Предл.','Следствие':'След.','Упражнение':'Упр.','Вопрос':'Вопр.'};
    const pillOf=e=>{
      if(e.tagName==='FIGCAPTION'){const m=e.textContent.match(/^\s*(Рис\.\s*[^\s.]+(?:\.[^\s.]+)*)/);if(!m)return null;const f=e.closest('figure'),cv=f.querySelector('canvas');
        return {el:f,txt:m[1].replace(/\.$/,''),cls:'p-fg',title:cv&&cv.getAttribute('aria-label')||''};}
      const box=e.parentNode,t=e.textContent.trim().replace(/\s+/g,' '),m=t.match(/^(\S+)\s+([^\s(]+)\s*(?:\((.*)\))?/);if(!m)return null;
      return {el:box,txt:(AB[m[1]]||m[1])+' '+m[2]+(m[3]?' '+m[3]:''),cls:box.classList.contains('ex')?'p-ex':'p-st',title:t};};
    document.querySelectorAll('section[id]').forEach(sec=>{const h=sec.querySelector('h2');if(!h)return;
      const head={el:sec,txt:h.textContent,sub:false,pills:[]};items.push(head);let cur=head,k=0;
      sec.querySelectorAll('h3, .stmt>.lbl, .ex>.lbl, figure>figcaption').forEach(e=>{
        if(e.tagName==='H3'){k++;if(!e.id)e.id=sec.id+'-'+k;cur={el:e,txt:e.textContent,sub:true,pills:[]};items.push(cur);return;}
        const pl=pillOf(e);if(pl)cur.pills.push(pl);});});
    items.forEach(it=>{const li=document.createElement('li');if(it.sub)li.className='sub';const a=document.createElement('a');a.href='#'+it.el.id;a.textContent=it.txt;li.appendChild(a);nl.appendChild(li);it.a=a;
      if(it.pills.length){const pl=document.createElement('li');pl.className='pills';
        it.pills.forEach(q=>{if(!q.el.id)q.el.id='nv'+(++uid);const b=document.createElement('a');b.className='npill '+q.cls;b.href='#'+q.el.id;b.textContent=q.txt;if(q.title)b.title=q.title;b.dataset.flash='1';pl.appendChild(b);});
        nl.appendChild(pl);}});
    const mark=()=>{let cur=null;const y=window.innerHeight*0.3;items.forEach(it=>{if(it.el.getBoundingClientRect().top<y)cur=it;});
      let top=null;items.forEach(it=>{if(!it.sub&&it.el.getBoundingClientRect().top<y)top=it;});
      items.forEach(it=>it.a.classList.toggle('cur',it===cur||it===top));};
    let q=false;window.addEventListener('scroll',()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;mark();});},{passive:true});mark();
    /* opening the contents scrolls the list to the current section */
    const toCur=()=>{const c=nl.querySelector('li:not(.sub)>a.cur');if(c)nl.scrollTop+=c.getBoundingClientRect().top-nl.getBoundingClientRect().top-6;};
    const ng=nl.closest('.gloss');ng.addEventListener('mouseenter',toCur);ng.querySelector('.gbtn').addEventListener('click',toCur);
    nl.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();const g=nl.closest('.gloss');
      g.classList.remove('open');g.querySelector('.gbtn').setAttribute('aria-expanded','false');g.classList.add('shut');a.blur();
      const el=document.getElementById(a.getAttribute('href').slice(1));if(!el)return;
      if(a.dataset.flash){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}
      else el.scrollIntoView({behavior:'smooth',block:'start'});});}
  document.querySelectorAll('.gloss').forEach(g=>{
  const b=g.querySelector('.gbtn');let ptr='mouse';
  function setOpen(o){g.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');}
  b.addEventListener('pointerdown',e=>{ptr=e.pointerType||'mouse';});
  /* A click on the circle toggles the panel; closing it while the mouse is over it keeps it shut until the mouse leaves. */
  b.addEventListener('click',e=>{e.stopPropagation();
    const shown=g.classList.contains('open')||(ptr==='mouse'&&hov&&!g.classList.contains('shut'));
    if(shown){setOpen(false);g.classList.add('shut');}else{g.classList.remove('shut');setOpen(true);}});
  let hov=false;g.addEventListener('mouseenter',()=>{hov=true;});
  g.addEventListener('mouseleave',()=>{hov=false;if(ptr==='mouse'){g.classList.remove('shut');setOpen(false);}});
  document.addEventListener('click',e=>{if(!g.contains(e.target))setOpen(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);if(g.contains(document.activeElement))document.activeElement.blur();}});
  g.querySelectorAll('.gref').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();const t=a.dataset.t;let el=null;
    if(t[0]==='#'){el=document.getElementById(t.slice(1));if(el&&el.tagName==='CANVAS')el=el.closest('figure');}
    else{const l=[...document.querySelectorAll('.stmt>.lbl,.ex>.lbl')].find(x=>{const s=x.textContent.trim();return s.startsWith(t)&&!/\d/.test(s.charAt(t.length));});el=l&&l.parentNode;}
    setOpen(false);g.classList.add('shut');a.blur();
    if(!el)return;
    el.scrollIntoView({behavior:'smooth',block:'center'});
    el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
  }));
  });
})();
