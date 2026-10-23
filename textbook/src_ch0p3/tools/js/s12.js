
(function(){
  /* Small figures inside the exercises of §∅.18: drawn on the exercise background, they show the setting of the statement, not the answer. */
  const TB=window.TB;if(!TB||!TB.fit)return;
  const KX=()=>{const K=TB.cols();K.paper=TB.tok('--warm-soft');return K;};
  const mount=(id,h,draw)=>{const cv=document.getElementById(id);if(!cv)return null;
    const run=()=>{const F=TB.fit(cv,h),c=F.c;c.clearRect(0,0,F.W,F.H);draw(c,F.W,F.H,KX(),F.W<480,cv);};
    run();TB.onTheme(run);TB.onResize(cv,run);return run;};
  const ticks=(c,K,s,list,pos,align)=>{c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign=align;for(const v of list){const p=pos(v);c.fillText(p[2]!==undefined?p[2]:TB.tickLabel(v),p[0],p[1]);}c.textAlign='start';};
  const dot=(c,x,y,r,col,K)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle=K.paper;c.lineWidth=1.2;c.stroke();};
  const erf=x=>{const s=x<0?-1:1;x=Math.abs(x);const t=1/(1+0.3275911*x);
    return s*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));};
  const Phi=x=>0.5*(1+erf(x/Math.SQRT2));

  /* exinv: a distribution function F and the construction of F^{-1}(u) */
  (function(){
    const sl=document.getElementById('exInvU'),so=document.getElementById('exInvUOut'),fx=document.getElementById('exInvFx');if(!sl)return;
    const F=t=>0.65*Phi((t+0.6)/0.55)+0.35*Phi((t-1.6)/0.8);
    const Finv=u=>{let lo=-12,hi=12;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(F(m)<u)lo=m;else hi=m;}return (lo+hi)/2;};
    const t0=-2.6,t1=4.4;
    const run=mount('exInv',W=>W<480?260:290,(c,W,H,K,sm)=>{
      const u=+sl.value;so.textContent=TB.fmt(u,2);const ts=Finv(u);
      const s=sm?12:14,L=sm?34:40,R=W-(sm?10:16),top=s+16,B=H-(2*s+22);
      const X=t=>L+(t-t0)/(t1-t0)*(R-L),Y=v=>B-v*(B-top);
      c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();c.moveTo(L,top-8);c.lineTo(L,B);c.lineTo(R,B);
      for(const v of [-2,0,2,4]){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}for(const v of [0.5,1]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
      c.strokeStyle=TB.rgba(K.muted,0.8);c.setLineDash([4,4]);c.beginPath();c.moveTo(L,Y(1));c.lineTo(R,Y(1));c.stroke();c.setLineDash([]);
      ticks(c,K,s,[-2,0,2,4],v=>[X(v),B+s+4],'center');ticks(c,K,s,[0,0.5,1],v=>[L-7,Y(v)+s*0.35],'right');
      TB.rich(c,[['t','i']],R-2,B-6,s,K.muted,'right');TB.rich(c,[['u','i']],L-7,Y(0.75)+s*0.35,s,K.muted,'right');
      c.strokeStyle=K.ink;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=400;i++){const t=t0+(t1-t0)*i/400;i?c.lineTo(X(t),Y(F(t))):c.moveTo(X(t),Y(F(t)));}c.stroke();
      TB.rich(c,[['F','i']],X(3.3)+4,Y(F(3.3))+s+4,s+1,K.ink);
      c.strokeStyle=K.warm;c.lineWidth=1.8;c.setLineDash([5,4]);c.beginPath();c.moveTo(L,Y(u));c.lineTo(X(ts),Y(u));c.lineTo(X(ts),B);c.stroke();c.setLineDash([]);
      dot(c,L,Y(u),4.5,K.warm,K);dot(c,X(ts),Y(u),3.5,K.ink,K);dot(c,X(ts),B,4.5,K.eth,K);
      TB.rich(c,[['u','i']],L+7,Y(u)-7,s,K.warm);
      const lb=[['F','i'],['⁻¹','m'],['(','m'],['u','i'],[')','m']],lw=TB.richW(c,lb,s),lx=Math.max(L+lw/2,Math.min(R-lw/2,X(ts)));
      TB.rich(c,lb,lx,B+2*s+14,s,K.eth,'center');
      fx.innerHTML=TB.rows([['<i>u</i> = '+TB.fmt(u,2)+',','<i>F</i><sup>−1</sup>(<i>u</i>) = '+TB.fmt(ts,2)]]);});
    sl.addEventListener('input',run);
  })();

  /* exstrip: the sign of f(x, y) = e^{-xy} - 2e^{-2xy} on the strip x > 0, 0 < y ≤ 1 */
  (function(){
    const f=(x,y)=>Math.exp(-x*y)-2*Math.exp(-2*x*y),XM=10;let img=null,key='';
    mount('exStrip',W=>W<480?190:220,(c,W,H,K,sm)=>{
      const s=sm?12:14,L=sm?28:34,R=W-(sm?26:34);
      const top=TB.legend(c,[{k:'fill',col:K.warm,a:0.85,t:[['f','i'],[' > 0','m']]},{k:'fill',col:K.eth,a:0.85,t:[['f','i'],[' < 0','m']]}],L,R,2,s)+8;
      const B=H-(sm?22:26),X=x=>L+x/XM*(R-L),Y=y=>B-y*(B-top);
      const k=K.paper+K.eth+K.warm;
      if(!img||key!==k){key=k;const n=420;img=TB.heat(n,(i,j)=>{const v=f(XM*(i+0.5)/n,(j+0.5)/n),a=Math.pow(Math.min(1,Math.abs(v)),0.35);return TB.mixa(K.paper,v>0?K.warm:K.eth,a*0.92);});}
      c.imageSmoothingEnabled=true;c.drawImage(img,L,top,R-L,B-top);
      c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();c.moveTo(L,top);c.lineTo(R,top);c.moveTo(L,top);c.lineTo(L,B);c.lineTo(R,B);
      for(const v of [0,2,4,6,8,10]){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}for(const v of [0.5,1]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
      // the strip goes on to the right: an arrow on the x-axis
      c.strokeStyle=K.muted;c.fillStyle=K.muted;c.lineWidth=1.2;c.beginPath();c.moveTo(R,B);c.lineTo(W-6,B);c.stroke();
      c.beginPath();c.moveTo(W-4,B);c.lineTo(W-10,B-4);c.lineTo(W-10,B+4);c.closePath();c.fill();
      TB.rich(c,[['x','i']],W-6,B-7,s,K.muted,'right');
      ticks(c,K,s,[0,2,4,6,8,10],v=>[X(v),B+s+4],'center');ticks(c,K,s,[0,0.5,1],v=>[L-7,Y(v)+s*0.35],'right');
      TB.rich(c,[['y','i']],L-7,Y(0.76)+s*0.35,s,K.muted,'right');});
  })();

  /* exconv: the product density of an independent pair and the half-plane x + y ≤ t */
  (function(){
    const sl=document.getElementById('exConvT'),so=document.getElementById('exConvTOut');if(!sl)return;
    const p=x=>x>0?x/0.49*Math.exp(-x/0.7):0,q=y=>Math.exp(-(y-1.5)*(y-1.5)/0.72)/(0.6*Math.sqrt(2*Math.PI));
    const x0=-0.5,x1=4.5,y0=-0.5,y1=3.5;let img=null,key='',pm=0,qm=0;
    for(let i=0;i<=500;i++){pm=Math.max(pm,p(x0+(x1-x0)*i/500));qm=Math.max(qm,q(y0+(y1-y0)*i/500));}
    const run=mount('exConv',W=>W<480?300:330,(c,W,H,K,sm)=>{
      const t=+sl.value;so.textContent=TB.fmt(t,2);
      const s=sm?12:14,L=sm?28:34,band=sm?40:52,R=W-band-(sm?6:10),top=band+6,B=H-(sm?22:26);
      const X=x=>L+(x-x0)/(x1-x0)*(R-L),Y=y=>B-(y-y0)/(y1-y0)*(B-top);
      const k=K.paper+K.eth;
      if(!img||key!==k){key=k;const n=220;img=TB.heat(n,(i,j)=>{const v=p(x0+(x1-x0)*(i+0.5)/n)*q(y0+(y1-y0)*(j+0.5)/n)/(pm*qm);return TB.mixa(K.paper,K.eth,Math.pow(v,0.8)*0.9);});}
      c.imageSmoothingEnabled=true;c.drawImage(img,L,top,R-L,B-top);
      // the half-plane x + y ≤ t, hatched
      c.save();c.beginPath();c.rect(L,top,R-L,B-top);c.clip();
      const A=[X(x0-50),Y(t-(x0-50))],Bp=[X(x1+50),Y(t-(x1+50))],C=[X(x0-50),Y(t-(x1+50))];
      c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(Bp[0],Bp[1]);c.lineTo(C[0],C[1]);c.closePath();c.clip();
      c.fillStyle=TB.rgba(K.warm,0.12);c.fillRect(L,top,R-L,B-top);
      c.strokeStyle=TB.rgba(K.warm,0.75);c.lineWidth=1;c.beginPath();for(let d=-(B-top);d<R-L+(B-top);d+=9){c.moveTo(L+d,B);c.lineTo(L+d+(B-top),top);}c.stroke();
      c.restore();
      c.save();c.beginPath();c.rect(L,top,R-L,B-top);c.clip();c.strokeStyle=K.warm;c.lineWidth=2.2;c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(Bp[0],Bp[1]);c.stroke();c.restore();
      // frame, axes through the origin, ticks
      c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(L,top,R-L,B-top);
      c.strokeStyle=TB.rgba(K.muted,0.45);c.beginPath();c.moveTo(X(0),top);c.lineTo(X(0),B);c.moveTo(L,Y(0));c.lineTo(R,Y(0));c.stroke();
      c.strokeStyle=K.rule;c.beginPath();for(const v of [0,1,2,3,4]){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}for(const v of [0,1,2,3]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
      ticks(c,K,s,[0,1,2,3,4],v=>[X(v),B+s+4],'center');ticks(c,K,s,[0,1,2,3],v=>[L-7,Y(v)+s*0.35],'right');
      // the factors: p above the square, q to the right of it
      const pb=top-4,ph=band-14;c.strokeStyle=K.ink;c.lineWidth=1.8;c.beginPath();for(let i=0;i<=300;i++){const x=x0+(x1-x0)*i/300,yy=pb-p(x)/pm*ph;i?c.lineTo(X(x),yy):c.moveTo(X(x),yy);}c.stroke();
      const qb=R+4,qw=band-10;c.beginPath();for(let i=0;i<=300;i++){const y=y0+(y1-y0)*i/300,xx=qb+q(y)/qm*qw;i?c.lineTo(xx,Y(y)):c.moveTo(xx,Y(y));}c.stroke();
      TB.rich(c,[['p','i'],['(','m'],['x','i'],[')','m']],X(x0)+4,pb-7,s,K.ink);
      TB.rich(c,[['q','i'],['(','m'],['y','i'],[')','m']],qb+4,Y(3.2),s,K.ink);
      TB.rich(c,[['x','i']],X(3.5),B+s+4,s,K.muted,'center');TB.rich(c,[['y','i']],L-7,Y(2.5)+s*0.35,s,K.muted,'right');
      // the label of the line, on a backing so that it never sits on the hatching
      const lb=[['x','i'],[' + ','m'],['y','i'],[' = ','m'],['t','i']],lw=TB.richW(c,lb,s);
      let xa=Math.min(x1-0.15,Math.max(x0+0.15,t-y1+0.35)),la=[X(xa)+8,Y(t-xa)+s*0.4];
      if(la[0]+lw+8>R){xa=x1-0.2;la=[X(xa)-lw-10,Y(t-xa)-8];}
      la[0]=Math.max(L+4,Math.min(R-lw-6,la[0]));la[1]=Math.max(top+s+4,Math.min(B-6,la[1]));
      c.fillStyle=TB.rgba(K.paper,0.88);c.fillRect(la[0]-3,la[1]-s,lw+6,s+6);TB.rich(c,lb,la[0],la[1],s,K.warm);});
    sl.addEventListener('input',run);
  })();

  /* expolar: the half-strip of (r, θ), its image under the polar map, and a small rectangle with its image */
  (function(){
    const sr=document.getElementById('exPolR'),st=document.getElementById('exPolT'),sro=document.getElementById('exPolROut'),sto=document.getElementById('exPolTOut'),fx=document.getElementById('exPolFx');if(!sr)return;
    const dr=0.3,dt=0.3,RM=3,TP=2*Math.PI;let img=null,key='',geo=null;
    const run=mount('exPolar',W=>{const sm=W<480,P=Math.min(300,(W-(sm?28:40)-(sm?26:44)-(sm?8:14))/2);return Math.round(P+(sm?46:52));},(c,W,H,K,sm)=>{
      const r=+sr.value,th=+st.value;sro.textContent=TB.fmt(r,2);sto.textContent=TB.fmt(th,2);
      const s=sm?12:14,L=sm?28:40,gap=sm?26:44,P=Math.min(300,(W-L-gap-(sm?8:14))/2),top=sm?20:22,B=top+P;
      const XA=L,XB=L+P+gap+(W-L-gap-(sm?8:14)-2*P);
      const ax=v=>XA+v/RM*P,ay=v=>B-v/TP*P,bx=x=>XB+(x+RM)/(2*RM)*P,by=y=>B-(y+RM)/(2*RM)*P;
      geo={XA:XA,XB:XB,P:P,B:B};
      const k=K.paper+K.eth;
      if(!img||key!==k){key=k;const n=200;img=TB.heat(n,(i,j)=>{const x=-RM+2*RM*(i+0.5)/n,y=-RM+2*RM*(j+0.5)/n;return TB.mixa(K.paper,K.eth,Math.exp(-(x*x+y*y)/2)*0.85);});}
      c.imageSmoothingEnabled=true;c.drawImage(img,XB,B-P,P,P);
      // left panel: grid lines r = 1, 2 and θ = kπ/4
      c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(XA,B-P,P,P);
      c.strokeStyle=TB.rgba(K.muted,0.55);c.beginPath();for(let k2=1;k2<8;k2++){c.moveTo(XA,ay(k2*Math.PI/4));c.lineTo(XA+P,ay(k2*Math.PI/4));}c.stroke();
      c.strokeStyle=K.ink;c.lineWidth=1.4;c.beginPath();for(const v of [1,2]){c.moveTo(ax(v),B);c.lineTo(ax(v),B-P);}c.stroke();
      c.strokeStyle=K.warm;c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.moveTo(XA,B);c.lineTo(XA+P,B);c.moveTo(XA,B-P);c.lineTo(XA+P,B-P);c.stroke();c.setLineDash([]);
      // right panel: circles and rays
      c.save();c.beginPath();c.rect(XB,B-P,P,P);c.clip();
      c.strokeStyle=TB.rgba(K.muted,0.55);c.lineWidth=1;c.beginPath();for(let k2=1;k2<8;k2++){const a=k2*Math.PI/4;c.moveTo(bx(0),by(0));c.lineTo(bx(RM*Math.cos(a)),by(RM*Math.sin(a)));}c.stroke();
      c.strokeStyle=K.ink;c.lineWidth=1.4;for(const v of [1,2]){c.beginPath();c.arc(bx(0),by(0),v/(2*RM)*P,0,7);c.stroke();}
      c.strokeStyle=TB.rgba(K.ink,0.5);c.setLineDash([2,3]);c.beginPath();c.arc(bx(0),by(0),P/2,0,7);c.stroke();c.setLineDash([]);
      c.strokeStyle=K.warm;c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.moveTo(bx(0),by(0));c.lineTo(XB+P,by(0));c.stroke();c.setLineDash([]);
      c.restore();c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(XB,B-P,P,P);
      // the small rectangle and its image
      c.fillStyle=TB.rgba(K.warm,0.4);c.strokeStyle=K.warm;c.lineWidth=1.6;
      c.beginPath();c.rect(ax(r),ay(th+dt),ax(r+dr)-ax(r),ay(th)-ay(th+dt));c.fill();c.stroke();
      const pr=v=>v/(2*RM)*P;c.beginPath();c.arc(bx(0),by(0),pr(r+dr),-th,-(th+dt),true);c.arc(bx(0),by(0),pr(r),-(th+dt),-th,false);c.closePath();c.fill();c.stroke();
      dot(c,ax(r),ay(th),4.5,K.warm,K);dot(c,bx(r*Math.cos(th)),by(r*Math.sin(th)),4.5,K.warm,K);
      // ticks and names
      c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();for(const v of [0,1,2,3]){c.moveTo(ax(v),B);c.lineTo(ax(v),B+4);}for(const v of [0,Math.PI,TP]){c.moveTo(XA-4,ay(v));c.lineTo(XA,ay(v));}
      for(const v of [-2,0,2]){c.moveTo(bx(v),B);c.lineTo(bx(v),B+4);c.moveTo(XB-4,by(v));c.lineTo(XB,by(v));}c.stroke();
      ticks(c,K,s,[0,1,2,3],v=>[ax(v),B+s+4],'center');ticks(c,K,s,[-2,0,2],v=>[bx(v),B+s+4],'center');
      ticks(c,K,s,[-2,0,2],v=>[XB-6,by(v)+s*0.35],'right');
      c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='right';c.fillText('0',XA-6,ay(0)+s*0.35);c.textAlign='start';
      TB.rich(c,[['π','m']],XA-6,ay(Math.PI)+s*0.35,s-1,K.muted,'right');TB.rich(c,[['2π','m']],XA-6,ay(TP)+s*0.35,s-1,K.muted,'right');
      TB.rich(c,[['r','i']],ax(2.5),B+s+4,s,K.muted,'center');
      TB.rich(c,[['θ','i']],XA-6,ay(1.5*Math.PI)+s*0.35,s,K.muted,'right');
      TB.rich(c,[['x','i']],bx(1),B+s+4,s,K.muted,'center');TB.rich(c,[['y','i']],XB-6,by(1)+s*0.35,s,K.muted,'right');
      const ia=0.5*((r+dr)*(r+dr)-r*r)*dt;
      fx.innerHTML=TB.rows([['<i>r</i> = '+TB.fmt(r,2)+',','<i>θ</i> = '+TB.fmt(th,2)],['<i>Φ</i>(<i>r</i>, <i>θ</i>) = ('+TB.fmt(r*Math.cos(th),2)+'; '+TB.fmt(r*Math.sin(th),2)+')'],
        ['площадь прямоугольника '+TB.fmt(dr*dt,2)+',','площадь образа '+TB.fmt(ia,3)]]);});
    if(!run)return;
    [sr,st].forEach(e=>e.addEventListener('input',run));
    const cv=document.getElementById('exPolar');let drag=false;
    const pick=e=>{if(!geo)return false;const b=cv.getBoundingClientRect(),px=e.clientX-b.left,py=e.clientY-b.top,P=geo.P;let r,th;
      if(px>=geo.XA-6&&px<=geo.XA+P+6&&py>=geo.B-P-6&&py<=geo.B+6){r=(px-geo.XA)/P*RM;th=(geo.B-py)/P*TP;}
      else if(px>=geo.XB-6&&px<=geo.XB+P+6&&py>=geo.B-P-6&&py<=geo.B+6){const x=(px-geo.XB)/P*2*RM-RM,y=(geo.B-py)/P*2*RM-RM;r=Math.hypot(x,y);th=Math.atan2(y,x);if(th<0)th+=TP;}
      else return false;
      sr.value=Math.max(+sr.min,Math.min(+sr.max,r)).toFixed(2);st.value=Math.max(+st.min,Math.min(+st.max,th)).toFixed(2);run();return true;};
    cv.style.touchAction='pan-y';
    cv.addEventListener('pointerdown',e=>{if(pick(e)){drag=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}}});
    cv.addEventListener('pointermove',e=>{if(drag)pick(e);});
    ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>{drag=false;}));
  })();

  /* excond: a joint density p(u, v), the level v, and the density of Q(v, ·) */
  (function(){
    const sl=document.getElementById('exCondV'),so=document.getElementById('exCondVOut'),fx=document.getElementById('exCondFx');if(!sl)return;
    const w=v=>v>0&&v<1.2?v*(1.2-v)*(1.2-v)/0.1728:0,m=v=>-0.3+1.4*v+0.25*Math.sin(4*v),sd=v=>0.18+0.25*v;
    const nd=(u,v)=>Math.exp(-(u-m(v))*(u-m(v))/(2*sd(v)*sd(v)))/(sd(v)*Math.sqrt(2*Math.PI)),p=(u,v)=>w(v)>0?w(v)*nd(u,v):0;
    const u0=-1,u1=2.5,v0=-0.2,v1=1.5,QM=2.4;let img=null,key='',pm=0;
    for(let i=0;i<=200;i++)for(let j=0;j<=200;j++)pm=Math.max(pm,p(u0+(u1-u0)*i/200,v0+(v1-v0)*j/200));
    const run=mount('exCond',W=>W<480?330:370,(c,W,H,K,sm)=>{
      const v=+sl.value;so.textContent=TB.fmt(v,2);const py=w(v);
      const s=sm?12:14,L=sm?32:40,R=W-(sm?10:16),T1=8,gp=sm?40:44,B1=T1+(H-T1-gp-(sm?22:26))*0.6,T2=B1+gp,B2=H-(sm?22:26);
      const X=u=>L+(u-u0)/(u1-u0)*(R-L),Y1=y=>B1-(y-v0)/(v1-v0)*(B1-T1),Y2=q=>B2-q/QM*(B2-T2);
      const k=K.paper+K.eth;
      if(!img||key!==k){key=k;const n=220;img=TB.heat(n,(i,j)=>TB.mixa(K.paper,K.eth,Math.pow(p(u0+(u1-u0)*(i+0.5)/n,v0+(v1-v0)*(j+0.5)/n)/pm,0.8)*0.9));}
      c.imageSmoothingEnabled=true;c.drawImage(img,L,T1,R-L,B1-T1);
      c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(L,T1,R-L,B1-T1);
      c.strokeStyle=TB.rgba(K.muted,0.8);c.setLineDash([4,4]);c.beginPath();for(const b of [0,1.2]){c.moveTo(L,Y1(b));c.lineTo(R,Y1(b));}c.stroke();c.setLineDash([]);
      c.strokeStyle=K.warm;c.lineWidth=2.2;c.beginPath();c.moveTo(L,Y1(v));c.lineTo(R,Y1(v));c.stroke();dot(c,R,Y1(v),4.5,K.warm,K);
      c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();for(const t of [-1,0,1,2]){c.moveTo(X(t),B1);c.lineTo(X(t),B1+4);c.moveTo(X(t),B2);c.lineTo(X(t),B2+4);}
      for(const t of [0,0.5,1]){c.moveTo(L-4,Y1(t));c.lineTo(L,Y1(t));}for(const t of [1,2]){c.moveTo(L-4,Y2(t));c.lineTo(L,Y2(t));}
      c.moveTo(L,T2-6);c.lineTo(L,B2);c.lineTo(R,B2);c.stroke();
      ticks(c,K,s,[-1,0,1,2],t=>[X(t),B1+s+4],'center');ticks(c,K,s,[-1,0,1,2],t=>[X(t),B2+s+4],'center');
      ticks(c,K,s,[0,0.5,1],t=>[L-7,Y1(t)+s*0.35],'right');ticks(c,K,s,[0,1,2],t=>[L-7,Y2(t)+s*0.35],'right');
      TB.rich(c,[['v','i']],L-7,Y1(0.76)+s*0.35,s,K.muted,'right');TB.rich(c,[['u','i']],X(1.5),B1+s+4,s,K.muted,'center');TB.rich(c,[['u','i']],X(1.5),B2+s+4,s,K.muted,'center');
      const ql=[['Q','i'],['(','m'],['v','i'],[', ·)','m']];
      if(py>0){c.fillStyle=TB.rgba(K.warm,0.3);c.beginPath();c.moveTo(X(u0),B2);for(let i=0;i<=300;i++){const u=u0+(u1-u0)*i/300;c.lineTo(X(u),Y2(Math.min(QM,nd(u,v))));}c.lineTo(X(u1),B2);c.closePath();c.fill();
        c.strokeStyle=K.warm;c.lineWidth=2;c.beginPath();for(let i=0;i<=300;i++){const u=u0+(u1-u0)*i/300;i?c.lineTo(X(u),Y2(nd(u,v))):c.moveTo(X(u),Y2(nd(u,v)));}c.stroke();
        TB.rich(c,[['плотность ','r']].concat(ql),R-4,T2+s,s,K.warm,'right');
        fx.innerHTML=TB.rows([['<i>v</i> = '+TB.fmt(v,2)+',','<i>p</i><sub><i>y</i></sub>(<i>v</i>) = '+TB.fmt(py,3)]]);}
      else{const x=X(0);c.strokeStyle=K.warm;c.fillStyle=K.warm;c.lineWidth=2.2;c.beginPath();c.moveTo(x,B2);c.lineTo(x,T2+8);c.stroke();
        c.beginPath();c.moveTo(x,T2+2);c.lineTo(x-5,T2+11);c.lineTo(x+5,T2+11);c.closePath();c.fill();
        TB.rich(c,ql.concat([[' = ','m'],['δ','i'],['0','s']]),x+10,T2+s+4,s,K.warm);
        fx.innerHTML=TB.rows([['<i>v</i> = '+TB.fmt(v,2)+',','<i>p</i><sub><i>y</i></sub>(<i>v</i>) = 0']]);}});
    sl.addEventListener('input',run);
  })();
})();
