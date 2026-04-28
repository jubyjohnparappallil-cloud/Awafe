// ── Video Slider ──
const totalSlides = 3;
let currentSlide = 0;
let sliderTimer = null;
let progressTimer = null;
let isMuted = true;
const SLIDE_DURATION = 7000; // ms

function getSlide(i) { return document.getElementById('vidSlide' + i); }
function getVideo(i) { return document.getElementById('hospVideo' + i); }

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

function goToSlide(index) {
  getSlide(currentSlide)?.classList.remove('active');
  getVideo(currentSlide)?.pause();

  currentSlide = (index + totalSlides) % totalSlides;

  const slide = getSlide(currentSlide);
  const video = getVideo(currentSlide);
  slide?.classList.add('active');
  if (video) {
    video.muted = isMuted;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  document.querySelectorAll('.vid-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });

  startProgress();
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_DURATION);
}

// Start
const firstVideo = getVideo(0);
if (firstVideo) {
  firstVideo.muted = true;
  firstVideo.play().catch(() => {
    document.addEventListener('click', () => firstVideo.play(), { once: true });
  });
}
startProgress();
sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_DURATION);

// Controls
document.getElementById('vidPrev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('vidNext')?.addEventListener('click', () => goToSlide(currentSlide + 1));
document.querySelectorAll('.vid-dot').forEach(dot => {
  dot.addEventListener('click', () => goToSlide(+dot.dataset.i));
});

// Unmute
const unmuteBtn = document.getElementById('vidUnmute');
const vidIcon   = document.getElementById('vidIcon');
if (unmuteBtn) {
  unmuteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    const vid = getVideo(currentSlide);
    if (vid) { vid.muted = isMuted; if (!isMuted) vid.play(); }
    vidIcon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
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

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
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
