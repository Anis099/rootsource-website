/* ==========================================================================
   ANIMATIONS.JS — Drives everything defined in animations.css
   ========================================================================== */

(function () {
  'use strict';

  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initSplitText();
    initScrollReveal();
    initCounters();
    initParallax();
    initRipple();
    initScrollProgress();
    initPageTransitions();
  });

  function initSplitText() {
    var nodes = document.querySelectorAll('[data-split]');
    nodes.forEach(function (node) {
      var mode = node.getAttribute('data-split');
      var text = node.textContent;
      var units = mode === 'words' ? text.split(/(\s+)/) : text.split('');

      node.textContent = '';
      var index = 0;
      units.forEach(function (unit) {
        if (mode === 'words' && unit.trim() === '') {
          node.appendChild(document.createTextNode(unit));
          return;
        }
        var span = document.createElement('span');
        span.className = 'split-unit';
        span.style.setProperty('--i', index);
        span.textContent = unit === ' ' ? '\u00A0' : unit;
        node.appendChild(span);
        index++;
      });
    });
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll('[data-animate]');

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    document.querySelectorAll('[data-stagger]').forEach(function (container) {
      var children = Array.prototype.filter.call(
        container.children,
        function (child) { return child.hasAttribute('data-animate') || child.matches('[data-animate]'); }
      );
      var items = container.hasAttribute('data-animate')
        ? Array.prototype.slice.call(container.children)
        : children;

      items.forEach(function (child, i) {
        if (!child.hasAttribute('data-animate')) {
          child.setAttribute('data-animate', container.getAttribute('data-animate') || 'fade-up');
        }
        var existingDelay = parseInt(child.getAttribute('data-delay') || '0', 10);
        var staggerDelay = existingDelay + i * 90;
        child.style.setProperty('--delay', staggerDelay + 'ms');
      });
    });

    targets.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay && !el.style.getPropertyValue('--delay')) {
        el.style.setProperty('--delay', delay + 'ms');
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) { observer.observe(el); });

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = parseInt(el.getAttribute('data-duration') || '1600', 10);
      var decimals = (el.getAttribute('data-target').split('.')[1] || '').length;
      var start = performance.now();

      el.classList.add('counter-started');

      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var value = (target * eased).toFixed(decimals);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }
      requestAnimationFrame(tick);
    }
  }

  function initParallax() {
    var layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length || REDUCED_MOTION) return;

    var ticking = false;

    function update() {
      var viewportH = window.innerHeight;
      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewportH + 200) return;
        var offset = (rect.top - viewportH / 2) * speed * -1;
        el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function initRipple() {
    var buttons = document.querySelectorAll('.btn-ripple');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('pointerdown', function (e) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var dot = document.createElement('span');
        dot.className = 'ripple-dot';
        dot.style.width = dot.style.height = size + 'px';
        dot.style.left = (e.clientX - rect.left - size / 2) + 'px';
        dot.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(dot);
        dot.addEventListener('animationend', function () {
          dot.remove();
        });
      });
    });
  }

  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initPageTransitions() {
    if (REDUCED_MOTION) return;

    var overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      document.body.appendChild(overlay);
    }

    document.querySelectorAll('a[href]').forEach(function (link) {
      var url = link.getAttribute('href');
      var isInternal =
        url &&
        !url.startsWith('#') &&
        !url.startsWith('http') &&
        !url.startsWith('mailto:') &&
        !url.startsWith('tel:') &&
        link.target !== '_blank';

      if (!isInternal) return;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(function () {
          window.location.href = url;
        }, 350);
      });
    });
  }
})();
