MYSTIC VALLEY – ALPHA 2.9.0
Die magische Werkstatt, Lagerhaus und Sternensplitter

UPDATE VON ALPHA 2.8
1. Noch im bisherigen Spiel: Zahnrad > Konto & Cloud > Jetzt sichern.
   Erfolg abwarten. Zusätzlich Spielstand & Spieloptionen > exportieren.
2. Diese ZIP entpacken.
3. Supabase > SQL Editor > New query:
   Den gesamten Inhalt von supabase_update_2_9.sql einfügen > Run.
   Nur die neue Datei ausführen, nicht die alten SQL-Migrationen wiederholen.
4. index.html, alle .js- und .css-Dateien sowie assets in den bisherigen
   Website-Ordner kopieren und ersetzen.
   Neu: economy29.css, premium.js und premium-protocol.js.
   cloud.js ist ebenfalls aktualisiert und muss ersetzt werden.
   Vorhandene CNAME und .nojekyll beibehalten, falls vorhanden.
5. Über GitHub Desktop: Commit to main > Push origin.
   Bei anderem Hosting dieselben Spieldateien hochladen.
6. Nach Bereitstellung auf ALLEN verwendeten Geräten Strg+F5 drücken.
   Oben muss Alpha 2.9.0 stehen.
   Anschließend anmelden und automatische Cloud-Prüfung abwarten.

Google und Login-Serverfunktion müssen nicht neu eingerichtet werden.
Bestehende Spielstände werden um die neuen Waren und Kapitelstände ergänzt.
Die neue SQL-Datei verändert keine Gildenprojekte, Bauzeiten oder Chats.
Der Sendefix aus Alpha 2.7.1 ist weiterhin enthalten.

LAGERHAUS
Links: Lagerhaus. Auch unten über Lagerhaus bzw. Ressourcen erreichbar.
Oben wird nur noch Gold angezeigt.
Das Lagerhaus zeigt alle 12 Bestände – einschließlich Beständen von null:
Gold, Holz, Kristalle, Mana, Stein, Nahrung, Kräuter, Bauholz, Zaubertränke,
Runenplatten, Zauberessenz, Schutzzauber.
Suche und Filter: Alle Ressourcen / Rohstoffe / Hergestellte Waren.
Bestände aktualisieren sich bei geöffnetem Lagerhaus fortlaufend.
Es gibt weiterhin keine Lagerobergrenze; keine vorhandenen Waren verfallen.

MAGISCHE WERKSTATT
Die bestehende Werkstatt wird erweitert. Kein zusätzlicher Gebäudeplatz nötig.
Alle bisherigen Rezepte und Warteschlangen bleiben bestehen.
Neue Rezepte (Kosten und Ausbeute jeweils pro Charge):
- Runenplatten: 6 Bauholz + 12 Stein > 2 Runenplatten, 120 Sekunden Basiszeit.
- Zauberessenz: 10 Kräuter + 8 Kristalle + 4 Mana > 2 Essenz, 150 Sekunden.
- Schutzzauber: 2 Runenplatten + 2 Zauberessenz > 1 Schutzzauber, 180 Sekunden.
Der bestehende Werkstattbonus reduziert die Herstellungszeit weiterhin.
Rezepte werden im Kapitel freigeschaltet.
Die Mengenwahl plant 1 bis 4 Chargen ein, abhängig von freien Plätzen.
Materialien werden beim Start für alle gewählten Chargen abgezogen.
Jede Station hat wie bisher vier Warteschlangenplätze.
Die Herstellung läuft auch bei geschlossenem Browser weiter.

KAPITEL 1 – DAS FLACKERNDE DORFSIEGEL
Links: Dorfsiegel, über den neuen Kartenbutton oder im Questbuch.
Acht Schritte führen durch Werkstatt, Bauholz, Runenplatten, Alchemiehütte,
Zauberessenz, Schutzzauber und das Auftragsbrett.
Gebäude-Freischaltlevel bleiben unverändert. Die Beschreibung erklärt,
welche Waren abgegeben und dabei verbraucht werden.
Der Abschluss gibt dauerhaft +5 % Rohstoffproduktion einschließlich Gold.
Das leuchtende Dorfsiegel auf der Karte zeigt den Abschluss.
Bisherige Quests und Lieferungen bleiben separat erhalten.

AUFTRAGSBRETT
Links: Auftragsbrett; auch unten über Aufträge.
Drei verfügbare Wünsche von Dorfbewohnern.
Vor Abgabe siehst du die Kosten, Gold und Erfahrung.
Abgegebene Waren werden verbraucht; der Auftrag wird ersetzt.
Wiederholte Klicks auf einen alten Auftrag geben keine zweite Belohnung.
Die bisherigen Lieferaufträge bleiben über einen eigenen Button erreichbar.

STERNENSPLITTER – AKTUELLE FUNKTIONEN
Links: Sternensplitter. Anmeldung und abgeschlossene Cloud-Prüfung nötig.
Der Splitterbestand liegt in einer eigenen serverseitigen Kontotabelle.
Er ist nicht Teil von Spielstandexporten, Test-Ressourcen oder lokalem Neustart.
Er bleibt beim selben Konto geräteübergreifend erhalten.

