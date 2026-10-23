
(function(){
  /* Fig. ∅.17: the typewriter sequence; the graph of f_n and, row by row, the values f_k(x) for k ≤ n. */
  const cv=document.getElementById('typewriter');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('twN'),so=document.getElementById('twNOut'),fx=document.getElementById('twFx'),g=new TB.Gauge('gTw');
  let px=0.71,geo=null;
  const mj=n=>{let m=0;while((2<<m)<=n)m++;return [m,n-(1<<m)];};
  function draw(){
    const n=+sl.value;so.textContent=n;const [m0,j0]=mj(n);
    const F=TB.fit(cv,W=>W<520?318:372),c=F.c,W=F.W,H=F.H;
    const ink=TB.tok('--ink'),muted=TB.tok('--muted'),rule=TB.tok('--rule'),eth=TB.tok('--ether'),warm=TB.tok('--warm'),paper=TB.tok('--paper');
    c.fillStyle=paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?42:56,R=W-(sm?10:16),X=x=>L+x*(R-L);
    const sT=s+14,sB=sT+(sm?44:56),rh=sm?30:36,r0=sB+(sm?16:20),bot=r0+6*rh;
    geo={L:L,R:R};
    c.strokeStyle=rule;c.lineWidth=1;c.setLineDash([2,4]);c.beginPath();c.moveTo(L,sT);c.lineTo(R,sT);c.stroke();c.setLineDash([]);
    c.beginPath();c.moveTo(L,sB);c.lineTo(R,sB);c.stroke();
    c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='right';c.fillText('1',L-8,sT+s*0.35);c.fillText('0',L-8,sB+s*0.35);
    const a=j0/(1<<m0),b=(j0+1)/(1<<m0);
    c.fillStyle=TB.rgba(warm,0.32);c.fillRect(X(a),sT,X(b)-X(a),sB-sT);
    c.strokeStyle=warm;c.lineWidth=2.2;c.beginPath();c.moveTo(X(a),sB);c.lineTo(X(a),sT);c.lineTo(X(b),sT);c.lineTo(X(b),sB);c.stroke();
    const lw=TB.richW(c,[['f','i'],[String(n),'s']],s);
    TB.rich(c,[['f','i'],[String(n),'s']],Math.min(R-lw/2,Math.max(L+lw/2,(X(a)+X(b))/2)),sT-7,s,warm,'center');
    for(let m=0;m<6;m++){const y=r0+(m+0.5)*rh,q=1<<m,dx=(R-L)/q,rd=Math.max(2.6,Math.min(5,dx*0.34));
      c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,y);c.lineTo(R,y);for(let j=0;j<=q;j++){c.moveTo(X(j/q),y-5);c.lineTo(X(j/q),y+5);}c.stroke();
      c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='right';TB.rich(c,[['m','i'],[' = '+m,'r']],L-8,y+s*0.35,s,muted,'right');
      for(let j=0;j<q;j++){const k=q+j;if(k>n)break;const cx=X((j+0.5)/q),on=px>=j/q&&px<(j+1)/q;
        if(j===0){c.fillStyle=TB.rgba(eth,0.3);c.beginPath();c.arc(cx,y,rd+4.5,0,7);c.fill();}
        c.beginPath();c.arc(cx,y,on?rd+0.65:rd,0,7);if(on){c.fillStyle=ink;c.fill();}else{c.fillStyle=paper;c.fill();c.strokeStyle=ink;c.lineWidth=1.3;c.stroke();}
        if(k===n){c.strokeStyle=warm;c.lineWidth=2.2;c.beginPath();c.arc(cx,y,rd+4,0,7);c.stroke();}}}
    c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,bot+4);c.lineTo(R,bot+4);
    for(const v of [0,0.25,0.5,0.75,1]){c.moveTo(X(v),bot+4);c.lineTo(X(v),bot+8);}c.stroke();
    c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='center';
    ['0','1/4','1/2','3/4','1'].forEach((t,i)=>c.fillText(t,X(i/4),bot+s+10));c.textAlign='start';
    const xp=X(px);c.strokeStyle=TB.rgba(ink,0.85);c.lineWidth=1.4;c.beginPath();c.moveTo(xp,sT);c.lineTo(xp,bot+4);c.stroke();
    c.fillStyle=ink;c.beginPath();c.moveTo(xp,bot+4);c.lineTo(xp-6,bot+13);c.lineTo(xp+6,bot+13);c.closePath();c.fill();
    const xl=TB.richW(c,[['x','i']],s);TB.rich(c,[['x','i']],xp+(xp+14+xl<R?6:-6-xl),(sB+r0)/2+s*0.35,s,ink);
    const ks=[];for(let k=1;k<=n;k++){const [m,j]=mj(k);if(px>=j/(1<<m)&&px<(j+1)/(1<<m))ks.push(k);}
    const p2='2<sup>'+m0+'</sup>';
    fx.innerHTML=TB.rows([['<i>n</i> = '+n+' = '+p2+' + '+j0+',','<i>I</i><sub>'+n+'</sub> = ['+TB.fr(j0,p2)+', '+TB.fr(j0+1,p2)+'),','‖<i>f</i><sub>'+n+'</sub>‖<sub>1</sub> = '+TB.fr(1,p2)],
      ['<i>x</i> = '+TB.fmt(px,3)+':','<i>f<sub>k</sub></i>(<i>x</i>) = 1 при <i>k</i> = '+ks.join(', ')]]);
    g.set(1/(1<<m0));
  }
  function setFrom(e){if(!geo)return;const b=cv.getBoundingClientRect();
    const x=(e.clientX-b.left-geo.L)/(geo.R-geo.L);px=Math.min(0.999,Math.max(0.001,Math.round(x*1000)/1000));draw();}
  let down=false;
  cv.addEventListener('pointerdown',e=>{down=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}setFrom(e);});
  cv.addEventListener('pointermove',e=>{if(down)setFrom(e);});
  cv.addEventListener('pointerup',()=>{down=false;});cv.addEventListener('pointercancel',()=>{down=false;});
  cv.style.touchAction='pan-y';cv.style.cursor='ew-resize';
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
