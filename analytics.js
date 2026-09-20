'use strict';
(() => {
  if (window.bmtAnalyticsInstalled) return;
  window.bmtAnalyticsInstalled = true;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  const measurementId = 'G-BWF7GN8082';
  const production = ['blackmountaintech.ca', 'www.blackmountaintech.ca'].includes(location.hostname);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  // Keep campaign attribution, but discard arbitrary query strings and fragments.
  const pageUrl = new URL(location.origin + location.pathname);
  const params = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'gclid', 'gbraid', 'wbraid']) {
    if (params.has(key)) pageUrl.searchParams.set(key, params.get(key).slice(0, 150));
  }
  let referrer = '';
  try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch {}
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: pageUrl.href,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  // Local previews queue events for testing, but never load Google's sender.
  if (production) {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(tag);
  }
  const send = (event, data = {}) => window.gtag('event', event, {
    send_to: measurementId, page_path: location.pathname, ...data
  });
  const placement = node => {
    if (node.closest('.hero')) return 'hero';
    if (node.closest('.review-strip')) return 'business_review';
    if (node.closest('.consultation-callout')) return 'consultation_callout';
    if (node.closest('footer')) return 'footer';
    if (node.closest('nav')) return 'navigation';
    return node.closest('[id]')?.id || 'body';
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (url.hostname === 'buy.stripe.com' && url.pathname === '/6oUdR9bJm4eCcL90vt3cc0f') {
      send('consultation_click', {placement: placement(link), service_name: 'business_review_30min'});
    } else if (url.protocol === 'mailto:') {
      const card = link.closest('.offer-card');
      send('inquiry_click', {placement: placement(link), service_name: card?.querySelector('h3')?.textContent.trim() || 'general_inquiry'});
    } else if (url.origin === location.origin && url.pathname.startsWith('/downloads/')) {
      send('resource_download_click', {resource_name: url.pathname.split('/').pop(), placement: placement(link)});
    } else if (url.hostname === 'calendar.google.com') {
      send('scheduling_click', {placement: placement(link)});
    }
  });
  document.addEventListener('toggle', event => {
    const details = event.target;
    if (details.tagName !== 'DETAILS' || !details.open) return;
    const name = details.id || details.querySelector('summary')?.textContent.trim().slice(0, 90);
    if (name) send('resource_open', {resource_name: name});
  }, true);
  document.addEventListener('bmt:calculator_used', event => {
    if (['pricing-form', 'quotes-form'].includes(event.detail?.tool)) send('calculator_use', {resource_name: event.detail.tool});
  });
  document.addEventListener('bmt:template_copied', event => {
    if (typeof event.detail?.template === 'string' && /^text-[a-z-]+$/.test(event.detail.template)) send('template_copy', {resource_name: event.detail.template});
  });
  document.addEventListener('bmt:checkup', event => {
    if (['start', 'complete'].includes(event.detail?.event)) send('checkup_' + event.detail.event);
  });
  document.getElementById('founder-video')?.addEventListener('play', () => send('intro_video_start'), {once: true});
})();
