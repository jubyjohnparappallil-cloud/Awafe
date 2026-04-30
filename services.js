/* =========================================================
   Services Page — Scroll Animations
   ========================================================= */

// Mobile nav
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

if (!('IntersectionObserver' in window)) {
  // Fallback: show everything immediately
  document.querySelectorAll('.svc-card, .care-card, .testi-card').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

// Stagger a group of elements into view
function staggerReveal(selector, delay = 100) {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // find index among all items (not just siblings) for consistent stagger
      const idx = Array.from(items).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('card-visible'), idx * delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
}

staggerReveal('.svc-card',  110);
staggerReveal('.care-card',  80);
staggerReveal('.testi-card', 150);

// Single element fade-in
function fadeIn(selector, delay = 0) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .65s ease, transform .65s ease';

  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, delay);
    obs.unobserve(el);
  }, { threshold: 0.15 });
  obs.observe(el);
}

fadeIn('.testi-left',  0);
fadeIn('.cta-text',    0);
fadeIn('.cta-image', 150);
fadeIn('.comp-care h2', 0);
fadeIn('.comp-care .lead', 100);

// Dental description card click animations
document.querySelectorAll('.dental-desc-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Pulse animation
    this.classList.remove('card-clicked');
    void this.offsetWidth; // force reflow
    this.classList.add('card-clicked');
    setTimeout(() => this.classList.remove('card-clicked'), 400);

    // Ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Dental side book button
document.getElementById('bookDentalSideBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('bmOverlay')?.classList.add('bm-open');
  document.body.style.overflow = 'hidden';
});

// GP side book button
document.getElementById('bookGpSideBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('bmOverlay')?.classList.add('bm-open');
  document.body.style.overflow = 'hidden';
});
