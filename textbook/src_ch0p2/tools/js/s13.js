
(function(){
  /* Fig. ∅.24: F(θ) = ∫_K exp(−|θ − x|²/(2s²)) dλ₃(x) for a solid body K and a point θ of space. Threads run from θ to the centres of the pieces of K, as bright as the average pull |∇_θ f| of the piece relative to the roof 1/(s√e); the arrow is ∇F(θ). The numbers come from a fine quadrature over K; the pieces only group its nodes for the picture. */
  const TB=window.TB,cv=document.getElementById('pull');if(!TB||!cv||!TB.V3||!TB.fit)return;
  const V=TB.V3,fx=document.getElementById('puFx'),sl=document.getElementById('puS'),so=document.getElementById('puSOut'),gF=new TB.Gauge('gPuF'),gG=new TB.Gauge('gPuG');
  const PI=Math.PI,LAM=1.4,BOX=[2.1,2.1,1.35];
  /* Gauss–Legendre nodes and weights on [0, 1] */
  function gl(n){const x=[],w=[];for(let i=1;i<=n;i++){let z=Math.cos(PI*(i-0.25)/(n+0.5)),pp=1;
    for(let it=0;it<100;it++){let p1=1,p2=0;for(let j=1;j<=n;j++){const p3=p2;p2=p1;p1=((2*j-1)*z*p2-(j-1)*p3)/j;}pp=n*(z*p1-p2)/(z*z-1);const z1=z;z=z1-p1/pp;if(Math.abs(z-z1)<1e-15)break;}
    x.push((1-z)/2);w.push(1/((1-z*z)*pp*pp));}return [x,w];}
  /* each body: its boundary surface for drawing, and quadrature nodes [x, y, z, weight, piece] filling it */
  const R=1.1,r=0.45,A=1.3,B=0.85,C=0.65;
  const BODY={
    torus:{S:(u,v)=>{const w=R+r*Math.cos(v);return [w*Math.cos(u),w*Math.sin(u),r*Math.sin(v)];},m:{u0:0,u1:2*PI,v0:0,v1:2*PI,nu:72,nv:30},
      st:{yaw:0.45,pitch:0.62},th:[1.0,-1.15,0.55],
      nodes(){const Q=[],[gx,gw]=gl(6),nf=72,np=20;
        for(let i=0;i<nf;i++){const f=2*PI*(i+0.5)/nf;for(let j=0;j<np;j++){const p=2*PI*(j+0.5)/np;for(let k=0;k<6;k++){const rho=r*gx[k],w=r*gw[k]*rho*(R+rho*Math.cos(p))*(2*PI/nf)*(2*PI/np);
          /* pieces: 24 sectors around the axis, each split into the inner tube and five outer slices */
          const pc=Math.floor(i/3)*6+(k<3?0:1+Math.floor(j/4));
          Q.push([(R+rho*Math.cos(p))*Math.cos(f),(R+rho*Math.cos(p))*Math.sin(f),rho*Math.sin(p),w,pc]);}}}return Q;}},
    elld:{S:(u,v)=>[A*Math.cos(u)*Math.cos(v),B*Math.sin(u)*Math.cos(v),C*Math.sin(v)],m:{u0:0,u1:2*PI,v0:-PI/2,v1:PI/2,nu:60,nv:32},
      st:{yaw:0.5,pitch:0.45},th:[1.2,-0.75,0.55],
      nodes(){const Q=[],[gx,gw]=gl(6),[tx,tw]=gl(24),nf=72;
        for(let i=0;i<nf;i++){const f=2*PI*(i+0.5)/nf;for(let j=0;j<24;j++){const ct=2*tx[j]-1,st=Math.sqrt(1-ct*ct);for(let k=0;k<6;k++){const rho=gx[k],w=A*B*C*rho*rho*gw[k]*2*tw[j]*(2*PI/nf);
          /* pieces: 12 sectors × 4 zones in height × 3 shells */
          const pc=(Math.floor(i/6)*4+Math.floor(j/6))*3+Math.floor(k/2);
          Q.push([A*rho*st*Math.cos(f),B*rho*st*Math.sin(f),C*rho*ct,w,pc]);}}}return Q;}}
  };
  for(const k in BODY){const b=BODY[k];b.mesh=V.mesh(b.S,b.m);b.Q=b.nodes();b.np=1+Math.max(...b.Q.map(q=>q[4]));
    /* centre and volume of every piece */
    const cen=[];for(let i=0;i<b.np;i++)cen.push([0,0,0,0]);
    for(const q of b.Q){const c=cen[q[4]];c[0]+=q[0]*q[3];c[1]+=q[1]*q[3];c[2]+=q[2]*q[3];c[3]+=q[3];}
    b.cen=cen.map(c=>[c[0]/c[3],c[1]/c[3],c[2]/c[3],c[3]]);b.vol=cen.reduce((a,c)=>a+c[3],0);b.th=b.th.slice();}
  let body=TB.segs(cv,k=>{if(!BODY[k])return;body=k;draw();});if(!BODY[body])body='torus';
  /* F(θ), ∇F(θ) and the pull of every piece */
  function field(b,th,s){const k=1/(2*s*s),pull=b.cen.map(()=>[0,0,0]);let F=0;const g=[0,0,0];
    for(const q of b.Q){const dx=q[0]-th[0],dy=q[1]-th[1],dz=q[2]-th[2],e=q[3]*Math.exp(-(dx*dx+dy*dy+dz*dz)*k),P=pull[q[4]];
      F+=e;g[0]+=dx*e;g[1]+=dy*e;g[2]+=dz*e;P[0]+=dx*e;P[1]+=dy*e;P[2]+=dz*e;}
    const s2=s*s;return {F:F,g:g.map(v=>v/s2),pull:pull.map((P,i)=>Math.hypot(P[0],P[1],P[2])/s2/b.cen[i][3])};}
  let cam=null;
  function draw(){
    const b=BODY[body],f=TB.fit(cv,W=>Math.round(W*(W<520?0.98:0.6))),c=f.c,W=f.W,H=f.H,col=TB.cols(),sm=W<520,fs=sm?12:13;
    c.clearRect(0,0,W,H);
    const yb=TB.legend(c,[{k:'thin',col:col.ink,t:[['нить к кусочку тела','r']]},{k:'line',col:col.warm,t:[['∇','m'],['F','i'],['(','m'],['θ','i'],[')','m']]},
      {k:'dash',col:col.ink,t:[['контур сферы радиуса ','r'],['s','i']]}],sm?8:14,W-8,4,fs);
    const s0=sm?Math.min(W*0.27,(H-yb)*0.3):Math.min(W*0.17,(H-yb)*0.27);
    cam=V.camera(b.st,W,H,W/2,yb+(H-yb)*0.53,s0);
    const s=+sl.value;so.textContent=TB.fmt(s,2);
    const th=b.th,Fd=field(b,th,s),roof=1/(s*Math.sqrt(Math.E));
    const items=[{t:'mesh',m:b.mesh,col:col.eth,grid:3,gridA:0.1,amb:0.36,alpha:0.8}];
    /* threads, cut into pieces so that the parts inside the body are hidden by its surface */
    for(let i=0;i<b.np;i++){const a=Math.min(1,Fd.pull[i]/roof);if(a<0.03)continue;const q=b.cen[i],pts=[];
      for(let t=0;t<=8;t++)pts.push(V.lin(th,1-t/8,q,t/8));
      items.push({t:'line',pts:pts,col:col.ink,w:0.5+1.8*a,alpha:0.12+0.83*a,bias:0.01});}
    /* depth cue: a dotted drop to the plane x₃ = 0 */
    const foot=[th[0],th[1],0];
    items.push({t:'line',pts:[th,foot],col:TB.rgba(col.ink,0.55),w:1,dash:[2,3],bias:0.02},{t:'pt',p:foot,r:2.2,fill:col.muted,stroke:col.paper,w:1});
    const gv=V.mul(Fd.g,LAM);
    items.push({t:'arrow',p:th,v:gv,col:col.warm,w:2.6,top:true},{t:'pt',p:th,r:6,fill:col.warm,stroke:col.paper,w:2,top:true});
    c.save();c.beginPath();c.rect(0,yb,W,H-yb);c.clip();V.render(c,cam,items,col);
    /* the outline of the sphere of radius s about θ, and labels */
    const P=cam.P(th),k=(b.st.dist||7)/((b.st.dist||7)-P[2]);
    c.strokeStyle=TB.rgba(col.ink,0.6);c.lineWidth=1.1;c.setLineDash([5,4]);c.beginPath();c.arc(P[0],P[1],s*s0*k,0,2*PI);c.stroke();c.setLineDash([]);
    TB.rich(c,[['θ','i']],P[0]-10,P[1]-10,fs+2,col.ink,'right');
    const T=cam.P(V.add(th,gv)),gl2=Math.hypot(T[0]-P[0],T[1]-P[1]);
    if(gl2>18){const ux=(T[0]-P[0])/gl2,uy=(T[1]-P[1])/gl2;TB.rich(c,[['∇','m'],['F','i']],T[0]+ux*12,T[1]+uy*12+5,fs+1,col.warm,ux<0?'right':'start');}
    c.restore();
    /* readouts */
    const gn=Math.hypot(...Fd.g),cm=v=>TB.fmt(v,3);
    gF.set(Fd.F);gG.set(gn);
    fx.innerHTML=TB.rows([['<i>F</i>(<i>θ</i>) = '+cm(Fd.F)+',','объём тела '+TB.fmt(b.vol,2)],
      ['∇<i>F</i>(<i>θ</i>) = ('+cm(Fd.g[0])+'; '+cm(Fd.g[1])+'; '+cm(Fd.g[2])+'),','|∇<i>F</i>(<i>θ</i>)| = '+cm(gn)],
      ['крыша:','|∇<sub><i>θ</i></sub><i>f</i>(<i>x</i>, <i>θ</i>)| ≤ 1/(<i>s</i>√<i>e</i>) = '+TB.fmt(roof,2),'при <i>x</i> ∈ <i>K</i>']]);
  }
  /* dragging θ keeps its depth: the point moves in the plane through it parallel to the screen */
  function unproject(st,x,y,D){const cyw=Math.cos(st.yaw),syw=Math.sin(st.yaw),cp=Math.cos(st.pitch),sp=Math.sin(st.pitch),dist=st.dist||7,k=dist/(dist-D);
    const X=(x-cam.cx)/(cam.s*k),Y=(cam.cy-y)/(cam.s*k),y1=sp*Y-cp*D,z=cp*Y+sp*D;return [cyw*X+syw*y1,-syw*X+cyw*y1,z];}
  let depth=0;
  V.interact(cv,BODY.torus.st,{active:()=>true,state:()=>BODY[body].st,
    grab(x,y){if(!cam)return false;const P=cam.P(BODY[body].th);if(Math.hypot(P[0]-x,P[1]-y)<28){depth=P[2];return true;}return false;},
    move(x,y){const b=BODY[body],q=unproject(b.st,x,y,depth);for(let i=0;i<3;i++)b.th[i]=Math.max(-BOX[i],Math.min(BOX[i],q[i]));draw();},
    redraw:draw});
  cv.style.touchAction='none';cv.style.cursor='grab';
  sl.addEventListener('input',draw);TB.onTheme(draw);TB.onResize(cv,draw);draw();
  /* a short turn of the view the first time the figure is seen, so that it reads as three-dimensional */
  if(window.IntersectionObserver){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();V.intro(BODY[body].st,draw);}},{threshold:0.4});io.observe(cv);}
})();
