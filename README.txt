MYSTIC VALLEY – ALPHA 2.6.0 – GEMEINSAME GILDENPROJEKTE
Grundlage: deine Alpha 2.5.0 mit dem neuen Menü.

UPDATE VON ALPHA 2.5 (ODER 2.4) – SCHRITT FÜR SCHRITT

1. BISHERIGEN SPIELSTAND SICHERN
   Öffne dein bisheriges Spiel. Zahnrad oben rechts > Konto & Cloud > Jetzt sichern.
   Warte auf „Automatisch gesichert“.
   Für eine zusätzliche Datei: Zahnrad > Spielstand & Spieloptionen > Spielstand exportieren.
   Beende danach das Spiel auch auf anderen Geräten, bis das Update fertig ist.

2. ZIP ENTPACKEN
   Öffne den entpackten Ordner Mystic_Valley_Alpha_2.6_Gildenprojekte.
   Darin findest du index.html, die JavaScript-/CSS-Dateien, assets und die SQL-Datei.

3. SUPABASE AKTUALISIEREN
   Öffne https://supabase.com/dashboard und dein bestehendes Mystic-Valley-Projekt.
   Links SQL Editor > New query / neue Abfrage.
   Öffne auf deinem Computer supabase_update_2_6.sql mit einem Texteditor.
   Kopiere den GESAMTEN Inhalt in die neue SQL-Abfrage und klicke Run.
   Warte auf die Erfolgsmeldung („Success. No rows returned“ ist normal).
   Die SQL-Datei ist erneut ausführbar und löscht keine bestehenden Konten, Spielstände oder Gilden.
   Für dieses Update NUR supabase_update_2_6.sql ausführen.
   supabase_setup.sql ist für eine vollständige Neueinrichtung; hier nicht erforderlich.
   Bei einer SQL-Fehlermeldung zunächst nicht weitermachen, sondern deren Wortlaut prüfen.

4. SPIELDATEIEN ERSETZEN
   Kopiere diese Dateien und den Ordner assets in deinen bisherigen Website-/GitHub-Ordner:
   index.html
   cloud.js
   payments.js  <- NEUE DATEI, unbedingt mitkopieren!
   guilds.js
   guilds.css
   chat.js
   chat.css
   auth.css
   navigation.js
   navigation.css
   assets/
   Vorhandene Dateien ersetzen. Die Dateien müssen direkt neben der bisherigen index.html liegen.
   Nicht den gesamten entpackten Versionsordner zusätzlich unter die Website verschachteln.
   Die SQL-Datei wird in Supabase ausgeführt; sie muss nicht als Spieldatei veröffentlicht werden.

5. VERÖFFENTLICHEN
   Bei GitHub Desktop: dein bisheriges Repository auswählen, Änderungstitel eingeben,
   Commit to main und anschließend Push origin anklicken.
   Bei Veröffentlichung über die GitHub-Webseite: die genannten Dateien am bisherigen Ort
   hochladen/ersetzen und Commit changes wählen; assets ebenfalls aktualisieren.
   Warte, bis die GitHub-Pages-Veröffentlichung erfolgreich abgeschlossen ist.
   Behalte deine bisherige Spieladresse bei.

6. NEU LADEN
   Öffne die bisherige Spieladresse und drücke Strg+F5.
   Oben muss Alpha 2.6.0 stehen. Auf anderen Geräten ebenfalls neu laden.
   Falls noch eine alte Version erscheint, die Seitendaten/den Spielstand nicht löschen:
   zuerst Veröffentlichung prüfen und erneut vollständig laden.
   Google, Benutzername-Login, Projekt-URL und Publishable Key bleiben eingerichtet.
   Die Edge Function muss für dieses Update nicht erneut veröffentlicht werden.

7. PROJEKTE ÖFFNEN
   Melde dich an. Links „Gildenhaus“ > Reiter „Projekte“.
   Auf dem Handy zuerst das ☰-Menü öffnen.
   Ohne Gilde zuerst eine gründen oder einer bestehenden Gilde beitreten.

SO FUNKTIONIEREN DIE PROJEKTE
- Alle Mitglieder sammeln für denselben Fortschritt.
- Bei jeder Ressource deine gewünschte GANZE Menge eingeben, dann Einzahlen.
- Max. füllt das Feld mit dem kleineren Wert aus verfügbarem Bestand und offenem Bedarf.
  Erst Einzahlen bestätigt die Buchung. Es gibt keine automatische Einzahlung.
- Der Betrag wird vom eigenen Cloud-Spielstand abgezogen und dem Projekt gutgeschrieben.
- Überhöhte Beträge werden abgelehnt, statt sie stillschweigend zu ändern.
- „Letzte Einzahlungen“ zeigt die letzten zehn Beiträge der eigenen Gilde.
- Sobald alles bezahlt ist, kann die aktuelle Gildenleitung „Bau starten“ anklicken.
- Der Bau läuft nach Serverzeit weiter, auch wenn alle das Spiel schließen.
- Die nächste Projektstufe wird erst nach Abschluss der vorherigen freigeschaltet.

PROJEKTE UND BONI
1. Die Mondbrücke: 2 Stunden Bauzeit, 2.200 Gilden-XP.
   Kosten: 600 Bauholz, 850 Stein, 400 Kristalle, 12.000 Gold.
   Bonus: +10 % Holz- und Steinproduktion.
2. Garten der Gemeinschaft: 4 Stunden Bauzeit, 3.800 Gilden-XP.
   Kosten: 3.500 Holz, 1.000 Kräuter, 850 Mana, 1.200 Nahrung, 18.000 Gold.
   Bonus: +15 % Nahrungs- und Kräuterproduktion.
