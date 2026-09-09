// Load video only when first frame is ready, prevents black flash
(function() {
  var video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.src = 'assets/hero-video.mov';
  video.autoplay = true;
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.addEventListener('ended', function() {
    video.currentTime = 0;
    video.play();
  });
  video.addEventListener('loadeddata', function() {
    var slot = document.getElementById('videoSlot');
    if (slot) {
      slot.appendChild(video);
      video.play();
    }
  });
  video.load();
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

// Fade-in on scroll.
// Progressive enhancement only: .fade-in elements start hidden via CSS and get
// revealed here. .fade-section content is never hidden by CSS, so a failure in
// this block can never blank out part of the page.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
}

// Compliance accordion toggle
function toggleCompliance(btn) {
  var item = btn.parentElement;
  item.classList.toggle('open');
}
