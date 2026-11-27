import Lenis from './assets/vendor/lenis.mjs';
const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 801px) and (pointer: fine)');
const toggle=document.querySelector('.motion-control');let userPaused=false;try{userPaused=sessionStorage.getItem('bmt-motion-paused')==='true'}catch{}
let lenis,sceneControl,frame=0,lastTime=0,visible=true;
const enabled=()=>!reduce.matches&&!userPaused;
function syncMotion(){
  const active=enabled();document.body.classList.toggle('motion-paused',!active);toggle.setAttribute('aria-pressed',String(!active));toggle.setAttribute('aria-label',active?'Pause motion':'Enable motion');toggle.title=active?'Pause motion':'Enable motion';
  toggle.innerHTML=active?'<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M4 3h3v10H4zm5 0h3v10H9z"/></svg>':'<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="m5 2 9 6-9 6z"/></svg>';
  lenis?.destroy();lenis=null;
  if(active&&desktop.matches){lenis=new Lenis({duration:1.05,smoothWheel:true,syncTouch:false,anchors:{offset:-108},stopInertiaOnNavigate:true});}
  sceneControl?.setMotion(active);schedule();
}
toggle.addEventListener('click',()=>{userPaused=enabled();try{sessionStorage.setItem('bmt-motion-paused',String(userPaused))}catch{}syncMotion()});
reduce.addEventListener('change',syncMotion);desktop.addEventListener('change',syncMotion);
// Reveal only after the observer is running. The full page remains readable if JS fails.
const reveals=[...document.querySelectorAll('.section-heading,.service,.package-card,.step,.faq,.case-intro,.proof-stats,.website-case,.contact')];
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}}),{threshold:0.06,rootMargin:'0px 0px -20px 0px'});
reveals.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${el.classList.contains('service')?i%3*90:0}ms`);revealObserver.observe(el)});document.body.classList.add('motion-ready');
const hero=document.querySelector('.hero'),plan=document.querySelector('.hero-plan'),proofCards=[...document.querySelectorAll('.proof-card')];
let heroOnScreen=true;new IntersectionObserver(([entry])=>{heroOnScreen=entry.isIntersecting;sceneControl?.setVisible(heroOnScreen);schedule()},{rootMargin:'150px'}).observe(hero);
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;root.style.setProperty('--progress',max?Math.min(1,scrollY/max):0);if(enabled()&&desktop.matches){const y=Math.min(scrollY,1000);plan.style.transform=`perspective(1500px) rotateY(${-7+y*.009}deg) rotateX(${3-y*.004}deg) translateY(${-y*.04}px)`;proofCards.forEach((el,i)=>{const rect=el.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(rect.top-innerHeight*.5)/innerHeight));el.style.transform=`perspective(1600px) rotateY(${(i?-1:1)*(5+p*3)}deg) rotateZ(${(i?1:-1)*(2+p)}deg) translateY(${p*25}px)`})}else{plan.style.transform='';proofCards.forEach(el=>el.style.transform='')}}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll,{passive:true});
function tick(time){frame=0;if(!visible)return;lenis?.raf(time);if(time-lastTime>32){sceneControl?.render(time);lastTime=time}if(lenis||(sceneControl&&heroOnScreen&&enabled()))schedule()}
function schedule(){if(!frame&&visible)frame=requestAnimationFrame(tick)}
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible){cancelAnimationFrame(frame);frame=0}else schedule()});
syncMotion();updateScroll();
// Three.js is a separate lazy-loaded chunk. Content and scrolling never depend on WebGL.
async function createMountain(){
 try{
  const T=await import('./assets/vendor/three.module.js');const canvas=document.getElementById('mountain-scene');
  const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  const scene=new T.Scene();scene.fog=new T.FogExp2(0x07080d,.033);const camera=new T.PerspectiveCamera(43,1,.1,120);camera.position.set(0,5.7,19);camera.lookAt(0,.8,0);
  const group=new T.Group();scene.add(group);group.position.set(5,-1.3,0);group.rotation.y=-.33;
  const size=28,segments=80,geometry=new T.PlaneGeometry(size,size,segments,segments);geometry.rotateX(-Math.PI/2);const positions=geometry.attributes.position;
  const height=(x,z)=>{const peak=(cx,cz,w,h)=>h*Math.exp(-((x-cx)**2+(z-cz)**2)/w);return peak(-3,0,17,5.7)+peak(3,-3,12,4.4)+peak(7,3,22,2.8)+.16*Math.sin(x*1.9+z)*Math.cos(z*1.7+x*.4)};
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),z=positions.getZ(i);positions.setY(i,height(x,z))}geometry.computeVertexNormals();
  const surface=new T.Mesh(geometry,new T.MeshBasicMaterial({color:0x0e0c1c,transparent:true,opacity:.72,side:T.DoubleSide}));group.add(surface);
  const wire=new T.Mesh(geometry,new T.MeshBasicMaterial({color:0x9c83f5,wireframe:true,transparent:true,opacity:.34}));wire.position.y=.018;group.add(wire);
  // Horizontal contour lines give the terrain a precise survey-map character.
  const contours=[];for(let z=-13;z<=13;z+=.65){for(let x=-13;x<13;x+=.25){contours.push(x,height(x,z)+.035,z,x+.25,height(x+.25,z)+.035,z)}}
  const linesGeometry=new T.BufferGeometry();linesGeometry.setAttribute('position',new T.Float32BufferAttribute(contours,3));group.add(new T.LineSegments(linesGeometry,new T.LineBasicMaterial({color:0xbaa2ff,transparent:true,opacity:.32})));
  const starPositions=[];let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<100;i++)starPositions.push((rand()-.5)*38,rand()*12-1,(rand()-.5)*25);
  const starsGeo=new T.BufferGeometry();starsGeo.setAttribute('position',new T.Float32BufferAttribute(starPositions,3));const stars=new T.Points(starsGeo,new T.PointsMaterial({color:0xc9c2ff,size:.035,transparent:true,opacity:.55}));scene.add(stars);
  let motion=enabled(),onScreen=true,px=0,py=0;
  const resize=()=>{const box=canvas.parentElement.getBoundingClientRect();renderer.setSize(box.width,box.height,false);camera.aspect=box.width/box.height;camera.updateProjectionMatrix();group.position.x=innerWidth<801?2.5:5;draw(0)};
  function draw(time){if(!onScreen)return;const drift=motion?Math.sin(time*.00012)*.025:0;group.rotation.y=-.33+drift+px*.035;group.rotation.z=py*.012;renderer.render(scene,camera)}
  addEventListener('pointermove',e=>{if(motion&&desktop.matches){px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5}},{passive:true});addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('scene-live');onScreen=false});
  sceneControl={setMotion(v){motion=v;px=0;py=0;draw(0)},setVisible(v){onScreen=v;if(v)draw(0)},render:draw};resize();document.body.classList.add('scene-live');schedule();
 }catch(error){console.info('BMT: static atmosphere active.');}
}
if('requestIdleCallback' in window)requestIdleCallback(createMountain,{timeout:1800});else setTimeout(createMountain,100);
