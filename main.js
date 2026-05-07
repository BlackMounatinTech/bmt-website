// Load hero video. Tries .mov first (best for Safari), falls back to .mp4
// if Chrome/Firefox refuses the QuickTime container. Retries play on first
// user interaction if the browser blocks autoplay.
(function() {
  var slot = document.getElementById('videoSlot');
  if (!slot) return;

  function attach(video) {
    if (slot.contains(video)) return;
    slot.appendChild(video);
    var p = video.play();
    if (p && p.catch) {
      p.catch(function() {
        var retry = function() {
          video.play();
          document.removeEventListener('click', retry);
          document.removeEventListener('touchstart', retry);
        };
        document.addEventListener('click', retry, { once: true });
        document.addEventListener('touchstart', retry, { once: true });
      });
    }
  }

  function makeVideo(src) {
    var v = document.createElement('video');
    v.muted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('loop', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.src = src;
    return v;
  }

  var primary = makeVideo('assets/hero-video.mov');
  var fallbackTried = false;

  primary.addEventListener('loadeddata', function() { attach(primary); });
  primary.addEventListener('error', function() {
    if (fallbackTried) return;
    fallbackTried = true;
    var fb = makeVideo('assets/hero-video.mp4');
    fb.addEventListener('loadeddata', function() { attach(fb); });
    fb.load();
  });
  primary.load();
})();

// Mobile nav toggle. Three lines open menu on mobile, go home on desktop
document.querySelectorAll('.nav-home').forEach(function(navHome) {
  navHome.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      document.getElementById('navLinks').classList.toggle('active');
    }
  });
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .fade-section').forEach(el => observer.observe(el));

// Compliance accordion toggle
function toggleCompliance(btn) {
  var item = btn.parentElement;
  item.classList.toggle('open');
}
