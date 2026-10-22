
(function(){
  /* Fig. ∅.25: the standard Gaussian density on the plane and its image under a lower-triangular A; circles go to ellipses, the unit square to a parallelogram. */
  const cv=document.getElementById('gauss2');if(!cv||!window.TB||!TB.fit)return;
  const sa=document.getElementById('g2A'),sb=document.getElementById('g2B'),sd=document.getElementById('g2D'),fx=document.getElementById('g2Fx');
  const oa=document.getElementById('g2AOut'),ob=document.getElementById('g2BOut'),od=document.getElementById('g2DOut');
  const g1=new TB.Gauge('gG21'),g2=new TB.Gauge('gG22');
  const P0=1-Math.exp(-0.5);g2.mark('a',P0,'1 − <i>e</i><sup>−1/2</sup>');
  const phi2=(u,v)=>Math.exp(-(u*u+v*v)/2)/(2*Math.PI),R0=4,NP=170;
  const tone=p=>1-Math.exp(-p/0.12);
  let imgL=null,keyL='';
  function draw(){
    const a=+sa.value,b=+sb.value,d=+sd.value;oa.textContent=TB.fmt(a,2);ob.textContent=TB.fmt(b,2);od.textContent=TB.fmt(d,2);
    const det=a*d,inv=(x,y)=>{const u=x/a;return [u,(y-b*u)/d];};
    const F=TB.fit(cv,W=>{const sm=W<520,P=(W-(sm?16:28)-(sm?40:56)-(sm?14:24))/2;return Math.max(220,Math.round(P+(sm?96:82)));}),c=F.c,W=F.W,H=F.H,K=TB.cols();
    c.fillStyle=K.paper;c.fillRect(0,0,W,H);
    const sm=W<520,s=sm?12:14,L=sm?20:28,R=W-(sm?8:14),gp=sm?20:28;
    const top=TB.legend(c,[{k:'line',col:K.ink,t:[['|','m'],['z','i'],['| = 1, 2 и эллипсы ','r'],['E','i'],['1','s'],[', ','r'],['E','i'],['2','s']]},{k:'line',col:K.warm,t:[['[0, 1)²','m'],[' и ','r'],['A','i'],['[0, 1)²','m']]}],L,R,4,s)+8;
    const B=H-(sm?24:28),P=Math.min(B-top,(R-L-gp)/2),XA=L,XB=L+P+gp;
    const tr=(X0,x,y)=>[X0+(x+R0)/(2*R0)*P,B-(y+R0)/(2*R0)*P];
    const key=K.paper+K.eth;if(!imgL||keyL!==key){keyL=key;imgL=TB.heat(NP,(i,j)=>{const x=-R0+2*R0*(i+0.5)/NP,y=-R0+2*R0*(j+0.5)/NP;return TB.mixa(K.paper,K.eth,tone(phi2(x,y))*0.92);});}
    const imgR=TB.heat(NP,(i,j)=>{const x=-R0+2*R0*(i+0.5)/NP,y=-R0+2*R0*(j+0.5)/NP,z=inv(x,y);return TB.mixa(K.paper,K.eth,tone(phi2(z[0],z[1])/det)*0.92);});
    c.imageSmoothingEnabled=true;c.drawImage(imgL,XA,B-P,P,P);c.drawImage(imgR,XB,B-P,P,P);
    for(const X0 of [XA,XB]){
      c.strokeStyle=K.rule;c.lineWidth=1;c.strokeRect(X0,B-P,P,P);c.beginPath();
      for(let v=-R0+1;v<R0;v++){const p=tr(X0,v,-R0),q=tr(X0,-R0,v);c.moveTo(p[0],B);c.lineTo(p[0],B+4);c.moveTo(X0-4,q[1]);c.lineTo(X0,q[1]);}
      c.stroke();c.strokeStyle=TB.rgba(K.muted,0.35);c.beginPath();const o=tr(X0,0,0);c.moveTo(X0,o[1]);c.lineTo(X0+P,o[1]);c.moveTo(o[0],B-P);c.lineTo(o[0],B);c.stroke();
      c.fillStyle=K.muted;c.font=s+'px '+TB.ui;c.textAlign='center';for(const v of [-2,0,2])c.fillText(TB.fmt(v,0),tr(X0,v,0)[0],B+s+5);
      if(X0===XA){c.textAlign='right';for(const v of [-2,0,2])c.fillText(TB.fmt(v,0),X0-6,tr(X0,0,v)[1]+s*0.35);}c.textAlign='start';}
    const curve=(X0,map)=>{c.beginPath();for(let i=0;i<=160;i++){const t=2*Math.PI*i/160,p=map(Math.cos(t),Math.sin(t)),q=tr(X0,p[0],p[1]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}c.closePath();c.stroke();};
    const poly=(X0,pts)=>{c.beginPath();pts.forEach((p,i)=>{const q=tr(X0,p[0],p[1]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();};
    const Am=(u,v)=>[a*u,b*u+d*v],sq=[[0,0],[1,0],[1,1],[0,1]];
    c.save();c.beginPath();c.rect(XA,B-P,P,P);c.rect(XB,B-P,P,P);c.clip();
    c.strokeStyle=K.ink;c.lineWidth=1.6;for(const r of [1,2]){curve(XA,(u,v)=>[r*u,r*v]);curve(XB,(u,v)=>Am(r*u,r*v));}
    c.fillStyle=TB.rgba(K.warm,0.3);c.strokeStyle=K.warm;c.lineWidth=2;poly(XA,sq);c.fill();c.stroke();poly(XB,sq.map(p=>Am(p[0],p[1])));c.fill();c.stroke();
    c.restore();
    TB.rich(c,[['ζ','i']],XA+8,B-P+s+6,s,K.ink);TB.rich(c,[['X','i'],[' = ','m'],['A','i'],['ζ','i']],XB+8,B-P+s+6,s,K.ink);
    // area of A[0,1)² by counting grid points, and P(X ∈ E_1) by a grid sum
    const dlt=0.01,xs0=Math.min(0,a),xs1=Math.max(0,a),ys0=Math.min(0,b,b+d,d),ys1=Math.max(0,b,b+d,d);let cnt=0;
    for(let x=xs0+dlt/2;x<xs1;x+=dlt)for(let y=ys0+dlt/2;y<ys1;y+=dlt){const z=inv(x,y);if(z[0]>=0&&z[0]<1&&z[1]>=0&&z[1]<1)cnt++;}
    const area=cnt*dlt*dlt;
    const ex=a,ey=Math.hypot(b,d),M=240,hx=2*ex/M,hy=2*ey/M;let pr=0;
    for(let i=0;i<M;i++)for(let j=0;j<M;j++){const x=-ex+(i+0.5)*hx,y=-ey+(j+0.5)*hy,z=inv(x,y);if(z[0]*z[0]+z[1]*z[1]<=1)pr+=phi2(z[0],z[1])/det*hx*hy;}
    g1.mark('d',det,'|det <i>A</i>|').set(area);g2.set(pr);
    const s11=a*a,s12=a*b,s22=b*b+d*d;
    fx.innerHTML=TB.rows([['det <i>A</i> = <i>a</i><sub>11</sub><i>a</i><sub>22</sub> = '+TB.fmt(det,3)+',','√det <i>Σ</i> = |det <i>A</i>| = '+TB.fmt(det,3)+','],
      ['<i>Σ</i> = <i>AA</i><sup>⊤</sup>: <i>σ</i><sub>11</sub> = '+TB.fmt(s11,3)+',','<i>σ</i><sub>12</sub> = '+TB.fmt(s12,3)+',','<i>σ</i><sub>22</sub> = '+TB.fmt(s22,3)+','],
      ['max <i>p</i><sub><i>X</i></sub> = 1/(2π √det <i>Σ</i>) = '+TB.fmt(1/(2*Math.PI*det),3)]]);
  }
  [sa,sb,sd].forEach(e=>e.addEventListener('input',draw));draw();TB.onTheme(draw);TB.onResize(cv,draw);
})();