3. Leuchtendes Gildenportal: 8 Stunden Bauzeit, 6.500 Gilden-XP.
   Kosten: 1.600 Bauholz, 2.400 Stein, 1.900 Kristalle, 90 Zaubertränke, 1.300 Mana, 45.000 Gold.
   Bonus: +10 % auf die passive Produktion von Gold, Holz, Kristallen, Mana, Stein, Nahrung und Kräutern.
   Keine Beschleunigung von Herstellungsaufträgen.
Gildenstufe = 1 + abgerundeter Wert von (Gilden-XP / 2.400). Diese Projekte geben Gilden-XP, keine persönlichen XP.
Abgeschlossene Projektboni addieren sich; mit allen drei Projekten zum Beispiel +20 % Holz und +25 % Nahrung.

ONLINE-BONI UND BESTEHENDER FORTSCHRITT
Die neuen Boni wirken auf passive Gebäudeproduktion für verbundene aktuelle Gildenmitglieder.
Sie werden regelmäßig geprüft, auch bei geschlossenem Gildenfenster. Bei verlorener Verbindung
läuft eine kurze Bestätigung spätestens nach 45 Sekunden aus. Nach einem erkannten Fehler
werden Online-Boni ausgesetzt. Die normale Produktion läuft weiter.
Offline-Zeit erhält die bisherige Grundproduktion bis acht Stunden, ohne rückwirkenden Online-Gildenbonus.
Nach Austritt/Ausschluss entfällt der Bonus bei der nächsten Mitgliedschaftsprüfung.
Bereits gesammelte Ressourcen werden dabei nicht zurückgenommen.
Die bisherigen lokalen Projekte, Einzahlungen und Boni bleiben separat im Dorf erhalten.
Sie sind weiterhin unter „Lokale Projektvorschau“ erreichbar und werden nicht zu Online-Beiträgen umgebucht.
Das Menü aus 2.5, Anmeldung, Google, Cloud-Speicherung und beide Chats bleiben enthalten.
Wer die Gilde verlässt, erhält frühere Einzahlungen nicht zurück. Sie bleiben beim gemeinsamen Projekt.
Beim Auflösen der letzten Mitgliedschaft werden die gemeinsamen Projekte samt Gildenchat gelöscht.

VERBINDUNGSABBRUCH BEIM EINZAHLEN
Während der Buchung sind Spielaktionen kurz gesperrt. Jede Einzahlung hat eine eindeutige Kennung.
Serverseitig werden Abbuchung, Projektfortschritt und Beleg gemeinsam gebucht.
Geht die Antwort verloren, fragt das Spiel denselben Beleg ab, statt erneut einzuzahlen.
Bleibt die Verbindung gestört, wird der Cloud-Bereich geöffnet und weiteres Speichern blockiert.
Verbindung wiederherstellen > Konto & Cloud > Erneut prüfen. Eine offene Buchung wird zuerst geklärt.
Auch nach Neuladen bleibt diese Prüfung dem betreffenden Konto zugeordnet.
Bei „anderes Gerät hat gespeichert“ den neueren Cloud-Stand übernehmen; der lokale Stand wird gesichert.
Nicht während einer offenen Buchung die Browserdaten löschen.

KURZER TEST MIT DEINEN ZWEI KONTEN
1. Beide Konten in derselben Gilde anmelden und Gildenhaus > Projekte öffnen.
2. Konto A zahlt eine kleine Menge einer verfügbaren Ressource in die Mondbrücke ein.
3. Der Bestand bei A muss um diesen Betrag sinken, der Projektstand entsprechend steigen.
4. Bei B Aktualisieren anklicken: derselbe Projektstand und der Beitrag von A müssen erscheinen.
   Der persönliche Bestand von B darf durch die Einzahlung von A nicht sinken.
5. B zahlt selbst eine frei gewählte Menge ein. A aktualisiert und sieht die Summe beider Beiträge.
6. Spiel nach erfolgreicher Cloud-Sicherung neu öffnen: eigener Bestand und gemeinsamer Beitrag bleiben erhalten.
7. Bei vollständig bezahltem Projekt startet die Leitung den Bau. Beide sehen dieselbe Restzeit.
   Erst nach der echten Bauzeit zeigt das Projekt Abgeschlossen und die Boni an.
8. Optional ein Testmitglied entfernen: dessen Projektbereich und Online-Bonus müssen bei Aktualisierung verschwinden.
   Getätigte Einzahlungen bleiben bei der Gilde. Den bestehenden Chat-Zugriff ebenfalls kurz prüfen.

TECHNISCHE PRÜFUNG DIESER VERSION
Lokal mit PostgreSQL (PGlite) und zwei simulierten DOM-Clients geprüft:
Neueinrichtung/Upgrade/Wiederholung der Migration, Rollen- und Mitgliedschaftsrechte,
Versionskonflikte, atomare Abbuchung, doppelte Buchungskennungen, Antwortverlust/Wiederherstellung,
Projektfolge, Leitung/Baustart, Serverabschluss, XP/Boni, Ausschluss/Auflösung und Erhalt lokaler Projekte.
Zusätzlich Anmeldung/Google-Konfiguration, Cloud-Konflikte und globaler/Gildenchat lokal geprüft.
Kein Live-Test in deinem Supabase-Projekt und kein visueller Test im echten Browser in dieser Umgebung.
Die Spielwirtschaft bleibt wie bisher clientseitig berechnet (einschließlich vorhandener Testwerkzeuge).
Diese Erweiterung schützt reguläre Buchungen vor doppelter Verarbeitung, ist aber kein vollständiger Anti-Cheat-Schutz.
