-- Ajouter la colonne user_id si elle n'existe pas déjà
alter table links add column if not exists user_id uuid references auth.users(id);

-- Mettre à jour les politiques
drop policy if exists "Authenticated users can insert links" on links;
drop policy if exists "Authenticated users can read links" on links;
drop policy if exists "Public read links" on links;

create policy "Users can insert their own links" on links
  for insert with check (auth.uid() = user_id);

create policy "Users can read their own links" on links
  for select using (auth.uid() = user_id);

create policy "Public can read active links" on links
  for select using (is_active = true);
