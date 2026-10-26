# Lernraum – Karteikarten

Mobile, deutschsprachige Web-App für Fächer → Themen/Klausuren → eigene Frage-Antwort-Karten.
Repository: https://github.com/Vietze123/Lernraum
Vorgesehene Pages-Adresse: https://vietze123.github.io/Lernraum/

## Wer macht was?

Der Besitzer verwaltet dieses Repository, Programmupdates und optional die Ausgangsvorlage.
Seine Freundin öffnet den Pages-Link ohne Anmeldung. Im normalen Modus werden Karten
nur angezeigt und gelernt. Erst **Bearbeitungsmodus** aktiviert Anlegen, Bearbeiten und
Löschen. **Bearbeitung beenden** schaltet zurück. Beim Start einer Lernrunde wird der
Bearbeitungsmodus immer beendet; im Lernmodus gibt es Umdrehen, Gewusst, Wiederholen und den bewussten Zyklus-Neustart.

Es gibt keine Accounts, Cloud-Synchronisierung, Freigaben oder Vorschlagsprozesse.
Persönliche Änderungen und Lernstände bleiben auf dem jeweiligen Gerät.

## Karten per Datei austauschen

1. Ausgangsinhalte in der App über **Bearbeitungsmodus** eingeben.
2. **Hilfe & Datensicherung → JSON-Sicherung exportieren** wählen und die Datei privat weitergeben.
3. Die Empfängerin öffnet dieselbe App auf ihrem Gerät und importiert die Datei.
4. Sie kann lernen und nach Aktivierung des Bearbeitungsmodus eigene Änderungen vornehmen.
5. Möchte sie diese zurückgeben, exportiert sie ihren Stand und schickt die Datei an den Besitzer.
6. Der Besitzer exportiert zuerst seinen eigenen Stand als Sicherung und importiert danach ihre Datei.

**Import ersetzt nach Bestätigung den gesamten bisherigen lokalen Stand, einschließlich
Lernfortschritt. Er führt die Datei nicht mit den bisherigen lokalen Karten zusammen.**
Es gibt keinen automatischen Rückkanal. Vorhandene v1-Sicherungen werden ebenfalls akzeptiert.
Beim Import wird der importierte Stand zusätzlich mit der aktuell geladenen Repository-Vorlage
abgeglichen; dafür gelten die unten beschriebenen Vorlagenregeln. Diese Regeln vereinen nicht
zwei persönliche Sicherungen. Danach bleibt der bisherige lokale Stand nur in einer zuvor
exportierten Datei verfügbar.

Eine JSON-Sicherung enthält die Karten und Antworten im Klartext. Sicherungen nicht ins
öffentliche Repository hochladen. Export bedeutet nur Download: Die Datei wird nicht automatisch
an eine andere Person versendet. Bei Geräten mit mehreren Benutzeroberflächen immer im
gewünschten Browser bzw. in der Home-Bildschirm-App importieren.

## Optionale zentrale Ausgangsvorlage pflegen

`content.json` enthält die zwölf vorgegebenen Fächer mit stabilen IDs; pro Fach gibt es die Untergruppe Beispielkarten mit drei Beispielfrage-/Beispielantwort-Platzhaltern. Nur bewusst öffentliche Inhalte gehören hinein: Sowohl das
Repository als auch die App und diese Datei sind öffentlich abrufbar. Private Lerninhalte
stattdessen ausschließlich in der App erfassen und per Sicherungsdatei austauschen.

Das Schema ist:

- `schemaVersion`: immer `1`.
- `revision`: Zeichenfolge, bei jeder inhaltlichen Änderung erhöhen (z. B. `"1"` → `"2"`).
- `subjects`: Liste von Fächern mit jeweils `id`, `name`, `topics`.
- Ein Thema enthält `id`, `name`, `cards`.
- Eine Karte enthält `id`, `question`, `answer`. Lernstände kommen nicht in die Vorlage.

IDs müssen global eindeutig und dauerhaft sein, z. B. `fach-01`, `thema-01`, `karte-01`.
Namen und Texte darfst du ändern; bestehende IDs nicht wiederverwenden oder zwischen
Fächern/Themen verschieben. Neue Einträge bekommen neue IDs. Leere Listen sind erlaubt,
leere Namen, Fragen und Antworten nicht. Es sind keine Lerninhalte vorgegeben.
JSON lässt sich auf GitHub mit dem Stiftsymbol bearbeiten. Änderungen auf `main` speichern;
nach dem Pages-Update die App neu öffnen. Keine Installation oder Abhängigkeiten erforderlich.

### Was beim Vorlagenupdate passiert

