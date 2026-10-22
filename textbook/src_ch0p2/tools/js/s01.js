
(function(){
  /* Shared helpers for the figures: theme tokens, number format with a decimal comma, read-only gauges. */
  const TB=window.TB={};
  TB.tok=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  TB.hex=c=>{const m=c.replace('#','');return [0,2,4].map(i=>parseInt(m.substr(i,2),16));};
  TB.rgba=(c,a)=>{const h=TB.hex(c);return 'rgba('+h[0]+','+h[1]+','+h[2]+','+a+')';};
  TB.mixh=(a,b,t)=>{const A=TB.hex(a),B=TB.hex(b);return '#'+A.map((u,i)=>Math.round(u+(B[i]-u)*t).toString(16).padStart(2,'0')).join('');};
  TB.fmt=(v,d)=>{if(d===undefined)d=3;const s=Math.abs(v).toFixed(d);return (v<0&&+s!==0?'−':'')+s.replace('.',',');};
  TB.fr=(a,b)=>'<span class="fr"><span>'+a+'</span><span>'+b+'</span></span>';
  TB.serif='Literata, Georgia, serif';TB.ui='"PT Sans Caption", "PT Sans", sans-serif';
  TB.onTheme=fn=>{try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',fn);}catch(e){}
    new MutationObserver(fn).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fn);};
  const lab=v=>String(v).replace('.',',').replace('-','−');
  function Gauge(id){
    const el=this.el=document.getElementById(id);if(!el)return;
    this.min=+el.dataset.min;this.max=+el.dataset.max;
    this.zero=el.dataset.zero!==undefined?+el.dataset.zero:this.min;
    this.d=el.dataset.d!==undefined?+el.dataset.d:3;
    el.innerHTML='<i class="gt"></i><i class="gf"></i><i class="ge" style="left:0">'+lab(this.min)+'</i><i class="ge" style="left:100%">'+lab(this.max)+'</i><i class="gk"></i>';
    this.f=el.querySelector('.gf');this.k=el.querySelector('.gk');this.m={};
    this.out=el.parentNode.querySelector('.gv');
    el.setAttribute('role','meter');el.setAttribute('aria-valuemin',this.min);el.setAttribute('aria-valuemax',this.max);
  }
  Gauge.prototype.p=function(v){return Math.max(0,Math.min(1,(v-this.min)/(this.max-this.min)))*100;};
  Gauge.prototype.set=function(v,col){
    if(!this.el)return this;const p=this.p(v),z=this.p(this.zero);
    this.f.style.left=Math.min(p,z)+'%';this.f.style.width=Math.abs(p-z)+'%';this.k.style.left=p+'%';
    this.f.style.background=col||'';this.k.style.background=col||'';
    if(this.out)this.out.textContent=TB.fmt(v,this.d);
    this.el.setAttribute('aria-valuenow',v.toFixed(this.d));return this;};
  Gauge.prototype.mark=function(key,v,html,below){
    if(!this.el)return this;let m=this.m[key];
    if(!m){m=document.createElement('i');m.className='gm'+(below?' gb':'');m.appendChild(document.createElement('b'));this.el.insertBefore(m,this.k);this.m[key]=m;}
    m.style.left=this.p(v)+'%';if(m.firstChild.innerHTML!==html)m.firstChild.innerHTML=html;return this;};
  TB.Gauge=Gauge;
})();
