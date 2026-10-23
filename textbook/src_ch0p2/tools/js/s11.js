
(function(){
  /* A small 3D renderer for the figures: orbit camera with weak perspective, shaded parametric surfaces drawn by the painter's algorithm together with lines, points, arrows and translucent patches; picking a point on a surface; numerical differential geometry of a parametrized surface. */
  const TB=window.TB;if(!TB)return;
  const V=TB.V3={};
  const add=V.add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=V.sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=V.mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
  const dot=V.dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=V.cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const nrm=V.norm=a=>Math.hypot(a[0],a[1],a[2]),unit=V.unit=a=>{const l=nrm(a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
  V.lin=(a,s,b,t)=>[a[0]*s+b[0]*t,a[1]*s+b[1]*t,a[2]*s+b[2]*t];
  /* Camera: yaw about the vertical axis z, then pitch (camera raised by this angle). View coordinates: X right, Y up, D towards the viewer. */
  V.camera=function(st,W,H,cx,cy,s){
    const cyw=Math.cos(st.yaw),syw=Math.sin(st.yaw),cp=Math.cos(st.pitch),sp=Math.sin(st.pitch),dist=st.dist||7;
    const rot=p=>{const x1=cyw*p[0]-syw*p[1],y1=syw*p[0]+cyw*p[1];return [x1,sp*y1+cp*p[2],-cp*y1+sp*p[2]];};
    return {W:W,H:H,rot:rot,s:s,cx:cx,cy:cy,
      P(p){const q=rot(p),k=dist/(dist-q[2]);return [cx+s*k*q[0],cy-s*k*q[1],q[2]];}};
  };
  /* Shade a base colour by the light falling on a view-space normal; works in both themes. */
  V.palette=function(col){const P=TB.hex(col.paper),dark=(0.3*P[0]+0.59*P[1]+0.11*P[2])<110;
    return {dark:dark,shade(base,s,sp){const B=TB.hex(base),lit=dark?B.map(v=>v+(255-v)*0.12):B.map((v,i)=>v+(P[i]-v)*0.5),
      sh=dark?B.map((v,i)=>v+(P[i]-v)*0.72):B.map(v=>v*0.62);sp=sp||0;
      return 'rgb('+lit.map((v,i)=>{const x=sh[i]+(v-sh[i])*s;return Math.round(x+(255-x)*sp);}).join(',')+')';}};};
  const L0=unit([-0.45,0.7,0.55]);
  /* Mesh of a parametric surface S(u,v) on [u0,u1]×[v0,v1]; colour(u,v) gives a base colour per vertex. */
  V.mesh=function(S,o){
    const nu=o.nu||56,nv=o.nv||40,P=[],U=[],Vv=[];
    for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const a=o.u0+(o.u1-o.u0)*i/nu,b=o.v0+(o.v1-o.v0)*j/nv,q=o.map?o.map(a,b):[a,b];P.push(S(q[0],q[1]));U.push(q[0]);Vv.push(q[1]);}
    return {S:S,nu:nu,nv:nv,P:P,U:U,V:Vv,o:o,cols:null};
  };
  V.colour=function(m,fn){m.cols=m.P.map((_,k)=>fn(m.U[k],m.V[k]));return m;};
  /* Render a scene: items are drawn far to near; each surface quad, line segment and patch cell is sorted separately. */
  V.render=function(c,cam,items,col){
    const pal=V.palette(col),prims=[],top=[];
    for(const it0 of items){
      /* items marked top are drawn over the sorted scene, in the order given (a glass plate, a marker); a line with ghost also leaves a faint dashed copy on top, so its hidden parts stay readable */
      const it=it0;
      if(it.ghost&&it.t==='line')top.push({ghost:it});
      if(it.top){top.push(it);continue;}
      if(it.t==='mesh'){const m=it.m,nu=m.nu,Q=m.P.map(p=>cam.P(p)),Rv=m.P.map(p=>cam.rot(p)),ge=it.grid||0;
        for(let j=0;j<m.nv;j++)for(let i=0;i<m.nu;i++){
          const a=j*(nu+1)+i,b=a+1,d=a+nu+1,e=d+1,q=[Q[a],Q[b],Q[e],Q[d]];
          let n=cross(sub(Rv[b],Rv[a]),sub(Rv[d],Rv[a]));const n2=cross(sub(Rv[e],Rv[d]),sub(Rv[e],Rv[b]));n=unit(add(n,n2));
          if(n[2]<0)n=mul(n,-1);
          const lam=Math.max(0,dot(n,L0)),s=Math.min(1,(it.amb!==undefined?it.amb:0.3)+0.7*lam),sp=0.3*Math.pow(Math.max(0,2*lam*n[2]-L0[2]),28);
          const base=it.cols?it.cols[a]:m.cols?m.cols[a]:(it.col||col.eth);
          prims.push({d:(q[0][2]+q[1][2]+q[2][2]+q[3][2])/4,f(){
            c.beginPath();c.moveTo(q[0][0],q[0][1]);c.lineTo(q[1][0],q[1][1]);c.lineTo(q[2][0],q[2][1]);c.lineTo(q[3][0],q[3][1]);c.closePath();
            const fc=pal.shade(base,s,sp);c.globalAlpha=it.alpha||1;c.fillStyle=fc;c.fill();c.strokeStyle=fc;c.lineWidth=0.7;c.stroke();
            if(ge){c.strokeStyle=TB.rgba(col.ink,it.gridA||0.12);c.lineWidth=0.7;c.beginPath();
              if(i%ge===0){c.moveTo(q[0][0],q[0][1]);c.lineTo(q[3][0],q[3][1]);}
              if(j%ge===0){c.moveTo(q[0][0],q[0][1]);c.lineTo(q[1][0],q[1][1]);}c.stroke();}
            c.globalAlpha=1;}});}}
      else if(it.t==='line'){const pts=it.pts.map(p=>cam.P(p)),bias=it.bias===undefined?0.03:it.bias;
        for(let k=0;k+1<pts.length;k++){const p=pts[k],q=pts[k+1];
          prims.push({d:(p[2]+q[2])/2+bias,f(){c.globalAlpha=it.alpha||1;c.strokeStyle=it.col;c.lineWidth=it.w||1.5;c.setLineDash(it.dash||[]);c.lineCap='round';
            c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();c.setLineDash([]);c.lineCap='butt';c.globalAlpha=1;}});}}
      else if(it.t==='segs'){const bias=it.bias===undefined?0.03:it.bias;
        for(const [a,b] of it.s){const p=cam.P(a),q=cam.P(b);
          prims.push({d:(p[2]+q[2])/2+bias,f(){c.globalAlpha=it.alpha||1;c.strokeStyle=it.col;c.lineWidth=it.w||1.5;c.setLineDash(it.dash||[]);c.lineCap='round';
            c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();c.setLineDash([]);c.lineCap='butt';c.globalAlpha=1;}});}}
      else if(it.t==='pt'){const p=cam.P(it.p);
        prims.push({d:p[2]+(it.bias===undefined?0.06:it.bias),f(){c.fillStyle=it.fill||col.ink;c.strokeStyle=it.stroke||col.paper;c.lineWidth=it.w||1.6;
          c.beginPath();c.arc(p[0],p[1],it.r||4.5,0,7);c.fill();c.stroke();}});}
      else if(it.t==='arrow'){const a=it.p,b=add(it.p,it.v),n=10;let prev=cam.P(a);
        for(let k=1;k<=n;k++){const q=cam.P(V.lin(a,1-k/n,b,k/n)),p0=prev;prev=q;
          prims.push({d:(p0[2]+q[2])/2+0.05,f(){c.strokeStyle=it.col;c.lineWidth=it.w||2;c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(q[0],q[1]);c.stroke();}});}
        const B=cam.P(b),A=cam.P(V.lin(a,0.12,b,0.88));
        prims.push({d:B[2]+0.06,f(){const an=Math.atan2(B[1]-A[1],B[0]-A[0]),hl=Math.min(10,Math.hypot(B[0]-A[0],B[1]-A[1])*3+3);c.fillStyle=it.col;c.beginPath();c.moveTo(B[0],B[1]);
          c.lineTo(B[0]-hl*Math.cos(an-0.42),B[1]-hl*Math.sin(an-0.42));c.lineTo(B[0]-hl*Math.cos(an+0.42),B[1]-hl*Math.sin(an+0.42));c.closePath();c.fill();}});}
      else if(it.t==='patch'){/* translucent quadrilateral p + a·e1 + b·e2, |a|,|b| ≤ h, split into cells */
        const k=it.n||6,h=it.h;
        for(let j=0;j<k;j++)for(let i=0;i<k;i++){const cr=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]].map(([x,y])=>cam.P(add(it.p,V.lin(it.e1,h*(2*x/k-1),it.e2,h*(2*y/k-1)))));
          prims.push({d:(cr[0][2]+cr[1][2]+cr[2][2]+cr[3][2])/4+(it.bias||0.01),f(){c.globalAlpha=it.alpha||0.25;c.fillStyle=it.fill;c.beginPath();
            c.moveTo(cr[0][0],cr[0][1]);for(let q=1;q<4;q++)c.lineTo(cr[q][0],cr[q][1]);c.closePath();c.fill();c.globalAlpha=1;}});}
        if(it.edge){const e=[[-1,-1],[1,-1],[1,1],[-1,1],[-1,-1]].map(([x,y])=>add(it.p,V.lin(it.e1,h*x,it.e2,h*y)));
          for(let q=0;q<4;q++){const A=cam.P(e[q]),B=cam.P(e[q+1]);prims.push({d:(A[2]+B[2])/2+0.02,f(){c.strokeStyle=it.edge;c.lineWidth=1;c.beginPath();c.moveTo(A[0],A[1]);c.lineTo(B[0],B[1]);c.stroke();}});}}}
    }
    prims.sort((a,b)=>a.d-b.d);for(const p of prims)p.f();
    if(top.length){const ghosts=top.filter(x=>x.ghost),rest=top.filter(x=>!x.ghost);
      for(const g of ghosts){const it=g.ghost,P=it.pts.map(q=>cam.P(q));c.globalAlpha=it.ghost;c.strokeStyle=it.col;c.lineWidth=Math.max(1,(it.w||1.5)*0.7);c.setLineDash([3,4]);
        c.beginPath();P.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();c.setLineDash([]);c.globalAlpha=1;}
      if(rest.length)V.render(c,cam,rest.map(x=>Object.assign({},x,{top:false})),col);}
    for(const it of items)if(it.t==='label'){const p=cam.P(it.p);TB.rich(c,it.segs,p[0]+(it.dx||0),p[1]+(it.dy||0),it.size||14,it.col||col.ink,it.al||'start');}
  };
  /* Nearest visible mesh vertex under the pointer, then Gauss–Newton refinement of (u,v) so that the projection lands under the pointer. */
  V.pick=function(cam,m,x,y,rad){
    let best=-1,bd=-1e9;const r2=rad*rad;
    for(let k=0;k<m.P.length;k++){const q=cam.P(m.P[k]),dx=q[0]-x,dy=q[1]-y;if(dx*dx+dy*dy<r2&&q[2]>bd){bd=q[2];best=k;}}
    if(best<0)return null;let u=m.U[best],v=m.V[best];const h=1e-4;
    for(let it=0;it<6;it++){const q=cam.P(m.S(u,v)),qu=cam.P(m.S(u+h,v)),qv=cam.P(m.S(u,v+h)),
      a=(qu[0]-q[0])/h,b=(qv[0]-q[0])/h,cc=(qu[1]-q[1])/h,d=(qv[1]-q[1])/h,rx=x-q[0],ry=y-q[1],det=a*d-b*cc;
      if(Math.abs(det)<1e-9)break;let du=(d*rx-b*ry)/det,dv=(-cc*rx+a*ry)/det;const st=Math.hypot(du,dv),mx=0.15;
      if(st>mx){du*=mx/st;dv*=mx/st;}u+=du;v+=dv;
      if(m.o.fix){const f=m.o.fix(u,v);u=f[0];v=f[1];}}
    return [u,v];
  };
  /* Differential geometry at (u,v): outward unit normal n (orientation o = ±1), first and second fundamental forms with the book's sign (κ > 0 where the surface bends away from n), principal curvatures κ₁ ≤ κ₂ and directions. */
  V.geom=function(S,u,v,o){
    const h=1e-3,p=S(u,v),pu=S(u+h,v),pm=S(u-h,v),pv=S(u,v+h),pw=S(u,v-h),pp=S(u+h,v+h),pq=S(u-h,v-h),pr=S(u+h,v-h),ps=S(u-h,v+h);
    const Su=mul(sub(pu,pm),1/(2*h)),Sv=mul(sub(pv,pw),1/(2*h)),Suu=mul(add(sub(pu,mul(p,2)),pm),1/(h*h)),Svv=mul(add(sub(pv,mul(p,2)),pw),1/(h*h)),
      Suv=mul(sub(add(pp,pq),add(pr,ps)),1/(4*h*h));
    const n=mul(unit(cross(Su,Sv)),o||1),E=dot(Su,Su),F=dot(Su,Sv),G=dot(Sv,Sv),L=-dot(Suu,n),M=-dot(Suv,n),N=-dot(Svv,n),g=E*G-F*F;
    const w11=(G*L-F*M)/g,w12=(G*M-F*N)/g,w21=(E*M-F*L)/g,w22=(E*N-F*M)/g,tr=(w11+w22)/2,K=(L*N-M*M)/g,disc=Math.sqrt(Math.max(0,tr*tr-K));
    const k1=tr-disc,k2=tr+disc;
    const dir=lam=>{let a=w12,b=lam-w11;const a2=lam-w22,b2=w21;if(a*a+b*b<a2*a2+b2*b2){a=a2;b=b2;}if(a*a+b*b<1e-18){a=1;b=0;}return unit(V.lin(Su,a,Sv,b));};
    const e1=dir(k1),e2=unit(cross(n,e1));
    return {p:p,Su:Su,Sv:Sv,n:n,E:E,F:F,G:G,L:L,M:M,N:N,K:K,H:tr,k1:k1,k2:k2,e1:e1,e2:e2};
  };
  /* The curve cut from the surface by the plane through p spanned by the normal n and a tangent direction d, traced both ways from (u,v). */
  V.section=function(S,u,v,o,d,len,inside){
    const g0=V.geom(S,u,v,o),p=g0.p,w=unit(cross(d,g0.n)),out=[];
    for(const sg of [1,-1]){let q=[u,v],T=mul(d,sg),s=0;const run=[p];const h=0.03;
      while(s<len){const g=V.geom(S,q[0],q[1],o);let t=unit(cross(g.n,w));if(dot(t,T)<0)t=mul(t,-1);T=t;
        const bu=dot(g.Su,T)*h,bv=dot(g.Sv,T)*h,det=g.E*g.G-g.F*g.F;q=[q[0]+(g.G*bu-g.F*bv)/det,q[1]+(g.E*bv-g.F*bu)/det];
        for(let it=0;it<2;it++){const X=S(q[0],q[1]),e=dot(sub(X,p),w),g2=V.geom(S,q[0],q[1],o),au=dot(g2.Su,w),av=dot(g2.Sv,w),l2=au*au+av*av;if(l2<1e-12)break;q=[q[0]-e*au/l2,q[1]-e*av/l2];}
        if(inside&&!inside(q[0],q[1]))break;run.push(S(q[0],q[1]));s+=h;}
      out.push(run);}
    return out[1].reverse().concat(out[0].slice(1));
  };
  /* Pointer handling: a press near the point drags it over the surface, a tap on the surface puts it there, a drag anywhere else turns the view. */
  V.interact=function(cv,st,o){let mode=null,lx=0,ly=0,x0=0,y0=0,moved=0;
    const xy=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
    cv.addEventListener('pointerdown',e=>{if(!o.active())return;const [x,y]=xy(e);mode=o.grab(x,y)?'pt':'rot';lx=x0=x;ly=y0=y;moved=0;cv.setPointerCapture(e.pointerId);
      cv.style.cursor=mode==='pt'?'move':'grabbing';e.preventDefault();});
    cv.addEventListener('pointermove',e=>{const [x,y]=xy(e);
      if(!mode){if(o.active())cv.style.cursor=o.grab(x,y)?'move':'grab';return;}
      moved=Math.max(moved,Math.hypot(x-x0,y-y0));
      if(mode==='pt')o.move(x,y);else{const S=o.state?o.state():st;S.yaw-=(x-lx)*0.009;S.pitch=Math.max(-1.2,Math.min(1.35,S.pitch+(y-ly)*0.008));o.redraw();}lx=x;ly=y;});
    const end=e=>{if(mode==='rot'&&moved<5&&o.tap&&e.type==='pointerup'){const [x,y]=xy(e);o.tap(x,y);}mode=null;if(o.active())cv.style.cursor='grab';};
    cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);};
  /* The curve where the tangent plane at p cuts the surface, near p: marching squares on the mesh for the height ⟨S − p, n⟩ above the plane. */
  V.tangentCut=function(m,p,n,rad){const nu=m.nu,h=m.P.map(q=>{const d=sub(q,p);return nrm(d)<rad?dot(d,n):NaN;}),out=[];
    for(let j=0;j<m.nv;j++)for(let i=0;i<m.nu;i++){const id=[j*(nu+1)+i,j*(nu+1)+i+1,(j+1)*(nu+1)+i+1,(j+1)*(nu+1)+i],v=id.map(k=>h[k]);
      if(v.some(isNaN))continue;const pts=[];
      for(let e=0;e<4;e++){const a=v[e],b=v[(e+1)%4];if((a<0)!==(b<0)){const t=a/(a-b);pts.push(V.lin(m.P[id[e]],1-t,m.P[id[(e+1)%4]],t));}}
      if(pts.length===2)out.push([pts[0],pts[1]]);else if(pts.length===4){out.push([pts[0],pts[1]]);out.push([pts[2],pts[3]]);}}
    return out;};
  /* Surfaces shared by the figures: S(u,v), the parameter box, the outward orientation o, a guard keeping (u,v) in the domain, and a default point. */
  const PI=Math.PI;
  V.SURF={
    elld:{S:(u,v)=>[1.4*Math.cos(u)*Math.cos(v),Math.sin(u)*Math.cos(v),0.8*Math.sin(v)],o:1,m:{u0:0,u1:2*PI,v0:-PI/2,v1:PI/2,nu:60,nv:36},
      fix:(u,v)=>[u,Math.max(-PI/2+0.04,Math.min(PI/2-0.04,v))],inside:(u,v)=>Math.abs(v)<PI/2-0.04,p0:[5.0,0.45]},
    torus:{S:(u,v)=>{const w=1.15+0.45*Math.cos(v);return [w*Math.cos(u),w*Math.sin(u),0.45*Math.sin(v)];},o:1,m:{u0:0,u1:2*PI,v0:0,v1:2*PI,nu:72,nv:36},
      fix:(u,v)=>[u,v],inside:()=>true,p0:[0.6,2.4]},
    saddle:{S:(x,y)=>[x,y,0.35*(x*x-y*y)],o:1,m:{u0:0,u1:1.45,v0:0,v1:2*PI,nu:22,nv:64,map:(r,f)=>[r*Math.cos(f),r*Math.sin(f)]},
      fix:(x,y)=>{const r=Math.hypot(x,y),R=1.42;return r>R?[x*R/r,y*R/r]:[x,y];},inside:(x,y)=>Math.hypot(x,y)<1.43,p0:[0.35,0.25],open:true}
  };
  V.meshOf=function(k){const d=V.SURF[k];if(!d.mesh)d.mesh=V.mesh(d.S,Object.assign({fix:d.fix},d.m));return d.mesh;};
  /* Switch a figure between its flat and spatial versions: data-dim on the canvas, elements .only2d / .only3d, and no page scrolling over a 3D canvas. */
  V.dim=function(cv,is3){cv.dataset.dim=is3?'3':'2';cv.style.touchAction=is3?'none':'pan-y';cv.style.cursor=is3?'grab':'';
    const f=cv.closest('figure');f.querySelectorAll('.only3d').forEach(e=>{e.hidden=!is3;});f.querySelectorAll('.only2d').forEach(e=>{e.hidden=is3;});};
  /* A short turn of the view the first time a 3D scene is shown, so that it reads as three-dimensional. */
  V.intro=function(st,redraw){if(TB.reduced()||st.introDone)return;st.introDone=true;const y0=st.yaw-0.7,t0=performance.now();st.yaw=y0;
    const step=t=>{const a=Math.min(1,(t-t0)/1400);st.yaw=y0+0.7*(1-Math.pow(1-a,3));redraw();if(a<1)requestAnimationFrame(step);};requestAnimationFrame(step);};
})();
