'use strict';
(() => {
 const form = document.getElementById('project-inquiry');
 if (!form) return;
 const status = document.getElementById('inquiry-status');
 const button = form.querySelector('button[type="submit"]');
 let pending = false;
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (pending || !form.reportValidity()) return;
  pending = true; button.disabled = true; status.textContent = 'Sending your inquiry…';
  try {
   const response = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
   const data = await response.json();
   if (!response.ok || !data.ok) throw new Error('Submission failed');
   status.textContent = 'Thanks—your inquiry has been submitted. Michael will review it and reply by email.';
   form.reset();
   if (!navigator.globalPrivacyControl && navigator.doNotTrack !== '1') window.gtag?.('event','project_inquiry_submitted',{service_name:'contractor_project',page_path:location.pathname});
  } catch {
   status.textContent = 'Your inquiry could not be sent. Your answers are still here. Try again or email Michael using the link beside this form.';
  } finally { pending = false; button.disabled = false; }
 });
})();
