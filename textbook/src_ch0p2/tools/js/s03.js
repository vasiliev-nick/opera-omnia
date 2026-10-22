
(function(){
  /* Fig. ∅.13: the needle, mass escaping to infinity, the growing peak; the integral on a scale with +∞ at its right end. */
  const cv=document.getElementById('needle');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('ndN'),so=document.getElementById('ndNOut'),fx=document.getElementById('ndFx');
  const g=new TB.Gauge('gNd'),cmp=v=>v===Infinity?1:v/(1+v);
  let md=TB.segs(cv,k=>{md=k;draw();});
  if(g.el){const ge=g.el.querySelectorAll('.ge');ge[1].textContent='+∞';
    for(const v of [1,2,4,9]){const t=document.createElement('i');t.className='ge';t.style.left=cmp(v)*100+'%';t.textContent=String(v);g.el.insertBefore(t,g.f);
      const k=document.createElement('i');k.style.cssText='left:'+cmp(v)*100+'%;top:18px;height:11px;width:0;border-left:1px solid var(--muted);opacity:.7';g.el.insertBefore(k,g.f);}}
  const sub=(a,b)=>a+'<sub>'+b+'</sub>',one='<b>1</b>',fi=sub('<i>f</i>','<i>n</i>'),dl=' <i>dλ</i><sub>1</sub>';
  function draw(){
    const n=+sl.value;so.textContent=n;
    const F=TB.fit(cv,W=>Math.max(250,Math.min(350,Math.round(W*0.46)))),c=F.c,W=F.W,H=F.H;
    const ink=TB.tok('--ink'),muted=TB.tok('--muted'),rule=TB.tok('--rule'),eth=TB.tok('--ether'),warm=TB.tok('--warm');
    c.fillStyle=TB.tok('--paper');c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?30:40,R=W-(sm?8:14);
    const fN=[['f','i'],[String(n),'s']];
    const T=TB.legend(c,[{k:'fill',col:warm,a:0.32,t:fN},{k:'dash',col:eth,t:md==='P'?[['lim ','r'],['f','i'],['n','s'],[' = ','r'],['u','i']]:[['lim ','r'],['f','i'],['n','s'],[' = 0','r']]}],L,R,4,s)+6;
    const B=H-(sm?26:30),PR=R-18,x1=md==='E'?22:1,y1=md==='E'?1.6:21,X=x=>L+x/x1*(PR-L),Y=y=>B-y/y1*(B-T);
    c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);
    const yt=md==='E'?[0,1]:[0,5,10,15,20],xt=md==='E'?[0,5,10,15,20]:[0,0.5,1];
    for(const v of yt){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}for(const v of xt){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}c.stroke();
    c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of yt)c.fillText(String(v),L-7,Y(v)+s*0.35);
    c.textAlign='center';for(const v of xt)c.fillText(TB.fmt(v,v%1?1:0),X(v),B+s+5);c.textAlign='start';
    TB.rich(c,[['x','i']],R-9,B-5,s,muted);
    c.save();c.beginPath();c.rect(L,T,PR-L+1,B-T+1);c.clip();
    c.beginPath();
    if(md==='N'){c.moveTo(X(0),B);c.lineTo(X(0),Y(n));c.lineTo(X(1/n),Y(n));c.lineTo(X(1/n),B);}
    else if(md==='E'){c.moveTo(X(n),B);c.lineTo(X(n),Y(1));c.lineTo(X(n+1),Y(1));c.lineTo(X(n+1),B);}
    else{c.moveTo(X(0),B);c.lineTo(X(0),Y(n));c.lineTo(X(1/n),Y(n));for(let i=1;i<=240;i++){const x=1/n+(1-1/n)*i/240;c.lineTo(X(x),Y(1/x));}c.lineTo(X(1),B);}
    c.fillStyle=TB.rgba(warm,0.32);c.fill();c.strokeStyle=warm;c.lineWidth=2.2;c.stroke();
    c.strokeStyle=eth;c.lineWidth=2.4;c.setLineDash([7,5]);c.beginPath();
    if(md==='P'){const x0=1/(y1+0.5);c.moveTo(X(x0),Y(1/x0));for(let i=1;i<=300;i++){const x=x0+(1-x0)*i/300;c.lineTo(X(x),Y(1/x));}}
    else{c.moveTo(X(0),B-1);c.lineTo(X(x1),B-1);}
    c.stroke();c.setLineDash([]);c.restore();
    if(md==='P'){const xa=X(1/y1);c.fillStyle=eth;c.beginPath();c.moveTo(xa-5,T+9);c.lineTo(xa+1,T-1);c.lineTo(xa+5,T+10);c.closePath();c.fill();}
    let v,html;
    const fH=sub('<i>f</i>',n);
    if(md==='N'){v=1;html=TB.rows([[fH+' = '+n+'·'+sub(one,'(0, '+TB.fr(1,n)+')')+',','∫'+fH+dl+' = '+n+'·'+TB.fr(1,n)+' = 1'],
      ['lim '+fi+'(<i>x</i>) = 0 при каждом <i>x</i>,','∫ lim '+fi+dl+' = 0']]);}
    else if(md==='E'){v=1;html=TB.rows([[fH+' = '+sub(one,'['+n+', '+(n+1)+')')+',','∫'+fH+dl+' = '+sub('<i>λ</i>',1)+'(['+n+', '+(n+1)+')) = 1'],
      [fi+'(<i>x</i>) = 0 при <i>n</i> &gt; <i>x</i>,','∫ lim '+fi+dl+' = 0']]);}
    else{v=1+Math.log(n);html=TB.rows([[fH+' = min('+n+', <i>u</i>),','∫'+fH+dl+' = '+n+'·'+TB.fr(1,n)+' + ln '+n+' ≈ '+TB.fmt(v,3)],
      ['lim '+fi+' = <i>u</i>,','∫<i>u</i>'+dl+' = +∞']]);}
    fx.innerHTML=html;
    g.set(cmp(v));if(g.out)g.out.textContent=TB.fmt(v,3);if(g.el)g.el.setAttribute('aria-valuetext',TB.fmt(v,3));
    const lim=md==='P'?Infinity:0;g.mark('lim',cmp(lim),'∫ lim '+fi+' = '+(md==='P'?'+∞':'0'));
    if(g.m.lim)g.m.lim.firstChild.style.transform=md==='P'?'translateX(-100%)':'none';
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
