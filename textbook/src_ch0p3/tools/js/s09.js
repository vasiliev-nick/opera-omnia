
(function(){
  /* Fig. ∅.24: (x²−y²)/(x²+y²)² on the unit square; the corner where both infinite masses live, and the strips of the two iterated integrals. */
  const cv=document.getElementById('fcounter');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('fcE'),so=document.getElementById('fcEOut'),fx=document.getElementById('fcFx');
  const g1=new TB.Gauge('gFc1'),g2=new TB.Gauge('gFc2'),g3=new TB.Gauge('gFc3');
  const f=(x,y)=>{const r=x*x+y*y;return (x*x-y*y)/(r*r);};
  const q=Math.PI/4;g1.mark('a',q,'<sup>π</sup>⁄<sub>4</sub>');g2.mark('a',-q,'−<sup>π</sup>⁄<sub>4</sub>');
  let md=TB.segs(cv,k=>{md=k;draw();}),img=null,imgKey='';
  function heat(K){const key=K.paper+K.eth+K.warm;if(img&&imgKey===key)return img;imgKey=key;const N=260;
    return img=TB.heat(N,(i,j)=>{const v=f((i+0.5)/N,(j+0.5)/N),a=1-Math.exp(-Math.abs(v)/1.5);return TB.mixa(K.paper,v>0?K.warm:K.eth,a*0.95);});}
  function draw(){
    const u=+sl.value,e=Math.pow(10,-u);so.textContent=e.toPrecision(2).replace('.',',');
    const F=TB.fit(cv,W=>Math.max(330,Math.min(440,Math.round(W*0.58)))),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?26:34,R=W-(sm?8:14);
    const top=TB.legend(c,[{k:'fill',col:K.warm,a:0.7,t:[['f','i'],[' > 0','m']]},{k:'fill',col:K.eth,a:0.7,t:[['f','i'],[' < 0','m']]},
      {k:'dash',col:K.ink,t:[['[0, ','m'],['ε','i'],[')²','m']]},{k:'line',col:K.ink,t:[['полоса','r']]}],L,R,4,s)+s+8;
    const B=H-(sm?24:28),S=Math.min(B-top,R-L-30),X0=L+Math.max(0,((R-L)-S)/2),hx=x=>X0+x*S,hy=y=>B-y*S;
    c.imageSmoothingEnabled=true;c.drawImage(heat(K),X0,B-S,S,S);
    // dim everything outside the strip
    c.fillStyle=TB.rgba(K.paper,0.62);
    if(md==='X')c.fillRect(X0,B-S,hx(e)-X0,S);else c.fillRect(X0,hy(e),S,B-hy(e));
    c.strokeStyle=TB.rgba(K.muted,0.7);c.lineWidth=1;c.setLineDash([2,4]);c.beginPath();c.moveTo(hx(0),hy(0));c.lineTo(hx(1),hy(1));c.stroke();c.setLineDash([]);
    c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(X0,B-S,S,S);
    c.strokeStyle=K.ink;c.lineWidth=2;if(md==='X')c.strokeRect(hx(e),B-S,hx(1)-hx(e),S);else c.strokeRect(X0,B-S,S,hy(e)-(B-S));
    c.lineWidth=1.4;c.setLineDash([4,3]);c.strokeRect(X0,hy(e),hx(e)-X0,B-hy(e));c.setLineDash([]);
    c.beginPath();for(const v of [0,0.5,1]){c.moveTo(hx(v),B);c.lineTo(hx(v),B+4);c.moveTo(X0-4,hy(v));c.lineTo(X0,hy(v));}c.strokeStyle=K.rule;c.stroke();
    c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='center';for(const v of [0,0.5,1])c.fillText(TB.tickLabel(v),hx(v),B+s+5);
    c.textAlign='right';for(const v of [0.5,1])c.fillText(TB.tickLabel(v),X0-6,hy(v)+s*0.35);c.textAlign='start';
    TB.rich(c,[['x','i']],hx(1)+5,B-4,s,K.muted);TB.rich(c,[['y','i']],X0+4,hy(1)-7,s,K.muted);
    const v=q-Math.atan(e),pm=0.5*Math.log(1/e)-Math.atan(1/e)+q;
    g1.set(v);g2.set(-v);g3.set(pm);
    const ar='π/4 − arctg <i>ε</i>';
    fx.innerHTML=TB.rows([md==='X'?['∫<sub>0</sub><sup>1</sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dy</i> = 1/(1 + <i>x</i><sup>2</sup>),','∫<sub><i>ε</i></sub><sup>1</sup> <i>dx</i>/(1 + <i>x</i><sup>2</sup>) = '+ar+' = '+TB.fmt(v,3)]
      :['∫<sub>0</sub><sup>1</sup> <i>f</i>(<i>x</i>, <i>y</i>) <i>dx</i> = −1/(1 + <i>y</i><sup>2</sup>),','∫<sub><i>ε</i></sub><sup>1</sup> (−1/(1 + <i>y</i><sup>2</sup>)) <i>dy</i> = '+TB.fmt(-v,3)],
      ['положительная масса на [<i>ε</i>, 1]<sup>2</sup>: '+TB.fmt(pm,3)]]);
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
