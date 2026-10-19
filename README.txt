MYSTIC VALLEY – ALPHA 2.7.0 – PRIVATE NACHRICHTEN
Grundlage: Alpha 2.6.0 mit gemeinsamen Gildenprojekten und Menü aus 2.5.

UPDATE VON DEINER INSTALLIERTEN ALPHA 2.6 – SCHRITT FÜR SCHRITT
1. SPIELSTAND SICHERN
   Im bisherigen Spiel: Zahnrad oben rechts > Konto & Cloud > Jetzt sichern.
   Erfolgsmeldung abwarten. Optional unter Spielstand & Spieloptionen einen Spielstand exportieren.
   Danach das Spiel auf allen Geräten schließen, bis das Update fertig veröffentlicht ist.

2. ZIP ENTPACKEN
   Öffne den entpackten Ordner Mystic_Valley_Alpha_2.7_Privatnachrichten.

3. SUPABASE AKTUALISIEREN
   Öffne dein bestehendes Projekt auf https://supabase.com/dashboard.
   SQL Editor > New query / neue Abfrage.
   Öffne supabase_update_2_7.sql mit einem Texteditor und kopiere den GESAMTEN Inhalt in die Abfrage.
   Klicke Run und warte auf die Erfolgsmeldung. „Success. No rows returned“ ist normal.
   Für dieses Update nur supabase_update_2_7.sql ausführen, nicht supabase_setup.sql.
   Bei einer Fehlermeldung zuerst deren Wortlaut prüfen, bevor du die Spieldateien veröffentlichst.
   Die Migration ist wiederholbar. Sie setzt weder Konten, Spielstände, Gildenprojekte noch deren Bauzeiten zurück.
   Noch auf 2.4/2.5? Dann zuerst supabase_update_2_6.sql, anschließend supabase_update_2_7.sql ausführen.
   supabase_setup.sql bleibt ausschließlich für eine vollständige Neueinrichtung vorgesehen.

4. SPIELDATEIEN KOPIEREN
   Diese Dateien/Ordner direkt in deinen bisherigen Website-Ordner kopieren und vorhandene Dateien ersetzen:
   index.html
   cloud.js
   payments.js
   chat.js
   chat.css
   dm.js      <- NEU, unbedingt mitkopieren!
   dm.css     <- NEU, unbedingt mitkopieren!
   guilds.js
   guilds.css
   auth.css
   navigation.js
   navigation.css
   assets/
   Die neue index.html muss an derselben Stelle liegen wie bisher.
   Nicht den gesamten Versionsordner als zusätzlichen Unterordner der Website hochladen.
   SQL-Dateien müssen nicht auf die Website: sie werden im Supabase SQL Editor ausgeführt.

5. VERÖFFENTLICHEN
   GitHub Desktop: bisheriges Repository auswählen, Änderungstitel eintragen, Commit to main > Push origin.
   Warte auf die erfolgreiche GitHub-Pages-Veröffentlichung.
   Behalte die bisherige Spieladresse bei. Google und die Edge Function müssen nicht neu eingerichtet werden.

6. NEU LADEN
   Öffne die bisherige Spieladresse und drücke Strg+F5. Oben muss Alpha 2.7.0 stehen.
   Auf anderen Geräten ebenfalls vollständig neu laden. Bestehende Browser-Spielstände nicht löschen.

PRIVATE NACHRICHTEN ÖFFNEN
- Oben auf das Chat-Symbol klicken und „Privat“ wählen.
- Unter „Spieler suchen“ mindestens die ersten drei Zeichen des Benutzernamens eingeben und Suchen klicken.
- Groß-/Kleinschreibung spielt bei der Suche keine Rolle. Es werden bis zu 20 Treffer angezeigt.
- Einen Treffer anklicken und eine Nachricht schreiben. Alternativ ein bestehendes Gespräch auswählen.
- „Privat senden“ oder Enter sendet; Shift+Enter erzeugt eine neue Zeile. Maximal 500 Zeichen.
- Die Gesprächsliste zeigt die letzten 50 Gespräche, ein Gespräch die letzten 50 Nachrichten.
  Ein älteres Gespräch ist über die Benutzernamensuche weiter erreichbar. Zurückblättern in ältere Nachrichten ist noch nicht enthalten.
- Nur angemeldete Spieler mit festgelegtem Benutzernamen können private Nachrichten verwenden.
  E-Mail-Adressen werden bei Suche und Gesprächen nicht ausgegeben.

UNGEELESENE NACHRICHTEN
- Am Chat-Symbol, im Reiter Privat und bei den Gesprächen erscheint die Zahl ungelesener Nachrichten.
- Aktualisierung bei sichtbarer Spielseite ungefähr alle fünf Sekunden.
- Eine Unterhaltung wird als gelesen markiert, wenn sie im geöffneten privaten Bereich angezeigt wird,
  das Browserfenster aktiv ist und die Nachrichtenansicht am unteren Ende steht.
- Globalen Chat öffnen allein markiert private Nachrichten nicht als gelesen.
- Es gibt in dieser Version keine „Gelesen“-Bestätigung für den Absender und keine externen Push-Mitteilungen.

BLOCKIEREN
- Im geöffneten Gespräch „Blockieren“ anklicken und bestätigen.
- Neue private Nachrichten zwischen euch sind dann in BEIDE Richtungen gesperrt.
- Der bisherige Verlauf bleibt lesbar. Blockieren löscht keine Nachrichten.
- „Blockierung aufheben“ im Gespräch oder unter „Blockierte Spieler“ macht deine Blockierung rückgängig.
  Hat die andere Person dich ebenfalls blockiert, bleibt das Senden weiterhin gesperrt.
