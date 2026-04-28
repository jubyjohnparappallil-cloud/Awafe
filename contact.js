(function () {
  /* ── Mobile nav ── */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle?.addEventListener('click', () => nav?.classList.toggle('open'));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ── Header shadow on scroll ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Scroll reveal helper ── */
  function revealOn(el, delay = 0) {
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => el.classList.add('in-view'), delay);
      obs.unobserve(el);
    }, { threshold: 0.12 });
    obs.observe(el);
  }

  /* Trigger reveals */
  revealOn(document.getElementById('colForm'),   0);
  revealOn(document.getElementById('colInfo'),   100);
  revealOn(document.getElementById('infoEmail'), 0);
  revealOn(document.getElementById('infoPhone'), 120);
  revealOn(document.getElementById('infoWa'),    240);
  revealOn(document.getElementById('infoLoc'),   360);
  revealOn(document.getElementById('hoursCard'), 480);
  revealOn(document.getElementById('mapLabel'),  0);
  revealOn(document.getElementById('mapWrap'),   120);

  /* ── Toast ── */
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ── Form validation ── */
  const form = document.getElementById('contactForm');
  if (!form) return;

  function setError(name, msg) {
    const el = form.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = msg || '';
  }
  function clearErrors() {
    form.querySelectorAll('.error').forEach(e => e.textContent = '');
  }
  function validate(d) {
    const errs = {};
    if (!d.firstName.trim())  errs.firstName = 'First name is required';
    if (!d.lastName.trim())   errs.lastName  = 'Last name is required';
    if (!d.email.trim())      errs.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errs.email = 'Invalid email address';
    if (!d.phone.trim() || d.phone.replace(/\D/g,'').length < 5) errs.phone = 'Valid phone number required';
    if (!d.message.trim())    errs.message   = 'Please enter a message';
    if (!d.agree)             errs.agree     = 'You must agree to the privacy policy';
    return errs;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    const d = {
      firstName: form.firstName.value,
      lastName:  form.lastName.value,
      email:     form.email.value,
      phone:     form.phone.value,
      message:   form.message.value,
      agree:     form.agree.checked,
    };
    const errs = validate(d);
    if (Object.keys(errs).length) {
      Object.entries(errs).forEach(([k, v]) => setError(k, v));
      return;
    }
    showToast("Message sent — we'll get back to you shortly!");
    form.reset();
  });

  /* Clear error on input */
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => setError(el.name || el.id, ''));
  });

  /* ── Input focus animation ── */
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => {
      el.closest('.field')?.classList.add('focused');
    });
    el.addEventListener('blur', () => {
      el.closest('.field')?.classList.remove('focused');
    });
  });

})();
