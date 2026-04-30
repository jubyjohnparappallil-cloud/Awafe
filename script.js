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
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.classList.remove('active');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));
// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav?.classList.contains('open') &&
      !menuToggle?.contains(e.target) &&
      !nav?.contains(e.target)) {
    nav.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

// Active nav link highlight
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav > a, .nav-dropdown > a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });
})();

// Header scroll shadow
const headerEl = document.querySelector('.header');
function syncHeaderOffset() {
  if (!headerEl) return;
  const headerHeight = Math.ceil(headerEl.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--header-offset', `${headerHeight}px`);
}

syncHeaderOffset();
window.addEventListener('load', syncHeaderOffset);
window.addEventListener('resize', syncHeaderOffset);
window.addEventListener('scroll', () => {
  headerEl?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Services carousel (back/next arrows)
const grid = document.getElementById('servicesGrid');
const nextBtn = document.getElementById('servNext');
const prevBtn = document.getElementById('servPrev');

if (grid && nextBtn && prevBtn) {
  function getSlideAmount() {
    const firstCard = grid.querySelector('.service-card');
    if (!firstCard) return 340;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(grid).gap) || 20;
    return cardWidth + gap;
  }

  function updateArrowState() {
    const maxScrollLeft = grid.scrollWidth - grid.clientWidth;
    const atStart = grid.scrollLeft <= 2;
    const atEnd = grid.scrollLeft >= maxScrollLeft - 2;

    prevBtn.style.opacity = atStart ? '0.3' : '1';
    prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
    nextBtn.style.opacity = atEnd ? '0.3' : '1';
    nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
  }

  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: getSlideAmount(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -getSlideAmount(), behavior: 'smooth' });
  });

  // Update dots on scroll
  const servDots = document.querySelectorAll('#servDots .dot');
  function updateDots() {
    if (!servDots.length) return;
    const cardWidth = grid.querySelector('.service-card')?.getBoundingClientRect().width || 300;
    const gap = parseFloat(window.getComputedStyle(grid).gap) || 20;
    const slideW = cardWidth + gap;
    const idx = Math.min(
      Math.round(grid.scrollLeft / slideW),
      servDots.length - 1
    );
    servDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  grid.addEventListener('scroll', () => { updateArrowState(); updateDots(); }, { passive: true });
  window.addEventListener('resize', () => { updateArrowState(); updateDots(); });
  updateArrowState();
  updateDots();
}

// Gallery paging arrows (3 rows per page on desktop)
const galleryGrid = document.getElementById('galleryGrid');
const galleryNext = document.getElementById('galleryNext');
const galleryPrev = document.getElementById('galleryPrev');

if (galleryGrid && galleryNext && galleryPrev) {
  const allGalleryCards = Array.from(galleryGrid.querySelectorAll('.gallery-card'));
  let galleryPage = 0;

  function getCardsPerPage() {
    if (window.innerWidth <= 600) return 3;
    if (window.innerWidth <= 960) return 6;
    return 9;
  }

  function renderGalleryPage() {
    const cardsPerPage = getCardsPerPage();
    const totalPages = Math.max(1, Math.ceil(allGalleryCards.length / cardsPerPage));
    galleryPage = Math.min(galleryPage, totalPages - 1);
    const start = galleryPage * cardsPerPage;
    const end = start + cardsPerPage;

    allGalleryCards.forEach((card, idx) => {
      card.style.display = idx >= start && idx < end ? '' : 'none';
    });

    const atStart = galleryPage === 0;
    const atEnd = galleryPage >= totalPages - 1;
    galleryPrev.style.opacity = atStart ? '0.3' : '1';
    galleryPrev.style.pointerEvents = atStart ? 'none' : 'auto';
    galleryNext.style.opacity = atEnd ? '0.3' : '1';
    galleryNext.style.pointerEvents = atEnd ? 'none' : 'auto';
  }

  galleryNext.addEventListener('click', () => {
    galleryPage += 1;
    renderGalleryPage();
  });

  galleryPrev.addEventListener('click', () => {
    galleryPage -= 1;
    renderGalleryPage();
  });

  window.addEventListener('resize', renderGalleryPage);
  renderGalleryPage();
}

// Testimonials data
const testimonials = [
  {
    name: 'Oliver Jake',
    photo: 'images/patient-1.png',
    text: "Dr. Shahanas A is incredible. I had a dental emergency on a Sunday while travelling in the desert, and she promptly responded through Google Maps chat and arranged an appointment for the following day. I received an excellent solution, and I felt extremely fortunate and grateful for her care."
  },
  {
    name: 'Sarah Mitchell',
    photo: 'images/patient-2.png',
    text: "The entire team at Awafe Medical Centre made me feel comfortable from the moment I walked in. The clinic uses the latest technology and the results of my smile makeover exceeded my expectations. Highly recommended!"
  },
  {
    name: 'David Cooper',
    photo: 'images/patient-3.png',
    text: "I've been a patient here for years. The professionalism, the warmth and the quality of care are unmatched. My family also visits regularly and we trust them completely with our dental health."
  },
  {
    name: 'Margaret Allen',
    photo: 'images/patient-4.png',
    text: "After years of being nervous about dental visits, the gentle approach at Awafe finally helped me overcome my fear. They take the time to explain every step. Truly grateful for their patience and expertise."
  }
];