- Blockierte Kontakte erscheinen nicht in der gegenseitigen Suche. Bestehende Gespräche bleiben sichtbar.
- Blockierungen gelten für private Nachrichten. Globaler und Gildenchat behalten ihre eigenen Regeln.
- Maximal 200 eigene Blockierungen pro Konto.

MELDEN UND MODERATION
- Bei einer empfangenen Nachricht „Melden“ anklicken und einen Grund mit 3–300 Zeichen eingeben.
- Nur der tatsächliche Empfänger kann diese Nachricht melden. Eigene oder fremde Gespräche lassen sich nicht melden.
- Gemeldet wird eine EINZELNACHRICHT: Die vorhandene Moderation erhält deren Inhalt, Absender,
  meldende Person und Grund. Kein Zugriff auf den restlichen privaten Gesprächsverlauf.
- Admins/Moderatoren sehen im Bereich Privat den Button „Private Meldungen“.
- Dort können sie die gemeldete Nachricht entfernen, die Meldung erledigen oder den Absender stummschalten.
- Globale Stummschaltungen gelten ebenfalls für private Nachrichten und den Gildenchat.
- Admin-/Mod-Konten können wie im bisherigen Chat nicht über diese Buttons stummgeschaltet werden.
- Nach Entfernen erscheint im Gespräch „Nachricht entfernt.“. Der gemeldete Inhalt bleibt serverseitig
  für die Bearbeitung vorhanden; er wird den Gesprächspartnern nicht mehr ausgeliefert.
- Maximal fünf neue private Meldungen pro Minute; eine Nachricht wird je Empfänger nur einmal gemeldet.

SENDEABSTAND UND VERBINDUNGSFEHLER
- Drei Sekunden Sendeabstand gelten gemeinsam für Global-, Gilden- und Privatnachrichten.
- Derselbe Text kann innerhalb von 60 Sekunden nicht erneut gesendet werden.
- Jede private Nachricht hat eine eindeutige Kennung. Eine wiederholte Anfrage mit derselben Kennung
  speichert dieselbe Nachricht nicht doppelt.
- Bei Antwortverlust bleibt der Text zunächst erhalten. Aktualisieren zeigt, ob er bereits gespeichert wurde.
  Ein bestätigter Beitrag wird im Verlauf angezeigt und der zugehörige offene Entwurf entfernt.
- Eine unbestätigte Nachricht wird nach Neuladen nicht automatisch gesendet. Öffne dasselbe Gespräch,
  prüfe den Verlauf und sende den wiederhergestellten offenen Text bei Bedarf selbst erneut.
- Neue, noch nicht gesendete Entwürfe bleiben beim Gesprächswechsel während der Sitzung erhalten.
- Abmelden oder ein Cloud-Konflikt schließt den Nachrichtenbereich und entfernt die privaten Inhalte aus der Anzeige.
- Nicht während einer offenen Gildeneinzahlung Browserdaten löschen. Die Zahlungsprüfung aus 2.6 bleibt unverändert.

TEST MIT DEINEN BEIDEN KONTEN
1. Konto A: Chat-Symbol > Privat > Benutzername von B suchen > Gespräch öffnen > Testnachricht senden.
2. Konto B in einem anderen Browser/Gerät: Die Zahl am Chat-Symbol muss erscheinen.
3. B öffnet nur Global: Die private Nachricht bleibt ungelesen.
4. B wechselt auf Privat und öffnet A: Nachricht sichtbar, Ungelesen-Zahl verschwindet.
5. B antwortet. A sieht die Antwort beim Aktualisieren oder nach ungefähr fünf Sekunden.
6. Beide laden das Spiel neu: Gespräch und Verlauf bleiben vorhanden.
7. A blockiert B: Beide können sich privat nicht mehr schreiben. Der Verlauf bleibt sichtbar.
8. A hebt die Blockierung auf: Schreiben funktioniert wieder, sofern B nicht ebenfalls blockiert.
9. Optional mit einem Moderationskonto: B meldet eine Nachricht von A. In „Private Meldungen“ erscheint
   nur diese Einzelnachricht. Andere Nachrichten aus dem Gespräch dürfen dort nicht erscheinen.
10. Abmelden und anderes Konto anmelden: vorheriger privater Verlauf darf nicht in dessen Anzeige auftauchen.

BESTEHENDE GILDENPROJEKTE WEITER TESTEN
Deine laufende Mondbrücke wird durch dieses Update nicht neu gestartet.
Nach Ablauf der ursprünglichen Bauzeit: Gildenhaus > Projekte > Aktualisieren.
Erwartet: Mondbrücke Abgeschlossen, 2.200 Gilden-XP, +10 % Holz-/Steinproduktion für verbundene Mitglieder,
Garten der Gemeinschaft für Einzahlungen freigeschaltet.
Persönliche Ressourcen, lokale Projekte, Cloud-Sicherung, Gildenmitglieder und beide bisherigen Chats bleiben erhalten.

LOKALE PRÜFUNG
Getestet mit PostgreSQL/PGlite und simulierten DOM-Clients für zwei Spieler plus Moderation:
Neueinrichtung, Update von 2.6 und wiederholbare Migration bei weiterlaufendem Gildenprojekt;
Gesprächsrechte auch gegenüber fremden Admins, Suche ohne E-Mail, ungelesen/gelesen,
Blockieren beidseitig, Melde-/Moderationsrechte, Sendeabstand, Stummschaltung, doppelte Kennungen,
Antwortverlust, Kontowechsel und verspätete Antworten ohne Offenlegung privater Inhalte.
Bestehende Anmeldung/Google-Konfiguration, Cloud-Sicherung, Global-/Gildenchat und Gildenprojekte lokal geprüft.
Kein Live-Test in deinem Supabase-Projekt und keine visuelle Prüfung im echten Browser in dieser Umgebung.
