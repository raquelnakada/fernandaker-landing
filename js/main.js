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

  // --- TIMER BASEADO NA INTERAÇÃO DO USUÁRIO ---
  // O Vturb v4 não envia eventos postMessage, então usamos um timer
  // que inicia quando o usuário interage com a página (clica pra ouvir/assistir)
  var timerStarted = false;

  function startDelayTimer() {
    if (timerStarted || contentShown) return;
    timerStarted = true;

    var startTime = Date.now();

    // Timer principal
    setTimeout(function () {
      showDelayedContent();
    }, DELAY_SECONDS * 1000);

    // Checagem periódica (robusto para mobile que throttle setTimeout)
    var checkInterval = setInterval(function () {
      if (contentShown) {
        clearInterval(checkInterval);
        return;
      }
      var elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= DELAY_SECONDS) {
        showDelayedContent();
        clearInterval(checkInterval);
      }
    }, 5000);

    // Quando volta pra aba, verifica se já passou o tempo
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !contentShown) {
        var elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= DELAY_SECONDS) {
          showDelayedContent();
        }
      }
    });
  }

  // Inicia o timer na primeira interação do usuário (click, touch, scroll)
  var interactionEvents = ['click', 'touchstart', 'scroll'];
  interactionEvents.forEach(function (evt) {
    document.addEventListener(evt, function handler() {
      startDelayTimer();
      // Remove o listener após a primeira interação
      interactionEvents.forEach(function (e) {
        document.removeEventListener(e, handler);
      });
    }, { once: true });
  });

  // Também escuta eventos postMessage do Vturb (caso funcione em algum cenário)
  window.addEventListener('message', function (e) {
    try {
      if (e.data && typeof e.data === 'object') {
        var currentTime = e.data.currentTime || e.data.time || e.data.seconds || 0;
        if (currentTime >= DELAY_SECONDS) {
          showDelayedContent();
        }
      }
    } catch (err) { /* ignore */ }
  });

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
