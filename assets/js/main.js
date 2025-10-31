// Main JS for The Outfitwaves
(function () {
  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // Initialize Lucide icons when available
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      // Retry shortly if script not yet ready
      setTimeout(initIcons, 50);
    }
  }
  initIcons();

  // Scroll reveal
  function initReveal() {
    // Target typical content blocks and cards; avoid huge wrappers like section/header/footer
    var els = document.querySelectorAll('[data-reveal], article, .card, .group, .feature-badge, .rounded-2xl, .rounded-xl, .relative.rounded-2xl');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    // Add classes on next frame to ensure CSS transitions trigger
    requestAnimationFrame(function () {
      els.forEach(function (el, i) {
        el.classList.add('reveal');
        // faster, tighter stagger for better sync
        el.style.transitionDelay = prefersReduced ? '0ms' : ((i % 6) * 30 + 'ms');
        io.observe(el);
      });
    });
  }
  function wireSearch() {
    // Try to inject a persistent header search input across pages
    try {
      document.querySelectorAll('header .flex.h-16.items-center.justify-between').forEach(function (bar) {
        var right = bar.querySelector('div.flex.items-center.gap-3');
        if (!right || right.querySelector('#header-search')) return;
        var wrap = document.createElement('div');
        wrap.className = 'hidden md:flex items-center';
        wrap.innerHTML = '<div class="mr-3 relative">\
          <i data-lucide="search" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>\
          <input id="header-search" class="pl-8 pr-3 py-1.5 rounded-md border w-56" placeholder="Search..."/>\
        </div>';
        bar.insertBefore(wrap, right);
        if (window.lucide) window.lucide.createIcons();
        var input = wrap.querySelector('#header-search');
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var t = input.value.trim(); if (t) { window.location.href = './shop.html?q=' + encodeURIComponent(t); } } });
      });
    } catch (e) { }

    function ensureOverlay() {
      var ov = document.getElementById('ow-search');
      if (ov) return ov;
      ov = document.createElement('div');
      ov.id = 'ow-search';
      ov.innerHTML = '<div class="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24">\
        <div class="bg-white shadow-xl rounded-xl w-[92%] max-w-2xl p-4 flex items-center gap-3">\
          <i data-lucide="search" class="text-gray-400"></i>\
          <input id="ow-search-input" class="flex-1 px-2 py-2 outline-none" placeholder="Search products by name or category"/>\
          <button id="ow-search-go" class="px-3 py-2 rounded-md bg-sky-600 text-white">Search</button>\
          <button id="ow-search-close" class="p-2 rounded hover:bg-gray-100" aria-label="Close">✕</button>\
        </div>\
      </div>';
      document.body.appendChild(ov);
      if (window.lucide) window.lucide.createIcons();
      return ov;
    }
    function openOverlay() {
      var ov = ensureOverlay();
      ov.style.display = 'flex';
      document.body.classList.add('overflow-hidden');
      var input = document.getElementById('ow-search-input');
      input.value = new URLSearchParams(location.search).get('q') || '';
      setTimeout(function () { input.focus(); }, 50);
      function go() {
        var term = input.value.trim();
        if (term) { window.location.href = './shop.html?q=' + encodeURIComponent(term); }
      }
      document.getElementById('ow-search-go').onclick = go;
      input.onkeydown = function (e) { if (e.key === 'Enter') go(); if (e.key === 'Escape') close(); };
      function close() { ov.style.display = 'none'; document.body.classList.remove('overflow-hidden'); }
      document.getElementById('ow-search-close').onclick = close;
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    }
    document.querySelectorAll('button[aria-label="Search"]').forEach(function (btn) {
      if (btn.dataset._wired) return; btn.dataset._wired = '1';
      btn.addEventListener('click', openOverlay);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initReveal(); wireSearch(); });
  } else {
    initReveal(); wireSearch();
  }
})();