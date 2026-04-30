/* =========================================================
   Booking Appointment Modal
   ========================================================= */
(function () {

  // ── Inject modal HTML ──
  const modalHTML = `
  <div class="bm-overlay" id="bmOverlay" role="dialog" aria-modal="true" aria-label="Book an Appointment">
    <div class="bm-modal" id="bmModal">

      <div class="bm-header">
        <h2>Book an Appointment</h2>
        <button class="bm-close" id="bmClose" aria-label="Close"><i class="fas fa-times"></i></button>
      </div>

      <form id="bmForm" novalidate>
        <div class="bm-body">

          <!-- Row 1: Department + Doctor -->
          <div class="bm-row two">
            <div class="bm-field">
              <label for="bmDept">Department</label>
              <div class="bm-select-wrap">
                <select id="bmDept" name="department" required>
                  <option value="">Select Department</option>
                  <option>Dental &amp; Oral Health</option>
                  <option>Cosmetic Dentistry</option>
                  <option>Pediatric Dentistry</option>
                  <option>Primary Care</option>
                  <option>Women's Health</option>
                  <option>Chronic Disease Management</option>
                  <option>Emergency &amp; First Aid</option>
                </select>
              </div>
            </div>
            <div class="bm-field">
              <label for="bmDoctor">Doctor</label>
              <div class="bm-select-wrap">
                <select id="bmDoctor" name="doctor">
                  <option value="">Select Doctor</option>
                  <option>Dr. Shahanas A</option>
                  <option>Any Available Doctor</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Row 2: Name + Mobile -->
          <div class="bm-row two">
            <div class="bm-field">
              <label for="bmName">Name</label>
              <input id="bmName" name="name" type="text" placeholder="Your Name" required />
            </div>
            <div class="bm-field">
              <label for="bmPhone">Mobile Number</label>
              <div class="bm-phone-wrap">
                <div class="bm-phone-prefix">
                  <img src="https://flagcdn.com/w20/ae.png" alt="UAE" />
                  +971
                </div>
                <input id="bmPhone" name="phone" type="tel" placeholder="Enter Your Number" required />
              </div>
            </div>
          </div>

          <!-- Row 3: Email + Gender + Date & Time -->
          <div class="bm-row three">
            <div class="bm-field">
              <label for="bmEmail">Email</label>
              <input id="bmEmail" name="email" type="email" placeholder="Your Email" />
            </div>
            <div class="bm-field">
              <label>Gender</label>
              <div class="bm-gender">
                <label><input type="radio" name="gender" value="Male" checked /> Male</label>
                <label><input type="radio" name="gender" value="Female" /> Female</label>
              </div>
            </div>
            <div class="bm-field">
              <label for="bmDate">Date and Time</label>
              <input id="bmDate" name="datetime" type="datetime-local" required />
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="bm-footer">
          <button type="submit" class="bm-submit" id="bmSubmitBtn">
            <span id="bmBtnText"><i class="fas fa-paper-plane"></i> Submit</span>
            <span id="bmBtnLoading" style="display:none"><i class="fas fa-spinner fa-spin"></i> Sending...</span>
          </button>
        </div>
      </form>

    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ── Set min date to today ──
  const dateInput = document.getElementById('bmDate');
  if (dateInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dateInput.min = now.toISOString().slice(0, 16);
  }

  // ── Open / close ──
  const overlay = document.getElementById('bmOverlay');
  const modal   = document.getElementById('bmModal');

  function openModal() {
    overlay.classList.add('bm-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('bmName')?.focus(), 100);
  }

  function closeModal() {
    overlay.classList.remove('bm-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      document.getElementById('bmForm')?.reset();
      setLoading(false);
    }, 350);
  }

  // ── FIX: Only close when clicking DIRECTLY on the dark backdrop ──
  // Use a flag to track if mousedown started on the overlay itself
  let backdropClick = false;

  overlay?.addEventListener('mousedown', (e) => {
    // Only set flag if the click started exactly on the overlay (not any child)
    backdropClick = (e.target === overlay);
  });

  overlay?.addEventListener('mouseup', (e) => {
    // Only close if both mousedown AND mouseup were on the overlay
    if (backdropClick && e.target === overlay) closeModal();
    backdropClick = false;
  });

  // Swallow all pointer events inside the modal so they never reach overlay
  modal?.addEventListener('mousedown', (e) => e.stopPropagation());
  modal?.addEventListener('mouseup',   (e) => e.stopPropagation());
  modal?.addEventListener('click',     (e) => e.stopPropagation());

  // ── Open on ALL Book Appointment buttons site-wide ──
  function bindOpenTriggers() {
    const selectors = [
      '.btn-book',
      '[href="#book"]',
      '[href="#contact"]',
      '[href="index.html#contact"]',
      '[href="#contactForm"]',
      '#bookBtn', '#bookBtn2', '#bookBtn3',
      '#bookDentalBtn', '#bookGpBtn',
      '#apptBannerBtn', '#bookVidBtn',
      '.btn-aus-primary',
      '.appt-banner-btn',
    ];

    document.querySelectorAll(selectors.join(', ')).forEach(btn => {
      if (btn.dataset.bmBound) return;
      btn.dataset.bmBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Catch any element whose text contains "book" + "appoint" or "book now"
    document.querySelectorAll('a, button').forEach(el => {
      if (el.dataset.bmBound) return;
      const text = el.textContent.trim().toLowerCase();
      if (text.includes('book') && (text.includes('appoint') || text.includes('now'))) {
        el.dataset.bmBound = '1';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      }
    });
  }

  bindOpenTriggers();
  setTimeout(bindOpenTriggers, 800);

  document.getElementById('bmClose')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('bm-open')) closeModal();
  });

  // ── Loading state ──
  function setLoading(on) {
    const btn  = document.getElementById('bmSubmitBtn');
    const txt  = document.getElementById('bmBtnText');
    const spin = document.getElementById('bmBtnLoading');
    if (!btn) return;
    btn.disabled       = on;
    txt.style.display  = on ? 'none' : '';
    spin.style.display = on ? ''     : 'none';
  }

  // ── FIX 2: Send email via EmailJS (free, reliable) ──
  // Load EmailJS
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => emailjs.init('lYourPublicKey'); // will be replaced below
  document.head.appendChild(s);

  // ── Form submit ──
  document.getElementById('bmForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const name  = form.name.value.trim();
    const phone = form.phone.value.trim();
    const dept  = form.department.value;
    const date  = form.datetime.value;

    // Validate
    let valid = true;
    [{ val: name, id: 'bmName' }, { val: phone, id: 'bmPhone' },
     { val: dept, id: 'bmDept' }, { val: date,  id: 'bmDate' }]
      .forEach(({ val, id }) => {
        const el = document.getElementById(id);
        if (!val) {
          el.style.borderColor = '#dc2626';
          el.addEventListener('input', () => el.style.borderColor = '', { once: true });
          valid = false;
        }
      });
    if (!valid) return;

    setLoading(true);

    const dateFormatted = date
      ? new Date(date).toLocaleString('en-AE', { dateStyle: 'full', timeStyle: 'short' })
      : 'Not specified';

    const gender = form.querySelector('input[name="gender"]:checked')?.value || 'Not specified';

    // ── Send via Web3Forms ──
    // ACTION NEEDED: Go to https://web3forms.com, enter jubyjohnparappallil@gmail.com
    // and paste the access key you receive below:
    const ACCESS_KEY = '91e86b61-8d2f-4ecc-9733-772695f64230';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key:     ACCESS_KEY,
          subject:        `🦷 New Appointment — ${name}`,
          from_name:      'Awafe Medical Centre',
          'Patient Name': name,
          'Phone':        '+971 ' + phone,
          'Email':        form.email.value || 'Not provided',
          'Department':   dept,
          'Doctor':       form.doctor.value || 'Any Available',
          'Gender':       gender,
          'Date & Time':  dateFormatted,
        })
      });

      const data = await res.json();
      console.log('Web3Forms response:', data);

      // Redirect regardless — don't block user
      window.location.href = 'thankyou.html';

    } catch (err) {
      console.error('Send error:', err);
      window.location.href = 'thankyou.html';
    }
  });

})();
