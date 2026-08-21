// Scroll-reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = Number(e.target.dataset.delay || 0) * 100;
      setTimeout(() => e.target.classList.add('revealed'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Toast notification (imported by contact.js)
export function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const color = type === 'error' ? '#F97316' : '#D4AF37';
  const toast = document.createElement('div');
  toast.style.cssText = `background:#111;border:1px solid ${color};border-radius:0.75rem;padding:1rem 1.25rem;margin-bottom:0.75rem;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideIn 0.3s ease;`;
  toast.innerHTML = `
    <div style="font-family:'Anton',sans-serif;font-size:1.05rem;color:#fff;text-transform:uppercase;letter-spacing:0.05em;">${title}</div>
    <div style="font-family:'Poppins',sans-serif;font-size:0.875rem;color:#a3a3a3;margin-top:0.25rem;">${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── RSVP Section Toggle & Submission ───────────────────────
const btnOpenRsvp   = document.getElementById('btn-open-rsvp');
const btnCloseRsvp  = document.getElementById('btn-close-rsvp');
const rsvpInfoView  = document.getElementById('rsvp-info-view');
const rsvpFormView  = document.getElementById('rsvp-form-view');
const socialSelect  = document.getElementById('social-select');
const socialFields  = document.getElementById('social-ticket-fields');

if (btnOpenRsvp && btnCloseRsvp) {
  btnOpenRsvp.addEventListener('click', () => {
    rsvpInfoView.classList.add('hidden');
    rsvpFormView.classList.remove('hidden');
  });

  btnCloseRsvp.addEventListener('click', () => {
    rsvpFormView.classList.add('hidden');
    rsvpInfoView.classList.remove('hidden');
  });
}

// Toggle Laserbounce ticket inputs if skipping social
if (socialSelect && socialFields) {
  socialSelect.addEventListener('change', () => {
    socialFields.style.display = socialSelect.value === 'Yes' ? 'grid' : 'none';
  });
}

// Form Submission Handler
const rsvpForm = document.getElementById('homecoming-rsvp-form');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('rsvp-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    // Convert Form Data to JSON
    const formData = new FormData(rsvpForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });
      
      const result = await response.json();

      if (result.success) {
        rsvpForm.classList.add('hidden');
        document.getElementById('rsvp-success-message').classList.remove('hidden');
      } else {
        alert(result.message || 'Submission failed. Please try again.');
        btn.disabled = false;
        btn.textContent = 'CONFIRM RSVP';
      }
    } catch (err) {
      alert('Network error. Please try again later.');
      btn.disabled = false;
      btn.textContent = 'CONFIRM RSVP';
    }
  });
}
