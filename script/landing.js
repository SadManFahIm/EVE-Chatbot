/* ═══════════════════════════════════════════
   LANDING.JS — Landing Page Interactions
   Custom cursor, scroll reveals, counter,
   navbar scroll, phone mockup demo
═══════════════════════════════════════════ */

'use strict';

/* ─── Custom Cursor ──────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

/* ─── Navbar Scroll ──────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ─── Scroll Reveal ──────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feat-card, .tech-card, .demo-text, .demo-visual, .section-title, .section-label'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ─── Animated Counter ───────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─── Demo Phone — Rotating messages ────── */
(function initPhoneDemo() {
  const container = document.getElementById('phone-msgs');
  if (!container) return;

  const conversations = [
    { user: "What's the weather like?", bot: "I can't check live weather, but I'm great at chatting! ☀️" },
    { user: "Tell me a joke!", bot: "Why do programmers prefer dark mode? Light attracts bugs! 🐛😄" },
    { user: "Play rock paper scissors!", bot: "I choose scissors ✌️! You go first, what do you pick?" },
    { user: "Who made you?", bot: "I'm EVE, an AI-powered assistant! Ask me anything 🤖" },
  ];

  let idx = 0;

  function showNext() {
    const pair = conversations[idx % conversations.length];
    idx++;

    const uMsg = document.createElement('div');
    uMsg.className = 'phone-msg user';
    uMsg.textContent = pair.user;

    const bMsg = document.createElement('div');
    bMsg.className = 'phone-msg bot';
    bMsg.textContent = pair.bot;

    container.appendChild(uMsg);

    setTimeout(() => {
      container.appendChild(bMsg);
      // keep last 4
      while (container.children.length > 4) {
        container.removeChild(container.firstChild);
      }
    }, 800);
  }

  // Rotate every 3 seconds
  setInterval(showNext, 3000);
})();

/* ─── Smooth nav link scroll ─────────────── */
(function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─── Feature cards tilt ─────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.feat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
