// Load hero video only when first frame is ready, prevents black flash
// Uses mp4 for universal browser support, mov as fallback
(function() {
  var slot = document.getElementById('videoSlot');
  if (!slot) return;

  var video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  var mp4 = document.createElement('source');
  mp4.src = 'assets/hero-video.mp4';
  mp4.type = 'video/mp4';
  video.appendChild(mp4);

  var mov = document.createElement('source');
  mov.src = 'assets/hero-video.mov';
  mov.type = 'video/quicktime';
  video.appendChild(mov);

  video.addEventListener('loadeddata', function() {
    slot.appendChild(video);
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function() {
        // Autoplay was blocked, try again after user interaction
        document.addEventListener('click', function once() {
          video.play();
          document.removeEventListener('click', once);
        });
      });
    }
  });

  video.load();
})();

// Mobile nav toggle — three lines open menu on mobile, go home on desktop
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
