/* =========================================================
   Gallery Page — Filters, Lightbox, Scroll Reveals
   ========================================================= */
(function () {

  /* ── Mobile nav ── */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle?.addEventListener('click', () => nav?.classList.toggle('open'));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ── All cards ── */
  const allCards = Array.from(document.querySelectorAll('.gallery-card'));

  /* =========================================================
     SCROLL REVEAL — stagger cards into view
     ========================================================= */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = allCards.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('gc-visible'), idx * 80);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    allCards.forEach(c => obs.observe(c));
  } else {
    allCards.forEach(c => c.classList.add('gc-visible'));
  }

  /* ── CTA reveal ── */
  const ctaEl = document.getElementById('galleryCta');
  if (ctaEl && 'IntersectionObserver' in window) {
    const ctaObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ctaEl.classList.add('in-view'); ctaObs.unobserve(ctaEl); }
    }, { threshold: 0.2 });
    ctaObs.observe(ctaEl);
  }

  /* =========================================================
     FILTER TABS
     ========================================================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const countEl    = document.getElementById('galleryCount');
  let activeFilter = 'all';

  function applyFilter(filter) {
    activeFilter = filter;
    let visible = 0;
    allCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      if (show) {
        card.classList.remove('gc-hidden');
        // re-trigger entrance if not yet visible
        if (!card.classList.contains('gc-visible')) {
          setTimeout(() => card.classList.add('gc-visible'), visible * 80);
        }
        visible++;
      } else {
        card.classList.add('gc-hidden');
      }
    });
    if (countEl) {
      countEl.textContent = filter === 'all'
        ? `Showing all ${visible} photos`
        : `Showing ${visible} photo${visible !== 1 ? 's' : ''} in "${filter}"`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  /* =========================================================
     PAGINATION (prev / next pages)
     ========================================================= */
  const PER_PAGE = 9;
  let page = 0;

  function getVisible() {
    return allCards.filter(c => !c.classList.contains('gc-hidden'));
  }

  function renderPage() {
    const visible = getVisible();
    const total   = Math.ceil(visible.length / PER_PAGE);
    page = Math.max(0, Math.min(page, total - 1));

    visible.forEach((c, i) => {
      const show = i >= page * PER_PAGE && i < (page + 1) * PER_PAGE;
      c.style.display = show ? '' : 'none';
      if (show && !c.classList.contains('gc-visible')) {
        setTimeout(() => c.classList.add('gc-visible'), (i % PER_PAGE) * 80);
      }
    });

    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (prevBtn) { prevBtn.style.opacity = page === 0 ? '.35' : '1'; prevBtn.style.pointerEvents = page === 0 ? 'none' : 'auto'; }
    if (nextBtn) { nextBtn.style.opacity = page >= total - 1 ? '.35' : '1'; nextBtn.style.pointerEvents = page >= total - 1 ? 'none' : 'auto'; }
  }

  document.getElementById('galleryPrev')?.addEventListener('click', () => { page--; renderPage(); window.scrollTo({ top: document.querySelector('.gallery-section').offsetTop - 80, behavior: 'smooth' }); });
  document.getElementById('galleryNext')?.addEventListener('click', () => { page++; renderPage(); window.scrollTo({ top: document.querySelector('.gallery-section').offsetTop - 80, behavior: 'smooth' }); });

  // Re-render on filter change
  const origApply = applyFilter;
  function applyFilterAndPage(filter) {
    origApply(filter);
    page = 0;
    renderPage();
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilterAndPage(btn.dataset.filter));
  });
  // Initial render
  renderPage();

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbDots    = document.getElementById('lbDots');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  let lbIndex = 0;

  function getActiveLbCards() {
    return allCards.filter(c => !c.classList.contains('gc-hidden') && c.style.display !== 'none');
  }

  function openLightbox(idx) {
    const cards = getActiveLbCards();
    if (!cards.length) return;
    lbIndex = ((idx % cards.length) + cards.length) % cards.length;
    const card = cards[lbIndex];
    const img  = card.querySelector('img');

    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = card.dataset.title || img.alt;

    // Dots
    lbDots.innerHTML = '';
    cards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'lb-dot' + (i === lbIndex ? ' active' : '');
      d.addEventListener('click', () => openLightbox(i));
      lbDots.appendChild(d);
    });

    lightbox.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  // Open on card click
  allCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const active = getActiveLbCards();
      const idx = active.indexOf(card);
      if (idx !== -1) openLightbox(idx);
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => openLightbox(lbIndex - 1));
  lbNext?.addEventListener('click', () => openLightbox(lbIndex + 1));

  // Close on backdrop click
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('lb-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  });

  // Touch swipe on lightbox
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? openLightbox(lbIndex + 1) : openLightbox(lbIndex - 1);
  });

})();
