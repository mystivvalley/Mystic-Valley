import { createClient } from 'npm:@supabase/supabase-js@2';

// Absichtlich vor der Anmeldung erreichbar. Service-Key nur aus der Serverumgebung.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
};
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { ...cors, 'Content-Type': 'application/json' },
});
const denied = () => reply({ error: 'Benutzername oder Passwort ist falsch.' }, 401);
function defaultKey(variable: string): string {
  try {
    const keys = JSON.parse(Deno.env.get(variable) || '{}');
    const value = keys.default || Object.values(keys)[0];
    return typeof value === 'string' ? value : '';
  } catch { return ''; }
}
const project = Deno.env.get('SUPABASE_URL') || '';
const service = Deno.env.get('MV_SECRET_KEY') || defaultKey('SUPABASE_SECRET_KEYS') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const publicKey = Deno.env.get('MV_PUBLISHABLE_KEY') || defaultKey('SUPABASE_PUBLISHABLE_KEYS') || Deno.env.get('SUPABASE_ANON_KEY') || '';
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return reply({ error: 'Nur POST erlaubt.' }, 405);
  if (!project || !service || !publicKey) return reply({ error: 'Benutzernamen-Login ist noch nicht eingerichtet.' }, 503);
  if (Number(req.headers.get('content-length') || 0) > 8192) return denied();
  try {
    // Begrenztes Lesen verhindert auch große Requests ohne Content-Length.
    const reader = req.body?.getReader();
    if (!reader) return denied();
    const parts: Uint8Array[] = []; let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 8192) { await reader.cancel(); return denied(); }
      parts.push(chunk.value);
    }
    const joined = new Uint8Array(size); let pos = 0;
    for (const part of parts) { joined.set(part, pos); pos += part.byteLength; }
    const input = JSON.parse(new TextDecoder().decode(joined));
    const username = typeof input.username === 'string' ? input.username.trim().toLowerCase() : '';
    const password = typeof input.password === 'string' ? input.password : '';
    if (!/^[a-z0-9_]{3,24}$/.test(username) || !password || password.length > 1024) return denied();
    const admin = createClient(project, service, options);
    // Gesalzene Hashes statt Klartext-IP/Benutzername in der Ratelimit-Tabelle.
    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    for (const value of ['ip:' + ip, 'name:' + username]) {
      const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(service + ':' + value));
      const bucket = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
      const { data, error } = await admin.rpc('mv_auth_limit_v1', { p_bucket: bucket });
      if (error) return reply({ error: 'Anmeldung vorübergehend nicht verfügbar.' }, 503);
      if (!data) return reply({ error: 'Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.' }, 429);
    }
    const { data: email, error: lookupError } = await admin.rpc('mv_login_email_v1', { p_username: username });
    if (lookupError) return reply({ error: 'Anmeldung vorübergehend nicht verfügbar.' }, 503);
    // Auch unbekannte Namen durch denselben Passwortpfad führen. Keine Namens-/E-Mail-Auskunft.
    const auth = createClient(project, publicKey, options);
    const { data, error } = await auth.auth.signInWithPassword({
      email: email || 'missing-' + crypto.randomUUID() + '@invalid.example', password,
    });
    if (error || !email || !data.session) return denied();
    return reply({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
  } catch {
    return denied();
  }
});
