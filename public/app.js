const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const productData = {
  signage: { title: 'Business & brand signage', image: 'signage', description: 'Give your business a physical presence with considered proportions, layered materials and a finish that reflects your brand.', items: ['Reception and logo signs', 'Individual wall letters with placement templates', 'Layered acrylic lettering and plaques', 'Coordinated signage for a new space'], note: 'Share your logo, approximate dimensions and a photo of the intended location. We’ll discuss mounting and material options.' },
  counter: { title: 'QR & counter signs', image: 'counter', description: 'Bring the next useful action into your customer’s space. A tidy, branded display for your counter, reception desk or tables.', items: ['Review and social media QR signs', 'Booking and menu displays', 'Guest Wi-Fi information', 'Coordinated table numbers and counter branding'], note: 'Tell us which link or information you want to share. Final QR codes are checked on the finished material; concept images show illustrative codes only.' },
  retail: { title: 'Retail & point of sale', image: 'counter', description: 'Give your products a considered setting, with compact displays and supporting signage designed around how you sell.', items: ['Branded product risers and stands', 'Price and product information holders', 'Countertop point-of-sale displays', 'Small retail and market display sets'], note: 'Include the size and weight of the products you want to display, the available counter space and the number of locations.' },
  industrial: { title: 'Industrial & identification', image: 'materials', description: 'Legible, repeatable engraved identification, planned around the equipment, environment and information it needs to carry.', items: ['Equipment and asset identification tags', 'Engraved laminate labels', 'Serial-number and inventory nameplates', 'Customer-specified panel identification'], note: 'Share a label schedule, quantities and the intended environment. Material suitability, fixing, heat and chemical exposure are assessed before quoting.' },
  interiors: { title: 'Spaces & wayfinding', image: 'signage', description: 'Bring consistency to the details throughout your space, from the first door to the last table.', items: ['Door and room identification', 'Table numbers and reserved signs', 'Internal directional signage', 'Coordinated sets for offices and guest spaces'], note: 'Send your room or table list, quantities, brand colours and fixing preferences. We’ll help establish a consistent design across the set.' },
  showroom: { title: 'Showroom & bespoke pieces', image: 'materials', description: 'A practical home for your samples, ideas and product information. Made around your space and the way your customers choose.', items: ['Material sample boards and holders', 'Showroom product identification', 'Branded consultation-desk displays', 'Bespoke laser-cut presentation pieces'], note: 'Send a sketch, reference or description with approximate dimensions. For sample holders, include the material sizes and weights.' }
};
document.getElementById('year').textContent = new Date().getFullYear();
const menuButton = $('.menu-toggle');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); $('#mobile-nav').hidden = true; }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); $('#mobile-nav').hidden = !open; });
$$('#mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 851px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
});
let selectedProduct = '';
$$('[data-product]').forEach(button => button.addEventListener('click', () => {
  const product = productData[button.dataset.product];
  selectedProduct = product.title;
  $('#product-title').textContent = product.title;
  $('#product-description').textContent = product.description;
  $('#product-image').src = `/assets/${product.image}.webp`;
  $('#product-image').alt = `Concept illustration for ${product.title.toLowerCase()}`;
  $('#product-items').replaceChildren(...product.items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  $('#product-note').textContent = product.note;
  $('#product-dialog').showModal();
}));
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  $$('.work-card').forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  $('.work-grid').classList.toggle('filtered', filter !== 'all');
}));
let currentStep = 0;
let briefText = '';
const form = $('#quote-form');
function setStep(step) {
  currentStep = step;
  $$('[data-step]').forEach(fieldset => { const active = Number(fieldset.dataset.step) === step; fieldset.hidden = !active; fieldset.disabled = !active; });
  form.hidden = step === 2;
  $('#brief-result').hidden = step !== 2;
  $$('.quote-progress li').forEach((li, i) => { if (i === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  $('#quote-dialog').scrollTop = 0;
}
function openQuote(type) { closeMenu(); if (type) $('#project-type').value = type; setStep(0); $('#brief-status').textContent = ''; $('#quote-dialog').showModal(); }
$$('[data-quote]').forEach(button => button.addEventListener('click', () => openQuote()));
$('#product-quote').addEventListener('click', () => { $('#product-dialog').close(); openQuote(selectedProduct); });
function validateStep() { return $$('input, select, textarea', $(`[data-step="${currentStep}"]`)).every(input => input.reportValidity()); }
$('#next-step').addEventListener('click', () => { if (validateStep()) { setStep(1); $('#project-name').focus(); } });
$('#previous-step').addEventListener('click', () => { setStep(0); $('#project-type').focus(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateStep()) return;
  if (currentStep === 0) { setStep(1); $('#project-name').focus(); return; }
  const value = name => form.elements.namedItem(name).value.trim();
  const date = value('date');
  briefText = [
    'ETCHED LASER STUDIO — PROJECT BRIEF', '',
    `Project: ${value('type')}`, `Quantity: ${value('quantity')}`, `Approximate size: ${value('size') || 'To be discussed'}`, '',
    'THE IDEA', value('description'), '',
    'PROJECT DETAILS', `Budget: ${value('budget') || 'To be discussed'}`, `Needed by: ${date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-GB') : 'Flexible / to be discussed'}`, `Delivery area: ${value('location') || 'To be discussed'}`, '',
    'CONTACT', `Name: ${value('name')}`, `Business: ${value('business') || 'Not provided'}`, `Email: ${value('email')}`, '',
    'This is a project brief, not an order. Pricing, specification and lead time are subject to an agreed quotation.'
  ].join('\n');
  $('#brief-preview').textContent = briefText;
  const inbox = window.ETCHED_CONFIG?.enquiryEmail?.trim();
  const hasEmail = inbox && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inbox);
  $('#email-brief').hidden = !hasEmail;
  if (hasEmail) { $('#email-brief').href = `mailto:${encodeURIComponent(inbox)}?subject=${encodeURIComponent(`Project enquiry: ${value('type')}`)}&body=${encodeURIComponent(briefText)}`; $('#delivery-note').textContent = 'Your brief is ready to share. Email opens your own email app for you to review and send. Nothing has been sent yet.'; }
  setStep(2);
  $('#download-brief').focus();
});
$('#edit-brief').addEventListener('click', () => { setStep(1); $('#project-name').focus(); });
$('#download-brief').addEventListener('click', () => { const blob = new Blob([briefText], {type:'text/plain;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'Etched-Laser-Studio-Project-Brief.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('#brief-status').textContent = 'Your brief has been prepared for download. It has not been sent to the studio.'; });
$('#copy-brief').addEventListener('click', async () => { try { await navigator.clipboard.writeText(briefText); $('#brief-status').textContent = 'Brief copied. You can paste it into an email or document.'; } catch { $('#brief-status').textContent = 'Copy is unavailable in this browser. Download the brief instead.'; } });
$('#privacy-open').addEventListener('click', () => $('#privacy-dialog').showModal());
