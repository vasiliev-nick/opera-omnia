
(function(){
  /* Figures inside the exercises of §∅.11 and §∅.12: drawn on the exercise background; each shows the setting of a problem, not its solution. */
  const TB=window.TB;if(!TB||!TB.fit)return;
  const K=()=>({ink:TB.tok('--ink'),muted:TB.tok('--muted'),eth:TB.tok('--ether'),warm:TB.tok('--warm'),bg:TB.tok('--warm-soft')});
  const mount=(id,h,draw)=>{const cv=document.getElementById(id);if(!cv)return null;
    const run=()=>{const F=TB.fit(cv,h),c=F.c;c.clearRect(0,0,F.W,F.H);draw(c,F.W,F.H,K(),F.W<520);};
    run();TB.onTheme(run);TB.onResize(cv,run);return run;};
  const listen=(ids,run)=>{if(run)ids.forEach(i=>{const e=document.getElementById(i);if(e)e.addEventListener('input',run);});};
  /* slider value; its output shows the value with d decimals */
  const val=(id,d)=>{const e=document.getElementById(id),o=document.getElementById(id+'Out'),v=+e.value;if(o)o.textContent=d?TB.fmt(v,d):String(v);return v;};
  function axes(c,k,s,L,R,T,B,X,Y,xt,yt){
    c.strokeStyle=TB.rgba(k.muted,0.6);c.lineWidth=1;c.setLineDash([]);c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);
    for(const v of yt){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}for(const v of xt){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}c.stroke();
    c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of yt)c.fillText(TB.fmt(v,v%1?1:0),L-7,Y(v)+s*0.35);
    c.textAlign='center';for(const v of xt)c.fillText(TB.fmt(v,v%1?1:0),X(v),B+s+5);c.textAlign='start';}
  const curve=(c,X,Y,a,b,f,N)=>{c.beginPath();for(let i=0;i<=N;i++){const x=a+(b-a)*i/N;i?c.lineTo(X(x),Y(f(x))):c.moveTo(X(x),Y(f(x)));}};

  /* Exercise ∅.5(b): f_n = 2d_n and, row by row, the sets {d_k = 1}; a draggable point x. */
  (function(){
    const cv=document.getElementById('exDig'),fx=document.getElementById('exDigFx');if(!cv)return;
    let px=0.71,geo=null;
    const d=(k,x)=>Math.floor(Math.pow(2,k)*x)-2*Math.floor(Math.pow(2,k-1)*x);
    const run=mount('exDig',W=>W<520?306:332,(c,W,H,k,sm)=>{
      const n=val('exDigN',0),s=sm?12:14,L=sm?40:52,R=W-(sm?10:16),X=x=>L+x*(R-L);
      const T0=s+20,B0=T0+(sm?64:76),Y=y=>B0-y/2*(B0-T0),rh=sm?25:28,r0=B0+(sm?24:28),bot=r0+6*rh-4,q=1<<n;
      geo={L:L,R:R};
      c.strokeStyle=TB.rgba(k.muted,0.6);c.lineWidth=1;c.beginPath();c.moveTo(L,T0-6);c.lineTo(L,B0);c.lineTo(R,B0);for(const v of [1,2]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
      c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of [0,1,2])c.fillText(String(v),L-7,Y(v)+s*0.35);c.textAlign='start';
      c.fillStyle=TB.rgba(k.warm,0.3);for(let a=1;a<q;a+=2)c.fillRect(X(a/q),Y(2),X((a+1)/q)-X(a/q),B0-Y(2));
      c.strokeStyle=k.warm;c.lineWidth=Math.max(1,Math.min(2,(R-L)/q/4));c.beginPath();
      for(let a=0;a<q;a++){if(a%2){c.moveTo(X(a/q),B0);c.lineTo(X(a/q),Y(2));c.lineTo(X((a+1)/q),Y(2));c.lineTo(X((a+1)/q),B0);}else{c.moveTo(X(a/q),B0-1);c.lineTo(X((a+1)/q),B0-1);}}
      c.stroke();
      TB.rich(c,[['f','i'],[String(n),'s'],[' = 2','m'],['d','i'],[String(n),'s']],R,T0-9,s,k.warm,'right');
      for(let r=1;r<=6;r++){const y=r0+(r-1)*rh,h=rh-10,cur=r===n,qq=1<<r;
        c.fillStyle=cur?TB.rgba(k.warm,0.6):TB.rgba(k.eth,0.38);for(let a=1;a<qq;a+=2)c.fillRect(X(a/qq),y,X((a+1)/qq)-X(a/qq),h);
        c.strokeStyle=cur?k.warm:TB.rgba(k.muted,0.55);c.lineWidth=cur?1.6:1;c.strokeRect(L+0.5,y+0.5,R-L-1,h-1);
        TB.rich(c,[['d','i'],[String(r),'s']],L-9,y+h/2+s*0.3,s,cur?k.warm:k.ink,'right');}
      c.strokeStyle=TB.rgba(k.muted,0.6);c.lineWidth=1;c.beginPath();c.moveTo(L,bot);c.lineTo(R,bot);for(const v of [0,0.25,0.5,0.75,1]){c.moveTo(X(v),bot);c.lineTo(X(v),bot+4);}c.stroke();
      c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='center';['0','1/4','1/2','3/4','1'].forEach((t,i)=>c.fillText(t,X(i/4),bot+s+12));c.textAlign='start';
      const xp=X(px);c.strokeStyle=TB.rgba(k.ink,0.85);c.lineWidth=1.4;c.beginPath();c.moveTo(xp,T0-6);c.lineTo(xp,bot);c.stroke();
      c.fillStyle=k.ink;c.beginPath();c.moveTo(xp,bot);c.lineTo(xp-6,bot+9);c.lineTo(xp+6,bot+9);c.closePath();c.fill();
      const xl=TB.richW(c,[['x','i']],s);TB.rich(c,[['x','i']],xp+(xp+14+xl<R?6:-6-xl),(B0+r0)/2+s*0.35,s,k.ink);
      const ds=[];for(let r=1;r<=6;r++){const v=d(r,px);ds.push(r===n?'<b>'+v+'</b>':String(v));}
      fx.innerHTML=TB.rows([['<i>x</i> = '+TB.fmt(px,3)+':','<i>d</i><sub>1</sub>(<i>x</i>), …, <i>d</i><sub>6</sub>(<i>x</i>) = '+ds.join(', ')],
        ['<i>f</i><sub>'+n+'</sub>(<i>x</i>) = 2<i>d</i><sub>'+n+'</sub>(<i>x</i>) = '+2*d(n,px)]]);});
    function setFrom(e){if(!geo)return;const b=cv.getBoundingClientRect();
      px=Math.min(0.999,Math.max(0,Math.round((e.clientX-b.left-geo.L)/(geo.R-geo.L)*1000)/1000));run();}
    let down=false;
    cv.addEventListener('pointerdown',e=>{down=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}setFrom(e);});
    cv.addEventListener('pointermove',e=>{if(down)setFrom(e);});
    cv.addEventListener('pointerup',()=>{down=false;});cv.addEventListener('pointercancel',()=>{down=false;});
    cv.style.touchAction='pan-y';cv.style.cursor='ew-resize';listen(['exDigN'],run);
  })();

  /* Exercise ∅.6: |∂θ f(x,θ)| for the Gaussian, the bound at θ0 and the upper envelope x²/2 over all θ > 0. */
  (function(){
    const fx=document.getElementById('exGauFx');
    const run=mount('exGau',W=>W<520?270:290,(c,W,H,k,sm)=>{
      const t0=val('exGauT0',2),t=val('exGauT',2),s=sm?12:14,L=sm?32:42,R=W-(sm?8:14),PR=R-14;
      const T=TB.legend(c,[{k:'line',col:k.warm,t:[['|∂','m'],['θ','s'],[' f','i'],['(','m'],['x','i'],[', ','m'],['θ','i'],[')|','m']]},
        {k:'fill',col:k.eth,a:0.3,t:[['g','i'],['(','m'],['x','i'],[')','m']]},{k:'dash',col:k.muted,t:[['x','i'],['²/2','m']]}],L,R,4,s)+8;
      const B=H-(sm?26:30),X=x=>L+(x+6)/12*(PR-L),Y=y=>B-y/1.6*(B-T),N=Math.max(240,Math.round(PR-L));
      const g=x=>x*x/2*Math.exp(-t0*x*x/2),h=x=>x*x/2*Math.exp(-t*x*x/2);
      axes(c,k,s,L,R,T,B,X,Y,sm?[-6,-3,0,3,6]:[-6,-4,-2,0,2,4,6],[0,0.5,1,1.5]);
      TB.rich(c,[['x','i']],R-9,B-5,s,k.muted);
      c.save();c.beginPath();c.rect(L+1,T,PR-L,B-T);c.clip();
      curve(c,X,Y,-6,6,g,N);c.lineTo(X(6),B);c.lineTo(X(-6),B);c.closePath();c.fillStyle=TB.rgba(k.eth,0.3);c.fill();
      if(t<t0-1e-9){curve(c,X,Y,-6,6,h,N);for(let i=N;i>=0;i--){const x=-6+12*i/N;c.lineTo(X(x),Y(g(x)));}c.closePath();c.fillStyle=TB.rgba(k.warm,0.32);c.fill();}
      curve(c,X,Y,-6,6,g,N);c.strokeStyle=k.eth;c.lineWidth=1.6;c.stroke();
      curve(c,X,Y,-6,6,x=>x*x/2,N);c.strokeStyle=k.muted;c.lineWidth=1.4;c.setLineDash([6,5]);c.stroke();c.setLineDash([]);
      curve(c,X,Y,-6,6,h,N);c.strokeStyle=k.warm;c.lineWidth=2.4;c.stroke();
      c.restore();
      const th='<i>θ</i>',t0h='<i>θ</i><sub>0</sub>',df='|∂<sub><i>θ</i></sub><i>f</i>(<i>x</i>, <i>θ</i>)|';
      fx.innerHTML=TB.rows(t>=t0-1e-9?[[th+' = '+TB.fmt(t,2)+' ≥ '+t0h+' = '+TB.fmt(t0,2)+':',df+' ≤ <i>g</i>(<i>x</i>) при всех <i>x</i>']]
        :[[th+' = '+TB.fmt(t,2)+' &lt; '+t0h+' = '+TB.fmt(t0,2)+':',df+' &gt; <i>g</i>(<i>x</i>) при всех <i>x</i> ≠ 0']]);});
    listen(['exGauT0','exGauT'],run);
  })();

  /* Exercise ∅.7: the integrand θe^{−θx} on (0,12]; the part over (0,R] is shaded darker. */
  (function(){
    const run=mount('exExp',W=>W<520?236:256,(c,W,H,k,sm)=>{
      const t=val('exExpT',2),s=sm?12:14,L=sm?32:42,R=W-(sm?8:14),PR=R-14,Rr=4,x1=12;
      const T=TB.legend(c,[{k:'line',col:k.warm,t:[['θ','i'],['e','i'],['−θx','p']]},{k:'fill',col:k.eth,a:0.36,t:[['над (0, ','r'],['R','i'],[']','r']]},
        {k:'fill',col:k.eth,a:0.13,t:[['над (','r'],['R','i'],[', 12]','r']]}],L,R,4,s)+8;
      const B=H-(sm?26:30),X=x=>L+x/x1*(PR-L),Y=y=>B-y/2.1*(B-T),N=Math.max(240,Math.round(PR-L)),f=x=>t*Math.exp(-t*x);
      axes(c,k,s,L,R,T,B,X,Y,sm?[0,4,8,12]:[0,2,4,6,8,10,12],[0,1,2]);
      TB.rich(c,[['x','i']],R-9,B-5,s,k.muted);
      const area=(a,b,al)=>{const n=Math.max(40,Math.round(N*(b-a)/x1));curve(c,X,Y,a,b,f,n);c.lineTo(X(b),B);c.lineTo(X(a),B);c.closePath();c.fillStyle=TB.rgba(k.eth,al);c.fill();};
      area(0,Rr,0.36);area(Rr,x1,0.13);
      c.strokeStyle=TB.rgba(k.ink,0.7);c.lineWidth=1.2;c.setLineDash([4,4]);c.beginPath();c.moveTo(X(Rr),B);c.lineTo(X(Rr),T+4);c.stroke();c.setLineDash([]);
      TB.rich(c,[['R','i'],[' = 4','m']],X(Rr)+6,T+s+2,s,k.ink);
      curve(c,X,Y,0,x1,f,N);c.strokeStyle=k.warm;c.lineWidth=2.4;c.stroke();});
    listen(['exExpT'],run);
  })();

  /* Exercise ∅.9: the definition of convergence in measure; f_n − f, the band |y| ≤ ε and the set where the band is left. */
  (function(){
    const g=new TB.Gauge('gExMeas');
    const h=(n,x)=>{const w=0.3/n,tri=Math.max(0,1-Math.abs(x-0.62)/w);return 2*tri+Math.sin(5*Math.PI*x+0.4)/(1+0.3*(n-1));};
    const run=mount('exMeas',W=>W<520?300:310,(c,W,H,k,sm)=>{
      const n=val('exMeasN',0),e=val('exMeasE',2),s=sm?12:14,L=sm?32:42,R=W-(sm?8:14),PR=R-14;
      const T=TB.legend(c,[{k:'line',col:k.warm,t:[['f','i'],['n','s'],[' − ','m'],['f','i']]},{k:'fill',col:k.eth,a:0.24,t:[['|','m'],['y','i'],['| ≤ ','m'],['ε','i']]},
        {k:'fill',col:k.warm,a:0.85,t:[['{|','m'],['f','i'],['n','s'],[' − ','m'],['f','i'],['| > ','m'],['ε','i'],['}','m']]}],L,R,4,s)+8;
      const B=H-(sm?54:58),yS=B+12,X=x=>L+x*(PR-L),Y=y=>T+(2.5-y)/3.8*(B-T),N=Math.max(400,Math.round((PR-L)*2));
      c.strokeStyle=TB.rgba(k.muted,0.6);c.lineWidth=1;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);for(const v of [-1,0,1,2]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
      c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of [-1,0,1,2])c.fillText(TB.fmt(v,0),L-7,Y(v)+s*0.35);c.textAlign='start';
      c.fillStyle=TB.rgba(k.eth,0.24);c.fillRect(L+1,Y(e),PR-L,Y(-e)-Y(e));
      c.strokeStyle=TB.rgba(k.eth,0.7);c.lineWidth=1;c.beginPath();c.moveTo(L,Y(e));c.lineTo(PR,Y(e));c.moveTo(L,Y(-e));c.lineTo(PR,Y(-e));c.stroke();
      c.strokeStyle=TB.rgba(k.muted,0.6);c.beginPath();c.moveTo(L,Y(0));c.lineTo(R,Y(0));c.stroke();
      c.save();c.beginPath();c.rect(L+1,T,PR-L,B-T);c.clip();
      curve(c,X,Y,0,1,x=>h(n,x),N);c.strokeStyle=k.warm;c.lineWidth=2.4;c.stroke();c.restore();
      c.strokeStyle=TB.rgba(k.muted,0.6);c.lineWidth=1;c.beginPath();c.moveTo(L,yS);c.lineTo(PR,yS);for(const v of [0,0.5,1]){c.moveTo(X(v),yS);c.lineTo(X(v),yS+4);}c.stroke();
      const M=4000;let cnt=0,run0=-1;c.fillStyle=TB.rgba(k.warm,0.85);
      for(let i=0;i<=M;i++){const x=(i+0.5)/M,out=i<M&&Math.abs(h(n,x))>e;if(out)cnt++;
        if(out&&run0<0)run0=i;if(!out&&run0>=0){c.fillRect(X(run0/M),yS-6,Math.max(1.5,X(i/M)-X(run0/M)),6);run0=-1;}}
      c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='center';for(const v of [0,0.5,1])c.fillText(TB.fmt(v,v%1?1:0),X(v),yS+s+7);c.textAlign='start';
      TB.rich(c,[['x','i']],R-9,yS-4,s,k.muted);
      g.set(cnt/M);});
    listen(['exMeasN','exMeasE'],run);
  })();

  /* Exercise ∅.10: the table a_sm = m^{−s}; cells shaded by size, row sums ζ(s) − 1 on the right. */
  (function(){
    const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'},sup=e=>String(e).split('').map(ch=>SUP[ch]).join('');
    const zm1=s=>{const M=2000;let v=0;for(let m=2;m<=M;m++)v+=Math.pow(m,-s);return v+1/((s-1)*Math.pow(M,s-1))-0.5*Math.pow(M,-s);};
    const ZS=[2,3,4,5,6,7,8].map(zm1);
    mount('exZeta',W=>{const q=W<520,ch=q?23:25;return 30+8*ch+4;},(c,W,H,k,sm)=>{
      const s=sm?11:13,ch=sm?23:25,Nc=sm?5:8,Lw=sm?42:56,Rw=sm?58:74,gap=sm?16:22,top=30;
      const cw=(W-Lw-Rw-gap)/Nc,x0=Lw,xr=x0+Nc*cw+gap,X=m=>x0+(m-1.5)*cw,Yr=r=>top+(r-2)*ch;
      for(let m=2;m<=Nc+1;m++)TB.rich(c,[['m','i'],[' = '+m,'r']],X(m),top-9,s-1,k.muted,'center');
      TB.rich(c,[['…','r']],x0+Nc*cw+gap/2,top-9,s,k.muted,'center');
      TB.rich(c,[['ζ','i'],['(','m'],['s','i'],[') − 1','m']],xr+Rw/2,top-9,s,k.muted,'center');
      for(let r=2;r<=8;r++){const y=Yr(r);
        TB.rich(c,[['s','i'],[' = '+r,'r']],Lw-8,y+ch/2+s*0.36,s-1,k.ink,'right');
        for(let m=2;m<=Nc+1;m++){const v=Math.pow(m,-r),a=0.06+0.6*Math.pow(v/0.25,0.45);
          c.fillStyle=TB.rgba(k.eth,a);c.fillRect(X(m)-cw/2+2,y+2,cw-4,ch-4);
          c.fillStyle=k.ink;c.font=(s+1)+'px '+TB.serif;c.textAlign='center';c.fillText(m+sup('-'+r),X(m),y+ch/2+s*0.38);}
        c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='center';c.fillText('…',x0+Nc*cw+gap/2,y+ch/2+s*0.36);
        c.fillStyle=k.ink;c.fillText(TB.fmt(ZS[r-2],3),xr+Rw/2,y+ch/2+s*0.36);}
      c.fillStyle=k.muted;c.textAlign='center';c.fillText('⋮',X(2),Yr(8)+ch+s);c.fillText('⋮',xr+Rw/2,Yr(8)+ch+s);c.textAlign='start';});
  })();

  /* Exercise ∅.11: the terms a_n^{(j)} of the binomial expansion of (1 + 1/j)^j; the scale shows their sum. */
  (function(){
    const g=new TB.Gauge('gExBin');
    let F=[1];for(let n=1;n<=10;n++)F.push(F[n-1]*n);
    const a=(j,n)=>{if(n>j)return 0;let p=1;for(let i=0;i<n;i++)p*=1-i/j;return p/F[n];};
    if(g.el)g.mark('e',Math.E,'Σ<sub><i>n</i></sub> 1/<i>n</i>!');
    const run=mount('exBin',W=>W<520?220:236,(c,W,H,k,sm)=>{
      const j=val('exBinJ',0),s=sm?12:14,L=sm?32:42,R=W-(sm?8:14),T=s+10,B=H-(sm?28:32),Nn=11,bw=(R-L)/Nn;
      const X=n=>L+(n+0.5)*bw,Y=y=>B-y/1.05*(B-T);
      c.strokeStyle=TB.rgba(k.muted,0.6);c.lineWidth=1;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);for(const v of [0.5,1]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
      c.fillStyle=k.muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of [0,0.5,1])c.fillText(TB.fmt(v,v%1?1:0),L-7,Y(v)+s*0.35);
      c.textAlign='center';for(let n=0;n<Nn;n++)c.fillText(String(n),X(n),B+s+6);c.textAlign='start';
      for(let n=0;n<Nn;n++){const v=a(j,n);if(v<=0)continue;const x=X(n)-bw*0.32,w=bw*0.64,y=Y(v);
        c.fillStyle=TB.rgba(k.eth,0.42);c.fillRect(x,y,w,B-y);c.strokeStyle=k.eth;c.lineWidth=1.4;c.strokeRect(x+0.5,y+0.5,w-1,B-y-1);}
      g.set(Math.pow(1+1/j,j));});
    listen(['exBinJ'],run);
  })();
})();
