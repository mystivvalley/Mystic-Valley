Mystic Valley Alpha 2.2.0 – Globaler Chat

UPDATE VON 2.1 – Schritt für Schritt:
1. Auf dem Gerät mit dem richtigen Fortschritt Jetzt sichern anklicken und Erfolgsmeldung abwarten. Optional unter Einstellungen den Spielstand exportieren.
2. Supabase > SQL Editor > New query: Inhalt von supabase_update_2_2.sql einfügen und Run anklicken. Bestehende Spielstände und automatische Cloud-Sicherung bleiben erhalten.
3. index.html, cloud.js, chat.js, chat.css und den Ordner assets in den bisherigen GitHub-Projektordner kopieren/ersetzen. GitHub Desktop: Commit to main > Push origin.
4. Nach Veröffentlichung Strg+F5 auf allen Geräten. Oben muss Alpha 2.2.0 stehen.
5. Anmelden, unter Konto & Cloud einen öffentlichen Spielernamen speichern. Über Globaler Chat den Dorfchat öffnen. Nur angemeldete Konten können lesen/schreiben.
6. OPTIONAL Admin einrichten: admin_einrichten.sql im Editor öffnen, DEINE-LOGIN-EMAIL durch die E-Mail deines Spielkontos ersetzen. Den angepassten Inhalt in einer neuen Supabase-SQL-Abfrage ausführen. Der Chat zeigt nach Aktualisieren die Moderation. Keine E-Mail/Schlüssel werden im Chat angezeigt. Niemand wird automatisch Admin.
7. Mit einem zweiten echten Testkonto eine Nachricht senden. Mit deinem Admin-Konto entfernen/stummschalten und die Sperre im zweiten Konto prüfen. Für gleichzeitiges Testen verschiedene Spielkonten verwenden, damit der Cloud-Versionsschutz nicht dazwischenkommt.

NEUINSTALLATION:
Einmal supabase_setup.sql ausführen; es enthält Cloud 2.1 und Chat 2.2. Nicht zusätzlich die Update-Dateien ausführen. URL und öffentlicher Publishable Key sind fest hinterlegt. SQL-Dateien müssen nicht über GitHub bereitgestellt werden.

CHAT:
- Globaler Chat mit letzten 50 Nachrichten in zeitlicher Reihenfolge. Alle 5 Sekunden aktualisiert, solange der Chat offen und der Tab sichtbar ist. Kein Realtime-Schalter in Supabase nötig.
- Reiner Text; HTML wird nicht ausgeführt. Links sind in dieser Version reiner Text.
- 1–500 Zeichen, mindestens 3 Sekunden Abstand, identische Nachricht innerhalb von 60 Sekunden gesperrt. Die Datenbank erzwingt diese Regeln auch ohne die UI.
- Melden mit Grund (3–300 Zeichen), maximal 5 Meldungen pro Minute, dieselbe Nachricht nur einmal pro Konto.
- Eigene Nachrichten können entfernt werden. Entfernte Inhalte werden im normalen Feed nicht mehr ausgeliefert; Moderationsdaten bleiben in der Datenbank erhalten.
- Moderation: Nachrichten entfernen, Meldungen erledigen, Spieler 10 Minuten/1 Stunde/24 Stunden stummschalten oder Sperre aufheben. Konten mit Admin-/Mod-Rolle sind über diese Buttons nicht stummschaltbar.
- Rollen nur durch Projektinhaber per SQL/Table Editor in mv_chat_roles. Rolle admin oder mod; niemals einen service_role-Schlüssel ins Spiel einbauen. Prüfungen und Moderationsprotokoll liegen in Supabase.
- Nach Anmeldung ohne Spielernamen können Spieler lesen. Senden erst nach Speichern des Profilnamens. E-Mail bleibt privat.
- Bei Cloud-Konflikten oder Abmeldung schließt sich der Chat; Nachrichten und Eingabe werden aus der Ansicht entfernt.

VALIDIERUNG:
Datenbankfunktionen mit PostgreSQL via PGlite getestet: Neuinstallation/wiederholte Migration, Authentifizierung, Rollenrechte, direktes Schreiben gesperrt, Nachrichtenlänge/Spamlimit/Duplikate, Meldungen und Privatsphäre, Stumm-/Freischalten, eigene/fremde Nachrichten, Ausblenden, Protokoll, 50er-Limit und bestehender Cloud-Versionsschutz. Oberfläche mit simuliertem DOM getestet: Spielstart, Chat öffnen/senden/melden/moderieren, HTML als Text, Sendeabstand, stumme Konten und Abmeldung. Echter Supabase-/Browser-/Zwei-Konten-Test nach Installation noch erforderlich.

WEITERHIN:
Automatische Cloud-Sicherung alle 30 Sekunden wie 2.1. Spielökonomie lokal berechnet. Gildenchat und Privatnachrichten sind in dieser Version noch nicht enthalten.
