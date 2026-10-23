
(function(){
  /* Small shared pieces for the figures of part 3: theme colours, superscript digits, a heat-map pixel buffer. */
  const TB=window.TB;if(!TB)return;
  TB.cols=()=>({ink:TB.tok('--ink'),muted:TB.tok('--muted'),rule:TB.tok('--rule'),eth:TB.tok('--ether'),warm:TB.tok('--warm'),paper:TB.tok('--paper')});
  const SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
  TB.sup=n=>String(n).split('').map(ch=>SUP[ch]||ch).join('');
  /* Paint an n×n off-screen image: col(i,j) returns [r,g,b] for the pixel whose centre is ((i+.5)/n,(j+.5)/n), j counted from the bottom. */
  TB.heat=function(n,col){const o=document.createElement('canvas');o.width=n;o.height=n;const x=o.getContext('2d'),im=x.createImageData(n,n),d=im.data;
    for(let j=0;j<n;j++)for(let i=0;i<n;i++){const c=col(i,j),k=4*((n-1-j)*n+i);d[k]=c[0];d[k+1]=c[1];d[k+2]=c[2];d[k+3]=255;}
    x.putImageData(im,0,0);return o;};
  TB.mixa=(a,b,t)=>{const A=TB.hex(a),B=TB.hex(b);return [0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*t));};
  TB.tickLabel=v=>TB.fmt(v,Math.abs(v-Math.round(v))<1e-9?0:(Math.abs(v*10-Math.round(v*10))<1e-9?1:2));
})();
