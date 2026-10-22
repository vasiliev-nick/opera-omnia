
(function(){
  /* Proofs and solutions fold into two squares joined by a thread; solutions start folded. */
  document.querySelectorAll('.proof').forEach(function(p){
    var lbl=p.querySelector(':scope>.lbl'); if(!lbl) return;
    var sol=p.classList.contains('sol');
    var body=document.createElement('div'); body.className='pbody';
    var pin=document.createElement('div'); pin.className='pin'; body.appendChild(pin);
    while(lbl.nextSibling) pin.appendChild(lbl.nextSibling);
    p.appendChild(body);
    ['thread','qo','qc'].forEach(function(c){var e=document.createElement('span');e.className=c;e.setAttribute('aria-hidden','true');p.appendChild(e);});
    lbl.setAttribute('role','button'); lbl.tabIndex=0;
    lbl.title=sol?'Показать или скрыть решение':'Свернуть или развернуть доказательство';
    if(sol){p.classList.add('folded');body.inert=true;}
    lbl.setAttribute('aria-expanded',sol?'false':'true');
    function toggle(){
      var f=p.classList.toggle('folded');
      lbl.setAttribute('aria-expanded',f?'false':'true');
      body.inert=f;
      p.classList.remove('snap'); void p.offsetWidth;
      setTimeout(function(){p.classList.add('snap');},f?430:0);
    }
    lbl.addEventListener('click',toggle);
    lbl.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    p.querySelector('.qo').addEventListener('click',toggle);
    p.querySelector('.qc').addEventListener('click',toggle);
  });
})();
