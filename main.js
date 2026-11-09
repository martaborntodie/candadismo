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
  }
  initPage();

  /* Navegación sin recargar, para que la música siga sonando al cambiar de página */
  var app = document.getElementById('app');
  function isInternal(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var u = new URL(a.href, location.href);
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
      e.preventDefault(); go(a.href, true);
    });
    window.addEventListener('popstate', function () { go(location.href, false); });
  }
})();
