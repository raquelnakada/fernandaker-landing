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

  // --- DEBUG: mostra eventos do Vturb na tela (TEMPORÁRIO) ---
  var debugBox = document.createElement('div');
  debugBox.id = 'vturb-debug';
  debugBox.style.cssText = 'position:fixed;top:0;left:0;right:0;background:yellow;color:black;padding:8px;font-size:12px;z-index:99999;max-height:150px;overflow:auto;';
  debugBox.textContent = 'DEBUG: Aguardando eventos do Vturb...';
  document.body.appendChild(debugBox);
  var debugCount = 0;

  // --- VTURB EVENT LISTENER (captura TUDO) ---
  window.addEventListener('message', function (e) {
    try {
      var data = e.data;

      // Ignora eventos que não são objeto ou são de extensões
      if (!data || typeof data !== 'object') return;
      if (typeof data === 'string') return;

      // Log de TODOS os eventos pra debug
      debugCount++;
      if (debugCount <= 50) {
        var keys = Object.keys(data).join(', ');
        var json = JSON.stringify(data).substring(0, 200);
        debugBox.textContent = 'Evento #' + debugCount + ' keys:[' + keys + '] = ' + json;
      }

      // Tenta extrair tempo de QUALQUER formato possível
      var currentTime = 0;

      // Formato 1: smartplayer_timeupdate
      if (data.type === 'smartplayer_timeupdate' || data.event === 'timeupdate' ||
          data.eventName === 'smartplayer_timeupdate' || data.name === 'timeupdate') {
        currentTime = data.currentTime || data.time || data.seconds || data.position || 0;
      }

      // Formato 2: qualquer campo que pareça tempo do vídeo
      if (!currentTime && data.currentTime) currentTime = data.currentTime;
      if (!currentTime && data.time) currentTime = data.time;
      if (!currentTime && data.seconds) currentTime = data.seconds;
      if (!currentTime && data.position) currentTime = data.position;

      if (currentTime >= DELAY_SECONDS) {
        debugBox.textContent = 'DESBLOQUEANDO! Tempo: ' + currentTime + 's';
        showDelayedContent();
      }
    } catch (err) {
      debugBox.textContent = 'ERRO: ' + err.message;
    }
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