Verdienen:
- Täglicher Dorfbesuch: 1 Splitter nach Anmeldung und Abholen.
- Gemeinsam anpacken: 1 Splitter, wenn heute insgesamt mindestens
  25 Einheiten in gemeinsame Online-Gildenprojekte eingezahlt wurden.
  Die Prüfung verwendet das serverseitige Buchungsprotokoll.
Beide Aufgaben sind jeweils einmal pro Kalendertag abholbar.
Tageswechsel: Europe/Berlin, vom Server bestimmt.
Bereits vor dem Update am selben Tag gebuchte Gildeneinzahlungen zählen mit.

Verwenden:
- Persönliche Reparatur/Verbesserung sofort abschließen:
  Gebäude öffnen > Bau beschleunigen.
  Kosten: 1 Splitter je angefangene 10 Minuten Restzeit.
  Preis wird vor der Bestätigung angezeigt und serverseitig nachgeprüft.
  Es wird nie mehr als der bestätigte Höchstpreis abgebucht.
  Nach einer Reparatur musst du das Gebäude wie gewohnt aktivieren.
  Gildenbauzeiten und Herstellungsaufträge werden nicht beschleunigt.
- Sternenbanner: einmalig 5 Splitter für ein dauerhaftes kleines Dorfdekor.
  Das Dekor wird über das Konto auf anderen Geräten wieder geladen.

ECHTGELDKÄUFE
Noch NICHT aktiviert. Es werden keine Zahlungen angenommen.
Diese Version enthält weder Checkout noch Zahlungsmethoden noch Preisangebote.
Als nächster eigener Schritt sind ein Zahlungsanbieter, serverseitig geprüfte
Zahlungsbestätigungen, Paketpreise und Erstattungsabläufe einzurichten.
Vor Echtgeldbetrieb muss außerdem die bisher clientseitige Spielökonomie
für den geplanten Shop geprüft und entsprechend abgesichert werden.
Splitter werden niemals aufgrund eines Browser-Kaufsignals gutgeschrieben.
Alle Gebäude und das neue Kapitel sind ohne Splitter vollständig spielbar.

BUCHUNGSSCHUTZ
Splitterausgabe und Änderung des Cloud-Spielstands erfolgen atomar.
Versionsschutz und eindeutige Buchungskennungen verhindern Doppelabbuchungen.
Bei verlorener Antwort wird die Buchung geprüft, statt blind erneut abzubuchen.
Offene Buchungen werden beim nächsten Laden desselben Kontos abgeglichen.
Lässt sich eine Buchung nicht klären, pausiert die Cloud bis Erneut prüfen.
Vor Änderung des Spielstands wird eine interne lokale Sicherung erstellt.

LIVE-TEST SCHRITT FÜR SCHRITT
1. Lagerhaus: bestehende Rohstoffe, Bauholz und Tränke mit vorherigem Stand
   vergleichen; neue Waren stehen zunächst auf null. Suche/Filter ausprobieren.
2. Dorfbesuch-Bonus abholen: +1 Splitter; erneutes Abholen ist gesperrt.
   Auf dem zweiten Gerät mit demselben Konto: Aktualisieren > gleicher Bestand.
3. Eine Reparatur oder Verbesserung mit weniger als 10 Minuten Restzeit starten.
   Bau beschleunigen > Preis 1 Splitter bestätigen.
   Bau muss beendet sein, Bestand um genau 1 reduziert. Nach Reparatur aktivieren.
4. Seite neu laden: Bauabschluss und Splitterbestand müssen erhalten sein.
5. Dorfsiegel öffnen und Kapitel spielen. Vorhandene aktive Gebäude zählen mit;
   neue Herstellungsaufgaben zählen ab diesem Update.
6. Werkstatt: zwei Chargen wählen, Kosten prüfen, starten und nach Ablauf
   die Waren im Lagerhaus kontrollieren. Auch nach Neuladen prüfen.
7. Auftragsbrett: Auftrag abgeben. Bestände müssen sinken, Gold/EP steigen,
   und ein neuer Auftrag muss nachrücken. Nach Neuladen erhalten bleiben.
8. Bestehende Anmeldung, Chats, Freundesliste und Gildenprojekte kurz prüfen.

LOKALE PRÜFUNGEN
Isolierte PostgreSQL-Tests: Migration wiederholbar; Zugriffsrechte, Kontotrennung,
Tagesbonus, Gildennachweis, Versionskonflikte, Preislimit, Doppelbuchungen,
Wiederherstellung und Dekorfreischaltung geprüft.
Browser mit isolierter Datenbank: Migration aus 2.8, alle acht Kapitel-Schritte,
Herstellung, Offline-Warteschlangen, Aufträge, Bestände, Splitterbonus,
Baubeschleunigung und mobile Lagerhausbreite geprüft.
Die Verbindung mit deinem echten Supabase-Projekt folgt nach Installation.
