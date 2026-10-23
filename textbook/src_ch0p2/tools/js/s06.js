
(function(){
  /* Fig. ∅.16: dominated convergence that is not uniform; the needle and its envelope without a finite integral. */
  const cv=document.getElementById('dct');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('dcN'),so=document.getElementById('dcNOut'),se=document.getElementById('dcE'),seo=document.getElementById('dcEOut'),seL=document.getElementById('dcEL');
  const r1=document.getElementById('rowDc1'),r2=document.getElementById('rowDc2'),r3=document.getElementById('rowDc3');
  const g1=new TB.Gauge('gDc1'),g2=new TB.Gauge('gDc2'),g3=new TB.Gauge('gDc3');
  let md=TB.segs(cv,k=>{md=k;draw();});
  const bump=(x,c,wl,wr)=>{const w=x<c?wl:wr;return Math.exp(-(x-c)*(x-c)/(2*w*w));};
  const g=x=>0.5+0.55*bump(x,0.30,0.16,0.26)+0.28*bump(x,0.84,0.05,0.07),f=x=>0.6*g(x)*Math.sin(2.3*Math.PI*(x-0.08));
  const phi=t=>t*Math.exp(1-t)*Math.sin(5*Math.PI*t/4),fn=(n,x)=>f(x)+(g(x)-Math.abs(f(x)))*phi(n*x);
  const epsOf=()=>0.5*Math.pow(10,-(+se.value)),efmt=e=>e.toPrecision(2).replace('.',',');
  function axes(c,L,R,T,B,X,Y,yt,s,muted,rule){
    c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);
    for(const v of yt){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}c.stroke();
    c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of yt)c.fillText(TB.fmt(v,v%1?1:0),L-7,Y(v)+s*0.35);c.textAlign='start';}
  function draw(){
    const n=+sl.value;so.textContent=n;const e=epsOf();seo.textContent=efmt(e);
    seL.hidden=md!=='S';r1.hidden=md==='S';r2.hidden=md==='S';r3.hidden=md!=='S';
    const F=TB.fit(cv,W=>Math.max(270,Math.min(360,Math.round(W*0.47)))),c=F.c,W=F.W,H=F.H;
    const ink=TB.tok('--ink'),muted=TB.tok('--muted'),rule=TB.tok('--rule'),eth=TB.tok('--ether'),warm=TB.tok('--warm');
    c.fillStyle=TB.tok('--paper');c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?30:40,R=W-(sm?8:14),PR=R-18,B=H-(sm?26:30),fN=[['f','i'],[String(n),'s']];
    const xaxis=(X,ticks)=>{c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,B);c.lineTo(R,B);for(const v of ticks){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}c.stroke();
      c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='center';for(const v of ticks)c.fillText(TB.fmt(v,v%1?1:0),X(v),B+s+5);c.textAlign='start';TB.rich(c,[['x','i']],R-9,B-5,s,muted);};
    if(md==='M'){
      const T=TB.legend(c,[{k:'fill',col:eth,a:0.16,t:[['|','m'],['y','i'],['| ≤ ','m'],['g','i'],['(','m'],['x','i'],[')','m']]},{k:'dash',col:ink,t:[['f','i']]},
        {k:'line',col:warm,t:fN},{k:'fill',col:warm,a:0.34,t:[['|','m'],['f','i'],[String(n),'s'],[' − ','m'],['f','i'],['|','m']]}],L,R,4,s)+6;
      const X=x=>L+x*(PR-L),Y=y=>(T+B)/2-y/1.2*(B-T)/2;
      axes(c,L,R,T,B,X,Y,[-1,0,1],s,muted,rule);
      const N=Math.max(300,Math.round((R-L)*1.5)),xs=[];for(let i=0;i<=N;i++)xs.push(i/N);
      c.beginPath();xs.forEach((x,i)=>{i?c.lineTo(X(x),Y(g(x))):c.moveTo(X(x),Y(g(x)));});for(let i=N;i>=0;i--)c.lineTo(X(xs[i]),Y(-g(xs[i])));c.closePath();
      c.fillStyle=TB.rgba(eth,0.16);c.fill();c.strokeStyle=TB.rgba(eth,0.75);c.lineWidth=1.2;c.stroke();
      c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,Y(0));c.lineTo(PR,Y(0));c.stroke();xaxis(X,[0,0.5,1]);
      c.beginPath();xs.forEach((x,i)=>{i?c.lineTo(X(x),Y(fn(n,x))):c.moveTo(X(x),Y(fn(n,x)));});for(let i=N;i>=0;i--)c.lineTo(X(xs[i]),Y(f(xs[i])));c.closePath();
      c.fillStyle=TB.rgba(warm,0.34);c.fill();
      c.strokeStyle=ink;c.lineWidth=1.6;c.setLineDash([6,5]);c.beginPath();xs.forEach((x,i)=>{i?c.lineTo(X(x),Y(f(x))):c.moveTo(X(x),Y(f(x)));});c.stroke();c.setLineDash([]);
      c.strokeStyle=warm;c.lineWidth=2.4;c.beginPath();xs.forEach((x,i)=>{i?c.lineTo(X(x),Y(fn(n,x))):c.moveTo(X(x),Y(fn(n,x)));});c.stroke();
      let a=0,m=0;const K=4000;for(let i=0;i<K;i++){const d=Math.abs(fn(n,(i+0.5)/K)-f((i+0.5)/K));a+=d/K;if(d>m)m=d;}
      g1.set(a);g2.set(m);
    }else{
      const T=TB.legend(c,[{k:'fill',col:eth,a:0.12,t:[['S','i'],[' = sup','r'],['k','s'],[' f','i'],['k','s']]},{k:'fill',col:eth,a:0.4,t:[['S','i'],[' на [','r'],['ε','i'],[', 1]','r']]},
        {k:'line',col:warm,t:fN}],L,R,4,s)+6;
      const y1=21,X=x=>L+x*(PR-L),Y=y=>B-y/y1*(B-T);
      axes(c,L,R,T,B,X,Y,[0,5,10,15,20],s,muted,rule);
      c.save();c.beginPath();c.rect(L,T,PR-L,B-T);c.clip();
      const xe=X(e);
      const top=y1+1,Sv=x=>x<=0?top:Math.min(top,Math.floor(1/x));
      const stair=(a,b)=>{c.beginPath();c.moveTo(X(a),B);c.lineTo(X(a),Y(Sv(a)));
        for(let k=a>0?Math.min(top+1,Math.floor(1/a)):top+1;k>=2;k--){const xb=1/k;if(xb<=a)continue;if(xb>=b)break;c.lineTo(X(xb),Y(Math.min(k,top)));c.lineTo(X(xb),Y(Math.min(k-1,top)));}
        c.lineTo(X(b),Y(Sv(b-1e-9)));c.lineTo(X(b),B);c.closePath();};
      stair(0,e);c.fillStyle=TB.rgba(eth,0.12);c.fill();stair(e,1);c.fillStyle=TB.rgba(eth,0.4);c.fill();
      c.strokeStyle=TB.rgba(eth,0.85);c.lineWidth=1.2;c.beginPath();c.moveTo(X(1),B);
      for(let k=1;k<=20;k++){c.lineTo(X(1/k),Y(k));c.lineTo(X(1/(k+1)),Y(k));c.lineTo(X(1/(k+1)),Y(k+1));}c.stroke();
      c.fillStyle=TB.rgba(warm,0.34);c.fillRect(X(0),Y(n),X(1/n)-X(0),B-Y(n));
      c.strokeStyle=warm;c.lineWidth=2.2;c.beginPath();c.moveTo(X(0),B);c.lineTo(X(0),Y(n));c.lineTo(X(1/n),Y(n));c.lineTo(X(1/n),B);c.stroke();
      c.restore();
      xaxis(X,xe-L>22?[0,0.5,1]:[0.5,1]);
      c.strokeStyle=ink;c.lineWidth=1.5;c.beginPath();c.moveTo(xe,B-6);c.lineTo(xe,B+6);c.stroke();
      TB.rich(c,[['ε','i']],Math.max(L+4,xe),B+s+6,s,ink,'center');
      const K=Math.floor(1/e);let h=0;for(let k=1;k<=K;k++)h+=1/k;
      g3.mark('ln',Math.log(1/e),'ln(1/<i>ε</i>)').set(h-K*e);
    }
  }
  [sl,se].forEach(x=>x.addEventListener('input',draw));draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
