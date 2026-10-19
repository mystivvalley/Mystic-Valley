-- OPTIONAL: Nur im Supabase SQL Editor als Projektinhaber ausführen.
-- Ersetze DEINE-LOGIN-EMAIL durch die E-Mail deines bestehenden Spielkontos.
-- Danach im Spiel den Chat erneut öffnen oder Aktualisieren anklicken.
do $$
declare account_id uuid;
begin
 select id into account_id from auth.users where lower(email)=lower('DEINE-LOGIN-EMAIL');
 if account_id is null then raise exception 'Spielkonto nicht gefunden. Bitte oben die richtige Login-E-Mail eintragen.'; end if;
 insert into public.mv_chat_roles(user_id,role) values(account_id,'admin')
 on conflict(user_id) do update set role=excluded.role;
end;
$$;
