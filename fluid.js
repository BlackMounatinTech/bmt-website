(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  const canvas = document.querySelector('#contours');
  const ctx = canvas.getContext('2d');
  const opening = document.querySelector('.opening');
  const film = document.querySelector('.film');
  const video = document.querySelector('.film video');
  const progress = document.querySelector('.reading-progress');
  let paused = reduced.matches, heroVisible = true, filmVisible = false, width = 0, height = 0;
  let raf = 0, last = 0, phase = 0, scrollQueued = false;
  document.documentElement.classList.add('enhanced');
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const count = width < 700 ? 15 : 25;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      const radius = 65 + i * 25;
      for (let j = 0; j <= 100; j++) {
        const a = j / 100 * Math.PI * 2;
        const r = radius + Math.sin(a * 3 + phase + i * .08) * 19 + Math.cos(a * 5 - phase * .6) * 9;
        const x = width * .85 + Math.cos(a) * r * 1.45;
        const y = height * .48 + Math.sin(a) * r * .82;
        j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.strokeStyle = `rgba(130,170,245,${.09 + i / count * .14})`; ctx.lineWidth = .8; ctx.stroke();
    }
  }
  function frame(now) {
    raf = 0;
    if (paused || document.hidden || !heroVisible) return;
    if (now - last > 32) { phase += .009; draw(); last = now; }
    raf = requestAnimationFrame(frame);
  }
  function animate() { if (!raf && !paused && !document.hidden && heroVisible) raf = requestAnimationFrame(frame); }
  function resize() {
    width = opening.clientWidth; height = opening.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr; canvas.height = height * dpr;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function syncVideo() {
    if (paused || document.hidden || !filmVisible || navigator.connection?.saveData) { video.pause(); return; }
    const source = video.querySelector('source');
    if (!source.src) { source.src = source.dataset.src; video.load(); }
    video.play().catch(() => {});
  }
  function syncMotion() {
    document.documentElement.classList.toggle('motion-paused', paused);
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused));
    if (paused && raf) { cancelAnimationFrame(raf); raf = 0; }
    animate(); syncVideo();
  }
  toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; syncMotion(); });
  document.addEventListener('visibilitychange', () => { animate(); syncVideo(); });
  new ResizeObserver(resize).observe(opening);
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === opening) { heroVisible = entry.isIntersecting; animate(); }
      else { filmVisible = entry.isIntersecting; syncVideo(); }
    });
  });
  visibility.observe(opening); visibility.observe(film);
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); reveal.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (!paused && el.getBoundingClientRect().top > innerHeight) el.classList.add('will-reveal');
    reveal.observe(el);
  });
  function scroll() {
    scrollQueued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (!paused && innerWidth > 700) {
      const amount = Math.max(0, Math.min(1, (innerHeight - film.getBoundingClientRect().top) / innerHeight));
      film.style.setProperty('--film-inset', `${(1 - amount) * 3}%`);
    }
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(scroll); } }, {passive:true});
  if (matchMedia('(pointer: fine)').matches) opening.addEventListener('pointermove', event => {
    if (paused) return;
    opening.style.setProperty('--mx', `${event.clientX / innerWidth * 100}%`);
    opening.style.setProperty('--my', `${event.offsetY / height * 100}%`);
  }, {passive:true});
  resize(); scroll(); syncMotion();
})();

(() => {
 const video=document.querySelector('#founder-video');
 const button=document.querySelector('.intro-play');
 if(!video || !button) return;
 button.addEventListener('click',()=>{if(video.paused){video.play().catch(()=>{button.textContent='Use video controls ▷';});}else{video.pause();}});
 video.addEventListener('play',()=>{button.textContent='Pause intro Ⅱ';document.querySelector('.film video')?.pause();});
 video.addEventListener('pause',()=>{button.textContent='Play my intro ▷';});
 video.addEventListener('ended',()=>{button.textContent='Watch again ↻';});
})();
