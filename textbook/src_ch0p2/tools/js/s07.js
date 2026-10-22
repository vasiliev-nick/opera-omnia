
(function(){
  /* Fig. ∅.18: a double series as functions on ℕ; rows, partial sums S_K and column sums. */
  const cv=document.getElementById('dseries');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('dsK'),so=document.getElementById('dsKOut'),fx=document.getElementById('dsFx'),g=new TB.Gauge('gDs');
  let md=TB.segs(cv,k=>{md=k;draw();});
  const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  const pow2=e=>'2'+String(e).split('').map(ch=>SUP[ch]).join('');
  const a=(k,n)=>md==='A'?(n===k?1:n===k+1?-1:0):(n<=k?Math.pow(2,-k):0);
  const SK=(K,n)=>{let s=0;for(let k=1;k<=K;k++)s+=a(k,n);return s;};
  const col=n=>md==='A'?(n===1?1:0):Math.pow(2,1-n);
  const sub=(x,y)=>x+'<sub>'+y+'</sub>';
  function draw(){
    const K=+sl.value;so.textContent=K;
    const F=TB.fit(cv,W=>W<520?372:400),c=F.c,W=F.W,H=F.H;
    const ink=TB.tok('--ink'),muted=TB.tok('--muted'),rule=TB.tok('--rule'),eth=TB.tok('--ether'),warm=TB.tok('--warm');
    c.fillStyle=TB.tok('--paper');c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?11:13,Lw=sm?50:64,Rw=sm?48:66,Nc=sm?6:10,R=10;
    const cw=(W-Lw-Rw-(sm?16:22))/Nc,ch=sm?21:22,top=24,x0=Lw,xr=x0+Nc*cw+(sm?16:22);
    const X=n=>x0+(n-0.5)*cw,Yr=k=>top+(k-1)*ch;
    /* header */
    c.font=s+'px '+TB.ui;c.fillStyle=muted;c.textAlign='center';
    for(let n=1;n<=Nc;n++)TB.rich(c,[['n','i'],[' = '+n,'r']],X(n),top-8,s-1,muted,'center');
    TB.rich(c,[['…','r']],x0+Nc*cw+(sm?8:11),top-8,s,muted,'center');
    TB.rich(c,[['Σ','r'],['n','s']],xr+Rw/2,top-8,s,muted,'center');
    /* highlighted rows */
    c.fillStyle=TB.rgba(eth,0.10);c.fillRect(2,Yr(1),xr+Rw-4,K*ch);
    c.strokeStyle=TB.rgba(eth,0.55);c.lineWidth=1;c.strokeRect(2.5,Yr(1)+0.5,xr+Rw-5,K*ch-1);
    const cell=(v,x,y,txt)=>{if(v!==0){c.fillStyle=TB.rgba(v>0?warm:eth,v>0?0.16+0.3*Math.min(1,Math.abs(v)):0.30);c.fillRect(x-cw/2+2,y+2,cw-4,ch-4);}
      c.fillStyle=v===0?TB.rgba(muted,0.6):ink;c.font=(v===0?s:s+1)+'px '+(v===0?TB.ui:TB.serif);c.textAlign='center';c.fillText(txt,x,y+ch/2+s*0.36);};
    for(let k=1;k<=R;k++){
      TB.rich(c,[['k','i'],[' = '+k,'r']],Lw-8,Yr(k)+ch/2+s*0.36,s-1,k<=K?ink:muted,'right');
      for(let n=1;n<=Nc;n++){const v=a(k,n);cell(v,X(n),Yr(k),v===0?'·':md==='A'?(v>0?'1':'−1'):pow2(-k));}
      c.fillStyle=muted;c.font=s+'px '+TB.ui;c.textAlign='center';c.fillText('…',x0+Nc*cw+(sm?8:11),Yr(k)+ch/2+s*0.36);
      const rs=md==='A'?0:k*Math.pow(2,-k);c.fillStyle=ink;c.font=s+'px '+TB.ui;c.fillText(TB.fmt(rs,md==='A'?0:3),xr+Rw/2,Yr(k)+ch/2+s*0.36);}
    c.fillStyle=muted;c.textAlign='center';c.fillText('⋮',X(1),Yr(R)+ch+s);c.fillText('⋮',xr+Rw/2,Yr(R)+ch+s);
    /* partial sums and column sums */
    const y1=Yr(R)+ch+s+14,y2=y1+ch+8,dg=sm?2:3;
    c.strokeStyle=rule;c.beginPath();c.moveTo(4,y1-4);c.lineTo(W-4,y1-4);c.stroke();
    TB.rich(c,[['S','i'],['K','s'],['(','r'],['n','i'],[')','r']],Lw-8,y1+ch/2+s*0.36,s,ink,'right');
    TB.rich(c,[['Σ','r'],['k','s'],[' a','i'],['kn','s']],Lw-8,y2+ch/2+s*0.36,s,ink,'right');
    for(let n=1;n<=Nc;n++){const v=SK(K,n),w=col(n);
      cell(Math.abs(v)<1e-12?0:v,X(n),y1,Math.abs(v)<1e-12?'0':md==='A'?(v>0?'1':'−1'):TB.fmt(v,dg));
      cell(w,X(n),y2,md==='A'?String(w):TB.fmt(w,dg));}
    const out=md==='A'&&K+1>Nc;
    c.font=s+'px '+TB.ui;c.textAlign='center';c.fillStyle=out?eth:muted;c.fillText(out?'−1 →':'…',x0+Nc*cw+(sm?8:11)+(out?(sm?6:4):0),y1+ch/2+s*0.36);
    c.fillStyle=muted;c.fillText('…',x0+Nc*cw+(sm?8:11),y2+ch/2+s*0.36);
    /* readout */
    const I=md==='A'?0:2-(K+2)*Math.pow(2,-K),Il=md==='A'?1:2;
    g.mark('l',Il,'Σ<sub><i>n</i></sub> Σ<sub><i>k</i></sub> <i>a<sub>kn</sub></i>');g.set(I);
    const SKh=sub('<i>S</i>','<i>K</i>'),dh=' <i>d</i>#';
    fx.innerHTML=md==='A'
      ?TB.rows([[SKh+' = '+sub('<b>1</b>','{1}')+' − '+sub('<b>1</b>','{'+(K+1)+'}')+',','∫'+SKh+dh+' = 1 − 1 = 0'],['lim '+SKh+' = '+sub('<b>1</b>','{1}')+',','∫ lim '+SKh+dh+' = 1']])
      :TB.rows([['∫'+SKh+dh+' = Σ<sub><i>k</i> ≤ '+K+'</sub> <i>k</i>·2<sup>−<i>k</i></sup> = 2 − '+TB.fr(K+2,'2<sup>'+K+'</sup>')+' ≈ '+TB.fmt(I,3)],['∫ lim '+SKh+dh+' = Σ<sub><i>n</i></sub> 2<sup>1−<i>n</i></sup> = 2']]);
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
