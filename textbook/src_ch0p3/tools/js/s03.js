
(function(){
  /* Canvas sizing for the figures of part 3: drawing in CSS pixels at the width of the column, sharp on dense screens; rich labels and a legend row. */
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
  const fsz=(k,s)=>k==='s'?Math.round(s*0.78):k==='m'?s+1:k==='r'?s:s+2;
  /* The italic θ of the text fonts is often the open, cursive form; the closed formula θ is drawn by hand so that labels match the formulas. */
  TB.theta=function(c,x,y,f,col){c.save();c.translate(x,y);c.transform(1,0,-0.2,1,0,0);c.strokeStyle=col;c.setLineDash([]);
    c.lineWidth=Math.max(1,f*0.075);c.beginPath();c.ellipse(f*0.27,-f*0.36,f*0.155,f*0.335,0,0,7);c.stroke();
    c.lineWidth=Math.max(0.9,f*0.06);c.beginPath();c.moveTo(f*0.12,-f*0.36);c.lineTo(f*0.42,-f*0.36);c.stroke();c.restore();};
  const segW=(c,q,s)=>{if(q[0]==='θ')return fsz(q[1],s)*0.56;c.font=font(q[1],s);return c.measureText(q[0]).width;};
  TB.richW=function(c,segs,s){let w=0;for(const q of segs)w+=segW(c,q,s)+(q[1]==='i'?1:0);return w;};
  TB.rich=function(c,segs,x,y,s,col,align){
    const w=TB.richW(c,segs,s);if(align==='center')x-=w/2;else if(align==='right')x-=w;
    c.fillStyle=col;c.textAlign='start';
    for(const q of segs){const gw=segW(c,q,s),yy=q[1]==='s'?y+s*0.3:y;
      if(q[0]==='θ')TB.theta(c,x,yy,fsz(q[1],s),col);else{c.font=font(q[1],s);c.fillStyle=col;c.fillText(q[0],x,yy);}
      x+=gw+(q[1]==='i'?1:0);}
    return w;};
  /* The same closed θ inside HTML readouts. */
  TB.thSvg='<svg class="gth" viewBox="0 -74 58 76" aria-label="θ"><g transform="skewX(-11.3)"><ellipse cx="27" cy="-36" rx="15.5" ry="33.5"/><line x1="12" y1="-36" x2="42" y2="-36"/></g></svg>';
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
  TB.rows=rows=>rows.map(r=>'<span>'+r.map(p=>'<span class="nw">'+p+'</span>').join('&emsp;')+'</span>').join('').replace(/(<i[^>]*>)θ(<\/i>)/g,'$1'+TB.thSvg+'$2');
  TB.segs=function(cv,fn){const b=[...cv.closest('figure').querySelectorAll('.seg button')];
    b.forEach(e=>e.addEventListener('click',()=>{b.forEach(o=>o.setAttribute('aria-pressed',o===e?'true':'false'));fn(e.dataset.k);}));
    const on=b.find(e=>e.getAttribute('aria-pressed')==='true');return on?on.dataset.k:b[0].dataset.k;};
})();
