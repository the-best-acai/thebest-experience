(function () {
  'use strict';
  var root = document.getElementById('tb-root');
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* parallax discreto das lentes da abertura */
  if (!reduce) {
    var raf = 0;
    window.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        root.style.setProperty('--mx', ((e.clientX / (window.innerWidth || 1) - 0.5) * 2).toFixed(3));
        root.style.setProperty('--my', ((e.clientY / (window.innerHeight || 1) - 0.5) * 2).toFixed(3));
      });
    }, { passive: true });
  }

  /* entrar na experiência: lente atravessa a tela e leva à seção da data */
  var xl = document.getElementById('xl');
  document.getElementById('enter-btn').addEventListener('click', function () {
    xl.classList.remove('on'); void xl.offsetWidth; xl.classList.add('on');
    setTimeout(function () {
      var el = document.getElementById('data');
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 620);
    setTimeout(function () { xl.classList.remove('on'); }, 1400);
  });

  /* benefícios do ingresso */
  var bx = document.getElementById('bxgrid'), bxBtn = document.getElementById('bx-btn'), bxLabel = document.getElementById('bx-label');
  bxBtn.addEventListener('click', function () {
    var open = bx.classList.toggle('open');
    bxBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    bxLabel.textContent = open ? 'Recolher benefícios' : 'Confira o que o seu ingresso inclui';
  });

  /* palestrantes */
  var SPK = {
    joel: ['DIA 02 · 08H30', 'JOEL JOTA', 'Empresário, palestrante e referência em alta performance, liderança e desenvolvimento'],
    koyama: ['DIA 01 · 13H00', 'RAPHAEL KOYAMA', 'Co-fundador e CEO da rede MTG Foods, que detém as marcas Matsuri To Go, Mok The Poke e Matsuri'],
    decker: ['DIA 01 · 14H00', 'ALINE DECKER', 'Empresária, Mentora de Liderança, Palestrante e Podcaster'],
    braz: ['DIA 02 · 16H20', 'THIAGO BRAZ', 'Atleta e campeão olímpico brasileiro, especializado no salto com vara. Detentor de duas medalhas olímpicas e atual recordista sul-americano da modalidade']
  };
  var spkBtns = [].slice.call(document.querySelectorAll('[data-spk]'));
  var det = document.getElementById('det'), detTick = 0;
  spkBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = SPK[btn.getAttribute('data-spk')];
      spkBtns.forEach(function (o) { var on = o === btn; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      document.getElementById('det-slot').textContent = d[0];
      document.getElementById('det-name').textContent = d[1];
      document.getElementById('det-desc').textContent = d[2];
      detTick++; det.className = 'det ' + (detTick % 2 ? 'b' : 'a');
    });
  });

  /* agenda: Dia 01 / Dia 02 */
  var dayBtns = [].slice.call(document.querySelectorAll('[data-day]'));
  var agl = document.getElementById('agl'), dayTick = 0;
  dayBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var day = btn.getAttribute('data-day');
      dayBtns.forEach(function (o) { var on = o === btn; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      document.getElementById('day1').hidden = day !== '1';
      document.getElementById('day2').hidden = day !== '2';
      dayTick++; agl.className = 'agl ' + (dayTick % 2 ? 'b' : 'a');
    });
  });

  /* contagem regressiva: 09/11/2026 às 08h (Brasília, UTC-3) */
  var target = new Date('2026-11-09T08:00:00-03:00').getTime();
  function pad(n) { return ('0' + n).slice(-2); }
  function ring(p) { return 'conic-gradient(#F6A12B ' + Math.round(Math.min(1, Math.max(0, p)) * 360) + 'deg, rgba(255,206,130,0.16) 0)'; }
  function tick() {
    var diff = Math.max(0, target - Date.now());
    var v = { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
    var frac = { d: v.d / 30, h: v.h / 24, m: v.m / 60, s: v.s / 60 };
    ['d', 'h', 'm', 's'].forEach(function (k) {
      document.getElementById('cn-' + k).textContent = k === 'd' ? String(v[k]) : pad(v[k]);
      document.getElementById('cr-' + k).style.background = ring(frac[k]);
    });
  }
  tick(); setInterval(tick, 1000);
})();