let currentIdx = 0;
const photoEl = document.getElementById('testPhoto');
const textEl = document.getElementById('testText');
const nameEl = document.getElementById('testName');
const thumbs = document.querySelectorAll('#testThumbs img');
const dots = document.querySelectorAll('#testDots .dot');

function showTestimonial(i) {
  if (!photoEl || !textEl || !nameEl) return;
  currentIdx = (i + testimonials.length) % testimonials.length;
  const t = testimonials[currentIdx];
  photoEl.src = t.photo;
  textEl.textContent = t.text;
  nameEl.textContent = t.name;
  thumbs.forEach(el => el.classList.toggle('active', +el.dataset.i === currentIdx));
  dots.forEach((el, idx) => el.classList.toggle('active', idx === currentIdx));
}
if (photoEl && textEl && nameEl) {
  thumbs.forEach(el => el.addEventListener('click', () => showTestimonial(+el.dataset.i)));
  dots.forEach((el, idx) => el.addEventListener('click', () => showTestimonial(idx)));
  document.getElementById('testPrev')?.addEventListener('click', () => showTestimonial(currentIdx - 1));
  document.getElementById('testNext')?.addEventListener('click', () => showTestimonial(currentIdx + 1));

  // Auto-rotate testimonials
  setInterval(() => showTestimonial(currentIdx + 1), 7000);
}

// Contact form — Web3Forms submission
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn  = document.getElementById('contactSubmitBtn');

  // Basic validation
  const name  = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  if (!name || !email || !phone) return;

  // Loading state
  const origHTML = btn.innerHTML;
  btn.disabled   = true;
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '91e86b61-8d2f-4ecc-9733-772695f64230',
        subject:    `New Message from ${name} — Awafe Website`,
        from_name:  'Awafe Medical Centre Website',
        'Name':     name,
        'Email':    email,
        'Phone':    phone,
        'Message':  form.message.value || 'No message provided',
      })
    });

    const data = await res.json();

    if (data.success) {
      btn.innerHTML  = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error(err);
    btn.innerHTML = origHTML;
    btn.disabled  = false;
    alert('Something went wrong. Please call us at +971 9236 5337');
  }
});

// Scroll reveal animation
const revealItems = document.querySelectorAll(
  '.section-head, .service-card, .svc-card, .about-content, .about-image, .stat, .testimonial-card, .care-card, .testi-card, .cta-text, .cta-image, .contact-card, .reach-card, .map-card, .gallery-title, .gallery-card'
);

