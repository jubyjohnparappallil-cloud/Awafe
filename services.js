/* =========================================================
   Services Page — Scroll Animations
   ========================================================= */

// Mobile nav
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => nav.classList.toggle('open'));

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
