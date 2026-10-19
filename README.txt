MYSTIC VALLEY – ALPHA 2.8.0
Freundesliste und Spielerprofile

UPDATE VON ALPHA 2.7 (MIT ODER OHNE SENDEFIX)
1. Im bisherigen Spiel: Zahnrad > Konto & Cloud > Jetzt sichern.
   Erfolg abwarten. Zusätzlich unter Spielstand & Spieloptionen exportieren.
2. Diese ZIP entpacken.
3. Supabase > SQL Editor > New query:
   Gesamten Inhalt von supabase_update_2_8.sql einfügen > Run.
   Nur dieses neue SQL ausführen. Vorherige Migrationen nicht erneut einspielen.
   Die Abfrage muss erfolgreich abschließen, bevor die Website ersetzt wird.
4. index.html, alle .js- und .css-Dateien und assets aus diesem Paket
   in den bisherigen Website-Ordner kopieren und ersetzen.
   social.js und social.css sind neu und müssen mit hochgeladen werden.
   Die bestehenden Dateien CNAME und .nojekyll beibehalten, falls vorhanden.
5. GitHub Desktop: Commit to main > Push origin.
   Bei einem anderen Hoster dieselben Website-Dateien hochladen.
   SQL-Dateien und Anleitungen werden nur zur Einrichtung benötigt.
6. Nach Bereitstellung Strg+F5. Angezeigte Version: Alpha 2.8.0.

Google-Anmeldung, Supabase-Verbindung und Login-Serverfunktion bleiben
unverändert eingerichtet. Die SQL-Erweiterung verändert keine Spielstände,
Gildenprojekte, Bauzeiten oder bisherigen Nachrichten.
Der Sendefix aus 2.7.1 für Privatnachrichten und Gildeneinzahlungen ist enthalten.

BEDIENUNG
Links: Freunde & Profil.
- Mein Profil: Symbol wählen und Beschreibung (bis 240 Zeichen) speichern.
- Spieler ab 3 Zeichen des Benutzernamens suchen und Profil öffnen.
- Freundschaft anfragen; die andere Person nimmt an oder lehnt ab.
- Eigene gesendete Anfragen können zurückgezogen werden.
- Bestehende Freundschaften können von beiden Seiten beendet werden.
- Vom Profil oder der Freundesliste eine private Nachricht starten.
- Namen im globalen Chat, Gildenchat und der Gildenmitgliederliste anklicken.
- In einer privaten Unterhaltung öffnet der Name oben das Spielerprofil.
- Die Freundesliste aktualisiert sich bei geöffnetem Fenster alle 10 Sekunden.
  Mit Aktualisieren kannst du sofort nach neuen Anfragen schauen.

PROFILE UND GRENZEN
Nur angemeldete Spieler mit gewähltem Benutzernamen können Profile abrufen.
Sichtbar: Benutzername, Spielername, gewähltes Symbol, eigene Beschreibung,
aktuelle Gilde und gegebenenfalls Admin-/Moderatorrolle.
Keine E-Mail-Adressen und keine privaten Spielstanddaten in Profilantworten.
Keine Anzeige von Online-Status oder letztem Login.
Maximal 100 Freunde und offene Anfragen zusammen pro Spieler.
Maximal 20 neue Freundschaftsanfragen pro Stunde.
Blockieren im Privatbereich entfernt eine Freundschaft/offene Anfrage und
sperrt neue Freundschaftsanfragen sowie private Nachrichten in beide Richtungen.
Nach Freigabe wird die frühere Freundschaft nicht automatisch wiederhergestellt.
Der bisherige Nachrichtenverlauf bleibt entsprechend Alpha 2.7 erhalten.

LIVE-TEST MIT ZWEI KONTEN
1. A: Mein Profil > Symbol und Beschreibung ändern > speichern.
2. B: A suchen > Profil prüfen. Keine E-Mail oder Ressourcen sichtbar.
3. A: B suchen > Freundschaft anfragen.
4. B: Freunde & Profil > eingehende Anfrage > Annehmen.
5. Beide: Aktualisieren > jeweils den anderen unter Deine Freunde sehen.
6. Vom Profil eine Nachricht öffnen, senden und im zweiten Konto antworten.
7. Freundschaft beenden; erneut anfragen, ablehnen und zurückziehen testen.
8. A blockiert B im Privatbereich: Freundschaft muss auf beiden Seiten
   verschwinden; keine neue Anfrage möglich. Danach Blockierung aufheben.
9. Seite neu laden: gespeichertes Symbol/Beschreibung und akzeptierte
   Freundschaften bleiben erhalten.
10. Chat- und Gildenmitgliedsnamen anklicken: richtiges Profil muss öffnen.

LOKALE VALIDIERUNG
Neue SQL-Migration und Rechte in isolierter PostgreSQL-Umgebung bestanden.
Zwei Browserfenster mit Datenbank-Anbindung: Anfrage/Annahme, Profilbearbeitung,
Textdarstellung ohne HTML-Ausführung, direkter PN-Versand, Chat-/Gildenlinks,
Abmelden und Handybreite geprüft. Keine JavaScript-Fehler in diesem Test.
Der Live-Test mit deinem Supabase-Projekt erfolgt nach Installation.
