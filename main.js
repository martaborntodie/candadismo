(function () {
  var root = document.documentElement;

  function setLang(l) {
    root.setAttribute('data-lang', l); root.setAttribute('lang', l);
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  setLang(saved || ((navigator.language || 'en').slice(0, 2) === 'es' ? 'es' : 'en'));

  function initPage() {
    var btn = document.getElementById('langBtn');
    if (btn) btn.addEventListener('click', function () { setLang(root.getAttribute('data-lang') === 'en' ? 'es' : 'en'); });
    var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
    initSlides();
    initDrag();
    initMesa();
    if (window.initOracle) window.initOracle();
    initProjects();
  }

  /* Página IA: los vídeos de la galería solo cargan y suenan (sin sonido) cuando se ven */
  function initLazyVideos() {
    var vids = document.querySelectorAll('video[data-autoplay]');
    if (!vids.length) return;
    if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(vids, function (v) { v.play && v.play(); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: '200px 0px' });
    Array.prototype.forEach.call(vids, function (v) { v.muted = true; io.observe(v); });
  }

  /* Mosaico sin CSS columns (Safari en iPhone pinta mal los vídeos dentro de columnas) */
  function ratioOf(el) {
    var m = el.querySelector('img, video');
    if (!m) return 1;
    var w = +m.getAttribute('width') || m.naturalWidth || m.videoWidth || 1;
    var h = +m.getAttribute('height') || m.naturalHeight || m.videoHeight || 1;
    return h / w;
  }
  function masonry(box, cols) {
    if (!box) return;
    var items = box._items || Array.prototype.slice.call(box.children);
    box._items = items;
    if (box._cols === cols) return;
    box._cols = cols;
    box.innerHTML = '';
    box.classList.add('is-masonry');
    var colEls = [], heights = [];
    for (var c = 0; c < cols; c++) {
      var d = document.createElement('div'); d.className = 'masonry-col';
      box.appendChild(d); colEls.push(d); heights.push(0);
    }
    items.forEach(function (it) {
      var k = heights.indexOf(Math.min.apply(null, heights));
      colEls[k].appendChild(it); heights[k] += ratioOf(it);
    });
  }
  function galleryCols() { return window.innerWidth <= 860 ? 2 : 3; }
  function modalCols() { return window.innerWidth >= 1100 ? 3 : 2; }
  var mResize = null;
  function initMasonry() {
    masonry(document.querySelector('.gallery'), galleryCols());
    if (!mResize) {
      mResize = true;
      window.addEventListener('resize', function () {
        masonry(document.querySelector('.gallery'), galleryCols());
        var g = document.querySelector('.pm[open] .pm__media--grid:not(.pm__media--wide)');
        if (g) masonry(g, modalCols());
      });
    }
  }

  /* Página IA: al pulsar una imagen se abre el proyecto */
  function initProjects() {
    initMasonry();
    initLazyVideos();
    var modal = document.getElementById('projectModal');
    if (!modal) return;
    var inner = modal.querySelector('.pm__inner');
    Array.prototype.forEach.call(document.querySelectorAll('.tile'), function (t) {
      t.addEventListener('click', function () {
        var tpl = t.querySelector('template');
        inner.innerHTML = ''; inner.appendChild(tpl.content.cloneNode(true));
        if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
        modal.scrollTop = 0;
        var grid = inner.querySelector('.pm__media--grid:not(.pm__media--wide)'); if (grid) masonry(grid, modalCols());
        var first = inner.querySelector('.pm__media--grid video'); if (first) { var pp = first.play(); if (pp && pp.catch) pp.catch(function () {}); }
      });
    });
    function close() { if (modal.close) modal.close(); else modal.removeAttribute('open'); inner.innerHTML = ''; }
    modal.addEventListener('close', function () { inner.innerHTML = ''; });
    modal.querySelector('.pm__close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  }

  /* Portada: mesa que se gira, se acerca y se recorre */
  var mesaCleanup = null;
  function initMesa() {
    if (mesaCleanup) { mesaCleanup(); mesaCleanup = null; }
    var root = document.getElementById('mesa');
    if (!root) return;
    var stage = document.getElementById('mesaStage'), world = document.getElementById('mesaWorld');
    var IW = 2400, IH = 1792, FX = 0.57, FY = 0.52;          /* punto de interés (móvil, auriculares, cartas) */
    var st = { rx: 14, rz: 0, s: 1, tx: 0, ty: 0 };
    var base = { w: 0, h: 0 };
    function layout() {
      var vw = stage.clientWidth, vh = stage.clientHeight;
      var k = Math.max(vw / IW, vh / IH);
      if (vw < 861) k = Math.max(k, (vw * 1.9) / IW);
      base.w = IW * k; base.h = IH * k;
      world.style.width = base.w + 'px'; world.style.height = base.h + 'px';
      world.style.left = (vw / 2 - base.w * FX) + 'px';
      world.style.top = (vh / 2 - base.h * FY) + 'px';
      world.style.transformOrigin = (FX * 100) + '% ' + (FY * 100) + '%';
      apply();
    }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function apply() {
      st.s = clamp(st.s, 0.8, 3.2); st.rx = clamp(st.rx, 0, 50); st.rz = clamp(st.rz, -40, 40);
      var lim = (st.s - 0.6) * 0.45;
      st.tx = clamp(st.tx, -base.w * lim, base.w * lim); st.ty = clamp(st.ty, -base.h * lim, base.h * lim);
      world.style.transform = 'translate(' + st.tx + 'px,' + st.ty + 'px) rotateX(' + st.rx + 'deg) rotateZ(' + st.rz + 'deg) scale(' + st.s + ')';
    }
    var pts = {}, start = null, moved = false, pinch0 = null;
    function down(e) {
      if (e.button && e.button !== 0) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 1) { start = { x: e.clientX, y: e.clientY, rx: st.rx, rz: st.rz, tx: st.tx, ty: st.ty, pan: e.shiftKey || st.s > 1.25 }; moved = false; }
      if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), s: st.s }; stage.classList.add('is-pinching'); }
    }
    function move(e) {
      if (!pts[e.pointerId]) { hover(e); return; }
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 2 && pinch0) {
        var a = pts[ids[0]], b = pts[ids[1]];
        st.s = pinch0.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch0.d; moved = true; apply(); return;
      }
      if (!start) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      if (!moved) { moved = true; stage.classList.add('is-dragging'); try { stage.setPointerCapture(e.pointerId); } catch (er) {} }
      if (start.pan) { st.tx = start.tx + dx; st.ty = start.ty + dy; }
      else { st.rz = start.rz + dx * 0.12; st.rx = start.rx - dy * 0.12; }
      apply();
    }
    function up(e) {
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) { pinch0 = null; stage.classList.remove('is-pinching'); }
      if (!Object.keys(pts).length) { start = null; stage.classList.remove('is-dragging'); setTimeout(function () { moved = false; }, 30); }
    }
    function wheel(e) { e.preventDefault(); st.s *= Math.exp(-e.deltaY * 0.0015); apply(); }
    function zoomAt(e) {
      var r = stage.getBoundingClientRect();
      var cx = e.clientX - r.left - r.width / 2, cy = e.clientY - r.top - r.height / 2;
      if (st.s < 1.6) { st.s = 2.2; st.tx = -cx * 1.1; st.ty = -cy * 1.1; } else { st.s = 1; st.tx = st.ty = 0; }
      apply();
    }
    function clickGuard(e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }
    var cur = '';
    function setHot(k) { if (k === cur) return; root.classList.remove('is-' + cur); cur = k; if (k) root.classList.add('is-' + k); }
    function hover(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var a = el && el.closest && el.closest('.hs');
      setHot(a ? a.getAttribute('data-label') : '');
    }
    function btn(e) {
      var z = e.currentTarget.getAttribute('data-z');
      if (z === 'in') st.s *= 1.35; else if (z === 'out') st.s /= 1.35; else { st = { rx: 14, rz: 0, s: 1, tx: 0, ty: 0 }; }
      apply();
    }
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('pointerleave', function () { if (!start) setHot(''); });
    stage.addEventListener('wheel', wheel, { passive: false });
    stage.addEventListener('dblclick', zoomAt);
    stage.addEventListener('click', clickGuard, true);
    Array.prototype.forEach.call(root.querySelectorAll('.hs'), function (a) {
      a.addEventListener('focus', function () { setHot(a.getAttribute('data-label')); });
      a.addEventListener('blur', function () { setHot(''); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-z]'), function (b) { b.addEventListener('click', btn); });
    window.addEventListener('resize', layout);
    /* en pantallas táctiles: el móvil se enciende solo y las etiquetas se muestran un momento */
    var t1 = null;
    if (window.matchMedia && matchMedia('(hover: none)').matches) {
      t1 = setTimeout(function () { root.classList.add('is-ia', 'is-dj', 'is-or'); }, 900);
    }
    layout();
    mesaCleanup = function () { window.removeEventListener('resize', layout); clearTimeout(t1); };
  }

  /* Portada: objetos que se arrastran y vuelven a su sitio al soltarlos */
  function initDrag() {
    var items = document.querySelectorAll('.drag');
    Array.prototype.forEach.call(items, function (el) {
      var door = el.closest('.door') || el.parentNode, sx = 0, sy = 0, dx = 0, dy = 0, down = false, moved = false, id = null;
      el.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        down = true; moved = false; id = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0;
        el.classList.remove('is-returning');
      });
      el.addEventListener('pointermove', function (e) {
        if (!down || e.pointerId !== id) return;
        dx = e.clientX - sx; dy = e.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) > 6) {
          moved = true; el.classList.add('is-dragging');
          try { el.setPointerCapture(id); } catch (err) {}
        }
        if (moved) el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (dx / 25) + 'deg)';
      });
      function release() {
        if (!down) return;
        down = false;
        if (!moved) return;
        el.classList.remove('is-dragging'); el.classList.add('is-returning');
        el.style.transform = '';
        door.dataset.dragged = '1';
        setTimeout(function () { delete door.dataset.dragged; }, 50);
      }
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      door.addEventListener('dragstart', function (e) { e.preventDefault(); });
      door.addEventListener('click', function (e) {
        if (door.dataset.dragged) { e.preventDefault(); e.stopPropagation(); }
      });
    });
  }

  /* Pase de fotos y vídeos (página DJ) */
  var slideTimer = null, slideVideo = null, slideEnded = null;
  function initSlides() {
    clearTimeout(slideTimer);
    var box = document.querySelector('[data-slides]');
    if (!box) return;
    var items = box.querySelectorAll('img, video'), hero = box.parentNode,
        dots = hero.querySelector('.slides__dots'), i = 0;
    if (items.length < 2) return;
    dots.innerHTML = '';
    function stopVideo() {
      if (slideVideo) { slideVideo.pause(); if (slideEnded) slideVideo.removeEventListener('ended', slideEnded); }
      slideVideo = null; slideEnded = null;
    }
    function show(n) {
      clearTimeout(slideTimer); stopVideo();
      i = (n + items.length) % items.length;
      for (var k = 0; k < items.length; k++) {
        items[k].classList.toggle('is-active', k === i);
        dots.children[k].classList.toggle('is-active', k === i);
      }
      var el = items[i];
      if (el.tagName === 'VIDEO') {
        hero.style.setProperty('--r', (el.getAttribute('data-ratio') || '4/5').replace('/', ' / '));
        slideVideo = el; el.muted = true; el.preload = 'auto';
        try { el.currentTime = 0; } catch (e) {}
        var p = el.play(); if (p && p.catch) p.catch(function () {});
        slideEnded = function () { show(i + 1); };
        el.addEventListener('ended', slideEnded);
        slideTimer = setTimeout(function () { show(i + 1); }, 150000); /* por si el vídeo no avisa */
      } else {
        var setR = function () { if (el.naturalWidth) hero.style.setProperty('--r', el.naturalWidth + ' / ' + el.naturalHeight); };
        if (el.complete) setR(); else el.addEventListener('load', setR, { once: true });
        slideTimer = setTimeout(function () { show(i + 1); }, 4500);
      }
    }
    for (var k = 0; k < items.length; k++) (function (k) {
      var b = document.createElement('button'); b.setAttribute('aria-label', (items[k].tagName === 'VIDEO' ? 'Vídeo ' : 'Foto ') + (k + 1));
      if (items[k].tagName === 'VIDEO') b.className = 'is-video';
      b.addEventListener('click', function (e) { e.stopPropagation(); show(k); }); dots.appendChild(b);
    })(k);
    box.onclick = function () { show(i + 1); };
    box.style.cursor = 'pointer';
    show(0);
  }

  /* Portada: objetos que se arrastran y vuelven a su sitio al soltarlos */
  function initDrag() {
    var items = document.querySelectorAll('.drag');
    Array.prototype.forEach.call(items, function (el) {
      var door = el.closest('.door') || el.parentNode, sx = 0, sy = 0, dx = 0, dy = 0, down = false, moved = false, id = null;
      el.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        down = true; moved = false; id = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0;
        el.classList.remove('is-returning');
      });
      el.addEventListener('pointermove', function (e) {
        if (!down || e.pointerId !== id) return;
        dx = e.clientX - sx; dy = e.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) > 6) {
          moved = true; el.classList.add('is-dragging');
          try { el.setPointerCapture(id); } catch (err) {}
        }
        if (moved) el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (dx / 25) + 'deg)';
      });
      function release() {
        if (!down) return;
        down = false;
        if (!moved) return;
        el.classList.remove('is-dragging'); el.classList.add('is-returning');
        el.style.transform = '';
        door.dataset.dragged = '1';
        setTimeout(function () { delete door.dataset.dragged; }, 50);
      }
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      door.addEventListener('dragstart', function (e) { e.preventDefault(); });
      door.addEventListener('click', function (e) {
        if (door.dataset.dragged) { e.preventDefault(); e.stopPropagation(); }
      });
    });
  }

  initPage();

  /* Navegación sin recargar, para que la música siga sonando al cambiar de página */
  var app = document.getElementById('app');
  function isInternal(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (/^(mailto:|tel:|#)/.test(href)) return false;
    var u = new URL(href, location.href);
    return u.origin === location.origin && /\.html$|\/$/.test(u.pathname) && u.pathname !== location.pathname;
  }
  function go(url, push) {
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var next = doc.getElementById('app');
      if (!next) throw 0;
      app.innerHTML = next.innerHTML;
      document.body.className = doc.body.className;
      document.title = doc.title;
      if (push) history.pushState({}, '', url);
      var hash = new URL(url, location.href).hash;
      var t = hash && document.querySelector(hash);
      if (t) t.scrollIntoView(); else window.scrollTo(0, 0);
      initPage();
    }).catch(function () { location.href = url; });
  }
  if (app && window.fetch && window.DOMParser && location.protocol !== 'file:') {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!isInternal(a)) return;
      e.preventDefault(); go(new URL(a.getAttribute('href'), location.href).href, true);
    });
    window.addEventListener('popstate', function () { go(location.href, false); });
  }
})();
