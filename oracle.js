/* Candadismo — Oráculo. Tarot de Marsella, 22 arcanos mayores, tirada de tres cartas. */
(function () {
  var C = [
    ['0', 'LE MAT', 'El Loco',
     'La energía pura, sin número fijo. Un impulso que todavía no tiene forma y empuja hacia lo desconocido. Lo que se abre aquí no pide certeza: pide movimiento.',
     'Pure energy with no fixed number. An impulse that has no shape yet and pushes towards the unknown. What opens here asks not for certainty but for movement.'],
    ['I', 'LE BATELEUR', 'El Mago',
     'El comienzo. Sobre la mesa están todas las herramientas, aunque aún no sepas usarlas. Una mano apunta al cielo y otra a la tierra: el talento está, falta elegir.',
     'The beginning. Every tool is on the table, even if you don’t yet know how to use them. One hand points to the sky, one to the earth: the talent is there, the choice is still missing.'],
    ['II', 'LA PAPESSE', 'La Papisa',
     'La acumulación silenciosa. Un libro abierto que se lee hacia dentro. Algo está incubándose y necesita recogimiento antes de nacer.',
     'Silent accumulation. An open book read inwards. Something is incubating and needs stillness before it can be born.'],
    ['III', 'L’IMPÉRATRICE', 'La Emperatriz',
     'La explosión creativa. Lo que estaba guardado brota sin plan, con fertilidad y deseo. Es el momento de producir antes de juzgar.',
     'The creative explosion. What was held bursts out without a plan, fertile and full of desire. Make first, judge later.'],
    ['IIII', 'L’EMPEREUR', 'El Emperador',
     'La estabilidad. El trono es cuadrado y el pie firme: estructura, orden, materia. Lo que construyas ahora tendrá cimientos.',
     'Stability. A square throne and a planted foot: structure, order, matter. What you build now will have foundations.'],
    ['V', 'LE PAPE', 'El Papa',
     'El puente entre dos mundos. Una enseñanza que se transmite, un vínculo entre quien sabe y quien busca. Escucha la voz que señala un ideal.',
     'The bridge between two worlds. A teaching passed on, a bond between the one who knows and the one who seeks. Listen to the voice pointing to an ideal.'],
    ['VI', 'L’AMOUREUX', 'El Enamorado',
     'La elección del corazón. Varias fuerzas tiran de ti y un ángel apunta desde arriba. No es decidir lo correcto: es reconocer lo que te da placer y verdad.',
     'The choice of the heart. Several forces pull at you while an angel aims from above. It is not about choosing right but recognising what brings you pleasure and truth.'],
    ['VII', 'LE CHARIOT', 'El Carro',
     'La acción en el mundo. Un viaje que avanza con dos fuerzas opuestas tirando a la par. El movimiento es ahora; conduce sin soltar ninguna.',
     'Action in the world. A journey moving forward with two opposite forces pulling side by side. The movement is now; drive without letting go of either.'],
    ['VIII', 'LA JUSTICE', 'La Justicia',
     'El equilibrio perfecto. La balanza pesa y la espada corta lo que sobra. Recibes exactamente lo que das: ni más, ni menos.',
     'Perfect balance. The scales weigh and the sword cuts what is excess. You receive exactly what you give: no more, no less.'],
    ['VIIII', 'L’HERMITE', 'El Ermitaño',
     'La crisis que ilumina. Camina hacia atrás, con la lámpara en alto, dejando atrás un ciclo. La sabiduría llega en soledad.',
     'The crisis that illuminates. He walks backwards, lamp raised, leaving a cycle behind. Wisdom arrives in solitude.'],
    ['X', 'LA ROUE DE FORTUNE', 'La Rueda de Fortuna',
     'El final de un ciclo y el principio de otro. La rueda está detenida y espera una mano que la mueva. Acepta lo que sube y lo que baja.',
     'The end of one cycle and the start of another. The wheel stands still, waiting for a hand to turn it. Accept what rises and what falls.'],
    ['XI', 'LA FORCE', 'La Fuerza',
     'El nuevo comienzo desde el cuerpo. La fuerza no doma con violencia: dialoga con el animal interior. Lo instintivo se vuelve energía creativa.',
     'A new beginning from the body. Strength doesn’t tame with violence: it converses with the inner animal. Instinct becomes creative energy.'],
    ['XII', 'LE PENDU', 'El Colgado',
     'La pausa voluntaria. Colgado del pie, con las manos ocultas, ve el mundo del revés. No hacer también es una forma de entrega profunda.',
     'The voluntary pause. Hanging by one foot, hands hidden, seeing the world upside down. Not acting is also a form of deep surrender.'],
    ['XIII', 'ARCANE SANS NOM', 'El Arcano sin nombre',
     'La transformación radical. La guadaña siega lo muerto para que crezca lo nuevo. No es un final: es la limpieza que precede a la vida.',
     'Radical transformation. The scythe mows down what is dead so the new can grow. Not an ending: the clearing that comes before life.'],
    ['XIIII', 'TEMPÉRANCE', 'Templanza',
     'La circulación. Un ángel pasa el agua de un vaso a otro sin derramarla. Sanación, protección, la mezcla justa de los opuestos.',
     'Circulation. An angel pours water from one vessel to another without spilling. Healing, protection, the right blend of opposites.'],
    ['XV', 'LE DIABLE', 'El Diablo',
     'El deseo y lo oculto. Energía creativa enorme que viene de lo más profundo, con sus lazos y sus pactos. Mira de frente lo que te ata y lo que te enciende.',
     'Desire and the hidden. Enormous creative energy rising from the depths, with its bonds and pacts. Look straight at what binds you and what sets you alight.'],
    ['XVI', 'LA MAISON DIEU', 'La Casa Dios',
     'La apertura. La torre se abre por arriba y lo encerrado sale a la luz. Una liberación repentina, una fiesta, un estallido de verdad.',
     'The opening. The tower breaks open at the top and what was locked inside comes into the light. A sudden release, a celebration, an outburst of truth.'],
    ['XVII', 'L’ÉTOILE', 'La Estrella',
     'Encontrar tu lugar en el mundo. Desnuda, vierte lo que tiene en la tierra y en el río. Generosidad, confianza, una guía que brilla desde lejos.',
     'Finding your place in the world. Naked, she pours what she holds into the earth and the river. Generosity, trust, a guide shining from afar.'],
    ['XVIII', 'LA LUNE', 'La Luna',
     'Lo receptivo y lo misterioso. Intuición, sueños, la noche que lo transforma todo. Hay algo que solo puede verse sin luz directa.',
     'The receptive and the mysterious. Intuition, dreams, the night that transforms everything. Some things can only be seen without direct light.'],
    ['XVIIII', 'LE SOLEIL', 'El Sol',
     'El nuevo construir. Dos figuras se apoyan bajo una luz que lo baña todo. Calor, claridad, unión y un muro que se levanta juntos.',
     'Building anew. Two figures support each other beneath a light that bathes everything. Warmth, clarity, union, and a wall raised together.'],
    ['XX', 'LE JUGEMENT', 'El Juicio',
     'El llamado. Una trompeta despierta lo que estaba dormido y algo renace desde abajo. Un deseo irresistible de ser quien eres.',
     'The call. A trumpet wakes what was asleep and something rises again from below. An irresistible desire to become who you are.'],
    ['XXI', 'LE MONDE', 'El Mundo',
     'La realización total. Una figura danza dentro de una corona, rodeada por los cuatro elementos. Todo está en su sitio y el ciclo se completa.',
     'Total fulfilment. A figure dances inside a wreath, surrounded by the four elements. Everything is in its place and the cycle is complete.']
  ];
  var POS = [
    ['Lo que fue', 'What was'],
    ['Lo que es', 'What is'],
    ['Lo que se abre', 'What opens']
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
      root.classList.remove('is-read');
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
      readEl.classList.add('is-on'); againBtn.hidden = false; hint.hidden = true; root.classList.add('is-read');
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    againBtn.onclick = function () { deal(); root.scrollIntoView({ behavior: 'smooth' }); };
    var lb = document.getElementById('langBtn');
    if (lb) lb.addEventListener('click', function () { if (picked.length === 3) setTimeout(read, 0); });
    deal();
  };
})();
