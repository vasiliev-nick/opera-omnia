
(function(){
  /* Fig. ∅.23: Tonelli on the unit square; a heat map of f, the current section, its integral, and the inner integral as a function of the section. */
  const cv=document.getElementById('fubini');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('fbS'),so=document.getElementById('fbSOut'),fx=document.getElementById('fbFx');
  const g1=new TB.Gauge('gFb1'),g2=new TB.Gauge('gFb2');
  const f=(x,y)=>2.2*Math.exp(-((x-0.3)*(x-0.3)/0.03+(y-0.65)*(y-0.65)/0.08))+1.8*Math.exp(-((x-0.72)*(x-0.72)/0.05+(y-0.25)*(y-0.25)/0.02))+0.3*(1+x*y);
  const n=400,G=new Float64Array(n*n),IX=new Float64Array(n),IY=new Float64Array(n);let vmax=0,tot=0;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const v=f((i+0.5)/n,(j+0.5)/n);G[i*n+j]=v;IX[i]+=v/n;IY[j]+=v/n;if(v>vmax)vmax=v;}
  const cX=new Float64Array(n+1),cY=new Float64Array(n+1);for(let i=0;i<n;i++){cX[i+1]=cX[i]+IX[i]/n;cY[i+1]=cY[i]+IY[i]/n;}tot=cX[n];
  const at=(A,s)=>{const u=Math.min(n-1e-9,Math.max(0,s*n-0.5)),i=Math.min(n-2,Math.floor(u));return A[i]+(A[i+1]-A[i])*(u-i);};
  const cum=(C,s)=>{const u=s*n,i=Math.min(n-1,Math.floor(u));return C[i]+(C[i+1]-C[i])*(u-i);};
  let md=TB.segs(cv,k=>{md=k;draw();}),img=null,imgKey='',geo=null,drag=false;
  g1.mark('t',tot,'∫<i>f</i> <i>dλ</i><sub>2</sub>');g2.mark('t',tot,'∫<i>f</i> <i>dλ</i><sub>2</sub>');
  function heat(K){const key=K.paper+K.eth;if(img&&imgKey===key)return img;imgKey=key;
    return img=TB.heat(200,(i,j)=>TB.mixa(K.paper,K.eth,Math.pow(G[(2*i)*n+2*j]/vmax,0.85)*0.92));}
  function draw(){
    const sv=+sl.value;so.textContent=TB.fmt(sv,3).replace(/0$/,'');
    const F=TB.fit(cv,W=>Math.max(250,Math.min(460,Math.round(W*0.56)))),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?24:34,R=W-(sm?8:14),top=sm?22:26,B=H-(sm?24:28);
    const S=Math.min(B-top,(R-L)*0.5),HX0=L,HY0=B-S,gap=sm?30:46,RX=L+S+gap,RW=R-RX;
    const hx=x=>HX0+x*S,hy=y=>B-y*S;
    c.imageSmoothingEnabled=true;c.drawImage(heat(K),HX0,HY0,S,S);
    c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(HX0,HY0,S,S);
    c.beginPath();for(const v of [0,0.5,1]){c.moveTo(hx(v),B);c.lineTo(hx(v),B+4);c.moveTo(HX0-4,hy(v));c.lineTo(HX0,hy(v));}c.stroke();
    c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='center';for(const v of [0,0.5,1])c.fillText(TB.tickLabel(v),hx(v),B+s+5);
    c.textAlign='right';for(const v of [0.5,1])c.fillText(TB.tickLabel(v),HX0-6,hy(v)+s*0.35);c.textAlign='start';
    TB.rich(c,[['x','i']],hx(1)+5,B-4,s,K.muted);TB.rich(c,[['y','i']],HX0+4,HY0-7,s,K.muted);
    // the section line
    c.strokeStyle=K.warm;c.lineWidth=2.6;c.beginPath();
    if(md==='X'){c.moveTo(hx(sv),HY0);c.lineTo(hx(sv),B);}else{c.moveTo(HX0,hy(sv));c.lineTo(HX0+S,hy(sv));}c.stroke();
    c.fillStyle=K.warm;c.beginPath();if(md==='X')c.arc(hx(sv),HY0,5,0,7);else c.arc(HX0+S,hy(sv),5,0,7);c.fill();
    geo={HX0:HX0,HY0:HY0,S:S};
    // right top: the section and the area under it
    const pg=sm?22:30,T1=top+s+4,B1=top+(B-top)/2-pg/2,T2=B1+pg+s+4,B2=B;
    const ux=t=>RX+t*RW,uy1=v=>B1-v/2.8*(B1-T1),uy2=v=>B2-v/1.6*(B2-T2);
    const sec=t=>md==='X'?f(sv,t):f(t,sv);
    c.fillStyle=TB.rgba(K.warm,0.3);c.beginPath();c.moveTo(ux(0),B1);for(let i=0;i<=200;i++){const t=i/200;c.lineTo(ux(t),uy1(sec(t)));}c.lineTo(ux(1),B1);c.closePath();c.fill();
    c.strokeStyle=K.warm;c.lineWidth=2;c.beginPath();for(let i=0;i<=200;i++){const t=i/200;i?c.lineTo(ux(t),uy1(sec(t))):c.moveTo(ux(t),uy1(sec(t)));}c.stroke();
    // right bottom: the inner integral as a function of the section
    const IA=md==='X'?IX:IY,CA=md==='X'?cX:cY,Iv=t=>at(IA,t);
    c.fillStyle=TB.rgba(K.eth,0.35);c.beginPath();c.moveTo(ux(0),B2);for(let i=0;i<=200;i++){const t=sv*i/200;c.lineTo(ux(t),uy2(Iv(t)));}c.lineTo(ux(sv),B2);c.closePath();c.fill();
    c.strokeStyle=K.eth;c.lineWidth=2;c.beginPath();for(let i=0;i<=200;i++){const t=i/200;i?c.lineTo(ux(t),uy2(Iv(t))):c.moveTo(ux(t),uy2(Iv(t)));}c.stroke();
    c.fillStyle=K.warm;c.beginPath();c.arc(ux(sv),uy2(Iv(sv)),4,0,7);c.fill();
    c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();c.moveTo(RX,T1);c.lineTo(RX,B1);c.lineTo(R,B1);c.moveTo(RX,T2);c.lineTo(RX,B2);c.lineTo(R,B2);
    for(const v of [0,0.5,1]){c.moveTo(ux(v),B1);c.lineTo(ux(v),B1+4);c.moveTo(ux(v),B2);c.lineTo(ux(v),B2+4);}
    for(const v of [1,2]){c.moveTo(RX-4,uy1(v));c.lineTo(RX,uy1(v));}c.moveTo(RX-4,uy2(1));c.lineTo(RX,uy2(1));c.stroke();
    c.fillStyle=K.muted;c.textAlign='right';for(const v of [1,2])c.fillText(String(v),RX-6,uy1(v)+s*0.35);c.fillText('1',RX-6,uy2(1)+s*0.35);
    c.textAlign='center';for(const v of [0,1])c.fillText(TB.tickLabel(v),ux(v),B1+s+3);for(const v of [0,1])c.fillText(TB.tickLabel(v),ux(v),B2+s+5);c.textAlign='start';
    const inn=md==='X'?'y':'x',out=md==='X'?'x':'y';
    TB.rich(c,md==='X'?[['f','i'],['(','m'],['s','i'],[', ','m'],['y','i'],[')','m']]:[['f','i'],['(','m'],['x','i'],[', ','m'],['s','i'],[')','m']],RX+6,T1-4,s,K.warm);
    TB.rich(c,[[inn,'i']],R-2,B1-5,s,K.muted,'right');
    TB.rich(c,[['I','i'],['(','m'],['s','i'],[')','m']],RX+6,T2-4,s,K.eth);
    TB.rich(c,[[out,'i']],R-2,B2-5,s,K.muted,'right');
    // readouts
    const v1=cum(cX,sv),v2=cum(cY,sv);g1.set(v1);g2.set(v2);
    const sI=md==='X'?'∫<sub>0</sub><sup>1</sup> <i>f</i>(<i>s</i>, <i>y</i>) <i>dy</i>':'∫<sub>0</sub><sup>1</sup> <i>f</i>(<i>x</i>, <i>s</i>) <i>dx</i>';
    fx.innerHTML=TB.rows([['<i>I</i>(<i>s</i>) = '+sI+' = '+TB.fmt(Iv(sv),3)+','],
      ['∫<sub>0</sub><sup><i>s</i></sup> <i>I</i>('+'<i>'+out+'</i>) <i>d'+out+'</i> = '+TB.fmt(md==='X'?v1:v2,3)+',','∫ <i>f</i> <i>dλ</i><sub>2</sub> = '+TB.fmt(tot,3)]]);
  }
  function pick(e){if(!geo)return;const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
    let t=md==='X'?(px-geo.HX0)/geo.S:(geo.HY0+geo.S-py)/geo.S;t=Math.max(0,Math.min(1,Math.round(t*200)/200));sl.value=t;draw();}
  const inside=e=>{if(!geo)return false;const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
    return px>=geo.HX0-8&&px<=geo.HX0+geo.S+8&&py>=geo.HY0-8&&py<=geo.HY0+geo.S+8;};
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{if(!inside(e))return;drag=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}pick(e);});
  cv.addEventListener('pointermove',e=>{if(drag)pick(e);else cv.style.cursor=inside(e)?(md==='X'?'ew-resize':'ns-resize'):'';});
  ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>{drag=false;}));
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
