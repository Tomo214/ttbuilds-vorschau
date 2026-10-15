/* Silhouette — Interaktion: Mobile-Nav, Öffnungsstatus, Scroll-Reveal, Terminformular */
(function () {
  'use strict';

  // ---- Mobile-Navigation ----
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      var open = document.body.classList.contains('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  // ---- Öffnungsstatus (Mo–Fr 10–18, Sa 10–16) ----
  // Zeigt live "Jetzt geöffnet" / "Geschlossen" im Topbar-Element [data-status].
  function openState(d) {
    var day = d.getDay();            // 0 So … 6 Sa
    var mins = d.getHours() * 60 + d.getMinutes();
    var hours = { 1: [600, 1080], 2: [600, 1080], 3: [600, 1080], 4: [600, 1080], 5: [600, 1080], 6: [600, 960] };
    var h = hours[day];
    if (h && mins >= h[0] && mins < h[1]) return { open: true, text: 'Jetzt geöffnet' };
    // nächste Öffnung finden
    for (var i = 0; i <= 7; i++) {
      var nd = (day + i) % 7;
      if (hours[nd] && (i > 0 || mins < hours[nd][0])) {
        var names = ['sonntags', 'montags', 'dienstags', 'mittwochs', 'donnerstags', 'freitags', 'samstags'];
        var oh = Math.floor(hours[nd][0] / 60);
        var label = i === 0 ? 'heute' : i === 1 ? 'morgen' : names[nd];
        return { open: false, text: 'Geschlossen · öffnet ' + label + ' ' + oh + ' Uhr' };
      }
    }
    return { open: false, text: 'Geschlossen' };
  }
  document.querySelectorAll('[data-status]').forEach(function (el) {
    var s = openState(new Date());
    el.innerHTML = '<span class="status-dot">' + (s.open ? '●' : '○') + '</span> ' + s.text;
  });

  // ---- Scroll-Reveal ----
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (r) { io.observe(r); });
  } else {
    revs.forEach(function (r) { r.classList.add('in'); });
  }

  // ---- Terminformular ----
  // Statisches Setup: kein Backend. Bei Absenden fassen wir die Anfrage
  // zusammen und bieten Anruf + vorbereitete E-Mail an. Die Zieladresse
  // unten anpassen, sobald sie feststeht.
  var CONTACT_EMAIL = 'termin@silhouette-whv.de'; // TODO: echte Adresse eintragen
  var form = document.querySelector('form.appt');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var anlass = data.get('anlass') || '';
      var wunsch = data.get('wunsch') || '';
      var tel = data.get('tel') || '';
      var nachricht = (data.get('nachricht') || '').toString().trim();

      var body =
        'Terminanfrage über die Website\n\n' +
        'Name: ' + name + '\n' +
        'Anlass: ' + anlass + '\n' +
        'Wunschzeit: ' + wunsch + '\n' +
        'Telefon: ' + tel + '\n' +
        'Nachricht: ' + nachricht + '\n';
      var mailto = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('Terminanfrage – ' + (name || 'Silhouette')) +
        '&body=' + encodeURIComponent(body);

      var ok = document.querySelector('.form-ok');
      if (ok) {
        ok.innerHTML =
          '<h3>Fast geschafft, ' + escapeHtml(name.split(' ')[0] || '') + '</h3>' +
          '<p style="margin:.6rem 0 1.1rem">Am schnellsten geht es telefonisch – oder du schickst uns deine Anfrage direkt als vorbereitete E-Mail.</p>' +
          '<div style="display:flex;flex-wrap:wrap;gap:.7rem">' +
          '<a class="btn btn--sm" href="tel:044219668202">04421 9668202 anrufen</a>' +
          '<span style="opacity:.75;font-size:.9em">Vorschau: In der fertigen Seite landet die Anfrage direkt bei euch im Postfach.</span>' +
          '</div>';
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.style.display = 'none';
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- Fußzeilen-Jahr ----
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
