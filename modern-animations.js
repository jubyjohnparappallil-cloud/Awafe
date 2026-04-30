/* =========================================================
   Awafe Medical Centre — Modern Animations JavaScript
   Scroll reveals, interactions, micro-animations
   ========================================================= */

(function() {
  'use strict';

  // ===== Scroll Progress Bar =====
  function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // ===== Intersection Observer for Scroll Reveal =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, ' +
      '.service-card, .svc-card, .care-card, .testi-card, .gallery-card, ' +
      '.hosp-doc-card, .circle-svc, .gp-card, .info-card, .stat, ' +
      '.col-form, .col-info, .map-label, .map-wrap, .info-card'
    );

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger delay based on element index within parent
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children);
            const siblingIndex = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (siblingIndex * 0.1) + 's';
          }
          
          entry.target.classList.add('active');
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // ===== Ripple Effect for Buttons =====
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, button, .btn-primary, .btn-submit');
    
    buttons.forEach(button => {
      button.classList.add('ripple');
      
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ===== Magnetic Button Effect =====
  function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-book, .fab');
    
    magneticElements.forEach(el => {
      el.classList.add('magnetic');
      
      el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      el.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // ===== Parallax Effect =====
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-img, .parallax');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ===== Counter Animation =====
  function initCounters() {
    const counters = document.querySelectorAll('.counter, .stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.textContent.replace(/\D/g, '')) || 0;
          const duration = 2000;
          const startTime = performance.now();
          
          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * endValue);
            
            target.textContent = currentValue.toLocaleString() + '+';
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }
          
          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ===== Header Scroll Effect =====
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ===== Smooth Scroll for Anchor Links =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===== Card Hover Tilt Effect =====
  function initCardTilt() {
    const cards = document.querySelectorAll(
      '.service-card, .svc-card, .care-card, .testi-card, ' +
      '.gallery-card, .info-card, .stat'
    );
    
    cards.forEach(card => {
      card.classList.add('card-3d');
      
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // ===== Image Lazy Loading with Fade =====
  function initLazyImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  // ===== Typing Effect for Hero Text =====
  function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      el.classList.add('typing-effect');
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);
    });
  }

  // ===== Notification Toast Animation =====
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.className = `toast show ${type}`;
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // ===== Stagger Animation for Lists =====
  function initStaggerAnimations() {
    const lists = document.querySelectorAll('.stagger-list');
    
    lists.forEach(list => {
      const items = list.children;
      Array.from(items).forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
      });
      
      const listObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Array.from(items).forEach(item => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
            listObserver.unobserve(entry.target);
          }
        });
      });
      
      listObserver.observe(list);
    });
  }

  // ===== Icon Animation on Hover =====
  function initIconAnimations() {
    const icons = document.querySelectorAll('.service-icon i, .stat i, .info-icon i');
    
    icons.forEach(icon => {
      icon.parentElement.addEventListener('mouseenter', () => {
        icon.classList.add('icon-spin');
      });
      
      icon.parentElement.addEventListener('mouseleave', () => {
        setTimeout(() => icon.classList.remove('icon-spin'), 600);
      });
    });
  }

  // ===== Initialize All Animations =====
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
  }

  function runInit() {
    createScrollProgress();
    initScrollReveal();
    initRippleEffect();
    initMagneticButtons();
    initParallax();
    initCounters();
    initHeaderScroll();
    initSmoothScroll();
    initCardTilt();
    initLazyImages();
    initTypingEffect();
    initStaggerAnimations();
    initIconAnimations();

    // Add page transition class
    document.body.classList.add('page-transition');

    // Expose showToast globally
    window.showModernToast = showToast;

    console.log('🎨 Awafe Modern Animations initialized!');
  }

  // Start initialization
  init();

})();
