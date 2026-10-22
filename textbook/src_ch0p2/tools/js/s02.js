
(function(){
  /* Canvas sizing for the figures of part 2: drawing in CSS pixels at the width of the column, sharp on dense screens; rich labels and a legend row. */
  const TB=window.TB;if(!TB)return;
  TB.fit=function(cv,hOf){
    const W=Math.round(cv.parentNode.getBoundingClientRect().width)||760,H=Math.round(hOf(W)),r=window.devicePixelRatio||1;
    const bw=Math.round(W*r),bh=Math.round(H*r);if(cv.width!==bw)cv.width=bw;if(cv.height!==bh)cv.height=bh;
    const c=cv.getContext('2d');c.setTransform(r,0,0,r,0,0);c.textAlign='start';c.textBaseline='alphabetic';c.setLineDash([]);
    return {c:c,W:W,H:H};};
  TB.onResize=function(cv,fn){let w=Math.round(cv.parentNode.getBoundingClientRect().width);
    if(window.ResizeObserver)new ResizeObserver(()=>{const nw=Math.round(cv.parentNode.getBoundingClientRect().width);if(nw!==w){w=nw;fn();}}).observe(cv.parentNode);
    else window.addEventListener('resize',fn);};
  /* A label is a list of [text, kind]: 'i' italic letter, 's' italic subscript, 'r' upright sans, 'm' upright serif. */
  function font(k,s){return k==='i'?'italic '+(s+2)+'px '+TB.serif:k==='s'?'italic '+Math.round(s*0.78)+'px '+TB.serif:k==='m'?(s+1)+'px '+TB.serif:s+'px '+TB.ui;}
  TB.richW=function(c,segs,s){let w=0;for(const q of segs){c.font=font(q[1],s);w+=c.measureText(q[0]).width+(q[1]==='i'?1:0);}return w;};
  TB.rich=function(c,segs,x,y,s,col,align){
    const w=TB.richW(c,segs,s);if(align==='center')x-=w/2;else if(align==='right')x-=w;
    c.fillStyle=col;c.textAlign='start';
    for(const q of segs){c.font=font(q[1],s);c.fillText(q[0],x,q[1]==='s'?y+s*0.3:y);x+=c.measureText(q[0]).width+(q[1]==='i'?1:0);}
    return w;};
  /* Legend items: {k:'line'|'thin'|'dash'|'fill', col, a (fill opacity), t: label}. Wraps to the next row when needed; returns the bottom y. */
  TB.legend=function(c,items,L,R,y,s){
    const sw=22,gap=18,rowH=s+9;let x=L;y+=s;
    for(const it of items){const w=sw+6+TB.richW(c,it.t,s);
      if(x>L&&x+w>R){x=L;y+=rowH;}
      const ym=y-s*0.33;
      if(it.k==='fill'){c.fillStyle=TB.rgba(it.col,it.a||0.3);c.fillRect(x,ym-6,sw,12);}
      else{c.strokeStyle=it.col;c.lineWidth=it.k==='thin'?1.2:2.2;c.setLineDash(it.k==='dash'?[5,4]:[]);
        c.beginPath();c.moveTo(x,ym);c.lineTo(x+sw,ym);c.stroke();c.setLineDash([]);}
      TB.rich(c,it.t,x+sw+6,y,s,TB.tok('--ink'));x+=w+gap;}
    return y+7;};
  /* Readout lines for .fx: each part stays on one line, a line may break only between parts. */
  TB.rows=rows=>rows.map(r=>'<span>'+r.map(p=>'<span class="nw">'+p+'</span>').join('&emsp;')+'</span>').join('');
  TB.segs=function(cv,fn){const b=[...cv.closest('figure').querySelectorAll('.seg button')];
    b.forEach(e=>e.addEventListener('click',()=>{b.forEach(o=>o.setAttribute('aria-pressed',o===e?'true':'false'));fn(e.dataset.k);}));
    const on=b.find(e=>e.getAttribute('aria-pressed')==='true');return on?on.dataset.k:b[0].dataset.k;};
})();
