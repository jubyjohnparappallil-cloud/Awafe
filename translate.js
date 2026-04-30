/* =========================================================
   EN / AR Switcher
   Uses Google Translate element + cookie + combo select
   with aggressive retry — works on hosted sites
   ========================================================= */
(function () {

  var LANG_KEY = 'awafe-lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'en';

  /* ── helpers ── */
  function setGoogCookie(lang) {
    var val = lang === 'ar' ? '/en/ar' : '/en/en';
    var exp = lang === 'ar' ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    document.cookie = 'googtrans=' + val + exp + '; path=/';
    document.cookie = 'googtrans=' + val + exp + '; domain=' + location.hostname + '; path=/';
    // also try without leading dot
    document.cookie = 'googtrans=' + val + exp + '; domain=.' + location.hostname + '; path=/';
  }

  function hideGoogleBar() {
    // Reset any body/html shifts Google Translate applies
    document.documentElement.style.top = '0';
    document.documentElement.style.marginTop = '0';
    document.body.style.top = '0';
    document.body.style.marginTop = '0';

    // Hide the GT toolbar iframe
    document.querySelectorAll(
      '.goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, iframe.goog-te-banner-frame, body > .skiptranslate'
    ).forEach(function (el) {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.height = '0';
      el.style.minHeight = '0';
    });
  }

  function doSelect(lang, attempts) {
    var sel = document.querySelector('.goog-te-combo');
    if (sel) {
      sel.value = lang === 'ar' ? 'ar' : 'en';
      sel.dispatchEvent(new Event('change'));
      hideGoogleBar();
      return;
    }
    if (attempts > 0) {
      setTimeout(function () { doSelect(lang, attempts - 1); }, 400);
    }
  }

  /* ── Google Translate widget init callback ── */
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ar',
      autoDisplay: false
    }, 'google_translate_element');

    // After widget is ready, apply saved language
    if (currentLang === 'ar') {
      setTimeout(function () { doSelect('ar', 15); }, 600);
    }
  };

  /* ── Switch language ── */
  function switchLang(lang) {
    localStorage.setItem(LANG_KEY, lang);

    // Update switcher UI immediately
    document.querySelectorAll('.lang-select').forEach(function (el) { el.value = lang; });
    document.querySelectorAll('.lang-label').forEach(function (el) { el.textContent = lang.toUpperCase(); });
    document.querySelectorAll('.lang-flag').forEach(function (el) { el.textContent = lang === 'ar' ? '🇦🇪' : '🇬🇧'; });
    document.querySelectorAll('.lang-opt').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === lang); });

    setGoogCookie(lang);

    var sel = document.querySelector('.goog-te-combo');
    if (sel) {
      // Widget already loaded — use it directly
      sel.value = lang === 'ar' ? 'ar' : 'en';
      sel.dispatchEvent(new Event('change'));
      hideGoogleBar();
      if (lang === 'en') {
        // Google Translate doesn't have a true "reset" — reload clears it
        setTimeout(function () { location.reload(); }, 300);
      }
    } else {
      // Widget not loaded yet — set cookie and reload so GT picks it up
      location.reload();
    }
  }

  /* ── Inject hidden Google Translate container ── */
  function injectGoogleDiv() {
    if (document.getElementById('google_translate_element')) return;
    var d = document.createElement('div');
    d.id = 'google_translate_element';
    d.style.cssText = 'position:fixed;bottom:-200px;left:-200px;opacity:0;pointer-events:none;z-index:-1;';
    document.body.appendChild(d);
  }

  /* ── Load Google Translate script ── */
  function loadGTScript() {
    if (document.getElementById('gt-script')) return;
    var s = document.createElement('script');
    s.id = 'gt-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(s);
  }

  /* ── Build the EN/AR switcher button ── */
  function injectSwitcher() {
    document.querySelectorAll('.nav').forEach(function (nav) {
      if (nav.querySelector('.lang-switcher')) return;

      var lang = currentLang;
      var sw = document.createElement('div');
      sw.className = 'lang-switcher';
      sw.innerHTML =
        '<button class="lang-trigger" type="button" aria-label="Switch language">' +
          '<span class="lang-flag">' + (lang === 'ar' ? '🇦🇪' : '🇬🇧') + '</span>' +
          '<span class="lang-label">' + lang.toUpperCase() + '</span>' +
          '<i class="fas fa-chevron-down" style="font-size:9px;margin-left:3px;"></i>' +
        '</button>' +
        '<div class="lang-drop">' +
          '<button class="lang-opt ' + (lang === 'en' ? 'active' : '') + '" data-lang="en" type="button">🇬🇧 English</button>' +
          '<button class="lang-opt ' + (lang === 'ar' ? 'active' : '') + '" data-lang="ar" type="button">🇦🇪 العربية</button>' +
        '</div>';

      nav.appendChild(sw);

      sw.querySelector('.lang-trigger').addEventListener('click', function (e) {
        e.stopPropagation();
        sw.querySelector('.lang-drop').classList.toggle('open');
      });

      sw.querySelectorAll('.lang-opt').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          sw.querySelector('.lang-drop').classList.remove('open');
          switchLang(btn.dataset.lang);
        });
      });

      document.addEventListener('click', function () {
        var drop = sw.querySelector('.lang-drop');
        if (drop) drop.classList.remove('open');
      });
    });
  }

  /* ── Init ── */
  /* Plain native language dropdown */
  function injectSwitcher() {
    document.querySelectorAll('.nav').forEach(function (nav) {
      if (nav.querySelector('.lang-switcher')) return;

      var lang = currentLang;
      var sw = document.createElement('div');
      sw.className = 'lang-switcher';
      sw.innerHTML =
        '<select class="lang-select" aria-label="Select language">' +
          '<option value="en"' + (lang === 'en' ? ' selected' : '') + '>English</option>' +
          '<option value="ar"' + (lang === 'ar' ? ' selected' : '') + '>Arabic</option>' +
        '</select>';

      nav.appendChild(sw);

      sw.querySelector('.lang-select').addEventListener('change', function (e) {
        switchLang(e.target.value);
      });
    });
  }

  function init() {
    // If AR was saved, set cookie before GT loads so it picks it up
    if (currentLang === 'ar') {
      setGoogCookie('ar');
    }
    injectGoogleDiv();
    injectSwitcher();
    loadGTScript();
    hideGoogleBar();
    setInterval(hideGoogleBar, 500);
    new MutationObserver(hideGoogleBar).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
