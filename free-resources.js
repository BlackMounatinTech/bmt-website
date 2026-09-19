'use strict';
(() => {
  const number = id => {
    const field = document.getElementById(id);
    const value = field.value.trim() === '' ? NaN : Number(field.value);
    if (!Number.isFinite(value) || value < 0) throw new Error('Enter a valid, non-negative number in every field.');
    return value;
  };
  const amount = n => n.toLocaleString('en-CA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const percent = n => `${n.toFixed(1)}%`;
  const render = (target, rows) => {
    target.replaceChildren();
    rows.forEach(([label, value]) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.append(strong, value);
      target.append(p);
    });
  };
  const error = (target, message) => {
    target.replaceChildren();
    const p = document.createElement('p');
    p.className = 'calc-error'; p.textContent = message; target.append(p);
  };
  const pricing = document.getElementById('pricing-form');
  pricing?.addEventListener('submit', event => {
    event.preventDefault();
    const output = document.getElementById('pricing-result');
    try {
      const cost = ['labour', 'materials', 'equipment', 'subcontractors', 'other', 'overhead'].reduce((sum, id) => sum + number(id), 0);
      const margin = number('margin');
      if (!Number.isFinite(cost) || cost <= 0) throw new Error('Enter total costs greater than zero.');
      if (margin >= 100) throw new Error('Target margin must be less than 100%.');
      const price = cost / (1 - margin / 100);
      if (!Number.isFinite(price)) throw new Error('These numbers are too large. Use smaller values.');
      render(output, [
        ['Total costs entered', amount(cost)],
        ['Selling price before tax', amount(price)],
        ['Amount left after those costs', amount(price - cost)],
        ['Target margin', percent(margin)],
        ['Equivalent markup on costs', percent((price / cost - 1) * 100)],
        ['Currency', 'Same as your inputs. Sales tax is not included.']
      ]);
      document.dispatchEvent(new CustomEvent('bmt:calculator_used', {detail: {tool: 'pricing-form'}}));
    } catch (e) { error(output, e.message); }
  });
  const quotes = document.getElementById('quotes-form');
  quotes?.addEventListener('submit', event => {
    event.preventDefault();
    const output = document.getElementById('quotes-result');
    try {
      const sent = number('sent'), accepted = number('accepted'), declined = number('declined');
      if (![sent, accepted, declined].every(Number.isSafeInteger)) throw new Error('Use whole numbers for quote counts.');
      if (sent === 0) throw new Error('Enter at least one quote sent to calculate results.');
      if (accepted + declined > sent) throw new Error('Accepted and declined quotes cannot add up to more than quotes sent.');
      const decided = accepted + declined;
      render(output, [
        ['Still open', String(sent - decided)],
        ['Accepted out of all quotes sent', percent(accepted / sent * 100)],
        ['Accepted out of decided quotes', decided ? percent(accepted / decided * 100) : 'Not available—no decisions recorded yet.'],
        ['Decisions recorded', `${decided} of ${sent}`]
      ]);
      document.dispatchEvent(new CustomEvent('bmt:calculator_used', {detail: {tool: 'quotes-form'}}));
    } catch (e) { error(output, e.message); }
  });
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const text = document.getElementById(button.dataset.copy);
      const status = button.parentElement.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(text.textContent);
        status.textContent = 'Copied. Replace the brackets with your details.';
        document.dispatchEvent(new CustomEvent('bmt:template_copied', {detail: {template: button.dataset.copy}}));
      } catch {
        const selection = window.getSelection();
        const range = document.createRange(); range.selectNodeContents(text);
        selection.removeAllRanges(); selection.addRange(range);
        status.textContent = 'Text selected. Use Copy on your device.';
      }
    });
  });
  // Open templates reached from direct links.
  const revealHash = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.tagName === 'DETAILS') { target.open = true; target.scrollIntoView(); }
  };
  revealHash(); window.addEventListener('hashchange', revealHash);
})();
