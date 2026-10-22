
(function(){
  /* Fig. ∅.14: Fatou's lemma; f_n, the next two terms, the lower envelope g_n and the lower limit. */
  const cv=document.getElementById('fatou');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('ftN'),so=document.getElementById('ftNOut'),gG=new TB.Gauge('gFg'),gI=new TB.Gauge('gFi');
  const bump=(x,c,wl,wr)=>{const w=x<c?wl:wr;return Math.exp(-(x-c)*(x-c)/(2*w*w));},base=x=>0.16+0.12*x;
  const P=[x=>base(x)+0.85*bump(x,0.20,0.06,0.15),x=>base(x)+0.62*bump(x,0.52,0.14,0.07),x=>base(x)+0.92*bump(x,0.80,0.05,0.11)],PC=[0.20,0.52,0.80];
  const f=(n,x)=>(1-0.75*Math.pow(0.8,n-1)*(1+x)/2)*P[n%3](x);
  const M=2000,I=h=>{let s=0;for(let i=0;i<M;i++)s+=h((i+0.5)/M);return s/M;};
  const IP=P.map(p=>I(p)),Imin=I(x=>Math.min(P[0](x),P[1](x),P[2](x))),liI=Math.min(...IP);
  const li='lim inf ',fn='<i>f<sub>n</sub></i>';
  gG.mark('a',Imin,'∫\u2009'+li+fn,true);gI.mark('a',Imin,'∫\u2009'+li+fn,true);gI.mark('b',liI,li+'∫\u2009'+fn);
  function draw(){
    const n=+sl.value;so.textContent=n;
    const F=TB.fit(cv,W=>Math.max(250,Math.min(340,Math.round(W*0.45)))),c=F.c,W=F.W,H=F.H;
    const ink=TB.tok('--ink'),muted=TB.tok('--muted'),rule=TB.tok('--rule'),eth=TB.tok('--ether'),warm=TB.tok('--warm');
    c.fillStyle=TB.tok('--paper');c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?30:40,R=W-(sm?8:14);
    const T=TB.legend(c,[{k:'line',col:warm,t:[['f','i'],['n','s']]},{k:'thin',col:muted,t:[['f','i'],['n+1','s'],[', ','r'],['f','i'],['n+2','s']]},
      {k:'fill',col:eth,a:0.26,t:[['g','i'],['n','s'],[' = inf','r'],['k≥n','s'],[' f','i'],['k','s']]},{k:'dash',col:eth,t:[[li,'r'],['f','i'],['n','s']]}],L,R,4,s)+8;
    const B=H-(sm?26:30),PR=R-18,X=x=>L+x*(PR-L),Y=y=>B-y/1.12*(B-T);
    c.strokeStyle=rule;c.lineWidth=1;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);
    for(const v of [0.5,1]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));}for(const v of [0,0.5,1]){c.moveTo(X(v),B);c.lineTo(X(v),B+4);}c.stroke();
    c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='right';c.fillText('0,5',L-7,Y(0.5)+s*0.35);c.fillText('1',L-7,Y(1)+s*0.35);c.fillText('0',L-7,B+s*0.35);
    c.textAlign='center';c.fillText('0,5',X(0.5),B+s+5);c.fillText('1',X(1),B+s+5);c.textAlign='start';
    TB.rich(c,[['x','i']],R-9,B-5,s,muted);
    const N=Math.max(200,Math.round(PR-L)),xs=[];for(let i=0;i<=N;i++)xs.push(i/N);
    c.beginPath();c.moveTo(X(0),B);for(const x of xs)c.lineTo(X(x),Y(Math.min(f(n,x),f(n+1,x),f(n+2,x))));c.lineTo(X(1),B);c.closePath();
    c.fillStyle=TB.rgba(eth,0.26);c.fill();
    const line=(h,col,w,dash)=>{c.strokeStyle=col;c.lineWidth=w;c.setLineDash(dash||[]);c.beginPath();xs.forEach((x,i)=>{i?c.lineTo(X(x),Y(h(x))):c.moveTo(X(x),Y(h(x)));});c.stroke();c.setLineDash([]);};
    line(x=>Math.min(P[0](x),P[1](x),P[2](x)),eth,1.8,[6,5]);
    line(x=>f(n+2,x),TB.rgba(muted,0.8),1.2);line(x=>f(n+1,x),TB.rgba(muted,0.8),1.2);
    line(x=>f(n,x),warm,2.6);
    const r=n%3;TB.rich(c,[['f','i'],[String(n),'s']],X(PC[r]),Y(f(n,PC[r]))-8,s,warm,'center');
    gG.set(I(x=>Math.min(f(n,x),f(n+1,x),f(n+2,x))));gI.set(Math.min(I(x=>f(n,x)),I(x=>f(n+1,x)),I(x=>f(n+2,x))));
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
