
(function(){
  /* Theme switch: a round button in the top right corner; the choice is remembered in this browser when storage is available. */
  const b=document.querySelector('.tbtn');if(!b)return;const R=document.documentElement;
  const cur=()=>R.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  const lab=()=>b.setAttribute('aria-label',cur()==='dark'?'Включить светлую тему':'Включить тёмную тему');lab();
  b.addEventListener('click',()=>{const n=cur()==='dark'?'light':'dark';R.setAttribute('data-theme',n);lab();try{localStorage.setItem('book-theme',n);}catch(e){}});
})();
