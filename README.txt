Mystic Valley Alpha 2.3.0 – Benutzername & Google-Anmeldung

NEU
- Registrierung mit Pflicht-Benutzername, E-Mail und Passwort.
- Benutzername: 3–24 Zeichen (A–Z, Zahlen, Unterstrich), eindeutig ohne Beachtung der Groß-/Kleinschreibung. Öffentlich im Chat. Nach der Wahl fest.
- Login mit Benutzername + Passwort. E-Mail + Passwort bleibt für bestehende Konten möglich.
- Mit Google anmelden. Neue Google-Spieler wählen vor dem Spieleinstieg ihren Benutzernamen. Google-Konten ohne zusätzliches Passwort melden sich weiterhin über Google an.
- Bestehende geeignete Profilnamen werden als Benutzernamen übernommen. Bei bisher ungeeigneten/fehlenden Namen wird einmalig eine neue Wahl verlangt. Konten-IDs, Cloud-Spielstände und Chat-Adminrechte bleiben erhalten.
- Bestehender Globalchat und automatische Cloud-Sicherung bleiben enthalten.

INSTALLATION
Bitte ANLEITUNG_KONTEN_GOOGLE.txt vollständig lesen. Es sind drei Einrichtungen nötig: SQL-Update, eine Edge Function für den Benutzernamen-Login und der Google-Provider. Danach die Website-Dateien hochladen. Kein Docker/WSL nötig.

VALIDIERUNG
PostgreSQL/PGlite: Upgrade und Wiederholung, Übernahme bestehender Namen/Spielstände/Adminrechte, Registrierung ohne Name abgewiesen, doppelte Namen ohne Beachtung der Groß-/Kleinschreibung abgewiesen, atomarer Rollback, Google-Onboarding, unveränderliche Benutzernamen, privater E-Mail-Resolver nur für Server, serverseitiges Loginlimit und Spieleinstieg geprüft.
Simuliertes DOM: Pflichtfeld, Registrierung, E-Mail-Bestätigungshinweis, Benutzername-Login, Session-Übernahme, E-Mail-Login, Google-Weiterleitung/PKCE-Konfiguration, Namenswahl vor Google-Spieleinstieg, Kontentrennung getestet.
Edge-Handler mit simuliertem Supabase Auth: gültiger/ungültiger/unbekannter Login, CORS, Requestbegrenzung, Ratelimit und ausschließlich eigene Session-Tokens in erfolgreicher Antwort getestet.
Bestehende isolierte Cloud- und Chat-Tests bestanden. Echter Google-OAuth-Rundlauf, E-Mail-Versand und Edge-Function-Deployment sind erst nach Einrichtung deines Projekts testbar. Keine dieser Einstellungen wurde von hier aus in deinem Supabase-/Google-Konto geändert.

DATEIEN
Website: index.html, cloud.js, auth.css, chat.js, chat.css, assets.
SQL für vorhandene Alpha 2.1/2.2: supabase_update_ab_2_1.sql.
SQL nur für vorhandene Alpha 2.2: alternativ supabase_update_2_3.sql.
Neuinstallation: supabase_setup.sql statt aller Updates.
Edge Function: supabase/functions/mv-username-login/index.ts.
Serverkonfiguration für CLI als Alternative: supabase/config.toml.
