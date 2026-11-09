/* Candadismo — reproductor fijo arriba (SoundCloud Widget API).
   Para cambiar la lista: edita TRACKS (url de SoundCloud + título). */
(function () {
  var TRACKS = [
    { url: 'https://soundcloud.com/deprerreo/candadismo-bim-bom-bam-1', title: 'Bim Bom Bam' },
    { url: 'https://soundcloud.com/deprerreo/lmiranda-x-malandra-escuchala', title: 'LMiranda x Malandra — Escúchala' },
    { url: 'https://soundcloud.com/pikoteo/5f3d3866-4453-4344-b79f-68c1a0aa5e35', title: 'Pikoteo' },
    { url: 'https://soundcloud.com/deprerreo/candadismo-bim-bom-bam-remix-by-gitano-del-futuro', title: 'Bim Bom Bam (Gitano del Futuro remix)' },
    { url: 'https://soundcloud.com/deprerreo/la-cantera-mixes-01-candadismo', title: 'La Cantera Mixes 01' },
    { url: 'https://soundcloud.com/rinsefm/lizz-presents-candadismo-03-july-2025', title: 'LIZZ presents Candadismo — Rinse FM' },
    { url: 'https://soundcloud.com/itsplasmaradio/113-candadismo-deprerreo', title: 'Plasma Radio 113 — Candadismo' }
  ];
  var PROFILE = 'https://soundcloud.com/candadismo';

  var root = document.getElementById('player');
  if (!root) return;

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
      encodeURIComponent(TRACKS[0].url) + '&auto_play=false&visual=false"></iframe>';

  var $ = function (s) { return root.querySelector(s); };
  var playBtn = $('.pl-play'), titleEl = $('.pl-title'),
      fill = $('.pl-fill'), timeEl = $('.pl-time'), bar = $('.pl-bar'),
      list = $('.pl-list'), listBtn = $('.pl-listbtn');

  var idx = 0, playing = false, duration = 0, ready = false, widget = null;

  TRACKS.forEach(function (t, i) {
    var li = document.createElement('li');
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
    Array.prototype.forEach.call(list.children, function (li, i) { li.classList.toggle('is-current', i === idx); });
  }
  function refreshSound() {
    widget.getCurrentSound(function (s) { showMeta(s); });
    widget.getDuration(function (d) { duration = d; });
  }
  function loadTrack(i, autoplay) {
    idx = (i + TRACKS.length) % TRACKS.length;
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
  $('.pl-next').addEventListener('click', function () { loadTrack(idx + 1, true); });
  $('.pl-prev').addEventListener('click', function () { loadTrack(idx - 1, true); });
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
    widget.bind(E.FINISH, function () { loadTrack(idx + 1, true); });
    widget.bind(E.PLAY_PROGRESS, function (e) {
      fill.style.width = (e.relativePosition * 100) + '%';
      timeEl.textContent = fmt(e.currentPosition);
    });
  }
  if (window.SC && SC.Widget) init();
  else window.addEventListener('load', init);
})();
