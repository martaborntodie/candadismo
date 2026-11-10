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

  /* Portada: mesa. Empieza en el primer plano; se puede alejar hasta ver la mesa entera, acercar, moverse e inclinar */
  var mesaCleanup = null;
  function initMesa() {
    if (mesaCleanup) { mesaCleanup(); mesaCleanup = null; }
    var root = document.getElementById('mesa');
    if (!root) return;
    var stage = document.getElementById('mesaStage'), world = document.getElementById('mesaWorld');
    var IW = 2400, IH = 1792;
    var CL = { x0: 754, y0: 580, x1: 1638, y1: 1191 };            /* zona del primer plano dentro de la mesa entera */
    var FX = (CL.x0 + CL.x1) / 2, FY = (CL.y0 + CL.y1) / 2;
    var lim = { sMin: 1, sInit: 1, sMax: 3 };
    var st = { s: 1, cx: FX, cy: FY, rx: 0, rz: 0 };
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function layout() {
      var vw = stage.clientWidth, vh = stage.clientHeight;
      lim.sMin = Math.max(vw / IW, vh / IH);
      var cw = CL.x1 - CL.x0, ch = CL.y1 - CL.y0;
      lim.sInit = vw < 861 ? Math.max(vw / (cw * 0.62), vh / IH) : Math.max(Math.min(vw / cw, vh / ch) * 1.04, lim.sMin);
      lim.sMax = lim.sInit * 2.6;
      apply();
    }
    function reset() { st = { s: lim.sInit, cx: vwPortrait() ? FX + 60 : FX, cy: FY, rx: 0, rz: 0 }; apply(); }
    function vwPortrait() { return stage.clientWidth < 861; }
    function apply() {
      var vw = stage.clientWidth, vh = stage.clientHeight;
      st.s = clamp(st.s, lim.sMin, lim.sMax);
      st.rx = clamp(st.rx, 0, 35); st.rz = clamp(st.rz, -25, 25);
      var hw = vw / 2 / st.s, hh = vh / 2 / st.s;
      st.cx = IW / 2 <= hw ? IW / 2 : clamp(st.cx, hw, IW - hw);
      st.cy = IH / 2 <= hh ? IH / 2 : clamp(st.cy, hh, IH - hh);
      world.style.transformOrigin = st.cx + 'px ' + st.cy + 'px';
      world.style.transform = 'translate(' + (vw / 2 - st.cx) + 'px,' + (vh / 2 - st.cy) + 'px) rotateX(' + st.rx + 'deg) rotateZ(' + st.rz + 'deg) scale(' + st.s + ')';
      if (cur) placeLabel(cur);
    }
    var pts = {}, start = null, moved = false, pinch0 = null;
    function down(e) {
      if (e.button && e.button !== 0) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 1) { start = { x: e.clientX, y: e.clientY, cx: st.cx, cy: st.cy, rx: st.rx, rz: st.rz, tilt: e.shiftKey || e.altKey }; moved = false; }
      if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), s: st.s }; stage.classList.add('is-pinching'); }
    }
    function move(e) {
      if (!pts[e.pointerId]) { hover(e); return; }
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 2 && pinch0) { var a = pts[ids[0]], b = pts[ids[1]]; st.s = pinch0.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch0.d; moved = true; apply(); return; }
      if (!start) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      if (!moved) { moved = true; stage.classList.add('is-dragging'); try { stage.setPointerCapture(e.pointerId); } catch (er) {} }
      if (start.tilt) { st.rz = start.rz + dx * 0.1; st.rx = start.rx - dy * 0.1; }
      else { st.cx = start.cx - dx / st.s; st.cy = start.cy - dy / st.s; }
      apply();
    }
    function up(e) {
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) { pinch0 = null; stage.classList.remove('is-pinching'); }
      if (!Object.keys(pts).length) { start = null; stage.classList.remove('is-dragging'); setTimeout(function () { moved = false; }, 30); }
    }
    function zoomTo(ns, ex, ey) {
      var r = stage.getBoundingClientRect(), old = st.s; ns = clamp(ns, lim.sMin, lim.sMax);
      if (ex != null) { var ox = ex - r.left - r.width / 2, oy = ey - r.top - r.height / 2; st.cx += ox / old - ox / ns; st.cy += oy / old - oy / ns; }
      st.s = ns; apply();
    }
    function wheel(e) { e.preventDefault(); zoomTo(st.s * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }
    function dbl(e) { zoomTo(st.s < lim.sInit * 1.4 ? lim.sInit * 2 : lim.sInit, e.clientX, e.clientY); }
    function clickGuard(e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }
    var cur = '';
    function placeLabel(k) {
      var poly = root.querySelector('.hs--' + k + ' polygon'), lab = root.querySelector('.mesa__label[data-for="' + k + '"]');
      if (!poly || !lab) return;
      var b = poly.getBoundingClientRect();
      lab.style.left = (b.left + b.width / 2) + 'px';
      lab.style.top = Math.max(b.top + (k === 'or' ? b.height * 0.15 : 0) - 8, 86) + 'px';
    }
    function setHot(k) {
      if (k === cur) return;
      root.classList.remove('is-' + cur); cur = k;
      if (k) { root.classList.add('is-' + k); placeLabel(k); }
    }
    function hover(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var a = el && el.closest && el.closest('.hs');
      setHot(a ? a.getAttribute('data-label') : '');
    }
    function btn(e) {
      var z = e.currentTarget.getAttribute('data-z');
      if (z === 'in') zoomTo(st.s * 1.35); else if (z === 'out') zoomTo(st.s / 1.35); else reset();
    }
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('pointerleave', function () { if (!start) setHot(''); });
    stage.addEventListener('wheel', wheel, { passive: false });
    stage.addEventListener('dblclick', dbl);
    stage.addEventListener('click', clickGuard, true);
    Array.prototype.forEach.call(root.querySelectorAll('.hs'), function (a) {
      a.addEventListener('focus', function () { setHot(a.getAttribute('data-label')); });
      a.addEventListener('blur', function () { setHot(''); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-z]'), function (b) { b.addEventListener('click', btn); });
    function onResize() { var keep = st.s / (lim.sInit || 1); layout(); st.s = lim.sInit * keep; apply(); }
    window.addEventListener('resize', onResize);
    var t1 = null;
    if (window.matchMedia && matchMedia('(hover: none)').matches) {
      t1 = setTimeout(function () { setHot('ia'); }, 900);
    }
    layout(); world.style.transition = 'none'; reset(); world.offsetHeight; world.style.transition = '';
    mesaCleanup = function () { window.removeEventListener('resize', onResize); clearTimeout(t1); };
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
