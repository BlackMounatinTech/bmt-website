// Availability manually checked in Google Calendar on September 23, 2026.
// This is a dated notice, not a live calendar integration.
(() => {
  const expires = Date.parse('2026-09-24T00:00:00-07:00');
  const starts = Date.parse('2026-09-23T00:00:00-07:00');
  const notices = document.querySelectorAll('[data-consult-availability]');
  const buttons = [...document.querySelectorAll('[data-tomorrow-cta]')];
  const labels = buttons.map(button => button.textContent);
  function refresh() {
    const active = Date.now() >= starts && Date.now() < expires;
    notices.forEach(notice => { notice.hidden = !active; });
    buttons.forEach((button, i) => {
      button.textContent = active ? 'Book Tomorrow’s Session' : labels[i];
    });
  }
  refresh();
  setInterval(refresh, 30000);
  document.addEventListener('visibilitychange', refresh);
})();
