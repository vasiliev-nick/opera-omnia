
(function(){
  /* Fig. ∅.21: the Cantor distribution against a distribution with a density; histograms on triadic intervals and distribution functions. */
  const cv=document.getElementById('cantor');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('caK'),so=document.getElementById('caKOut'),fx=document.getElementById('caFx');
  const g1=new TB.Gauge('gCa1'),g2=new TB.Gauge('gCa2');
  const Kf=x=>{let s=0,p=1/3;for(let j=0;j<40;j++){x*=2;const d=x>=1?1:0;x-=d;s+=2*d*p;p/=3;}return s;};
  const FCx=t=>{if(t<=0)return 0;if(t>=1)return 1;let lo=0,hi=1;for(let i=0;i<46;i++){const mid=(lo+hi)/2;if(Kf(mid)<=t)lo=mid;else hi=mid;}return lo;};
  const NG=1200,FCg=[];for(let i=0;i<=NG;i++)FCg.push(FCx(i/NG));
  const FP=t=>t<=0?0:t>=1?1:t*t*(6-8*t+3*t*t),pP=t=>t<0||t>1?0:12*t*(1-t)*(1-t);
  const inC=(j,k)=>{for(let i=0;i<k;i++){if(j%3===1)return false;j=Math.floor(j/3);}return true;};
  let md=TB.segs(cv,k=>{md=k;draw();});
  g1.mark('p',16/9,'max <i>p</i>');
  function draw(){
    const k=+sl.value;so.textContent=k;const n=Math.pow(3,k),w=1/n;
    const ms=new Float64Array(n);for(let j=0;j<n;j++)ms[j]=md==='C'?(inC(j,k)?Math.pow(2,-k):0):FP((j+1)*w)-FP(j*w);
    const F=TB.fit(cv,W=>Math.max(330,Math.min(420,Math.round(W*0.55)))),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?30:40,R=W-(sm?8:14),PR=R-10;
    const items=[{k:'fill',col:K.eth,a:0.45,t:[['мера / длина','r']]}];
    if(md==='P')items.push({k:'line',col:K.warm,t:[['p','i']]});
    items.push({k:'line',col:K.ink,t:[['F','i']]},{k:'dash',col:K.eth,t:[['ломаная','r']]});
    const top=TB.legend(c,items,L,R,4,s)+8;
    const B2=H-(sm?24:28),gap=sm?26:30,mid=top+(B2-top)*0.56,B1=mid-gap/2,T2=mid+gap/2-6;
    const X=x=>L+x*(PR-L),Y1=y=>B1-y/3*(B1-top),Y2=y=>B2-y*(B2-T2);
    // axes
    c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();
    c.moveTo(L,top);c.lineTo(L,B1);c.lineTo(R,B1);c.moveTo(L,T2);c.lineTo(L,B2);c.lineTo(R,B2);
    for(const v of [1,2,3]){c.moveTo(L-4,Y1(v));c.lineTo(L,Y1(v));}for(const v of [0.5,1]){c.moveTo(L-4,Y2(v));c.lineTo(L,Y2(v));}
    for(const v of [0,1/3,2/3,1]){c.moveTo(X(v),B1);c.lineTo(X(v),B1+4);c.moveTo(X(v),B2);c.lineTo(X(v),B2+4);}c.stroke();
    c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='right';
    for(const v of [0,1,2,3])c.fillText(String(v),L-7,Y1(v)+s*0.35);for(const v of [0,0.5,1])c.fillText(TB.tickLabel(v),L-7,Y2(v)+s*0.35);
    c.textAlign='center';const xl=['0','1/3','2/3','1'];[0,1/3,2/3,1].forEach((v,i)=>c.fillText(xl[i],X(v),B2+s+5));c.textAlign='start';
    TB.rich(c,[['t','i']],R-8,B2-5,s,K.muted);
    // bars
    let mh=0,sup=0,clip=false;
    c.fillStyle=TB.rgba(K.eth,0.45);
    for(let j=0;j<n;j++){if(ms[j]<=0)continue;const hgt=ms[j]/w;mh=Math.max(mh,hgt);sup+=w;
      const x1=X(j*w),x2=Math.max(X((j+1)*w),x1+1),yt=Math.max(top,Y1(hgt));if(hgt>3)clip=true;c.fillRect(x1,yt,x2-x1,B1-yt);}
    if(n<=27){c.strokeStyle=TB.rgba(K.eth,0.9);c.lineWidth=1;for(let j=0;j<n;j++){if(ms[j]<=0)continue;const yt=Math.max(top,Y1(ms[j]/w));c.strokeRect(X(j*w),yt,X((j+1)*w)-X(j*w),B1-yt);}}
    if(md==='P'){c.strokeStyle=K.warm;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=300;i++){const t=i/300;i?c.lineTo(X(t),Y1(pP(t))):c.moveTo(X(t),Y1(pP(t)));}c.stroke();}
    if(clip){c.fillStyle=K.paper;const lb=[['высота (3/2)','r'],[TB.sup(k),'r'],[' ≈ '+TB.fmt(Math.pow(1.5,k),2),'r']],lw=TB.richW(c,lb,s);
      c.globalAlpha=0.85;c.fillRect(X(0.5)-lw/2-4,top+2,lw+8,s+8);c.globalAlpha=1;TB.rich(c,lb,X(0.5),top+s+4,s,K.ink,'center');
      c.strokeStyle=K.ink;c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.moveTo(L,top+0.5);c.lineTo(PR,top+0.5);c.stroke();c.setLineDash([]);}
    // distribution functions
    const Fv=t=>{if(md==='P')return FP(t);const u=t*NG,i=Math.min(NG-1,Math.floor(u));return FCg[i]+(FCg[i+1]-FCg[i])*(u-i);};
    c.strokeStyle=K.ink;c.lineWidth=2;c.beginPath();for(let i=0;i<=NG;i++){const t=i/NG;i?c.lineTo(X(t),Y2(Fv(t))):c.moveTo(X(t),Y2(Fv(t)));}c.stroke();
    c.strokeStyle=K.eth;c.lineWidth=2;c.setLineDash([6,4]);c.beginPath();let acc=0;c.moveTo(X(0),Y2(0));
    for(let j=0;j<n;j++){acc+=ms[j];c.lineTo(X((j+1)*w),Y2(acc));}c.stroke();c.setLineDash([]);
    // readouts
    const two='2<sup>−'+k+'</sup>',r32='(3/2)<sup>'+k+'</sup>',r23='(2/3)<sup>'+k+'</sup>';
    if(md==='C')fx.innerHTML=TB.rows([['<i>μ</i><sub><i>C</i></sub> каждого из 2<sup>'+k+'</sup> отрезков = '+two+' = '+TB.fmt(Math.pow(2,-k),4)+','],
      ['высота = '+two+' · 3<sup>'+k+'</sup> = '+r32+' = '+TB.fmt(Math.pow(1.5,k),3)+',','<i>λ</i><sub>1</sub>(<i>C</i><sub>'+k+'</sub>) = '+r23+' = '+TB.fmt(Math.pow(2/3,k),3)]]);
    else fx.innerHTML=TB.rows([['наибольшая высота = 3<sup>'+k+'</sup> · max<sub><i>j</i></sub> <i>μ</i>(<i>I<sub>j</sub></i>) = '+TB.fmt(mh,3)+',','max <i>p</i> = '+TB.fr(16,9)+' ≈ 1,778'],
      ['длина опоры = 1']]);
    g1.set(mh);g2.set(sup);if(g1.m.p)g1.m.p.style.display=md==='P'?'':'none';
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
