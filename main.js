(function () {
  var root = document.documentElement;
  function setLang(l) {
    root.setAttribute('data-lang', l); root.setAttribute('lang', l);
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  setLang(saved || ((navigator.language || 'en').slice(0, 2) === 'es' ? 'es' : 'en'));
  var btn = document.getElementById('langBtn');
  if (btn) btn.addEventListener('click', function () { setLang(root.getAttribute('data-lang') === 'en' ? 'es' : 'en'); });
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
