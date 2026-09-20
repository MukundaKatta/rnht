-- 018: bring the migration set back in line with the live database, and let a
-- cash gift be recorded for a donor who has no email address.
--
-- (a) Migration 001 created "Anyone can create ..." INSERT policies with
--     WITH CHECK (true) on bookings, event_rsvps and donations. Production no
--     longer has them (they were removed out of band; 010 dropped only the
--     "Users can insert own ..." ones), so replaying 001-017 into a new project
--     would REOPEN anonymous donation and booking inserts. Drop them here so a
--     rebuild matches production.
-- (b) donations.donor_email has been NOT NULL since 001. The admin "Record
--     Donation" form now allows a blank email (many cash donors have none) and
--     the edge function writes NULL, which that constraint rejects. Make the
--     column nullable; every reader already treats it as optional.
-- Idempotent.

drop policy if exists "Anyone can create bookings"  on public.bookings;
drop policy if exists "Anyone can create donations" on public.donations;

do $$
begin
  if to_regclass('public.event_rsvps') is not null then
    execute 'drop policy if exists "Anyone can create RSVPs" on public.event_rsvps';
  end if;
end
$$;

alter table public.donations alter column donor_email drop not null;
