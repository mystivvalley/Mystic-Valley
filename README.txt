Mystic Valley Alpha 2.4.0 – Online-Gilden & Gildenchat

UPDATE VON DEINER ALPHA 2.3
1. Im Spiel Jetzt sichern anklicken und die Erfolgsmeldung abwarten. Optional unter Einstellungen einen Spielstand exportieren.
2. ZIP entpacken.
3. Supabase > SQL Editor > New query: gesamten Inhalt von supabase_update_2_4.sql einfügen und Run drücken. Die Datei aktualisiert anschließend den Schema-Cache automatisch. Vorhandene Konten, Cloud-Stände und globale Chatdaten bleiben erhalten.
4. Folgende Dateien/Ordner in deinem bisherigen GitHub-Projektordner ersetzen/kopieren:
   index.html
   cloud.js
   auth.css
   chat.js
   chat.css
   guilds.js
   guilds.css
   assets
5. GitHub Desktop > Commit to main > Push origin.
6. Nach Veröffentlichung Strg+F5 auf den Geräten. Oben muss Alpha 2.4.0 stehen.
7. Über Online-Gilde in der unteren Online-Leiste oder Gildenhaus in der Seitenleiste öffnen.
Google, Benutzername-Login und Edge Function müssen nicht neu eingerichtet werden. Für das Update nur supabase_update_2_4.sql verwenden, nicht alle bisherigen SQL-Dateien erneut ausführen.

WAS IST NEU?
- Eine echte Online-Gilde pro Spielkonto, bis zu 20 Mitglieder.
- Gilde gründen, Gildenverzeichnis durchsuchen, Beitritt anfragen.
- Maximal drei offene Anfragen pro Spieler; Leitung nimmt an oder lehnt ab.
- Mitgliederliste, Mitglieder entfernen, Leitung an aktuelles Mitglied übergeben.
- Gilde verlassen. Leitung muss bei mehreren Mitgliedern zuerst übergeben. Verlässt das letzte Mitglied die Gilde, wird nach Bestätigung die Gilde einschließlich ihres internen Chats aufgelöst.
- Interner Gildenchat: nur aktuelle Mitglieder, letzte 50 Nachrichten, Aktualisierung alle 5 Sekunden bei offenem sichtbarem Gildenfenster.
- Gildenleitung kann Nachrichten entfernen und andere Mitglieder im Gildenchat 10 Minuten/1 Stunde stummschalten oder freigeben. Mitglieder können eigene Nachrichten entfernen.
- Globale Chat-Stummschaltungen gelten auch im Gildenchat. Sendeabstand von 3 Sekunden und Wiederholungsschutz von 60 Sekunden gelten kanalübergreifend.
- Name der Gilde eindeutig ohne Beachtung der Groß-/Kleinschreibung, 3–24 Zeichen. Gründung maximal einmal pro Minute; Beitrittsanfragen mit 30 Sekunden Abstand; maximal 50 offene Anfragen je Gilde.
- Konto-/Cloud-Konflikt oder Abmeldung schließt die Gildenansicht und entfernt die sichtbaren internen Nachrichten.

LOKALE PROJEKTE BLEIBEN ERHALTEN
Die bisherigen Projekte, Einzahlungen und Boni bleiben im bestehenden Spielstand. Über Lokale Projektvorschau sind sie weiter erreichbar. Online-Mitgliedschaft und Gildenchat sind jetzt echt geteilt; Ressourcen und Projektfortschritt sind noch NICHT zwischen Mitgliedern verbunden. Die Online-Gründung kostet in dieser Version keine lokalen Rohstoffe und verlangt kein aktives Gildenhaus. Die bestehende lokale Projektvorschau behält ihre bisherigen Freischaltungen. Gemeinsame Ressourcen/Projekte folgen als nächster Ausbau.

SCHRITTWEISER TEST MIT ZWEI VERSCHIEDENEN KONTEN
1. Konto A öffnet Online-Gilde und gründet eine Gilde.
2. Konto B sucht diese Gilde und klickt Beitritt anfragen.
3. Konto A klickt Aktualisieren und unter Beitrittsanfragen Aufnehmen.
4. Konto B aktualisiert und öffnet Gildenchat. Nachricht senden; Konto A öffnet ebenfalls Gildenchat. Spätestens nach rund 5 Sekunden sollte sie erscheinen.
5. Leitung entfernt eine Testnachricht und schaltet Konto B stumm. B darf nicht senden. Stumm aufheben muss das Senden wieder erlauben; der normale 3-Sekunden-Abstand bleibt bestehen.
6. A übergibt die Leitung an B. B erhält die Verwaltungsbuttons, A ist normales Mitglied.
7. B entfernt A. A aktualisiert: interner Chat verschwindet; Server weist weitere Sendeversuche ab.
8. Optional mit drittem Konto eine zweite Gilde erstellen. Deren interne Nachrichten dürfen nicht in der ersten Gilde sichtbar sein. Auch globale Chat-Admins erhalten keinen Sonderzugriff auf fremde Gildenchats.
9. Erst danach optional die verbleibende Testgilde auflösen. Deren interner Chat wird gelöscht; das Dorf und lokale Projekte bleiben bestehen.

VALIDIERUNG
PostgreSQL/PGlite: Neuinstallation und wiederholte Migration, Anmeldung/Berechtigungen, private Gildengrenzen, eindeutige Namen, Anfragen/Aufnahme, eine Gilde pro Nutzer, Mitgliederlimit inklusive Prüfung bei Annahme, Anfragelimits, Chat/Spamgrenzen, Stumm-/Freischalten, ausgeblendete Inhalte, Leitung/Verlassen/Entfernen, entzogener Zugriff, Auflösung und automatische Leitungsübergabe beim Löschen eines Auth-Kontos bestanden.
Zwei simulierte Browser-DOMs mit den tatsächlichen PostgreSQL-RPCs: Gründung bis Aufnahme, Chat, HTML als Text, Sendeabstand, Stumm-/Freischalten, Entfernen mit geleerter Ansicht, lokale Projektvorschau und Auth-Aufräumen bestanden.
Bestehende isolierte Cloud-, Konten- und globale Chat-Tests bestanden. Ein vollständiger echter Browser-/Supabase-/Mehrkontentest steht nach Installation noch aus. SQL wurde nicht von hier aus in deinem Projekt ausgeführt.

WEITERE DATEIEN
supabase_setup.sql ist nur für eine komplette Neuinstallation vorgesehen und enthält alle bisherigen Migrationen. Alte Update-/Google-Dateien bleiben als Referenz enthalten. Für deine bestehende Alpha 2.3 genügen die Schritte oben.
Privatnachrichten und gemeinsame Online-Ressourcen/-Projekte sind noch nicht enthalten.
