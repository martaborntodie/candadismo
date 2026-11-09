/* Candadismo — reproductor fijo arriba (SoundCloud Widget API).
   Para cambiar la lista: edita TRACKS (url de SoundCloud + título). */
(function () {
  var TRACKS = [
    { url: "https://soundcloud.com/deprerreo/candadismo-bim-bom-bam-1", title: "Bim Bom Bam", kind: "track" },
    { url: "https://soundcloud.com/deprerreo/lmiranda-x-malandra-escuchala", title: "LMiranda x Malandra — Escúchala", kind: "track" },
    { url: "https://soundcloud.com/deprerreo/sorry-kitten-candadismo-lmiranda-ibn-itaka", title: "Sorry Kitten — Candadismo, LMiranda, Ibn Itaka", kind: "track" },
    { url: "https://soundcloud.com/pikoteo/5f3d3866-4453-4344-b79f-68c1a0aa5e35", title: "Pikoteo", kind: "track" },
    { url: "https://soundcloud.com/deprerreo/sets/ep-bim-bom-bam-remixes", title: "EP Bim Bom Bam (Remixes)", kind: "track" },
    { url: "https://soundcloud.com/globalc0re/lmiranda-x-candadismo-x-kruela-x-malandra-marcha-marcha-16", title: "LMiranda x Candadismo x Kruela x Malandra — Marcha Marcha 16", kind: "track" },
    { url: "https://soundcloud.com/candadismo/pin-pon-pan-pun", title: "Pin Pon Pan Pun", kind: "track" },
    { url: "https://soundcloud.com/candadismo/angeles-estamos-aqui", title: "Ángeles estamos aquí", kind: "track" },
    { url: "https://soundcloud.com/candadismo/mi-1er-mix", title: "Mi 1er mix", kind: "mix" },
    { url: "https://soundcloud.com/candadismo/super-uraniana-mix", title: "Super Uraniana Mix", kind: "mix" },
    { url: "https://soundcloud.com/individualactivities/candadismo2026", title: "Individual Activities — Candadismo 2026", kind: "mix" },
    { url: "https://soundcloud.com/santasedelabel/ssdmix-008-candadismo-cuando-el-deseo-desarma-la-realidad", title: "SSDMIX 008 — Cuando el deseo desarma la realidad", kind: "mix" },
    { url: "https://soundcloud.com/rinsefm/lizz-presents-candadismo-03-july-2025", title: "LIZZ presents Candadismo — Rinse FM", kind: "mix" },
    { url: "https://soundcloud.com/vanta-black-986864415/deprerreo-lmiranda-b2b-candadismo-vanta-radio", title: "Deprerreo: LMiranda b2b Candadismo — Vanta Radio", kind: "mix" },
    { url: "https://soundcloud.com/nofutureberlin/n-o-f-u-t-u-r-e-x-candadismo", title: "N.O.F.U.T.U.R.E x Candadismo", kind: "mix" },
    { url: "https://soundcloud.com/cuntryclub/009candadismo", title: "Cuntry Club 009 — Candadismo", kind: "mix" },
    { url: "https://soundcloud.com/itsplasmaradio/113-candadismo-deprerreo", title: "Plasma Radio 113 — Candadismo", kind: "mix" },
    { url: "https://soundcloud.com/deprerreo/la-cantera-mixes-01-candadismo", title: "La Cantera Mixes 01", kind: "mix" }
  ];
  var PROFILE = 'https://soundcloud.com/candadismo';

  var root = document.getElementById('player');
  if (!root) return;

  /* Orden totalmente aleatorio: se baraja en cada visita y al terminar la ronda */
  function shuffled(n, avoidFirst) {
    var a = [], k, j, t;
    for (k = 0; k < n; k++) a.push(k);
    for (k = n - 1; k > 0; k--) { j = Math.floor(Math.random() * (k + 1)); t = a[k]; a[k] = a[j]; a[j] = t; }
    if (n > 1 && a[0] === avoidFirst) { t = a[0]; a[0] = a[1]; a[1] = t; }
    return a;
  }
  var order = shuffled(TRACKS.length), pos = 0;

  root.innerHTML =
    '<div class="player__inner">' +
      '<button class="pl-btn pl-prev" aria-label="Anterior">' + icon('prev') + '</button>' +
      '<button class="pl-btn pl-play" aria-label="Play">' + icon('play') + '</button>' +
      '<button class="pl-btn pl-next" aria-label="Siguiente">' + icon('next') + '</button>' +
      '<span class="pl-meta"><span class="pl-title"></span><span class="pl-artist">— Candadismo</span></span>' +
      '<span class="pl-bar" role="slider" aria-label="Progreso"><span class="pl-fill"></span></span>' +
      '<span class="pl-time">0:00</span>' +
      '<button class="pl-btn pl-listbtn" aria-label="Lista" aria-expanded="false">' + icon('list') + '</button>' +
      '<a class="pl-sc" href="' + PROFILE + '" target="_blank" rel="noopener">SoundCloud ↗</a>' +
    '</div>' +
    '<ol class="pl-list" hidden></ol>' +
    '<iframe class="pl-frame" title="SoundCloud" allow="autoplay" src="https://w.soundcloud.com/player/?url=' +
      encodeURIComponent(TRACKS[order[0]].url) + '&auto_play=false&visual=false"></iframe>';

  var $ = function (s) { return root.querySelector(s); };
  var playBtn = $('.pl-play'), titleEl = $('.pl-title'),
      fill = $('.pl-fill'), timeEl = $('.pl-time'), bar = $('.pl-bar'),
      list = $('.pl-list'), listBtn = $('.pl-listbtn');

  var idx = order[0], playing = false, duration = 0, ready = false, widget = null;

  TRACKS.forEach(function (t, i) {
    var li = document.createElement('li'); li.dataset.i = i;
    if (i === 0 || TRACKS[i - 1].kind !== t.kind) {
      var h = document.createElement('li'); h.className = 'pl-head'; h.textContent = t.kind === 'mix' ? 'Mixes' : 'Tracks'; list.appendChild(h);
    }
    li.innerHTML = '<button>' + t.title + '</button>';
    li.firstChild.addEventListener('click', function () { loadTrack(i, true); toggleList(false); });
    list.appendChild(li);
  });
  showMeta();

  function icon(n) {
    var p = {
      play: '<path d="M7 4.5v15l12.5-7.5z"/>',
      pause: '<path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"/>',
      prev: '<path d="M6 5h2.5v14H6zM20 5v14L9.5 12z"/>',
      next: '<path d="M15.5 5H18v14h-2.5zM4 5v14l10.5-7z"/>',
      list: '<path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z"/>'
    }[n];
    return '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">' + p + '</svg>';
  }
  function fmt(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function setPlaying(p) {
    playing = p;
    playBtn.innerHTML = icon(p ? 'pause' : 'play');
    playBtn.setAttribute('aria-label', p ? 'Pausa' : 'Play');
    root.classList.toggle('is-playing', p);
  }
  function showMeta(sound) {
    titleEl.textContent = (sound && sound.title) || TRACKS[idx].title;
    Array.prototype.forEach.call(list.querySelectorAll('li[data-i]'), function (li) { li.classList.toggle('is-current', +li.dataset.i === idx); });
  }
  function refreshSound() {
    widget.getCurrentSound(function (s) { showMeta(s); });
    widget.getDuration(function (d) { duration = d; });
  }
  function step(dir) {
    pos += dir;
    if (pos >= order.length) { order = shuffled(TRACKS.length, idx); pos = 0; }
    if (pos < 0) pos = order.length - 1;
    loadTrack(order[pos], true);
  }
  function loadTrack(i, autoplay) {
    idx = i; pos = order.indexOf(i);
    fill.style.width = '0%'; timeEl.textContent = '0:00'; showMeta();
    if (!widget) return;
    widget.load(TRACKS[idx].url, {
      auto_play: !!autoplay, visual: false,
      callback: function () { refreshSound(); if (autoplay) widget.play(); }
    });
  }
  function toggleList(force) {
    var open = typeof force === 'boolean' ? force : list.hidden;
    list.hidden = !open; listBtn.setAttribute('aria-expanded', open);
  }

  playBtn.addEventListener('click', function () { if (widget && ready) widget.toggle(); });
  $('.pl-next').addEventListener('click', function () { step(1); });
  $('.pl-prev').addEventListener('click', function () { step(-1); });
  listBtn.addEventListener('click', function () { toggleList(); });
  document.addEventListener('click', function (e) { if (!root.contains(e.target)) toggleList(false); });
  bar.addEventListener('click', function (e) {
    if (!widget || !duration) return;
    var r = bar.getBoundingClientRect();
    widget.seekTo(duration * Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  });

  function init() {
    if (!window.SC || !SC.Widget) { titleEl.textContent = 'SoundCloud no disponible'; return; }
    widget = SC.Widget($('.pl-frame'));
    var E = SC.Widget.Events;
    widget.bind(E.READY, function () { ready = true; root.classList.add('is-ready'); refreshSound(); });
    widget.bind(E.PLAY, function () { setPlaying(true); refreshSound(); });
    widget.bind(E.PAUSE, function () { setPlaying(false); });
    widget.bind(E.FINISH, function () {
      widget.getSounds(function (s) {
        widget.getCurrentSoundIndex(function (i) {
          if (s && s.length > 1 && i < s.length - 1) widget.next(); else step(1);
        });
      });
    });
    widget.bind(E.PLAY_PROGRESS, function (e) {
      fill.style.width = (e.relativePosition * 100) + '%';
      timeEl.textContent = fmt(e.currentPosition);
    });
  }
  if (window.SC && SC.Widget) init();
  else window.addEventListener('load', init);
})();
