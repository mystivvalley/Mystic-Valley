Mystic Valley Alpha 2.1.0 – Konto & automatische Cloud

UPDATE VON 2.0.1 – Reihenfolge beachten:
1. Auf dem Gerät mit dem richtigen Fortschritt: Einstellungen > Spielstand exportieren.
2. Dort mit Version 2.0.1 noch einmal den richtigen Stand in die Cloud sichern.
3. Supabase > SQL Editor > New query: gesamten Inhalt von supabase_update_2_1.sql einfügen und Run drücken. Einmalig; vorhandene Daten bleiben erhalten. Alte Versionen können danach nicht mehr direkt in die Cloud schreiben.
4. index.html, cloud.js und assets in den bisherigen GitHub-Ordner kopieren. Commit und Push.
5. Nach Veröffentlichung auf allen Geräten Strg+F5. Oben muss Alpha 2.1.0 stehen.
6. Anmelden. Bestehender Cloud-Stand wird automatisch geladen. Keine URL-/Key-Eingabe mehr.
7. Auf Gerät A eine Reparatur starten, mindestens 30 Sekunden warten oder Jetzt sichern anklicken. Erfolgsmeldung abwarten. A schließen, dann auf B anmelden/Erneut prüfen und vergleichen.
8. Bei gleichzeitig geöffneten Geräten kann eine Versionskollision auftreten: Spiel pausiert, lokalen Stand bei Bedarf exportieren, dann Cloud-Stand übernehmen. Fortschritte werden nicht automatisch zusammengeführt.

NEUINSTALLATION: statt der Update-Datei einmal supabase_setup.sql ausführen. Projekt-URL und öffentlicher Publishable Key sind bereits fest eingebaut.

Verhalten:
- Alle 30 Sekunden und beim Wechsel in den Hintergrund wird ein Speicherversuch ausgeführt. Beim Schließen ist eine vollständige Netzwerkübertragung nicht garantiert; Erfolgsmeldung vor Gerätewechsel abwarten.
- Bei Netzfehlern bleibt der lokale Stand erhalten; die Cloud wird erneut versucht. Beim nächsten Login wird ein lokaler Stand desselben Kontos bei unveränderter Cloud-Version weiterverwendet. Hat die Cloud sich geändert, wird lokal gesichert und der Cloud-Stand übernommen.
- Fünf letzte interne Sicherungen pro Browser; Letzte Sicherung exportieren lädt die jüngste als JSON herunter. Kein automatischer Dateidownload beim Login.
- Gastmodus bleibt lokal. Erster Login ohne Cloud-Stand fragt nach Übernahme des lokalen Fortschritts. Bei Kontowechsel ohne Cloud-Stand wird ein neues Dorf angelegt.
- Cloud-Anfangsprüfung/Konflikt pausiert die Bedienung. Der Versionsschutz wird atomar in Supabase geprüft; keine geräteabhängigen Uhrzeiten für die Konfliktentscheidung.
- SQL-Änderung wurde nicht in deinem Projekt ausgeführt. Anmeldung und echter Gerätewechsel müssen nach Installation getestet werden.
- Spielökonomie bleibt lokal berechnet, noch kein manipulationssicheres Multiplayer-Spiel. Chat/PN noch nicht enthalten.

Validierung: Isolierte Integrationstests mit simuliertem Supabase-Client für automatischen Start, zwei Geräte/Versionskonflikt, Sicherung und Wiederaufnahme, Netzfehler/erneuten Versuch und Kontowechsel bestanden. HTML-Verknüpfung und JavaScript-Syntax geprüft. Kein vollständiger Browser- oder Live-Datenbanktest in dieser Umgebung.
