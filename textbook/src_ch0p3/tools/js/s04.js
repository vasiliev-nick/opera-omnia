
(function(){
  /* Fig. ∅.20: the image of Lebesgue measure on [0,1] under T; points travel up to the graph and across to the y-axis, where a histogram of T_*λ grows. */
  const cv=document.getElementById('push');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('puH'),so=document.getElementById('puHOut'),fx=document.getElementById('puFx');
  const g1=new TB.Gauge('gPu1'),g2=new TB.Gauge('gPu2');
  const TF={M:x=>x+0.18*Math.sin(2*Math.PI*x)*(1-x),H:x=>6.75*x*(1-x)*(1-x)};
  const N=40000,cache={};
  function vals(k){if(cache[k])return cache[k];const T=TF[k],v=new Float64Array(N);let s=0;
    for(let i=0;i<N;i++){v[i]=T((i+0.5)/N);s+=v[i]*v[i];}return cache[k]={v:v,I2:s/N};}
  let md=TB.segs(cv,k=>{md=k;draw();});
  const Y0=0.55;
  const sub=(a,b)=>a+'<sub>'+b+'</sub>',Tl=sub('<i>T</i>','*')+sub('<i>λ</i>',1),Ij=sub('<i>I</i>','<i>j</i>'),cj=sub('<i>c</i>','<i>j</i>');
  function draw(){
    const hv=+sl.value,nb=5*Math.pow(2,hv-1),h=1/nb;so.textContent=String(h).replace('.',',');
    const D=vals(md),T=TF[md];
    const m=new Float64Array(nb);for(let i=0;i<N;i++){let j=Math.floor(D.v[i]*nb);if(j>=nb)j=nb-1;if(j<0)j=0;m[j]++;}
    let S=0,mx=0;for(let j=0;j<nb;j++){m[j]/=N;const c=(j+0.5)*h;S+=c*c*m[j];mx=Math.max(mx,m[j]/h);}
    const js=Math.floor(Y0*nb),a=js*h,b=a+h;
    const F=TB.fit(cv,W=>Math.max(280,Math.min(380,Math.round(W*0.5)))),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?30:40,R=W-(sm?8:14);
    const top=TB.legend(c,[{k:'line',col:K.ink,t:[['y','i'],[' = ','m'],['T','i'],['(','m'],['x','i'],[')','m']]},
      {k:'fill',col:K.eth,a:0.4,t:[['T','i'],['*','s'],['λ','i'],['1','s'],['(','m'],['I','i'],['j','s'],[')','m'],[' / ','m'],['h','i']]},
      {k:'fill',col:K.warm,a:0.7,t:[['I','i'],['j','s'],[' и ','r'],['T','i'],['⁻¹','m'],['(','m'],['I','i'],['j','s'],[')','m']]}],L,R,4,s)+8;
    const B=H-(sm?26:30),XL=L+(R-L)*0.55,HX0=XL+(sm?18:30),HR=R-6;
    const X=x=>L+x*(XL-L),Y=y=>B-y*(B-top);
    const hm=Math.max(2,Math.ceil(mx)),HX=v=>HX0+v/hm*(HR-HX0);
    // the highlighted interval of the y-axis, across both panels
    c.fillStyle=TB.rgba(K.warm,0.12);c.fillRect(L,Y(b),HR-L,Y(a)-Y(b));
    // axes
    c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();c.moveTo(L,top);c.lineTo(L,B);c.lineTo(XL,B);c.moveTo(HX0,top);c.lineTo(HX0,B);c.lineTo(HR,B);
    for(const v of [0,0.5,1]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));c.moveTo(X(v),B);c.lineTo(X(v),B+4);}
    const ht=[0,hm/2,hm];for(const v of ht){c.moveTo(HX(v),B);c.lineTo(HX(v),B+4);}c.stroke();
    c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of [0,0.5,1])c.fillText(TB.tickLabel(v),L-7,Y(v)+s*0.35);
    c.textAlign='center';for(const v of [0,0.5,1])c.fillText(TB.tickLabel(v),X(v),B+s+5);for(const v of ht)c.fillText(TB.tickLabel(v),HX(v),B+s+5);c.textAlign='start';
    TB.rich(c,[['x','i']],XL+4,B-5,s,K.muted);TB.rich(c,[['y','i']],L+6,top+s,s,K.muted);
    // paths of some grid points: up to the graph, then right to the histogram axis
    for(let k=0;k<=60;k+=3){const x=k/60,y=T(x),hit=y>=a&&y<b;
      c.strokeStyle=hit?TB.rgba(K.warm,0.95):TB.rgba(K.muted,0.38);c.lineWidth=hit?1.5:1;
      c.beginPath();c.moveTo(X(x),B);c.lineTo(X(x),Y(y));c.lineTo(HX0,Y(y));c.stroke();}
    // the preimage of the highlighted interval on the x-axis
    c.strokeStyle=K.warm;c.lineWidth=5;c.beginPath();const M=2000;let on=-1;
    for(let i=0;i<=M;i++){const x=i/M,y=i<M?T(x):-1,inb=y>=a&&y<b;if(inb&&on<0)on=x;if(!inb&&on>=0){const xm=(X(on)+X(x))/2,hw=Math.max(2.5,(X(x)-X(on))/2);c.moveTo(xm-hw,B-2.5);c.lineTo(xm+hw,B-2.5);on=-1;}}
    c.stroke();
    // grid points and their images
    for(let k=0;k<=60;k++){const x=k/60;c.fillStyle=K.muted;c.beginPath();c.arc(X(x),B,1.7,0,7);c.fill();
      c.fillStyle=K.eth;c.beginPath();c.arc(HX0,Y(T(x)),1.7,0,7);c.fill();}
    // the graph
    c.strokeStyle=K.ink;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=300;i++){const x=i/300;i?c.lineTo(X(x),Y(T(x))):c.moveTo(X(x),Y(T(x)));}c.stroke();
    // histogram of T_*λ
    for(let j=0;j<nb;j++){if(m[j]<=0)continue;const y1=Y(j*h),y2=Y((j+1)*h);
      c.fillStyle=j===js?TB.rgba(K.warm,0.7):TB.rgba(K.eth,0.4);c.fillRect(HX0,y2,HX(m[j]/h)-HX0,y1-y2);}
    if(nb<=20){c.strokeStyle=TB.rgba(K.eth,0.8);c.lineWidth=1;for(let j=0;j<nb;j++){if(m[j]<=0)continue;const y1=Y(j*h),y2=Y((j+1)*h);c.strokeRect(HX0,y2,HX(m[j]/h)-HX0,y1-y2);}}
    const fm=(v,d)=>TB.fmt(v,d),tr=v=>TB.fmt(v,5).replace(/0+$/,'').replace(/,$/,'');
    fx.innerHTML=TB.rows([['<i>h</i> = '+String(h).replace('.',',')+',',Ij+' = ['+tr(a)+'; '+tr(b)+'),'],
      [Tl+'('+Ij+') = <i>λ</i><sub>1</sub>(<i>T</i><sup>−1</sup>('+Ij+')) ≈ '+fm(m[js],4)],
      ['∑ '+cj+'<sup>2</sup> '+Tl+'('+Ij+') ≈ '+fm(S,4)+',','∫<sub>0</sub><sup>1</sup> <i>T</i>(<i>x</i>)<sup>2</sup> <i>dx</i> ≈ '+fm(D.I2,4)]]);
    g1.set(D.I2);g2.set(S);g2.mark('l',D.I2,'∫<sub>0</sub><sup>1</sup> <i>T</i><sup>2</sup>');
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
