/* Candadismo — Oráculo. Tarot de Marsella, 22 arcanos mayores, tirada de tres cartas. */
(function () {
  var C = [
    ['0', 'LE MAT', 'El Loco',
     'Salir de casa sin saber a qué fiesta vas. Lo mejor de la noche todavía no tiene nombre: déjate llevar, pero lleva el móvil cargado.',
     'Leaving home without knowing which party you’re going to. The best part of the night has no name yet — let go, but keep your phone charged.'],
    ['I', 'LE BATELEUR', 'El Mago',
     'Tienes todo encima de la mesa: los cables, los dados, las ganas. Falta enchufarlo. Empieza con lo que hay.',
     'Everything is on the table: the cables, the dice, the hunger. It just needs plugging in. Start with what you have.'],
    ['II', 'LA PAPESSE', 'La Papisa',
     'Hay un libro abierto que solo lees tú. No lo cuentes todavía: lo que se incuba en silencio sale con más fuerza.',
     'There’s an open book only you can read. Don’t tell anyone yet: what incubates in silence comes out louder.'],
    ['III', 'L’IMPÉRATRICE', 'La Emperatriz',
     'Temporada de crear sin pedir permiso. Todo lo que tocas florece si lo riegas con deseo y un poco de descaro.',
     'Season of making without asking for permission. Everything you touch blooms if you water it with desire and a little nerve.'],
    ['IIII', 'L’EMPEREUR', 'El Emperador',
     'Toca poner orden en el set. Estructura, horarios, contrato firmado. La magia también necesita mesa y patas.',
     'Time to put the set in order. Structure, schedules, a signed contract. Magic needs a table with legs too.'],
    ['V', 'LE PAPE', 'El Papa',
     'Alguien que ya ha pasado por ahí tiene algo que decirte. Escucha, aunque luego lo remezcles a tu manera.',
     'Someone who’s been there has something to tell you. Listen — even if you remix it your own way later.'],
    ['VI', 'L’AMOUREUX', 'El Enamorado',
     'Dos caminos y los dos brillan. Elige con el cuerpo, no con el algoritmo. Lo que te hace bailar es la respuesta.',
     'Two paths and both are shining. Choose with your body, not the algorithm. Whatever makes you dance is the answer.'],
    ['VII', 'LE CHARIOT', 'El Carro',
     'Ruta, gira, maletas. Lo que empezó en tu cuarto ya va en marcha y nadie lo para. Agárrate fuerte a las riendas.',
     'Road, tour, suitcases. What started in your bedroom is moving and nobody’s stopping it. Hold the reins tight.'],
    ['VIII', 'LA JUSTICE', 'La Justicia',
     'Cuentas claras y facturas pagadas. Lo que das vuelve exacto. Pon precio a tu trabajo y no pidas perdón.',
     'Clear accounts, paid invoices. What you give comes back exactly. Put a price on your work and don’t apologise.'],
    ['VIIII', 'L’HERMITE', 'El Ermitaño',
     'Apaga el móvil un rato. La linterna que buscas la llevas tú. Hay respuestas que solo suenan con los cascos puestos.',
     'Turn your phone off for a while. The lantern you’re looking for is in your hand. Some answers only play with headphones on.'],
    ['X', 'LA ROUE DE FORTUNE', 'La Rueda de Fortuna',
     'El plato gira. Lo que hoy está abajo mañana suena en el pico de la noche. Aprovecha la vuelta.',
     'The platter spins. What’s at the bottom today plays at the peak of the night tomorrow. Ride the turn.'],
    ['XI', 'LA FORCE', 'La Fuerza',
     'Tu fuerza no grita, susurra al oído de la bestia. Doma lo salvaje sin apagarlo.',
     'Your strength doesn’t shout, it whispers to the beast. Tame the wild thing without switching it off.'],
    ['XII', 'LE PENDU', 'El Colgado',
     'Míralo todo del revés. La pausa no es pérdida: es el silencio antes del drop.',
     'Look at everything upside down. The pause isn’t loss — it’s the silence before the drop.'],
    ['XIII', 'ARCANE SANS NOM', 'El Arcano sin nombre',
     'Algo se corta de raíz para que crezca otra cosa. Suelta lo que ya no suena. Limpieza total de la carpeta.',
     'Something gets cut at the root so something else can grow. Let go of what no longer plays. Wipe the folder.'],
    ['XIIII', 'TEMPÉRANCE', 'Templanza',
     'Mezcla con paciencia, como dos pistas que tardan en cuadrar. El punto medio también es un lugar precioso.',
     'Mix patiently, like two tracks that take a while to lock. The middle ground is a beautiful place too.'],
    ['XV', 'LE DIABLE', 'El Diablo',
     'Deseo, ego, cadenas brillantes. Disfruta del fuego, pero mira quién tiene la llave del candado.',
     'Desire, ego, shiny chains. Enjoy the fire, but check who’s holding the key to the padlock.'],
    ['XVI', 'LA MAISON DIEU', 'La Casa Dios',
     'Se cae la estructura y entra la luz. Lo que se rompe hoy deja sitio para una fiesta mejor.',
     'The structure falls and the light gets in. What breaks today makes room for a better party.'],
    ['XVII', 'L’ÉTOILE', 'La Estrella',
     'Desnuda y en paz, vertiendo lo que tienes sin miedo. Hay una estrella que lleva tu nombre: sigue brillando.',
     'Naked and at peace, pouring out what you have without fear. There’s a star with your name on it — keep shining.'],
    ['XVIII', 'LA LUNE', 'La Luna',
     'Noche cerrada, intuición abierta. No todo lo que ves es real ni todo lo real se ve. Confía en tu olfato de bruja.',
     'Pitch-dark night, wide-open intuition. Not everything you see is real, nor is everything real visible. Trust your witch’s nose.'],
    ['XVIIII', 'LE SOLEIL', 'El Sol',
     'Amanecer después del after. Claridad, alegría, gente buena alrededor. Lo que sembraste sale a la luz.',
     'Sunrise after the afterparty. Clarity, joy, good people around you. What you planted comes into the light.'],
    ['XX', 'LE JUGEMENT', 'El Juicio',
     'Una llamada te despierta. Es tu momento de decir sí a lo que siempre supiste que eras.',
     'A call wakes you up. It’s your moment to say yes to what you always knew you were.'],
    ['XXI', 'LE MONDE', 'El Mundo',
     'Ciclo cerrado, baile completo. Todo encaja y el mundo es tu pista. Celébralo antes de empezar el siguiente.',
     'Cycle closed, dance complete. Everything fits and the world is your dancefloor. Celebrate before the next one starts.']
  ];
  var POS = [
    ['Lo que suena', 'What’s playing'],
    ['Lo que se atasca', 'What’s stuck'],
    ['Lo que viene', 'What’s coming']
  ];

  function lang() { return document.documentElement.getAttribute('data-lang') === 'es' ? 1 : 0; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function face(c) {
    return '<div class="tc__face tc__front"><span class="tc__num">' + c[0] + '</span>' +
      '<span class="tc__orn" aria-hidden="true">✶</span>' +
      '<span class="tc__name">' + c[1] + '</span></div>';
  }

  window.initOracle = function () {
    var root = document.getElementById('oraculo');
    if (!root) return;
    var deckEl = root.querySelector('.or-deck'), slots = root.querySelectorAll('.or-slot'),
        readEl = root.querySelector('.or-reading'), againBtn = root.querySelector('.or-again'),
        hint = root.querySelector('.or-hint');
    var picked = [];

    function deal() {
      picked = [];
      readEl.innerHTML = ''; readEl.classList.remove('is-on');
      againBtn.hidden = true; hint.hidden = false;
      Array.prototype.forEach.call(slots, function (s) { s.querySelector('.or-slot__card').innerHTML = ''; s.classList.remove('is-filled'); });
      deckEl.innerHTML = '';
      shuffle(C.map(function (_, i) { return i; })).forEach(function (idx, n) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'tc tc--deck'; b.style.setProperty('--n', n);
        b.setAttribute('aria-label', 'Carta ' + (n + 1));
        b.innerHTML = '<div class="tc__face tc__back"></div>';
        b.addEventListener('click', function () { pick(b, idx); });
        deckEl.appendChild(b);
      });
    }
    function pick(b, idx) {
      if (picked.length >= 3 || b.classList.contains('is-taken')) return;
      b.classList.add('is-taken');
      var k = picked.length; picked.push(idx);
      var c = C[idx], holder = slots[k].querySelector('.or-slot__card');
      holder.innerHTML = '<div class="tc tc--big"><div class="tc__inner">' + '<div class="tc__face tc__back"></div>' + face(c) + '</div></div>';
      slots[k].classList.add('is-filled');
      setTimeout(function () { holder.querySelector('.tc').classList.add('is-flipped'); }, 60);
      if (picked.length === 3) setTimeout(read, 900);
    }
    function read() {
      var L = lang();
      readEl.innerHTML = picked.map(function (idx, k) {
        var c = C[idx];
        return '<article class="or-read"><p class="mono or-read__pos">' + POS[k][L ? 0 : 1] + '</p>' +
          '<h3 class="display or-read__title">' + c[0] + ' · ' + c[1] + '</h3>' +
          '<p class="or-read__es-name">' + c[2] + '</p>' +
          '<p class="or-read__text">' + c[L ? 3 : 4] + '</p></article>';
      }).join('');
      readEl.classList.add('is-on'); againBtn.hidden = false; hint.hidden = true;
      readEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    againBtn.onclick = function () { deal(); root.scrollIntoView({ behavior: 'smooth' }); };
    var lb = document.getElementById('langBtn');
    if (lb) lb.addEventListener('click', function () { if (picked.length === 3) setTimeout(read, 0); });
    deal();
  };
})();
