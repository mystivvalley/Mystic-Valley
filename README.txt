Mystic Valley Alpha 2.0 – Online-Fundament

1. Lege ein Supabase-Projekt an.
2. Supabase -> SQL Editor -> Inhalt supabase_setup.sql ausführen.
3. Projekt-URL und Publishable-/anon-Key aus den Supabase-Einstellungen kopieren.
4. Das Spiel über GitHub Pages oder einen lokalen Webserver (z. B. python -m http.server 8000) bereitstellen.
5. Im Spiel „Konto & Cloud“ öffnen, URL/Key eingeben, verbinden, registrieren und anmelden.
6. Profilnamen speichern. Erst danach den lokalen Spielstand manuell in die Cloud sichern.
7. Für ein zweites Gerät dort anmelden und Cloud-Spielstand bewusst laden.

WICHTIG: Der lokale Spielstand bleibt Hauptquelle. Kein automatischer Sync und kein echtes Server-authoritatives Spiel! Spieler könnten lokale Ressourcen manipulieren. Für öffentliche Multiplayer-Gilden müssen Ressourcenbewegungen später serverseitig mit RPC/Transaktionen validiert werden.
Keine service_role/secret Keys im Browser verwenden.
Chat- und Gilden-Multiplayer noch NICHT enthalten.

Alpha 2.0.1: Cloud-Laden aktualisiert auch den laufenden Spielstand vor dem Neuladen. Upload liest einen aktuellen Schnappschuss.
Update: index.html und assets im bisherigen Hosting-Ordner ersetzen, hochladen, Strg+F5. SQL muss nicht erneut ausgeführt werden. Auf dem Gerät mit Fortschritt zuerst in Cloud sichern, danach auf dem zweiten laden.
