/* ============================================
   FERNANDA KER — Método Completo
   Landing Page Scripts + Efeitos
   ============================================ */

(function () {
  'use strict';

  var DELAY_SECONDS = 12 * 60;
  var contentShown = false;
  var delayedContent = document.querySelector('.delayed-content');

  // --- SHOW DELAYED CONTENT ---
  function showDelayedContent() {
    if (contentShown || !delayedContent) return;
    contentShown = true;
    delayedContent.classList.add('visible');

    // Re-trigger reveal animations for newly visible elements
    setTimeout(function () {
      initRevealAnimations();
      initCounters();
      initHighlightAnimations();
    }, 100);
  }

  // --- VTURB EVENT LISTENER ---
  try {
    window.addEventListener('message', function (e) {
      try {
        if (e.data && typeof e.data === 'object') {
          // Captura qualquer evento de tempo do Vturb
          if (e.data.type === 'smartplayer_timeupdate' || e.data.event === 'timeupdate' ||
              e.data.eventName === 'smartplayer_timeupdate') {
            var currentTime = e.data.currentTime || e.data.time || e.data.seconds || 0;
            if (currentTime >= DELAY_SECONDS) {
              showDelayedContent();
            }
          }
        }
      } catch (err) { /* ignore vturb errors */ }
    });
  } catch (err) { /* ignore */ }

  // --- SEM FALLBACK POR TEMPO ---
  // O conteúdo só aparece quando o VÍDEO chegar em 12 min (via evento do Vturb)
  // Isso garante que o lead precisa assistir o vídeo para desbloquear

  // --- SKIP DELAY (Ctrl+Shift+S) ---
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      showDelayedContent();
    }
  });

  // --- SCROLL REVEAL ANIMATIONS ---
  function initRevealAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function (el) {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });
  }

  // --- ANIMATED HIGHLIGHT (grifa ao aparecer) ---
  function initHighlightAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var highlights = document.querySelectorAll('.highlight-animate');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    highlights.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- COUNTER ANIMATION (números contando) ---
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    var counters = document.querySelectorAll('[data-count]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- INIT on load ---
  initRevealAnimations();
  initCounters();
  initHighlightAnimations();

})();
