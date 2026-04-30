// ── Video Slider ──
const totalSlides = 3;
let currentSlide = 0;
let sliderTimer = null;
let progressTimer = null;
let isMuted = true;
const SLIDE_DURATION = 7000;

// Detect iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

function getSlide(i) { return document.getElementById('vidSlide' + i); }
function getVideo(i) { return document.getElementById('hospVideo' + i); }
function getPoster(i) { return document.getElementById('vidPoster' + i); }
const vidIcon = document.getElementById('vidIcon');
const unmuteBtn = document.getElementById('vidUnmute');

function syncMuteUi() {
  if (vidIcon) {
    vidIcon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
  }
  if (unmuteBtn) {
    unmuteBtn.setAttribute('aria-label', isMuted ? 'Unmute video' : 'Mute video');
    unmuteBtn.setAttribute('title', isMuted ? 'Unmute video' : 'Mute video');
  }
}

function startProgress() {
  const bar = document.getElementById('vidProgressBar');
  if (!bar) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.transition = `width ${SLIDE_DURATION}ms linear`;
    bar.style.width = '100%';
  }, 50);
}

function resetPosterAnim(i) {
  const poster = getPoster(i);
  if (!poster) return;
  poster.style.display = 'block';
  poster.style.animation = 'none';
  poster.offsetHeight; // force reflow
  poster.style.animation = 'posterZoom 8s ease-out forwards';
}

function tryPlayVideo(video, slideIndex) {
  if (!video) return;
  // Ensure muted — required for iOS autoplay
  video.muted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Video playing — hide poster
      const poster = getPoster(slideIndex);
      if (poster) poster.style.display = 'none';
    }).catch((err) => {
      // Autoplay blocked — keep poster visible, advance via timer anyway
      console.warn('Video autoplay blocked:', err);
      // On iOS, try again after a tiny delay (sometimes helps after load)
      if (isIOS) {
        setTimeout(() => {
          video.play().then(() => {
            const poster = getPoster(slideIndex);
            if (poster) poster.style.display = 'none';
          }).catch(() => {
            // Poster stays visible as fallback — that's fine
          });
        }, 300);
      }
    });
  }
}

function goToSlide(index) {
  getSlide(currentSlide)?.classList.remove('active');
  getVideo(currentSlide)?.pause();

  currentSlide = (index + totalSlides) % totalSlides;

  const slide = getSlide(currentSlide);
  const video = getVideo(currentSlide);
  slide?.classList.add('active');

  resetPosterAnim(currentSlide);

  if (video) {
    video.currentTime = 0;
    tryPlayVideo(video, currentSlide);
  }

  document.querySelectorAll('.vid-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });

  startProgress();
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_DURATION);
}

// ── Start first video ──
const firstVideo = getVideo(0);
resetPosterAnim(0);

function initFirstVideo() {
  if (!firstVideo) return;
  tryPlayVideo(firstVideo, 0);
}

// On iOS, video needs a user gesture or must wait for the page to be fully loaded
if (isIOS) {
  // Try on load first
  if (document.readyState === 'complete') {
    initFirstVideo();
  } else {
    window.addEventListener('load', initFirstVideo, { once: true });
  }
  // Also try on first user interaction as fallback
  document.addEventListener('touchstart', function iosUnlock() {
    initFirstVideo();
    document.removeEventListener('touchstart', iosUnlock);
  }, { once: true, passive: true });
} else {
  initFirstVideo();
}

syncMuteUi();
startProgress();
sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_DURATION);

// Controls
document.getElementById('vidPrev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('vidNext')?.addEventListener('click', () => goToSlide(currentSlide + 1));
document.querySelectorAll('.vid-dot').forEach(dot => {
  dot.addEventListener('click', () => goToSlide(+dot.dataset.i));
});

// Unmute
if (unmuteBtn) {
  unmuteBtn.addEventListener('click', () => {
    // iOS does not allow unmuting without a user gesture — this click IS the gesture
    isMuted = !isMuted;
    const vid = getVideo(currentSlide);
    if (vid) {
      vid.muted = isMuted;
      if (!isMuted) {
        // On iOS, must call play() after unmuting to apply the change
        vid.play().catch(() => {
          isMuted = true;
          vid.muted = true;
          syncMuteUi();
        });
      }
    }
    syncMuteUi();
  });
}

// Book button in video overlay opens modal
document.getElementById('bookVidBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('bmOverlay')?.classList.add('bm-open');
  document.body.style.overflow = 'hidden';
});

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('reveal-visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Hero background slow zoom on load
const heroBg = document.querySelector('.hosp-hero-bg');
if (heroBg) {
  setTimeout(() => { heroBg.style.transform = 'scale(1)'; }, 100);
}

// Mobile menu toggle — single handler
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close menu when any nav link is clicked
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// 3D tilt effect on glass cards
document.querySelectorAll('.g-card, .glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Section animations on scroll ──
function animateOnScroll(selector, delay = 0) {
  const els = document.querySelectorAll(selector);
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('anim-in'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('anim-in'), delay + i * 90);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

animateOnScroll('.hosp-gallery .section-head');
animateOnScroll('.g-card', 0);
animateOnScroll('.glass-grid-btm .g-card', 0);
animateOnScroll('.hosp-why .hosp-why-text');
animateOnScroll('.why-feat', 80);
animateOnScroll('.hosp-why-visual');
animateOnScroll('.hosp-services-strip .section-head');
animateOnScroll('.strip-card', 60);
animateOnScroll('.hosp-cta-text');
animateOnScroll('.hosp-cta-img');

// Sync body padding-top to actual header height
(function syncHeaderOffset() {
  const headerEl = document.querySelector('.header');
  if (!headerEl) return;
  const update = () => {
    const h = Math.ceil(headerEl.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-offset', h + 'px');
  };
  update();
  window.addEventListener('load', update);
  window.addEventListener('resize', update);
})();

// Active nav link highlight
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'hospital.html';
  document.querySelectorAll('.nav > a, .nav-dropdown > a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });
})();

// Top bar hide on scroll + header transition
const topBarEl = document.querySelector('.top-bar');
if (topBarEl) {
  topBarEl.style.transition = 'transform .3s ease';
}
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  const scrolled = window.scrollY > 10;
  header?.classList.toggle('scrolled', scrolled);
  if (topBarEl) {
    topBarEl.style.transform = scrolled ? 'translateY(-100%)' : 'translateY(0)';
  }
}, { passive: true });

// Strip book buttons open modal
['bookDentalBtn','bookGpBtn'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('bmOverlay')?.classList.add('bm-open');
    document.body.style.overflow = 'hidden';
  });
});

// Appointment banner button
document.getElementById('apptBannerBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('bmOverlay')?.classList.add('bm-open');
  document.body.style.overflow = 'hidden';
});

// Services dropdown — click to toggle on mobile, hover on desktop
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const trigger = dropdown.querySelector(':scope > a');
  if (!trigger) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobile = window.innerWidth <= 960;
    if (isMobile) {
      const isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
    }
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
  }
});
