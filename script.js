(function () {

  /* ── CURSOR ── */
  var cur = document.getElementById('cursor');
  document.addEventListener('mousemove', function (e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .sc, .skc, .svc, .pc').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cur.style.transform = 'translate(-50%,-50%) scale(3)'; });
    el.addEventListener('mouseleave', function () { cur.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });

  /* ── THEME TOGGLE ── */
  var themeBtn = document.getElementById('themeBtn');
  var root = document.documentElement;
  themeBtn.addEventListener('click', function () {
    var isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.textContent = isDark ? '\uD83C\uDF19' : '\u2600\uFE0F';
  });

  /* ── SCROLL REVEAL ── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
    revealObs.observe(el);
  });

  /* ── ACTIVE NAV LINK ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', function () {
    var current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  }, { passive: true });

  /* ── STAT COUNTER ── */
  function countUp(el, target) {
    var start = null;
    var suffix = el.textContent.replace(/[0-9]/g, '');
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counted = false;
  var statsEl = document.querySelector('.stats');
  if (statsEl) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.sn').forEach(function (el) {
          var t = parseInt(el.getAttribute('data-val'));
          if (!isNaN(t)) countUp(el, t);
        });
      }
    }, { threshold: 0.3 }).observe(statsEl);
  }

  /* ── CONTACT FORM (EmailJS) ── */
  window.submitForm = function (e) {
    e.preventDefault();

    var fname    = document.getElementById('fname').value.trim();
    var lname    = document.getElementById('lname').value.trim();
    var femail   = document.getElementById('femail').value.trim();
    var fproject = document.getElementById('fproject').value.trim();
    var fmessage = document.getElementById('fmessage').value.trim();

    var errEl = document.getElementById('form-error');

    if (!fname || !femail || !fmessage) {
      errEl.style.display = 'block';
      errEl.querySelector('p').textContent = 'Please fill in First Name, Email and Message.';
      return;
    }

    var btn = document.getElementById('submitBtn');
    document.getElementById('send-arrow').style.display   = 'none';
    document.getElementById('send-spinner').style.display = 'inline';
    btn.disabled     = true;
    btn.style.opacity = '0.7';
    errEl.style.display = 'none';

    /* ⚠️ Replace these three values with yours from emailjs.com */
    var SERVICE_ID  = 'service_drj2wir';
    var TEMPLATE_ID = 'template_5f1hepm';
    var PUBLIC_KEY  = 'ODvOyNdJBaseklR17';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name:    fname + ' ' + lname,
      from_email:   femail,
      project_type: fproject || 'Not specified',
      message:      fmessage,
      to_email:     'sathesiddhesh16@gmail.com'
    }, PUBLIC_KEY)
    .then(function () {
      document.getElementById('contact-form-wrap').style.display = 'none';
      document.getElementById('form-success').style.display      = 'block';
    })
    .catch(function (err) {
      console.error('EmailJS error:', err);
      errEl.style.display = 'block';
      errEl.querySelector('p').innerHTML =
        'Something went wrong. Email me directly at ' +
        '<a href="mailto:sathesiddhesh16@gmail.com" style="color:#ff6b6b;text-decoration:underline">sathesiddhesh16@gmail.com</a>';
      document.getElementById('send-arrow').style.display   = 'inline';
      document.getElementById('send-spinner').style.display = 'none';
      btn.disabled      = false;
      btn.style.opacity = '1';
    });
  };

  window.resetForm = function () {
    document.getElementById('contact-form-wrap').style.display = 'block';
    document.getElementById('form-success').style.display      = 'none';
    ['fname','lname','femail','fproject','fmessage'].forEach(function (id) {
      document.getElementById(id).value = '';
    });
    var btn = document.getElementById('submitBtn');
    btn.disabled      = false;
    btn.style.opacity = '1';
    document.getElementById('send-arrow').style.display   = 'inline';
    document.getElementById('send-spinner').style.display = 'none';
  };

})();