Die App merkt sich die zuletzt angewandte Vorlage und den persönlichen Stand. Beim Öffnen
lädt sie `content.json` und vergleicht beide mit der neuen Vorlage:

- Neue Fächer, Themen und Karten werden ergänzt.
- Unveränderte persönliche Karten übernehmen zentrale Textänderungen. Ihr Lernstatus bleibt erhalten.
- Eine persönlich geänderte Karte bleibt **als ganze Frage-Antwort-Karte** erhalten. Wenn beide
  Seiten diese Karte unterschiedlich geändert haben, gewinnt die persönliche Fassung – auch
  wenn eine Seite nur die Frage und die andere nur die Antwort geändert hat. Unter Hilfe wird
  die neue Vorlagenfassung zum Vergleich angezeigt; eine gewünschte Übernahme erfolgt manuell
  im Bearbeitungsmodus. Es gibt keine automatische Freigabe.
- Bei beidseitiger Umbenennung von Fach/Thema gewinnt der persönliche Name; ein Hinweis nennt
  den neuen Vorlagennamen. Die untergeordneten Einträge werden getrennt abgeglichen.
- Persönlich gelöschte Vorlageneinträge bleiben gelöscht, solange die ID in der bisherigen
  Vorlage vorhanden war. Änderungen an solchen Einträgen erzeugen einen Hinweis.
- Zentral entfernte Einträge werden lokal entfernt, wenn sie inhaltlich unverändert sind.
  Persönlich geänderte Einträge bleiben mit Hinweis erhalten. Reiner Lernfortschritt gilt
  nicht als Inhaltsänderung: Er verhindert eine zentrale Löschung nicht.
- Eigene Ergänzungen bleiben erhalten. Bei kollidierenden neuen IDs gewinnt der persönliche Stand.

Grenzen: Kein feldweiser Textabgleich, keine dauerhafte Versionshistorie, keine Synchronisierung
zwischen Geräten. Hinweise bleiben bis zur Markierung als gelesen erhalten; pro ID wird nur der
jüngste Hinweis gespeichert. Zentral gelöschte und später wieder eingeführte IDs können erneut
erscheinen; deshalb IDs niemals wiederverwenden. Verschieben bestehender Vorlagen-IDs wird
abgelehnt. Bei ungültigen Vorlagen, unveränderter Revision trotz Textänderungen oder Ladefehlern
bleibt der gespeicherte Stand erhalten und es erscheint ein Hinweis. Das Laden wird beim nächsten
Öffnen erneut versucht. Mehrere gleichzeitig geöffnete Tabs sollten nicht parallel bearbeiten:
Der letzte gespeicherte Stand gewinnt.

## GitHub Pages einschalten

In https://github.com/Vietze123/Lernraum/settings/pages unter **Build and deployment** die
Quelle **Deploy from a branch**, Branch **main**, Ordner **/(root)** wählen und **Save** klicken.
Die Dateien liegen direkt im Hauptverzeichnis. `.nojekyll` deaktiviert die Jekyll-Verarbeitung.
Die von GitHub dort angezeigte URL ist nach erfolgreichem Deployment nutzbar. HTTPS verwenden.

## iPhone, Speicherung und Offline

In Safari öffnen → Teilen → Zum Home-Bildschirm → Hinzufügen. Kein Mac erforderlich.
Karten und Fortschritt liegen im localStorage des jeweiligen Browsers. Keine Übertragung der
persönlichen Karten an GitHub oder einen App-Server. GitHub verarbeitet beim Seitenabruf
unter anderem die IP-Adresse. Browserdaten-Löschen, privates Surfen oder Speicherbereinigung
können Daten entfernen. Regelmäßig exportieren; lokaler Speicher ist nicht verschlüsselt.

GitHub-Projektseiten dieses Kontos teilen die Origin `https://vietze123.github.io`.
localStorage ist deshalb keine Sicherheitsgrenze gegenüber anderen Seiten derselben Origin.
Der Speicherschlüssel ist `lernraum-v1` (internes Sicherungsformat v2).

Eine bereits geöffnete Seite kann ohne Internet benutzt werden; Neuladen oder erneutes Öffnen
benötigt Internet. Es gibt keinen Service Worker und keine vollständige Offline-Installation.

## Prüfung

JavaScript-Syntax und separate Tests erfolgreich für Datenvalidierung, JSON-Rundlauf,
Vorlagenupdates, neue Karten, lokale Löschung, zentrale Entfernung, beidseitige Änderungen,
Lernfortschritt, ungültige Revision/IDs/Verschiebungen, bewusstes Aktivieren der Bearbeitung,
Sperre im Lernmodus, Speicherfehler und Import alter Sicherungen.
Eine echte iPhone-Bedienprüfung wurde noch nicht durchgeführt.

