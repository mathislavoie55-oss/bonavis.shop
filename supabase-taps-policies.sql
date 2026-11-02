-- Assure que les taps peuvent être insérés et lus
create policy if not exists "Anyone can insert taps" on taps
  for insert with check (true);

create policy if not exists "Authenticated users can read taps" on taps
  for select using (true);
