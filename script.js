const drawer=document.getElementById('drawer');
const btn=document.getElementById('drawerBtn');
function setDrawer(open){
  if(!drawer||!btn)return;
  drawer.classList.toggle('open',open);
  document.body.classList.toggle('drawer-closed',!open);
  document.body.classList.toggle('drawer-open',open);
  btn.setAttribute('aria-expanded',String(open));
}
if(drawer&&btn){
  const mobile=()=>window.matchMedia('(max-width:760px)').matches;
  setDrawer(!mobile());
  btn.addEventListener('click',()=>setDrawer(drawer.classList.contains('open')?false:true));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobile())setDrawer(false)});
  document.addEventListener('click',e=>{
    if(mobile()&&drawer.classList.contains('open')&&!drawer.contains(e.target)&&!btn.contains(e.target))setDrawer(false);
  });
  let wasMobile=mobile();
  window.addEventListener('resize',()=>{
    const m=mobile();
    if(m!==wasMobile){wasMobile=m;setDrawer(!m);}
  });
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(mobile())setDrawer(false)}));
  const closeBtn=drawer.querySelector('.drawer-close');
  if(closeBtn)closeBtn.addEventListener('click',()=>setDrawer(false));
  /* Mobile: show the sidebar briefly on first load so visitors know it exists */
  let seen=false;
  try{seen=sessionStorage.getItem('drawerHint')==='1'}catch(e){}
  if(mobile()&&!seen){
    try{sessionStorage.setItem('drawerHint','1')}catch(e){}
    setDrawer(true);
    const hint=setTimeout(()=>setDrawer(false),1800);
    ['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>clearTimeout(hint),{once:true}));
  }
}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.05,rootMargin:'0px 0px -20px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.accordion').forEach(d=>{const b=d.querySelector('summary b');if(b){b.textContent=d.open?'×':'+';d.addEventListener('toggle',()=>b.textContent=d.open?'×':'+')}});

/* About page custom cursor — intentionally scoped to About only. */
if(document.body.classList.contains('about-page') && !window.matchMedia('(pointer:coarse)').matches){
  const cursor=document.createElement('div');
  cursor.className='about-cursor';
  cursor.setAttribute('aria-hidden','true');
  document.body.appendChild(cursor);
  let cx=window.innerWidth/2,cy=window.innerHeight/2,tx=cx,ty=cy;
  let raf=0;const move=()=>{cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cursor.style.left=cx+'px';cursor.style.top=cy+'px';raf=(Math.abs(tx-cx)>.1||Math.abs(ty-cy)>.1)?requestAnimationFrame(move):0};
  document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(move)});
  document.querySelectorAll('a,button,.chips b,.care-grid article,.outside-grid article').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('is-hover'));
  });
  move();
}
if(document.body.classList.contains('about-page')){
  const aboutObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');aboutObserver.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -35px'});
  document.querySelectorAll('.about-reveal').forEach(el=>aboutObserver.observe(el));
}

/* Smooth scroll site-wide (Lenis). Skipped for reduced-motion users; the drawer and horizontal scrollers keep native scrolling. */
if(window.Lenis&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  const lenis=new Lenis({duration:1.1,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),wheelMultiplier:1,smoothWheel:true});
  const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};
  requestAnimationFrame(raf);
  const syncDrawerLock=()=>{document.body.classList.contains('drawer-open')&&window.matchMedia('(max-width:760px)').matches?lenis.stop():lenis.start()};
  new MutationObserver(syncDrawerLock).observe(document.body,{attributes:true,attributeFilter:['class']});
}
