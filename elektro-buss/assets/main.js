// Elektro Buss – Menü, Eintritt der Abschnitte, Störungs-Check, Vorschau-Formular
document.documentElement.classList.add("js");

const menue = document.querySelector(".menue-knopf");
const nav = document.querySelector(".nav");
if (menue && nav) menue.addEventListener("click", () => {
  const offen = nav.classList.toggle("offen");
  menue.setAttribute("aria-expanded", offen);
});

// Teile jedes Abschnitts nacheinander einblenden (Überschrift, Text, Bild), einmal
const teile = document.querySelectorAll("[data-auf]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("da");
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px" });
  teile.forEach((t, i) => { t.style.transitionDelay = (Number(t.dataset.auf) || 0) * 80 + "ms"; io.observe(t); });
} else teile.forEach(t => t.classList.add("da"));

// Störungs-Check: Symptom wählen → was es bedeuten kann, wie dringend, was jetzt zu tun ist
const STOERUNG = {
  sicherung: { wie: "bald", wieText: "Bald prüfen lassen",
    was: "Meist ist der Stromkreis überlastet oder ein Gerät hat einen Defekt. Fliegt die Sicherung auch ohne angeschlossene Geräte, liegt der Fehler meist in der Leitung.",
    tun: ["Alle Geräte in diesem Stromkreis abstecken.", "Sicherung wieder einschalten.", "Geräte einzeln wieder anschließen – so finden Sie den Verursacher.", "Fliegt sie trotzdem: nicht weiter probieren, uns anrufen."] },
  fi: { wie: "bald", wieText: "Bald prüfen lassen",
    was: "Der FI-Schalter hat einen Fehlerstrom bemerkt und schützt damit Menschen. Häufige Ursachen: Feuchtigkeit (Außensteckdose, Keller) oder ein defektes Gerät wie Waschmaschine oder Herd.",
    tun: ["Alle Geräte abstecken, FI wieder einschalten.", "Geräte einzeln zuschalten.", "Den FI niemals überbrücken oder festhalten.", "Löst er weiter aus: anrufen, wir suchen den Fehler."] },
  warm: { wie: "sofort", wieText: "Sofort handeln",
    was: "Eine warme, verfärbte oder verschmort riechende Steckdose deutet auf eine lose Klemme oder Überlastung hin. Das ist eine echte Brandgefahr.",
    tun: ["Wenn gefahrlos möglich: Stecker ziehen.", "Die Sicherung dieses Stromkreises ausschalten.", "Steckdose nicht mehr benutzen.", "Rufen Sie uns direkt an. Bei Rauch oder Feuer: 112."] },
  flackern: { wie: "planen", wieText: "Prüfen lassen, wenn es bleibt",
    was: "Flackert nur eine Lampe, passt oft das Leuchtmittel nicht zum Dimmer. Flackert es in mehreren Räumen oder beim Einschalten großer Geräte, kann eine lose Verbindung dahinterstecken.",
    tun: ["Leuchtmittel tauschen, Dimmer-Angabe prüfen (LED-tauglich?).", "Notieren, wann es flackert und wo.", "Mehrere Räume betroffen: anrufen."] },
  dunkel: { wie: "bald", wieText: "Heute klären",
    was: "Wenn in einem Raum alles aus ist, hat meist eine Sicherung oder der FI-Schalter ausgelöst. Bleibt es nach dem Einschalten dunkel, liegt der Fehler weiter vorn.",
    tun: ["Im Verteiler nachsehen: steht ein Schalter nach unten?", "Wieder einschalten.", "Löst er sofort wieder aus oder bleibt es dunkel: anrufen."] },
  altbau: { wie: "planen", wieText: "In Ruhe planen",
    was: "Stoffummantelte Leitungen, Schraubsicherungen und kein FI-Schalter sind in älteren Häusern in Wilhelmshaven keine Seltenheit. Ein Check zeigt, was bleiben kann und was erneuert werden sollte.",
    tun: ["Fotos vom Sicherungskasten machen.", "Termin für einen Elektro-Check ausmachen.", "Wir sagen Ihnen vorher, was es kostet."] }
};
const check = document.querySelector("[data-check]");
if (check) {
  const box = check.querySelector(".antwort");
  const zeige = k => {
    const s = STOERUNG[k]; if (!s) return;
    box.innerHTML = `<span class="wie ${s.wie}"><i aria-hidden="true"></i>${s.wieText}</span>
      <p>${s.was}</p><ol>${s.tun.map(t => `<li>${t}</li>`).join("")}</ol>
      <div class="hero-aktionen"><a class="knopf" href="tel:${check.dataset.tel}">${check.dataset.telText} anrufen</a></div>`;
  };
  check.addEventListener("change", e => { if (e.target.name === "stoerung") zeige(e.target.value); });
  const erst = check.querySelector("input[name=stoerung]:checked"); if (erst) zeige(erst.value);
}

// Vorschau: Formular sendet nichts, zeigt aber, wie es später läuft
document.querySelectorAll("form[data-vorschau]").forEach(f => f.addEventListener("submit", e => {
  e.preventDefault();
  f.closest(".coupon").classList.add("gesendet");
  f.querySelector("button").textContent = "Danke – angekommen";
}));