Offizielle Anleitung: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Warme Gestaltung

Gestaltungsentscheidungen, Kontrastprüfung und Quellen sind in [DESIGN.md](DESIGN.md) dokumentiert.
Die Farben erleichtern die Orientierung; es wird keine allgemeine Gedächtniswirkung bestimmter Farben versprochen.

## Fächervorlage und Lernzyklen

Die Vorlage enthält PMK, Psychologie, Pädagogik, Deutsch&Kommunikation, Englisch, Bewegung, Musik, Werken, Kunst, Religionspädagogik, Rechtskunde sowie Naturwissenschaften und Gesundheit. Pro Fach wurde ausdrücklich die Untergruppe Beispielkarten mit drei neutralen Beispielfrage-/Beispielantwort-Platzhaltern ergänzt. Echte Lerninhalte oder Klausuren sind nicht enthalten.

Beim erstmaligen Ergänzen eines Vorlagenfachs wird ein vorhandenes gleichnamiges lokales Fach übernommen. Groß-/Kleinschreibung, Rand-Leerzeichen, mehrfache Leerzeichen und Leerzeichen um & werden beim Abgleich ignoriert. Themen, Karten, Fortschritt und vorhandene Schreibweise bleiben erhalten. Die technische Fach-ID wird der stabilen Vorlagen-ID zugeordnet; die feste Fachfarbe der zugeordneten Vorlagen-ID wird übernommen. Ein lokaler colorKey bleibt nur als Rückfall für zusätzliche eigene Fächer erhalten. Bei bereits vorhandenen mehreren gleichnamigen lokalen Fächern wird nur das erste zugeordnet; bestehende eigene Duplikate werden nicht gelöscht. Kein unscharfer Ähnlichkeitsvergleich. Lokal gelöschte oder umbenannte bereits zugeordnete Fächer werden bei erneutem Laden nicht zurückgesetzt.

Ein Lernzyklus wird pro Thema gespeichert: 0/3 noch nicht gewusst, 1/3 einmal gewusst, 2/3 zweimal gewusst, 3/3 abgeschlossen. Nach Gewusst erhöht sich der Zähler um eins. Wiederholen erhöht und vermindert ihn nicht; richtige Antworten müssen nicht aufeinander folgen. Nicht abgeschlossene Karten kommen im nächsten Durchlauf wieder. Eine 3/3-Karte bleibt gespeichert und wird nur aus dem aktuellen Zyklus genommen. Durchlauf, Reihenfolge, Position und Zähler liegen lokal im optionalen cycles-Feld der v2-Sicherung. Beim Öffnen von Lernen wird ein vorhandener Zyklus fortgesetzt. Zyklus neu starten setzt bewusst auf 0/3 zurück, bei laufendem Zyklus nach Bestätigung.

Alte Sicherungen ohne Lernzyklen bleiben gültig. Ein früheres Gewusst wird beim ersten Zyklus als 1/3 übernommen, da frühere Wiederholungszahlen nicht gespeichert wurden; neue oder zu wiederholende Karten beginnen bei 0/3. Beim expliziten Neustart beginnen alle Karten bei 0/3. Entfernte Karten/Topics werden aus den Zyklusdaten entfernt, neu hinzugefügte Karten erhalten 0/3. Die Dateiübergabe umfasst den Lernzyklus; ein Import ersetzt weiterhin den gesamten lokalen Stand nach Bestätigung. Keine automatische Rückübertragung.

## Feste Fachfarben

Alle zwölf vorgegebenen Fächer haben ausdrücklich fest codierte, individuelle Farbpaletten über ihre stabilen IDs. Die Zuordnung gilt auch für zugeordnete gleichnamige importierte Fächer und bleibt beim Umbenennen erhalten. [Zuordnung und Farbnamen](FACHFARBEN.md). Kein Farbeditor; zusätzliche eigene Fächer erhalten eine deterministische Zuordnung, bei der Wiederholungen möglich sind.

## Beispielkarten

Jedes Fach enthält genau die Demo-Untergruppe Beispielkarten mit drei Karten Beispielfrage 1 bis 3 / Beispielantwort 1 bis 3. Das sind ausschließlich Platzhalter, keine fachlichen Lerninhalte. Demo-IDs sind dauerhaft; Beispiele werden wie andere Karten im Bearbeitungsmodus bearbeitet oder gelöscht. Persönliche Änderungen bleiben bei Vorlagenupdates erhalten. Lokal gelöschte Beispiele werden bei unveränderter Vorlage nicht wiederhergestellt. Sie werden erst bei einer bewussten Wiederherstellung einer Sicherung mit diesen Beispielen erneut übernommen.
