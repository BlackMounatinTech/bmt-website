'use strict';
const form = document.querySelector('#onboarding');
const submit = document.querySelector('#submit-button');
const status = document.querySelector('#form-status');
const fallback = document.querySelector('#submit-fallback');
let sending = false;
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  sending = true;
  submit.disabled = true;
  submit.textContent = 'Sending…';
  status.className = '';
  status.textContent = 'Sending your setup details…';
  fallback.hidden = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
    let data = {};
    try { data = await response.json(); } catch (_) { /* Non-JSON responses are not confirmations. */ }
    if (!response.ok || data.ok !== true) throw new Error('Submission not confirmed');
    form.hidden = true;
    const success = document.querySelector('#success');
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ behavior: 'auto', block: 'center' });
  } catch (_) {
    status.className = 'error';
    status.textContent = 'We couldn’t confirm delivery. Your answers are still here. You can retry or download them below. If you retry, Michael may receive a duplicate.';
    fallback.hidden = false;
    status.focus();
  } finally {
    clearTimeout(timeout);
    sending = false;
    submit.disabled = false;
    submit.textContent = 'Send my setup details ↗';
  }
});
document.querySelector('#download-answers').addEventListener('click', () => {
  const lines = ['BMT — fencing client setup', ''];
  for (const [name, value] of new FormData(form)) {
    if (name.startsWith('_') || name === 'form_type') continue;
    lines.push(name.replaceAll('_', ' ') + ': ' + value, '');
  }
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'BMT-setup-details.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
