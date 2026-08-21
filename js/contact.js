import { showToast } from './main.js';

// ── Tab toggle ────────────────────────────────────────────
const tabContact  = document.getElementById('tab-contact');
const tabPrayer   = document.getElementById('tab-prayer');
const formContact = document.getElementById('form-contact');
const formPrayer  = document.getElementById('form-prayer');

function setTab(which) {
  if (which === 'contact') {
    formContact.classList.remove('hidden');
    formPrayer.classList.add('hidden');
    tabContact.style.color = '#fff';
    tabPrayer.style.color  = 'rgba(255,255,255,0.3)';
  } else {
    formPrayer.classList.remove('hidden');
    formContact.classList.add('hidden');
    tabPrayer.style.color  = '#fff';
    tabContact.style.color = 'rgba(255,255,255,0.3)';
  }
}
tabContact.addEventListener('click', () => setTab('contact'));
tabPrayer.addEventListener('click',  () => setTab('prayer'));

// ── Anonymous checkbox ────────────────────────────────────
const anonCheckbox = document.getElementById('p-anon');
const anonBox      = document.getElementById('p-anon-box');
const pIdentity    = document.getElementById('p-identity');

anonCheckbox.addEventListener('change', () => {
  const checked = anonCheckbox.checked;
  anonBox.innerHTML = checked
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
    : '';
  anonBox.style.background  = checked ? '#F97316' : 'transparent';
  anonBox.style.borderColor = checked ? '#F97316' : 'rgba(255,255,255,0.2)';
  pIdentity.style.display   = checked ? 'none' : '';
});

// ── Helpers ───────────────────────────────────────────────
function showErr(id, msg) { const el = document.getElementById(id); if (el) { el.textContent = msg; el.classList.add('visible'); } }
function clearErr(id)      { const el = document.getElementById(id); if (el) el.classList.remove('visible'); }
function isEmail(v)        { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

// ── Contact form ──────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();

  clearErr('c-name-err'); clearErr('c-email-err'); clearErr('c-message-err');
  if (name.length < 2)     { showErr('c-name-err',    'Name is required (min 2 chars)'); valid = false; }
  if (!isEmail(email))     { showErr('c-email-err',   'Valid email is required');        valid = false; }
  if (message.length < 10) { showErr('c-message-err', 'Message must be at least 10 characters'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('c-submit');
  btn.disabled = true;
  btn.textContent = 'SENDING...';

  const formData = new FormData(e.target);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (result.success) {
      showToast('Message Sent!', "Thank you — we'll get back to you soon.");
      document.getElementById('contact-form').reset();
    } else {
      showToast('Error', result.message || 'Something went wrong. Please try again.');
    }
  } catch (error) {
    showToast('Error', 'Unable to send message. Please check your connection.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'SEND MESSAGE';
  }
});

// ── Prayer form ───────────────────────────────────────────
document.getElementById('prayer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;
  const isAnon  = document.getElementById('p-anon').checked;
  const name    = document.getElementById('p-name').value.trim();
  const email   = document.getElementById('p-email').value.trim();
  const request = document.getElementById('p-request').value.trim();

  clearErr('p-name-err'); clearErr('p-email-err'); clearErr('p-request-err');
  if (!isAnon && name.length < 1)         { showErr('p-name-err',    'Name is required');             valid = false; }
  if (!isAnon && email && !isEmail(email)) { showErr('p-email-err',  'Please enter a valid email');   valid = false; }
  if (request.length < 5)                 { showErr('p-request-err', 'Please describe your request'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('p-submit');
  btn.disabled = true;
  btn.textContent = 'SUBMITTING...';

  const formData = new FormData();
  formData.append('access_key', '840d7ea0-cf12-4e5b-9b8e-ae30fa51f9a9');
  formData.append('subject', 'New Prayer Request');
  formData.append('name', isAnon ? 'Anonymous' : (name || 'Anonymous'));
  formData.append('email', isAnon ? 'anonymous@noemail.com' : (email || 'anonymous@noemail.com'));
  formData.append('message', request);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (result.success) {
      showToast('Prayer Request Received', 'Our team will be praying for you.');
      document.getElementById('prayer-form').reset();
      anonCheckbox.checked      = false;
      anonBox.innerHTML         = '';
      anonBox.style.background  = 'transparent';
      anonBox.style.borderColor = 'rgba(255,255,255,0.2)';
      pIdentity.style.display   = '';
    } else {
      showToast('Error', result.message || 'Something went wrong. Please try again.');
    }
  } catch (error) {
    showToast('Error', 'Unable to submit request. Please check your connection.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'SUBMIT PRAYER REQUEST';
  }
});
