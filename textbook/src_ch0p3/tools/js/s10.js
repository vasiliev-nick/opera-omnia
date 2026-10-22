
(function(){
  /* Fig. ∅.26: the area under a graph collected by vertical strips or by horizontal layers; on the right, t ↦ λ{f > t} on the same t-axis. */
  const cv=document.getElementById('layer');if(!cv||!window.TB||!TB.fit)return;
  const sl=document.getElementById('lyN'),so=document.getElementById('lyNOut'),fx=document.getElementById('lyFx'),g=new TB.Gauge('gLy');
  const bump=(x,c,wl,wr)=>{const w=x<c?wl:wr;return Math.exp(-(x-c)*(x-c)/(2*w*w));};
  const f=x=>0.12+0.05*x+0.78*bump(x,0.28,0.09,0.16)+0.42*bump(x,0.76,0.07,0.05);
  const NM=4000,FV=new Float64Array(NM);let If=0;for(let i=0;i<NM;i++){FV[i]=f((i+0.5)/NM);If+=FV[i]/NM;}
  const mt=t=>{let k=0;for(let i=0;i<NM;i++)if(FV[i]>t)k++;return k/NM;};
  const MT=[];for(let i=0;i<=400;i++)MT.push(mt(i/400));
  const segsAbove=t=>{const out=[];let on=-1;for(let i=0;i<=NM;i++){const inb=i<NM&&FV[i]>t;if(inb&&on<0)on=i/NM;if(!inb&&on>=0){out.push([on,i/NM]);on=-1;}}return out;};
  let md=TB.segs(cv,k=>{md=k;draw();});
  g.mark('i',If,'∫<i>f</i> <i>dλ</i><sub>1</sub>');
  function draw(){
    const n=+sl.value;so.textContent=n;const N=Math.pow(2,n);
    const F=TB.fit(cv,W=>Math.max(260,Math.min(400,Math.round(W*0.52)))),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?30:40,R=W-(sm?8:14);
    const top=TB.legend(c,[{k:'line',col:K.ink,t:[['f','i']]},{k:'line',col:K.eth,t:[['t','i'],[' ↦ ','m'],['λ','i'],['1','s'],['({','m'],['f','i'],[' > ','m'],['t','i'],['})','m']]},
      {k:'fill',col:K.warm,a:0.4,t:[[md==='V'?'полоски':'слои','r']]}],L,R,4,s)+8;
    const B=H-(sm?24:28),XL=L+(R-L)*0.56,RX=XL+(sm?22:40),RR=R-8;
    const X=x=>L+x*(XL-L),Y=t=>B-t*(B-top),RXv=m=>RX+m*(RR-RX);
    let sum=0;
    c.fillStyle=TB.rgba(K.warm,0.4);
    if(md==='V'){c.strokeStyle=TB.rgba(K.warm,0.95);c.lineWidth=1;
      for(let k=0;k<N;k++){let mn=Infinity;const a=k/N,b=(k+1)/N;for(let i=0;i<=60;i++)mn=Math.min(mn,f(a+(b-a)*i/60));sum+=mn/N;
        c.fillRect(X(a),Y(mn),X(b)-X(a),B-Y(mn));if(N<=32)c.strokeRect(X(a),Y(mn),X(b)-X(a),B-Y(mn));}
    }else{const dt=1/N,lw=Math.max(0.8,Math.min(2,(Y(0)-Y(dt))/4));
      for(let k=0;k<N;k++){const t0=k*dt,t1=t0+dt,sg=segsAbove(t1);let len=0;
        for(const p of sg){len+=p[1]-p[0];c.fillRect(X(p[0]),Y(t1),X(p[1])-X(p[0]),Y(t0)-Y(t1));}
        sum+=dt*len;if(len>0)c.fillRect(RX,Y(t1),RXv(len)-RX,Y(t0)-Y(t1));
        c.strokeStyle=K.warm;c.lineWidth=lw;c.beginPath();for(const p of sg){c.moveTo(X(p[0]),Y(t0)+lw/2);c.lineTo(X(p[1]),Y(t0)+lw/2);}c.stroke();
        if(N<=32&&len>0){c.strokeStyle=TB.rgba(K.warm,0.95);c.lineWidth=1;c.strokeRect(RX,Y(t1),RXv(len)-RX,Y(t0)-Y(t1));}}
    }
    // axes
    c.strokeStyle=K.rule;c.lineWidth=1;c.beginPath();c.moveTo(L,top);c.lineTo(L,B);c.lineTo(XL,B);c.moveTo(RX,top);c.lineTo(RX,B);c.lineTo(R,B);
    for(const v of [0,0.5,1]){c.moveTo(L-4,Y(v));c.lineTo(L,Y(v));c.moveTo(X(v),B);c.lineTo(X(v),B+4);c.moveTo(RXv(v),B);c.lineTo(RXv(v),B+4);c.moveTo(RX-4,Y(v));c.lineTo(RX,Y(v));}c.stroke();
    c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='right';for(const v of [0,0.5,1])c.fillText(TB.tickLabel(v),L-7,Y(v)+s*0.35);
    c.textAlign='center';for(const v of [0,0.5,1]){c.fillText(TB.tickLabel(v),X(v),B+s+5);c.fillText(TB.tickLabel(v),RXv(v),B+s+5);}c.textAlign='start';
    TB.rich(c,[['x','i']],XL-10,B-6,s,K.muted);TB.rich(c,[['t','i']],L+6,top+s,s,K.muted);TB.rich(c,[['t','i']],RX-12,top+s,s,K.muted);
    // curves
    c.strokeStyle=K.ink;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=400;i++){const x=i/400;i?c.lineTo(X(x),Y(f(x))):c.moveTo(X(x),Y(f(x)));}c.stroke();
    if(md==='V'){c.fillStyle=TB.rgba(K.eth,0.16);c.beginPath();c.moveTo(RX,Y(0));for(let i=0;i<=400;i++)c.lineTo(RXv(MT[i]),Y(i/400));c.lineTo(RX,Y(1));c.closePath();c.fill();}
    c.strokeStyle=K.eth;c.lineWidth=2.2;c.beginPath();for(let i=0;i<=400;i++){i?c.lineTo(RXv(MT[i]),Y(i/400)):c.moveTo(RXv(MT[i]),Y(i/400));}c.stroke();
    // readouts
    g.set(sum);
    if(md==='V')fx.innerHTML=TB.rows([['2<sup>'+n+'</sup> = '+N+' частей,','∑ <i>λ</i><sub>1</sub>(часть) · min <i>f</i> = '+TB.fmt(sum,3)+','],['∫<sub>0</sub><sup>1</sup> <i>f</i> <i>dλ</i><sub>1</sub> = '+TB.fmt(If,3)]]);
    else fx.innerHTML=TB.rows([['Δ<i>t</i> = 2<sup>−'+n+'</sup>,','∑<sub><i>k</i></sub> Δ<i>t</i> · <i>λ</i><sub>1</sub>({<i>f</i> &gt; <i>t</i><sub><i>k</i>+1</sub>}) = '+TB.fmt(sum,3)+','],['∫<sub>0</sub><sup>∞</sup> <i>λ</i><sub>1</sub>({<i>f</i> &gt; <i>t</i>}) <i>dt</i> = ∫<sub>0</sub><sup>1</sup> <i>f</i> <i>dλ</i><sub>1</sub> = '+TB.fmt(If,3)]]);
  }
  sl.addEventListener('input',draw);draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
