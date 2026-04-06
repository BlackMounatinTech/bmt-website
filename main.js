// Load video only when first frame is ready — prevents black flash
(function() {
  var video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.src = 'assets/hero-video.mov';
  video.addEventListener('loadeddata', function() {
    var slot = document.getElementById('videoSlot');
    if (slot) {
      slot.appendChild(video);
      video.play();
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

// Demo tab switching
function switchDemo(product) {
  document.querySelectorAll('.demo-tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  const content = document.getElementById('demoContent');
  if (product === 'overrun') {
    content.innerHTML = `
      <p>Interactive demo coming soon.</p>
      <p style="margin-top: 12px;"><a href="contact.html" class="btn-text">Request a live walkthrough</a></p>
    `;
  } else {
    content.innerHTML = `
      <p>Interactive demo coming soon.</p>
      <p style="margin-top: 12px;"><a href="contact.html" class="btn-text">Request a live walkthrough</a></p>
    `;
  }
}
