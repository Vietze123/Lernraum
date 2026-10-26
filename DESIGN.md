# Gestaltung des Lernraums

Stand: 26. Oktober 2026. Die warme Palette ist eine ästhetische Entscheidung. Sie ist keine Behauptung, dass warme Farben oder eine bestimmte
Farbe generell Gedächtnis, Leistung oder Wohlbefinden verbessern.

## Was die Gestaltung leitet

- Apricotfarbener Hintergrund statt weißer Arbeitsfläche; Terrakotta für allgemeine Aktionen,
  Rosé, Pflaume, Ocker und gedämpftes Oliv für zurückhaltende Akzente.
- Große, farbige Serifentitel und klar getrennte Inhaltsflächen. Text bleibt echter Text und
  kann umbrechen; die dekorative Illustration enthält keine Lerninhalte.
- Zwölf feste Fachpaletten, explizit den zwölf vorgegebenen stabilen Fach-IDs zugeordnet. Umbenennen, Neuladen und Import ändern die Zuordnung nicht. Zusätzliche eigene Fächer erhalten eine deterministische Zuordnung mit möglichen Wiederholungen; Fachnamen bleiben entscheidend. Die Zuordnung steht in FACHFARBEN.md.
- Dieselbe Fachfarbe bei Navigation, Überschriften, Karten und Lernmodus. Eine dünne obere
  Farbkante, farbige Kartenköpfe und zurückhaltende Schatten erinnern an Karteikarten aus Papier.
- Gewusst, Wiederholen und Neu tragen Text und Symbole. Aktives Fach: Rand, Text und
  `aria-current`; Bearbeitungsmodus: klarer Text und `aria-pressed`. Farbe trägt nie allein
  die Bedeutung.
- Große Schaltflächen, sichtbarer Tastaturfokus, Sprung zum Lernbereich, benannte Dialoge,
  Rücksicht auf reduzierte Bewegung und Systemfarben im Modus mit erzwungenen Farben.
- Unverändert: Datenmodell, Speicherschlüssel, JSON-Austausch, Vorlage und Bearbeitungssperren.

## Quellen und Übertragungsgrenzen

**W3C, WCAG 2.2 – Kontrast:** Normaler Text mindestens 4,5:1, großer Text mindestens 3:1.
Die Palette wurde auch für große Texte nach dem strengeren Wert 4,5:1 geprüft.
https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

**W3C, WCAG 2.2 – Farbe:** Farbe darf Information und Bedienzustände nicht allein vermitteln.
Deshalb ergänzen Beschriftungen, Symbole und Konturen die Farbcodierung.
https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html

**W3C, WCAG 2.2 – Zielgrößen:** Die Richtlinie nennt mindestens 24 × 24 CSS-Pixel mit
Ausnahmen. Die Hauptaktionen dieser App sind in der Regel mindestens 44 Pixel hoch.
https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

**Ozcelik et al. (2009), Originalstudie mit 52 Studierenden:** Konsistente Farbcodierung
korrespondierender Text- und Illustrationselemente erleichterte in dieser konkreten
Multimedia-Lernsituation die Zuordnung; die Studie berichtet bessere Behaltens- und
Transferleistungen. Das ist keine Untersuchung dieser App und kein Beleg für eine generelle
Gedächtniswirkung von Terrakotta, Rosé oder warmen Farben. Hier dient Fachfarbe ausschließlich
als zusätzliche Orientierung. Die Studie begründet keine bestimmte Anzahl von Fachfarben;
die Anzahl der Paletten folgt den zwölf vorgegebenen Fächern.
DOI: https://doi.org/10.1016/j.compedu.2009.03.002
Universitätsnachweis: https://open.metu.edu.tr/handle/11511/28595

## Prüfung

96 explizite Text-/Hintergrund-Paare inklusive aller Fachpaletten rechnerisch mindestens
4,5:1. Keine vollständige WCAG-Zertifizierung. Mobile Browseransicht bei 390 und 320 CSS-Pixeln,
lange Fach-/Thementitel und längere Karten ohne horizontales Überlaufen geprüft. Anlegen,
Ansicht ohne Bearbeitungsaktionen, Lernkarte umdrehen, Wiederholen, Wiederholungsrunde und
Gewusst im Browser geprüft. Automatische Daten-, Import-, Konflikt- und Bearbeitungsmodus-Tests
weiter erfolgreich. Testdaten nur in der lokalen Vorschau, niemals in `content.json`.
Keine echte iPhone-/VoiceOver-Prüfung durchgeführt.
