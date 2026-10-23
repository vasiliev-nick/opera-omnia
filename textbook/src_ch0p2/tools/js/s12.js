
(function(){
  /* Helpers the spatial figure needs that this part does not define yet. */
  const TB=window.TB;if(!TB)return;
  if(!TB.cols)TB.cols=()=>({ink:TB.tok('--ink'),muted:TB.tok('--muted'),rule:TB.tok('--rule'),eth:TB.tok('--ether'),warm:TB.tok('--warm'),paper:TB.tok('--paper'),esoft:TB.tok('--ether-soft'),wsoft:TB.tok('--warm-soft')});
  if(!TB.ln)TB.ln=function(c,x1,y1,x2,y2){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  if(!TB.reduced)TB.reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};
})();
