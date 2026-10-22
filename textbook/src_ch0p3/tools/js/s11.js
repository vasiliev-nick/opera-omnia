
(function(){
  /* Glossary: opens on hover, on keyboard focus, or by tap; closes after a jump. */
  const g=document.querySelector('.gloss');if(!g)return;
  const b=g.querySelector('.gbtn');let ptr='mouse';
  function setOpen(o){g.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');}
  b.addEventListener('pointerdown',e=>{ptr=e.pointerType||'mouse';});
  b.addEventListener('focus',()=>g.classList.remove('shut'));
  b.addEventListener('click',e=>{e.stopPropagation();g.classList.remove('shut');
    if(e.detail>0&&ptr==='mouse')return;
    setOpen(!g.classList.contains('open'));});
  g.addEventListener('mouseleave',()=>g.classList.remove('shut'));
  document.addEventListener('click',e=>{if(!g.contains(e.target))setOpen(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);if(g.contains(document.activeElement))document.activeElement.blur();}});
  g.querySelectorAll('.gref').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();const t=a.dataset.t;let el=null;
    if(t[0]==='#'){el=document.getElementById(t.slice(1));if(el&&el.tagName==='CANVAS')el=el.closest('figure');}
    else{const l=[...document.querySelectorAll('.stmt>.lbl,.ex>.lbl')].find(x=>x.textContent.trim().startsWith(t));el=l&&l.parentNode;}
    setOpen(false);g.classList.add('shut');a.blur();
    if(!el)return;
    el.scrollIntoView({behavior:'smooth',block:'center'});
    el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
  }));
})();