if ('IntersectionObserver' in window && revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(idx * 40, 280)}ms`;
    revealObserver.observe(el);
  });
}


/* =========================================================
   Index Enhancements — Scroll Reveal + Stats Counter
   ========================================================= */

// Scroll reveal for .sr, .sr-left, .sr-right
const srItems = document.querySelectorAll('.sr, .sr-left, .sr-right');
if ('IntersectionObserver' in window && srItems.length) {
  const srObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('sr-visible'), i * 80);
      srObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  srItems.forEach(el => srObserver.observe(el));
}

// Stats bar — trigger colour + stagger when in view
const statsBar = document.querySelector('.stats-bar');
if (statsBar && 'IntersectionObserver' in window) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statsBar.classList.add('in-view');
      statsObs.unobserve(statsBar);
    }
  }, { threshold: 0.3 });
  statsObs.observe(statsBar);
}

// Animated number counter for stat strong elements
function animateCount(el) {
  const raw = el.textContent.trim();
  const num = parseInt(raw.replace(/\D/g, ''), 10);
  if (!num) return;
  const suffix = raw.replace(/[\d,]/g, '');
  let start = 0;
  const duration = 1400;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * num).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if (statsBar && 'IntersectionObserver' in window) {
  const countObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statsBar.querySelectorAll('strong').forEach(animateCount);
      countObs.unobserve(statsBar);
    }
  }, { threshold: 0.4 });
  countObs.observe(statsBar);
}

// Service cards — stagger entrance
const serviceCards = document.querySelectorAll('.service-card');
if ('IntersectionObserver' in window && serviceCards.length) {
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cards = entry.target.querySelectorAll('.service-card');
      cards.forEach((c, i) => {
        setTimeout(() => c.classList.add('sr-visible'), i * 100);
      });
      cardObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  const servGrid = document.getElementById('servicesGrid');
  if (servGrid) {
    serviceCards.forEach(c => c.classList.add('sr'));
    cardObs.observe(servGrid);
  }
}

// Doctor cards scroll reveal
const doctorCards = document.querySelectorAll('.doctor-card');
if ('IntersectionObserver' in window && doctorCards.length) {
  const docObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('doc-visible'), i * 150);
      docObs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  doctorCards.forEach(c => docObs.observe(c));
}

// GP Services carousel
const gpGrid = document.getElementById('gpGrid');
const gpNext = document.getElementById('gpNext');
const gpPrev = document.getElementById('gpPrev');
const gpDots = document.querySelectorAll('#gpDots .dot');

if (gpGrid && gpNext && gpPrev) {
  function getGpSlide() {
    const card = gpGrid.querySelector('.service-card');
    if (!card) return 320;
    return card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(gpGrid).gap) || 20);
  }
  function updateGpDots() {
    const max = gpGrid.scrollWidth - gpGrid.clientWidth;
    const idx = Math.min(Math.round(gpGrid.scrollLeft / getGpSlide()), gpDots.length - 1);
    gpDots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  function updateGpArrows() {
    const max = gpGrid.scrollWidth - gpGrid.clientWidth;
    gpPrev.style.opacity = gpGrid.scrollLeft <= 2 ? '.35' : '1';
    gpNext.style.opacity = gpGrid.scrollLeft >= max - 2 ? '.35' : '1';
  }
  gpNext.addEventListener('click', () => gpGrid.scrollBy({ left: getGpSlide(), behavior: 'smooth' }));
  gpPrev.addEventListener('click', () => gpGrid.scrollBy({ left: -getGpSlide(), behavior: 'smooth' }));
  gpGrid.addEventListener('scroll', () => { updateGpArrows(); updateGpDots(); }, { passive: true });
  gpDots.forEach((d, i) => d.addEventListener('click', () => gpGrid.scrollTo({ left: i * getGpSlide(), behavior: 'smooth' })));
  updateGpArrows();
}

// Services dropdown — click to toggle on mobile, hover on desktop
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const trigger = dropdown.querySelector(':scope > a');
  if (!trigger) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobile = window.innerWidth <= 960;
    if (isMobile) {
      // Toggle this dropdown, close others
      const isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
    }
    // On desktop, hover handles it — click does nothing extra
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
  }
});

// ── Page load left-slide animations ──
(function() {
  // Elements that slide in from left on load
  const leftEls = [
    '.hero-content',
    '.about-us-text',
    '.hosp-why-text',
    '.page-head-inner',
    '.gallery-hero-inner',
    '.gp-hero-content',
    '.col-form',
    '.ty-card',
  ];

  // Elements that slide in from right on load
  const rightEls = [
    '.hero-image',
    '.about-us-video',
    '.col-info',
  ];

  // Elements that slide up on load
  const upEls = [
    '.stats-bar',
    '.hosp-stats-grid',
    '.gallery-hero-stats',
    '.page-head-scroll',
  ];

  function applyLoadAnim(selectors, cls) {
    selectors.forEach((sel, si) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = cls === 'page-load-left' ? 'translateX(-60px)'
                           : cls === 'page-load-right' ? 'translateX(60px)'
                           : 'translateY(40px)';
        el.style.transition = `opacity .7s ${(si * 0.1 + i * 0.08).toFixed(2)}s ease, transform .7s ${(si * 0.1 + i * 0.08).toFixed(2)}s ease`;
        // Trigger after a tiny delay so transition fires
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translate(0)';
          });
        });
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyLoadAnim(leftEls,  'page-load-left');
      applyLoadAnim(rightEls, 'page-load-right');
      applyLoadAnim(upEls,    'page-load-up');
    });
  } else {
    applyLoadAnim(leftEls,  'page-load-left');
    applyLoadAnim(rightEls, 'page-load-right');
    applyLoadAnim(upEls,    'page-load-up');
  }
})();

// ── Page transition — clean curtain from left ──
(function() {
  // Create curtain element
  function makeCurtain() {
    const c = document.createElement('div');
    c.className = 'page-curtain';
    c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;background:linear-gradient(135deg,#0f2d5e 0%,#1d4ed8 60%,#06b6d4 100%);transform-origin:left center;';
    return c;
  }

  // On page load — curtain slides OUT revealing the page
  const curtain = makeCurtain();
  curtain.style.transform = 'scaleX(1)';
  curtain.style.transition = 'transform .65s cubic-bezier(.77,0,.18,1)';
  document.body.appendChild(curtain);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      curtain.style.transform = 'scaleX(0)';
      curtain.addEventListener('transitionend', () => curtain.remove(), { once: true });
    });
  });

  // On link click — curtain slides IN then navigates
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('tel:') || href.startsWith('mailto:') ||
        href.startsWith('https://wa.me') || link.target === '_blank') return;

    e.preventDefault();

    const exit = makeCurtain();
    exit.style.transform = 'scaleX(0)';
    exit.style.transition = 'transform .45s cubic-bezier(.77,0,.18,1)';
    document.body.appendChild(exit);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        exit.style.transform = 'scaleX(1)';
        exit.addEventListener('transitionend', () => {
          window.location.href = href;
        }, { once: true });
      });
    });
  });
})();
