/* =========================================================
   مركز إقرأ التعليمي — main.js (vanilla, no dependencies)
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Configurable links — replace '#' with the real URLs.
     Any element with data-link="<key>" picks up the value.
     --------------------------------------------------------- */
  var SITE_LINKS = {
    payment: '#'    // «ادفع الآن»
  };

  document.querySelectorAll('[data-link]').forEach(function (el) {
    var url = SITE_LINKS[el.getAttribute('data-link')];
    if (url && url !== '#') {
      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
    // Unconfigured placeholder: don't jump to the top of the page.
    el.addEventListener('click', function (e) {
      if (el.getAttribute('href') === '#') e.preventDefault();
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    header.classList.toggle('menu-open', open);
  }
  function isMenuOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  toggle.addEventListener('click', function () {
    setMenu(!isMenuOpen());
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen()) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (isMenuOpen() && !header.contains(e.target)) setMenu(false);
  });
  var desktopMq = window.matchMedia('(min-width: 1200px)');
  var onMqChange = function (e) { if (e.matches) setMenu(false); };
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', onMqChange);
  else if (desktopMq.addListener) desktopMq.addListener(onMqChange);

  /* ---------- Highlight the nav link of the visible section ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var active = linkFor[entry.target.id];
        if (!active) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Booking form (Web3Forms) ---------- */
  var form = document.getElementById('booking-form');
  if (!form) return;

  // JS takes over validation so messages are shown in Arabic, inline.
  // Without JS the browser's native validation + normal POST still work.
  form.noValidate = true;

  var MESSAGES = {
    success: 'تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.',
    error: 'عذرًا، تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى أو التواصل معنا عبر الهاتف.',
    sending: 'جارٍ الإرسال...'
  };

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.textContent;

  // Convert Arabic-Indic / Persian digits to Western digits.
  function toWesternDigits(str) {
    return str.replace(/[٠-٩۰-۹]/g, function (d) {
      return String(d.charCodeAt(0) & 0xF);
    });
  }

  var rules = [
    {
      el: document.getElementById('f-name'),
      check: function (v) { return v.length >= 2; },
      message: 'يرجى إدخال الاسم الكامل.'
    },
    {
      el: document.getElementById('f-phone'),
      check: function (v) {
        var compact = toWesternDigits(v).replace(/[\s\-().]/g, '');
        return /^\+?\d{9,15}$/.test(compact);
      },
      message: 'يرجى إدخال رقم جوال صحيح.'
    },
    {
      el: document.getElementById('f-email'),
      check: function (v) { return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
      message: 'يرجى إدخال بريد إلكتروني صحيح.'
    }
  ];

  function setFieldError(el, message) {
    var errorEl = document.getElementById(el.id + '-error');
    if (message) {
      el.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = message;
    } else {
      el.removeAttribute('aria-invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  function validateRule(rule) {
    var ok = rule.check(rule.el.value.trim());
    setFieldError(rule.el, ok ? '' : rule.message);
    return ok;
  }

  // Re-check a field as the user corrects it.
  rules.forEach(function (rule) {
    rule.el.addEventListener('input', function () {
      if (rule.el.getAttribute('aria-invalid') === 'true') validateRule(rule);
    });
    rule.el.addEventListener('blur', function () {
      if (rule.el.value.trim() !== '') validateRule(rule);
    });
  });

  function setStatus(type, message) {
    statusEl.classList.remove('is-success', 'is-error');
    if (type) statusEl.classList.add('is-' + type);
    statusEl.textContent = message || '';
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? MESSAGES.sending : submitLabel;
    form.setAttribute('aria-busy', String(loading));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus(null, '');

    var firstInvalid = null;
    rules.forEach(function (rule) {
      if (!validateRule(rule) && !firstInvalid) firstInvalid = rule.el;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Honeypot ticked → a bot. Pretend success and send nothing.
    if (form.elements.botcheck && form.elements.botcheck.checked) {
      form.reset();
      setStatus('success', MESSAGES.success);
      return;
    }

    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = typeof value === 'string' ? value.trim() : value;
    });
    data['رقم الجوال'] = toWesternDigits(data['رقم الجوال'] || '');

    if (data.access_key === 'PUT-YOUR-WEB3FORMS-KEY-HERE') {
      console.warn('Web3Forms: replace PUT-YOUR-WEB3FORMS-KEY-HERE in index.html with your access key (see README.md).');
    }

    setLoading(true);

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok || !json.success) {
            throw new Error(json.message || ('HTTP ' + res.status));
          }
        });
      })
      .then(function () {
        form.reset();
        rules.forEach(function (rule) { setFieldError(rule.el, ''); });
        setStatus('success', MESSAGES.success);
      })
      .catch(function (err) {
        console.error('Web3Forms submission failed:', err);
        setStatus('error', MESSAGES.error);
      })
      .then(function () {
        setLoading(false);
      });
  });
})();
