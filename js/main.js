/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   main.js — Amrita Pandey Portfolio
   Sections:
     1. Custom cursor
     2. Nav scroll behaviour + mobile menu
     3. Marquee builder
     4. Scroll reveal (IntersectionObserver)
     5. Animated counters
     6. Contact form
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── 1. CUSTOM CURSOR ───────────────────────────── */
(function initCursor() {
  const dot    = document.getElementById('cursor-dot');
  const circle = document.getElementById('cursor-circle');
  if (!dot || !circle) return;

  // Only show on non-touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.body.classList.add('has-mouse');

  let mx = 0, my = 0;   // mouse
  let cx = 0, cy = 0;   // circle (lagged)

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    // dot follows instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Circle lags behind with lerp
  (function lerpCircle() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    circle.style.left = cx + 'px';
    circle.style.top  = cy + 'px';
    requestAnimationFrame(lerpCircle);
  })();

  // Grow on interactive elements
  const interactors = 'a, button, input, textarea, .skill-pill, .achiev-item, .project-row';
  document.querySelectorAll(interactors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width    = '14px';
      dot.style.height   = '14px';
      circle.style.width  = '48px';
      circle.style.height = '48px';
      circle.style.opacity = '0.25';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width    = '8px';
      dot.style.height   = '8px';
      circle.style.width  = '32px';
      circle.style.height = '32px';
      circle.style.opacity = '0.45';
    });
  });
})();


/* ── 2. NAV ─────────────────────────────────────── */
(function initNav() {
  const header = document.getElementById('site-header');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');

  // Add border when scrolled
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Mobile menu toggle
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    menu.classList.toggle('open', open);
  });

  // Close menu on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();


/* ── 3. MARQUEE ─────────────────────────────────── */
(function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const items = [
    'Python', 'Java', 'C++', 'JavaScript',
    'OpenCV', 'Scikit-Learn', 'NumPy', 'Pandas',
    'HTML / CSS', 'MySQL', 'Git', 'Linux',
    'DSA', 'OOP', 'rPPG', 'Machine Learning',
    'Netlify', 'VS Code', 'IntelliJ', 'AWT/Swing',
  ];

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  track.innerHTML = doubled
    .map(t => `<span class="marquee-item">${t}</span>`)
    .join('');
})();


/* ── 4. SCROLL REVEAL ───────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();


/* ── 5. ANIMATED COUNTERS ───────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.big-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400; // ms
        const start    = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ── 6. CONTACT FORM ────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    // Let Netlify handle the real submission in production.
    // In local dev, we prevent default and show success UI.
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:') {
      e.preventDefault();
      showSuccess();
      return;
    }
    // On Netlify, let the form submit naturally, then show success
    e.preventDefault();
    try {
      const data = new FormData(form);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      showSuccess();
    } catch {
      showSuccess(); // show anyway
    }
  });

  function showSuccess() {
    form.querySelectorAll('input, textarea').forEach(f => f.value = '');
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }
})();
