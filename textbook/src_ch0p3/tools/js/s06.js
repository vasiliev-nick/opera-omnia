
(function(){
  /* Fig. ∅.22: the density of η = exp ξ for standard normal ξ; a strip under φ and its image under q carry the same probability. */
  const cv=document.getElementById('dens1');if(!cv||!window.TB||!TB.fit)return;
  const sx=document.getElementById('d1X'),sxo=document.getElementById('d1XOut'),sw=document.getElementById('d1W'),swo=document.getElementById('d1WOut'),fx=document.getElementById('d1Fx');
  const g1=new TB.Gauge('gD11'),g2=new TB.Gauge('gD12');
  const phi=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI),q=y=>y>0?phi(Math.log(y))/y:0;
  const simp=(f,a,b,n)=>{n=n||400;const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3;};
  const xa=-2.6,xb=2.1,ym=7.6;
  function draw(){
    const x0=+sx.value,d=+sw.value,x1=x0+d,y0=Math.exp(x0),y1=Math.exp(x1);sxo.textContent=TB.fmt(x0,2);swo.textContent=TB.fmt(d,2);
    const F=TB.fit(cv,W=>Math.max(340,Math.min(440,Math.round(W*0.58)))),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?8:14,R=W-(sm?8:14);
    const top=TB.legend(c,[{k:'line',col:K.ink,t:[['y','i'],[' = ','m'],['e','i'],['ˣ','i']]},{k:'line',col:K.warm,t:[['φ','i'],[' — плотность ','r'],['ξ','i']]},
      {k:'line',col:K.eth,t:[['q','i'],[' — плотность ','r'],['η','i']]}],L,R,4,s)+8;
    const QX=L+(R-L)*0.72,GB=top+(H-top-(sm?22:26))*0.74,PB=H-(sm?22:26);
    const X=x=>L+(x-xa)/(xb-xa)*(QX-L),Y=y=>GB-y/ym*(GB-top),PY=v=>GB+v/0.42*(PB-GB-2),QXv=v=>QX+v/0.7*(R-QX-4);
    // strips
    c.fillStyle=TB.rgba(K.warm,0.13);c.beginPath();c.moveTo(X(x0),GB);for(let i=0;i<=40;i++){const x=x0+d*i/40;c.lineTo(X(x),Y(Math.exp(x)));}c.lineTo(X(x1),GB);c.closePath();c.fill();
    c.fillStyle=TB.rgba(K.eth,0.13);c.beginPath();c.moveTo(QX,Y(y0));for(let i=0;i<=40;i++){const x=x0+d*i/40;c.lineTo(X(x),Y(Math.exp(x)));}c.lineTo(QX,Y(y1));c.closePath();c.fill();
    c.fillStyle=TB.rgba(K.warm,0.45);c.beginPath();c.moveTo(X(x0),GB);for(let i=0;i<=60;i++){const x=x0+d*i/60;c.lineTo(X(x),PY(phi(x)));}c.lineTo(X(x1),GB);c.closePath();c.fill();
    c.fillStyle=TB.rgba(K.eth,0.45);c.beginPath();c.moveTo(QX,Y(y0));for(let i=0;i<=60;i++){const y=y0+(y1-y0)*i/60;c.lineTo(QXv(q(y)),Y(y));}c.lineTo(QX,Y(y1));c.closePath();c.fill();
    // axes: x-axis at y = 0, y-axis on the right edge of the graph; x tick labels under the φ panel
    c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();c.moveTo(L,GB);c.lineTo(R,GB);c.moveTo(QX,top);c.lineTo(QX,PB);
    for(const v of [-2,-1,0,1,2]){c.moveTo(X(v),PB-4);c.lineTo(X(v),PB);c.moveTo(X(v),GB);c.lineTo(X(v),GB+4);}
    for(const v of [2,4,6]){c.moveTo(QX,Y(v));c.lineTo(QX+4,Y(v));}c.stroke();
    c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='center';for(const v of [-2,-1,0,1,2])c.fillText(TB.fmt(v,0),X(v),PB+s+4);
    c.textAlign='right';for(const v of [2,4,6])c.fillText(String(v),QX-6,Y(v)+s*0.35);c.textAlign='start';
    TB.rich(c,[['y','i']],QX+8,top+s,s,K.muted);TB.rich(c,[['x','i']],L+2,GB-6,s,K.muted);
    // the curves
    c.strokeStyle=K.warm;c.lineWidth=1.8;c.beginPath();for(let i=0;i<=300;i++){const x=xa+(xb-xa)*i/300;i?c.lineTo(X(x),PY(phi(x))):c.moveTo(X(x),PY(phi(x)));}c.stroke();
    c.strokeStyle=K.eth;c.lineWidth=1.8;c.beginPath();for(let i=0;i<=500;i++){const y=1e-3+(ym-1e-3)*i/500;i?c.lineTo(QXv(q(y)),Y(y)):c.moveTo(QXv(q(y)),Y(y));}c.stroke();
    c.save();c.beginPath();c.rect(L,top,QX-L,GB-top);c.clip();
    c.strokeStyle=K.ink;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=300;i++){const x=xa+(xb-xa)*i/300;i?c.lineTo(X(x),Y(Math.exp(x))):c.moveTo(X(x),Y(Math.exp(x)));}c.stroke();c.restore();
    c.fillStyle=K.ink;c.beginPath();c.arc(X(x0),Y(y0),3.2,0,7);c.fill();
    c.strokeStyle=TB.rgba(K.ink,0.55);c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.moveTo(X(x0),GB);c.lineTo(X(x0),Y(y0));c.lineTo(QX,Y(y0));c.stroke();c.setLineDash([]);
    TB.rich(c,[['φ','i']],X(-1.75),PY(phi(-1.75))+s+2,s,K.warm,'center');
    TB.rich(c,[['q','i']],QXv(q(Math.exp(-1)))+6,Y(Math.exp(-1))-8,s,K.eth);
    // numbers
    const P1=simp(phi,x0,x1),P2=simp(q,y0,y1);
    g1.set(P1);g2.set(P2);
    const x0s='<i>x</i><sub>0</sub>',ex='<i>e</i><sup><i>x</i><sub>0</sub></sup>';
    fx.innerHTML=TB.rows([['<i>y</i><sub>0</sub> = '+ex+' = '+TB.fmt(y0,3)+',','<i>φ</i>('+x0s+') = '+TB.fmt(phi(x0),3)+','],
      ['<i>q</i>(<i>y</i><sub>0</sub>) = <i>φ</i>('+x0s+') / '+ex+' = '+TB.fmt(q(y0),3)+','],
      ['('+'<i>e</i><sup><i>x</i><sub>0</sub>+Δ</sup> − '+ex+') / Δ = '+TB.fmt((y1-y0)/d,3)+',','<i>T</i>′('+x0s+') = '+ex+' = '+TB.fmt(y0,3)]]);
  }
  [sx,sw].forEach(e=>e.addEventListener('input',draw));draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
